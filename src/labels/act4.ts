import { Assets } from "pixi.js";
import { narration, newLabel } from "@drincs/pixi-vn";
import { act4_scene1 } from "./act4/scene1_last_will";

export const act4 = newLabel(
    "act4",
    [
        async (props) => {
            return await narration.jump(act4_scene1, props);
        },
    ],
    {
        onLoadingLabel: () => {
            Assets.backgroundLoadBundle(["act4"]);
        },
    }
);
