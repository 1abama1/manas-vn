import { moveIn, moveOut, narration, newLabel } from "@drincs/pixi-vn";
import { Emotions } from "../../values/assets";
import { bakai, manas } from "../../values/characters";
import { act2_scene2 } from "./scene2_oath";

export const act2_branch_a = newLabel(
    "act2_branch_a",
    [
        async () => {
            await moveIn(
                "manas",
                {
                    value: [Emotions.MANAS_ADULT],
                    options: { xAlign: 100, yAlign: -50 },
                },
                { direction: "left" }
            );
            await moveIn(
                "bakai",
                {
                    value: [Emotions.BAKAI_BASE],
                    options: { xAlign: 0.75, yAlign: 0 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: manas,
                text: "act2_branch_a_manas_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: bakai,
                text: "act2_branch_a_bakai_1"
            };
        },
        async () => {
            await moveOut("manas", { direction: "down" });
            await moveOut("bakai", { direction: "down" });

            narration.dialogue = "act2_branch_a_sys_1";
        },
        async (props) => {
            return await narration.jump(act2_scene2, props);
        }
    ]
);
