import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Backgrounds, Emotions } from "../../values/assets";
import { kanykei } from "../../values/characters";
import { act2_scene2 } from "./scene2_oath";

export const act2_branch_b = newLabel(
    "act2_branch_b",
    [
        async () => {
            await showImage("bg", Backgrounds.KANYKEI_ROOM, { width: 1920, height: 1080 });

            await moveIn(
                "manas",
                {
                    value: [Emotions.MANAS_ADULT],
                    options: { xAlign: -1.2, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "left" }
            );

            await moveIn(
                "kanykei",
                {
                    value: [Emotions.KANYKEI_BASE],
                    options: { xAlign: 2, yAlign: 0, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: kanykei,
                text: "act2_branch_b_kanykei_1"
            };
        },
        async () => {
            await moveOut("kanykei", { direction: "down" });
            await moveOut("manas", { direction: "down" });

            narration.dialogue = "act2_branch_b_sys_1";
        },
        async (props) => {
            return await narration.jump(act2_scene2, props);
        }
    ]
);
