import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { GameProgressManager } from "../../utils/GameProgressManager";
import { Backgrounds, Emotions } from "../../values/assets";
import { almambet } from "../../values/characters";
import { act3_scene2 } from "./scene2_battle";

export const act3_branch_a = newLabel(
    "act3_branch_a",
    [
        async () => {
            await showImage("bg", Backgrounds.ALMAMBET_CAMP, { width: 1920, height: 1080 });

            await moveIn(
                "almambet",
                {
                    value: [Emotions.ALMAMBET_BASE],
                    options: { xAlign: 1.2, yAlign: 0.5, scale: 1 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: almambet,
                text: "act3_branch_a_almambet_1"
            };
        },
        async () => {
            GameProgressManager.unlockCodex("codex_almambet_tactics");
            narration.dialogue = "act3_branch_a_sys_1";

            await moveOut("almambet", { direction: "down" });
        },
        async (props) => {
            return await narration.jump(act3_scene2, props);
        }
    ]
);
