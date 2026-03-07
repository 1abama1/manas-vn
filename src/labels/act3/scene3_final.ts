import { moveIn, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Backgrounds, Emotions } from "../../values/assets";
import { konurbay, storyteller } from "../../values/characters";

export const act3_scene3 = newLabel(
    "act3_scene3",
    [
        async () => {
            await showImage("bg", Backgrounds.FINAL_PRAYER, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act3_scene3_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "konurbay",
                {
                    value: [Emotions.KONURBAY_BASE],
                    options: { xAlign: 1, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: konurbay,
                text: "act3_scene3_konurbay_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: storyteller,
                text: "act3_scene3_storyteller_2"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.BLACK, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act3_scene3_storyteller_3"
            };
        },
        async () => {
            narration.dialogue = "act3_scene3_sys_1";
        }
    ]
);
