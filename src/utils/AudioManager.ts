import { sound, IMediaInstance } from "@pixi/sound";
import { storage } from "@drincs/pixi-vn";
import { Music, Sfx } from "../values/sounds";

// ─── Константы ──────────────────────────────────────────────
const STORAGE_KEY_MASTER = "vol_master";
const STORAGE_KEY_MUSIC  = "vol_music";
const STORAGE_KEY_SFX    = "vol_sfx";
const STORAGE_KEY_CURRENT_MUSIC = "current_music";

const DEFAULT_MASTER = 1.0;
const DEFAULT_MUSIC  = 0.6;
const DEFAULT_SFX    = 1.0;

// ─── Внутреннее состояние (модульный синглтон) ──────────────
let _currentMusic: Music | null = null;
let _currentMusicInstance: IMediaInstance | null = null;
let _fadeInterval: ReturnType<typeof setInterval> | null = null;

// Map для отслеживания активных SFX-инстансов
const _activeSfx = new Map<Sfx, IMediaInstance>();

// Тома, инициализируются один раз
let _masterVol = (storage.get<number>(STORAGE_KEY_MASTER)) ?? DEFAULT_MASTER;
let _musicVol  = (storage.get<number>(STORAGE_KEY_MUSIC))  ?? DEFAULT_MUSIC;
let _sfxVol    = (storage.get<number>(STORAGE_KEY_SFX))    ?? DEFAULT_SFX;

// Применяем глобальный volume при инициализации модуля
sound.volumeAll = _masterVol;

// ─── Восстановление трека после загрузки сохранения ─────────
// Вызывается один раз при старте, не при каждом play
const _savedMusic = storage.get<Music>(STORAGE_KEY_CURRENT_MUSIC);
if (_savedMusic) {
    // Восстановление отложено — ассеты могут ещё не быть загружены.
    // AudioManager.resumeSavedMusic() вызывается явно из label'а.
    _currentMusic = _savedMusic;
}

/**
 * AudioManager — оптимизированная обёртка над @pixi/sound.
 *
 * Ключевые улучшения по сравнению с исходной версией:
 * - IMediaInstance хранится явно → нет повторного поиска sound.find()
 * - Fade-out гарантированно очищает предыдущий interval
 * - activeSfx хранит инстансы в Map → O(1) поиск и остановка
 * - storage.set только при реальном изменении значения
 * - resumeSavedMusic для корректного восстановления после load
 */
const AudioManager = {

    // ── Getters ─────────────────────────────────────────────
    getMasterVolume: (): number => _masterVol,
    getMusicVolume:  (): number => _musicVol,
    getSfxVolume:    (): number => _sfxVol,
    getCurrentMusic: (): Music | null => _currentMusic,

    // ── Music ────────────────────────────────────────────────

    /**
     * Запускает зацикленный музыкальный трек.
     * Если тот же трек уже играет — просто обновляет громкость (без restart).
     */
    playMusic(alias: Music, volume = _musicVol): void {
        const finalVolume = Math.max(0, Math.min(1, volume)) * _masterVol;

        // Тот же трек — только обновляем громкость
        if (_currentMusic === alias && _currentMusicInstance) {
            _currentMusicInstance.volume = finalVolume;
            return;
        }

        // Останавливаем предыдущий трек без fade (мгновенно)
        this._stopMusicImmediate();

        if (!sound.exists(alias)) {
            console.warn(`[AudioManager] Music not loaded: ${alias}`);
            return;
        }

        try {
            // sound.play возвращает IMediaInstance | Promise<IMediaInstance>
            const result = sound.play(alias, {
                loop: true,
                volume: finalVolume,
            });

            // Обрабатываем оба случая: синхронный и асинхронный
            if (result instanceof Promise) {
                result.then((instance) => {
                    _currentMusicInstance = instance;
                }).catch((e) => {
                    console.error(`[AudioManager] Async play error for ${alias}:`, e);
                });
            } else {
                _currentMusicInstance = result as IMediaInstance;
            }

            _currentMusic = alias;
            storage.set(STORAGE_KEY_CURRENT_MUSIC, alias);
        } catch (e) {
            console.error(`[AudioManager] Error playing music ${alias}:`, e);
        }
    },

    /**
     * Останавливает музыку с опциональным fade-out (мс).
     * Гарантирует очистку предыдущего fade-interval.
     */
    stopMusic(fadeMs = 0): void {
        if (!_currentMusic) return;

        // Очищаем предыдущий fade, если был
        if (_fadeInterval !== null) {
            clearInterval(_fadeInterval);
            _fadeInterval = null;
        }

        if (fadeMs > 0 && _currentMusicInstance) {
            const instance = _currentMusicInstance;
            const startVol = instance.volume;
            const steps = Math.ceil(fadeMs / 50);
            const stepSize = startVol / steps;
            let elapsed = 0;

            _fadeInterval = setInterval(() => {
                elapsed++;
                const newVol = Math.max(0, startVol - stepSize * elapsed);
                instance.volume = newVol;

                if (newVol <= 0 || elapsed >= steps) {
                    clearInterval(_fadeInterval!);
                    _fadeInterval = null;
                    try { instance.stop(); } catch { /* noop */ }
                }
            }, 50);
        } else {
            this._stopMusicImmediate();
        }

        _currentMusic = null;
        _currentMusicInstance = null;
        storage.remove(STORAGE_KEY_CURRENT_MUSIC);
    },

    /**
     * Восстанавливает трек из сохранения.
     * Вызывать после того, как ассеты гарантированно загружены.
     */
    resumeSavedMusic(): void {
        if (_currentMusic && sound.exists(_currentMusic)) {
            const alias = _currentMusic;
            _currentMusic = null; // сбрасываем, чтобы playMusic не считал его "уже играющим"
            this.playMusic(alias, _musicVol);
        }
    },

    // ── SFX ─────────────────────────────────────────────────

    /**
     * Воспроизводит однократный звуковой эффект.
     * Хранит инстанс в Map для точечной остановки.
     */
    playSfx(alias: Sfx, volume = _sfxVol): void {
        if (!sound.exists(alias)) {
            console.warn(`[AudioManager] SFX not loaded: ${alias}`);
            return;
        }

        const finalVolume = Math.max(0, Math.min(1, volume)) * _masterVol;

        try {
            const result = sound.play(alias, {
                volume: finalVolume,
                complete: () => _activeSfx.delete(alias),
            });

            if (result instanceof Promise) {
                result.then((instance) => {
                    _activeSfx.set(alias, instance as IMediaInstance);
                });
            } else if (result) {
                _activeSfx.set(alias, result as IMediaInstance);
            }
        } catch (e) {
            console.error(`[AudioManager] Error playing SFX ${alias}:`, e);
        }
    },

    /** Останавливает конкретный SFX. */
    stopSfx(alias: Sfx): void {
        const instance = _activeSfx.get(alias);
        if (instance) {
            try { instance.stop(); } catch { /* noop */ }
            _activeSfx.delete(alias);
        }
    },

    /** Останавливает все SFX (не трогает музыку). */
    stopAllSfx(): void {
        for (const [, instance] of _activeSfx) {
            try { instance.stop(); } catch { /* noop */ }
        }
        _activeSfx.clear();
    },

    /** Останавливает всё (музыку + SFX). Для полного сброса. */
    stopAll(): void {
        this.stopMusic();
        this.stopAllSfx();
    },

    // ── Volume setters ───────────────────────────────────────

    setMasterVolume(vol: number): void {
        const clamped = Math.max(0, Math.min(1, vol));
        if (clamped === _masterVol) return; // нет изменений — нет I/O
        _masterVol = clamped;
        sound.volumeAll = _masterVol;
        storage.set(STORAGE_KEY_MASTER, _masterVol);
        // Обновляем громкость текущего трека
        if (_currentMusicInstance) {
            _currentMusicInstance.volume = _musicVol * _masterVol;
        }
    },

    setMusicVolume(vol: number): void {
        const clamped = Math.max(0, Math.min(1, vol));
        if (clamped === _musicVol) return;
        _musicVol = clamped;
        if (_currentMusicInstance) {
            _currentMusicInstance.volume = _musicVol * _masterVol;
        }
        storage.set(STORAGE_KEY_MUSIC, _musicVol);
    },

    setSfxVolume(vol: number): void {
        const clamped = Math.max(0, Math.min(1, vol));
        if (clamped === _sfxVol) return;
        _sfxVol = clamped;
        storage.set(STORAGE_KEY_SFX, _sfxVol);
    },

    // ── Приватные методы (не экспортируются в интерфейс) ────

    _stopMusicImmediate(): void {
        if (_fadeInterval !== null) {
            clearInterval(_fadeInterval);
            _fadeInterval = null;
        }
        if (_currentMusic) {
            try { sound.stop(_currentMusic); } catch { /* noop */ }
        }
        _currentMusicInstance = null;
    },
};

export default AudioManager;
