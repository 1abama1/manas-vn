import { newLabel, narration } from "@drincs/pixi-vn";
import { act1 } from "./act1";

const startLabel = newLabel(
    "start",
    [
        async (props) => {
            return await narration.jump(act1, props);
        }
    ]
);
export default startLabel;
