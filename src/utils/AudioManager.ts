import { sound } from "@pixi/sound";
import { Music, Sfx } from "../values/sounds";

let _currentMusic: Music | null = null;

/**
 * AudioManager – thin wrapper around @pixi/sound for the Manas VN.
 *
 * - Music: looped background tracks, only one plays at a time.
 * - Sfx:   one-shot effects, multiple can overlap.
 *
 * All aliases must be registered in the PixiJS asset manifest first
 * (see src/assets/manifest.ts).  The manager handles graceful
 * no-ops when a file hasn't been loaded yet so placeholder stubs
 * won't crash development.
 */
const AudioManager = {
    // -------------------------------------------------------
    // MUSIC
    // -------------------------------------------------------

    /**
     * Start a looping music track.
     * If the same track is already playing it is left running.
     */
    playMusic(alias: Music, volume = 0.6): void {
        if (_currentMusic === alias) return;
        this.stopMusic();
        try {
            sound.play(alias, { loop: true, volume });
            _currentMusic = alias;
        } catch {
            console.warn(`[AudioManager] Music not loaded yet: ${alias}`);
        }
    },

    /** Stop the currently-playing music (with optional fade-out ms). */
    stopMusic(fadeMs = 0): void {
        if (!_currentMusic) return;
        try {
            if (fadeMs > 0) {
                const instance = sound.find(_currentMusic);
                if (instance) {
                    const step = instance.volume / (fadeMs / 50);
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
        } catch {
            // already stopped or not loaded
        }
        _currentMusic = null;
    },

    // -------------------------------------------------------
    // SFX
    // -------------------------------------------------------

    /** Play a one-shot sound effect. */
    playSfx(alias: Sfx, volume = 1.0): void {
        try {
            sound.play(alias, { volume });
        } catch {
            console.warn(`[AudioManager] SFX not loaded yet: ${alias}`);
        }
    },

    /** Stop a specific SFX (useful for looping ambience). */
    stopSfx(alias: Sfx): void {
        try {
            sound.stop(alias);
        } catch {
            // already stopped or not loaded
        }
    },

    /** Stop ALL sounds (music + sfx). */
    stopAll(): void {
        sound.stopAll();
        _currentMusic = null;
    },

    /** Global volume (0–1) for music. */
    setMusicVolume(vol: number): void {
        if (_currentMusic) {
            try {
                const instance = sound.find(_currentMusic);
                if (instance) instance.volume = vol;
            } catch { /* noop */ }
        }
    },
};

export default AudioManager;
