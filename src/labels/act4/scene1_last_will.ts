import { moveIn, moveOut, narration, newLabel, showImage } from "@drincs/pixi-vn";
import { Backgrounds, Emotions } from "../../values/assets";
import { kanykei, manas, storyteller } from "../../values/characters";
import { act4_scene2 } from "./scene2_immortality";

export const act4_scene1 = newLabel(
    "act4_scene1",
    [
        async () => {
            await showImage("bg", Backgrounds.LAST_WILL, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene1_storyteller_1"
            };
        },
        async () => {
            await moveIn(
                "manas",
                {
                    value: [Emotions.MANAS_WOUNDED],
                    options: { xAlign: -1, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "left" }
            );

            await moveIn(
                "kanykei",
                {
                    value: [Emotions.KANYKEI_MOURNING],
                    options: { xAlign: 1, yAlign: 0.5, scale: 1.2 },
                },
                { direction: "right" }
            );

            narration.dialogue = {
                character: kanykei,
                text: "act4_scene1_kanykei_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_1"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_2"
            };
        },
        async () => {
            narration.dialogue = {
                character: kanykei,
                text: "act4_scene1_kanykei_2"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_3"
            };
        },
        async () => {
            narration.dialogue = {
                character: manas,
                text: "act4_scene1_manas_4"
            };
        },
        async () => {
            await moveOut("manas", { direction: "down" });
            await moveOut("kanykei", { direction: "down" });

            narration.dialogue = {
                character: storyteller,
                text: "act4_scene1_storyteller_2"
            };
        },
        async (props) => {
            return await narration.jump(act4_scene2, props);
        }
    ]
);
