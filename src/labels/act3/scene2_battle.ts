import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Backgrounds, Emotions } from "../../values/assets";
import { konurbay, storyteller } from "../../values/characters";
import { act3_scene3 } from "./scene3_final";

export const act3_scene2 = newLabel(
    "act3_scene2",
    [
        async () => {
            await showImage("bg", Backgrounds.BATTLE_CHAOS, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act3_scene2_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "konurbay",
                {
                    value: [Emotions.KONURBAY_BASE],
                    options: { xAlign: 1.2, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: konurbay,
                text: "act3_scene2_konurbay_1"
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

            narration.dialogue = {
                character: storyteller,
                text: "act3_scene2_storyteller_2"
            };
        },
        async () => {
            await moveOut("konurbay", { direction: "right" });

            narration.dialogue = {
                character: storyteller,
                text: "act3_scene2_storyteller_3"
            };

            await moveOut("manas", { direction: "left" });
        },
        async (props) => {
            return await narration.jump(act3_scene3, props);
        }
    ]
);
