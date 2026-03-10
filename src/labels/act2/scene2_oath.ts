import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Backgrounds, Emotions } from "../../values/assets";
import { almambet, manas, storyteller } from "../../values/characters";
import AudioManager from "../../utils/AudioManager";
import { Music, Sfx } from "../../values/sounds";
import { act3 } from "../act3";

export const act2_scene2 = newLabel(
    "act2_scene2",
    [
        async () => {
            await showImage("bg", Backgrounds.OATH_HILL, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act2_scene2_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "almambet",
                {
                    value: [Emotions.ALMAMBET_BASE],
                    options: { xAlign: 1.2, yAlign: 0.5, scale: 1 },
                },
                { direction: "right" }
            );
            // 🔊 Ringing clash of crossing blades — the oath of brotherhood
            AudioManager.playSfx(Sfx.SWORD_CLASH);

            narration.dialogue = {
                character: almambet,
                text: "act2_scene2_almambet_1"
            };
        },
        async () => {
            await moveIn(
                "manas",
                {
                    value: [Emotions.MANAS_ADULT],
                    options: { xAlign: -0.3, yAlign: 0.5, scale: 1 },
                },
                { direction: "left" }
            );

            narration.dialogue = {
                character: manas,
                text: "act2_scene2_manas_2"
            };
        },
        async () => {
            await moveOut("almambet", { direction: "down" });
            await moveOut("manas", { direction: "down" });

            await showImage("bg", Backgrounds.BLACK, { width: 1920, height: 1080 });
            // 🔊 War horn rally + growing cavalry thunder
            AudioManager.playSfx(Sfx.WAR_HORN);
            AudioManager.playSfx(Sfx.CAVALRY_CHARGE);
            // 🎵 Army march music
            AudioManager.playMusic(Music.ACT2_MARCH);

            narration.dialogue = {
                character: storyteller,
                text: "act2_scene2_storyteller_2"
            };
        },
        async (props) => {
            return await narration.jump(act3, props);
        }
    ]
);
