import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { GameProgressManager } from "../../utils/GameProgressManager";
import { Backgrounds, Emotions } from "../../values/assets";
import { chubak } from "../../values/characters";
import { act3_scene2 } from "./scene2_battle";

export const act3_branch_b = newLabel(
    "act3_branch_b",
    [
        async () => {
            await showImage("bg", Backgrounds.CHUBAK_CAMP, { width: 1920, height: 1080 });

            await moveIn(
                "chubak",
                {
                    value: [Emotions.CHUBAK_BASE],
                    options: { xAlign: 1.2, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: chubak,
                text: "act3_branch_b_chubak_1"
            };
        },
        async () => {
            GameProgressManager.unlockCodex("codex_chubak_fury");
            narration.dialogue = "act3_branch_b_sys_1";

            await moveOut("chubak", { direction: "down" });
        },
        async (props) => {
            return await narration.jump(act3_scene2, props);
        }
    ]
);
