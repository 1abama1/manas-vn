import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Assets } from "pixi.js";
import { Backgrounds, Emotions } from "../../values/assets";
import { kanykei, manas, storyteller } from "../../values/characters";
import AudioManager from "../../utils/AudioManager";
import { Music, Sfx } from "../../values/sounds";
import { act4_scene2 } from "./scene2_immortality";

export const act4_scene1 = newLabel(
    "act4_scene1",
    [
        async () => {
            await showImage("bg", Backgrounds.LAST_WILL, { width: 1920, height: 1080 });
            // 🔊 Final act clean up
            AudioManager.stopAllSfx();
            // 🎵 Mournful komuz – Kambarkan minor
            AudioManager.playMusic(Music.ACT4_KOMUZ_GRIEF, 0.5);

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene1_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "manas",
                {
                    value: [Emotions.MANAS_WOUNDED],
                    options: { xAlign: -1, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "left" }
            );

            await moveIn(
                "kanykei",
                {
                    value: [Emotions.KANYKEI_MOURNING],
                    options: { xAlign: 1, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "right" }
            );

            // 🔊 Heavy, laboured dying breaths
            AudioManager.playSfx(Sfx.HEAVY_BREATH, 0.6);

            narration.dialogue = {
                character: kanykei,
                text: "act4_scene1_kanykei_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_2"
            };
        },
        async () => {
            narration.dialogue = {
                character: kanykei,
                text: "act4_scene1_kanykei_2"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_3"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_4"
            };
        },
        async () => {
            await moveOut("manas", { direction: "down" });
            await moveOut("kanykei", { direction: "down" });
            // 🔊 Stop heavy breathing and music: Manas has passed
            AudioManager.stopMusic();
            AudioManager.stopSfx(Sfx.HEAVY_BREATH);
            AudioManager.playSfx(Sfx.WIND_HOWL);

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene1_storyteller_2"
            };
        },
        async (props) => {
            return await narration.jump(act4_scene2, props);
        }
    ],
    // act4 has no onLoadingLabel in the original, add bundle preload
    {
        onLoadingLabel: () => {
            Assets.backgroundLoadBundle(["audio_act4"]);
        },
    }
);
