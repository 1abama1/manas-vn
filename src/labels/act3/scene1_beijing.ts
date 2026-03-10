import { narration, newChoiceOption, newLabel, showImage, moveIn, moveOut } from "@drincs/pixi-vn";
import { Assets } from "pixi.js";
import { Backgrounds, Emotions } from "../../values/assets";
import { manas, storyteller } from "../../values/characters";
import AudioManager from "../../utils/AudioManager";
import { Music, Sfx } from "../../values/sounds";
import { act3_branch_a } from "./branch_a";
import { act3_branch_b } from "./branch_b";

export const act3 = newLabel(
    "act3",
    [
        async () => {
            await showImage("bg", Backgrounds.BEIJING_WALLS, { width: 1920, height: 1080 });
            // 🔊 Clean up any lingering act 2 noises (cavalry, march etc.)
            AudioManager.stopAllSfx();
            // 🎵 Tense, fast-tempo komuz with growing percussion
            AudioManager.playMusic(Music.ACT3_TENSION);
            // 🔊 Camp sounds: horses, clanking metal
            AudioManager.playSfx(Sfx.CAMP_AMBIENCE, 0.5);

            narration.dialogue = {
                character: storyteller,
                text: "act3_scene1_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "manas",
                {
                    value: [Emotions.MANAS_ADULT],
                    options: { xAlign: -1.2, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "left" }
            );

            await moveIn(
                "bakai",
                {
                    value: [Emotions.BAKAI_BASE],
                    options: { xAlign: 2, yAlign: 0, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: manas,
                text: "act3_scene1_manas_1"
            };
        },
        async () => {
            await moveOut("manas", { direction: "down" });
            await moveOut("bakai", { direction: "down" });

            narration.dialogue = "act3_scene1_choice_q";
            narration.choices = [
                newChoiceOption("act3_scene1_choice_1", act3_branch_a, {}, { type: "jump" }),
                newChoiceOption("act3_scene1_choice_2", act3_branch_b, {}, { type: "jump" })
            ];
        }
    ],
    {
        onLoadingLabel: () => {
            Assets.backgroundLoadBundle(["act3", "audio_act3"]);
        },
    }
);
