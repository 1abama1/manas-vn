import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { GameProgressManager } from "../../utils/GameProgressManager";
import { Backgrounds, Emotions } from "../../values/assets";
import { jakyp, storyteller } from "../../values/characters";
import { act1_scene2 } from "./scene2_birth";

export const act1_branch_a = newLabel(
    "act1_branch_a",
    [
        async () => {
            await showImage("bg", Backgrounds.BALBAL, { width: 1920, height: 1080 });
            await moveOut("jakyp", { direction: "down" });

            await moveIn(
                "storyteller",
                {
                    value: [Emotions.STORYTELLER_BASE],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: storyteller,
                text: "act1_branch_a_storyteller_1"
            };
        },
        async () => {
            await moveOut("storyteller", { direction: "down" });
            await moveIn(
                "jakyp",
                {
                    value: [Emotions.JAKYP_HOPE],
                    options: { xAlign: 0.5, yAlign: 1 },
                },
                { direction: "up" }
            );

            narration.dialogue = {
                character: jakyp,
                text: "act1_branch_a_jakyp_1"
            };
        },
        async () => {
            GameProgressManager.unlockCodex("codex_tugol_kan");
            narration.dialogue = "act1_branch_a_sys_1";
        },
        async (props) => {
            return await narration.jump(act1_scene2, props);
        }
    ]
);
