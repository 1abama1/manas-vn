import { sound } from "@pixi/sound";
import { Music, Sfx } from "../values/sounds";
import { storage } from "@drincs/pixi-vn";

let _currentMusic: Music | null = null;
const STORAGE_KEY_MASTER = "vol_master";
const STORAGE_KEY_MUSIC = "vol_music";
const STORAGE_KEY_SFX = "vol_sfx";

// Initialize volumes from storage or defaults
let _masterVol = storage.get<number>(STORAGE_KEY_MASTER) ?? 1.0;
let _musicVol = storage.get<number>(STORAGE_KEY_MUSIC) ?? 0.6;
let _sfxVol = storage.get<number>(STORAGE_KEY_SFX) ?? 1.0;

// Apply initial global volume
sound.volumeAll = _masterVol;

/**
 * AudioManager – thin wrapper around @pixi/sound for the Manas VN.
 */
const AudioManager = {
    // -------------------------------------------------------
    // GETTERS
    // -------------------------------------------------------
    getMasterVolume: () => _masterVol,
    getMusicVolume: () => _musicVol,
    getSfxVolume: () => _sfxVol,

    // -------------------------------------------------------
    // MUSIC
    // -------------------------------------------------------

    /** Start a looping music track. */
    playMusic(alias: Music, volume = -1): void {
        const finalVolume = volume >= 0 ? volume : _musicVol;
        if (_currentMusic === alias) {
            // If already playing, just update volume if needed
            const instance = sound.find(alias);
            if (instance) instance.volume = finalVolume;
            return;
        }
        this.stopMusic();

        if (!sound.exists(alias)) {
            console.warn(`[AudioManager] Music not loaded: ${alias}`);
            return;
        }

        try {
            sound.play(alias, { loop: true, volume: finalVolume });
            _currentMusic = alias;
        } catch (e) {
            console.error(`[AudioManager] Error playing music ${alias}:`, e);
        }
    },

    /** Stop music with optional fade-out. */
    stopMusic(fadeMs = 0): void {
        if (!_currentMusic) return;
        try {
            if (fadeMs > 0) {
                const instance = sound.find(_currentMusic);
                if (instance) {
                    const originalVol = instance.volume;
                    const step = originalVol / (fadeMs / 50);
                    const iv = setInterval(() => {
                        if (!instance || instance.volume <= 0) {
                            clearInterval(iv);
                            sound.stop(_currentMusic!);
                        } else {
                            instance.volume = Math.max(0, instance.volume - step);
                        }
                    }, 50);
                } else {
                    sound.stop(_currentMusic);
                }
            } else {
                sound.stop(_currentMusic);
            }
        } catch { /* noop */ }
        _currentMusic = null;
    },

    // -------------------------------------------------------
    // SFX
    // -------------------------------------------------------

    /** Play a one-shot sound effect. */
    playSfx(alias: Sfx, volume = -1): void {
        const finalVolume = volume >= 0 ? volume : _sfxVol;
        if (!sound.exists(alias)) {
            console.warn(`[AudioManager] SFX not loaded: ${alias}`);
            return;
        }

        try {
            sound.play(alias, { volume: finalVolume });
        } catch (e) {
            console.error(`[AudioManager] Error playing SFX ${alias}:`, e);
        }
    },

    /** Stop a specific SFX. */
    stopSfx(alias: Sfx): void {
        try {
            sound.stop(alias);
        } catch { /* noop */ }
    },

    /** Stop ALL sounds. */
    stopAll(): void {
        sound.stopAll();
        _currentMusic = null;
    },

    /** Stop all currently playing SFX (ones that are not the current music). */
    stopAllSfx(): void {
        const musicAlias = _currentMusic;
        // This is a brutal way because @pixi/sound doesn't provide a list of playing SFX-only instances
        // easily without tracking them manually.
        sound.stopAll();
        if (musicAlias) {
            this.playMusic(musicAlias);
        }
    },

    // -------------------------------------------------------
    // VOLUME SETTERS
    // -------------------------------------------------------

    setMasterVolume(vol: number): void {
        _masterVol = Math.max(0, Math.min(1, vol));
        sound.volumeAll = _masterVol;
        storage.set(STORAGE_KEY_MASTER, _masterVol);
    },

    setMusicVolume(vol: number): void {
        _musicVol = Math.max(0, Math.min(1, vol));
        if (_currentMusic) {
            const instance = sound.find(_currentMusic);
            if (instance) instance.volume = _musicVol;
        }
        storage.set(STORAGE_KEY_MUSIC, _musicVol);
    },

    setSfxVolume(vol: number): void {
        _sfxVol = Math.max(0, Math.min(1, vol));
        storage.set(STORAGE_KEY_SFX, _sfxVol);
    },
};

export default AudioManager;
