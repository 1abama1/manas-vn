import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Backgrounds, Emotions } from "../../values/assets";
import { chiyirdi, spy, storyteller } from "../../values/characters";

export const act1_scene2 = newLabel(
    "act1_scene2",
    [
        async () => {
            await showImage("bg", Backgrounds.YURTA_OUTSIDE, { width: 1920, height: 1080 });

            await showImage("bg", Backgrounds.WHITE, { width: 1920, height: 1080 });
            await new Promise((resolve) => setTimeout(resolve, 500));
            await showImage("bg", Backgrounds.YURTA_OUTSIDE, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act1_scene2_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "chiyirdi",
                {
                    value: [Emotions.CHIYIRDI_SHOCK],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: chiyirdi,
                text: "act1_scene2_chiyirdi_1"
            };
        },
        async () => {
            await moveOut("chiyirdi", { direction: "down" });

            narration.dialogue = {
                character: storyteller,
                text: "act1_scene2_storyteller_2"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.YURTA, { width: 1920, height: 1080 });

            await moveIn(
                "spy",
                {
                    value: [Emotions.SPY_ATTACK],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up", ease: "circInOut", type: "spring", duration: 0.5 }
            );

            narration.dialogue = {
                character: spy,
                text: "act1_scene2_spy_1"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.YURTA, { width: 1920, height: 1080 });
            await moveOut("spy", { direction: "down", duration: 0.1 });
            await moveIn(
                "manas_baby",
                {
                    value: [Emotions.MANAS_NEON_EYES],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up", duration: 0.4, type: "spring", ease: "circInOut" } // Прыжок
            );

            narration.dialogue = {
                character: storyteller,
                text: "act1_scene2_storyteller_3"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.BLACK, { width: 1920, height: 1080 });
            await moveOut("manas_baby", { direction: "down" });

            narration.dialogue = "act1_scene2_sys_1";
        }
    ]
);
