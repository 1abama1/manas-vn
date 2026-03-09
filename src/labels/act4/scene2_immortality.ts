import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { CREDITS_ROUTE } from "../../constans";
import { Backgrounds, Emotions } from "../../values/assets";
import { storyteller } from "../../values/characters";

export const act4_scene2 = newLabel(
    "act4_scene2",
    [
        async () => {
            await showImage("bg", Backgrounds.IMMORTALITY, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene2_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "kanykei",
                {
                    value: [Emotions.KANYKEI_MOURNING],
                    options: { xAlign: 1, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene2_storyteller_2"
            };
        },
        async () => {
            await moveOut("kanykei", { direction: "down" });

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene2_storyteller_3"
            };
        },
        async () => {
            narration.dialogue = {
                character: storyteller,
                text: "act4_scene2_storyteller_4"
            };
        },
        async () => {
            narration.dialogue = "act4_sys_game_over";
        },
        async (props) => {
            props.navigate(CREDITS_ROUTE);
        }
    ]
);
