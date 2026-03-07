import { narration, newLabel, showImage } from "@drincs/pixi-vn";
import { GameProgressManager } from "../../utils/GameProgressManager";
import { Backgrounds } from "../../values/assets";
import { jakyp, storyteller } from "../../values/characters";
import { act1_scene2 } from "./scene2_birth";

export const act1_branch_b = newLabel(
    "act1_branch_b",
    [
        async () => {
            await showImage("bg", Backgrounds.HORSES, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act1_branch_b_storyteller_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: jakyp,
                text: "act1_branch_b_jakyp_1"
            };
        },
        async () => {
            GameProgressManager.unlockCodex("codex_jakyp_wealth");
            narration.dialogue = "act1_branch_b_sys_1";
        },
        async (props) => {
            return await narration.jump(act1_scene2, props);
        }
    ]
);
