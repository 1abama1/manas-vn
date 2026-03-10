import { narration, newChoiceOption, newLabel, showImage } from "@drincs/pixi-vn";
import { Assets } from "pixi.js";
import { Backgrounds } from "../../values/assets";
import { jakyp, storyteller } from "../../values/characters";
import AudioManager from "../../utils/AudioManager";
import { Music, Sfx } from "../../values/sounds";
import { act1_branch_a } from "./branch_a";
import { act1_branch_b } from "./branch_b";

export const act1 = newLabel(
    "act1",
    [
        async () => {
            await showImage("bg", Backgrounds.YURTA, { width: 1920, height: 1080 });
            // 🎵 Sad komuz melody begins — sets the tone of Jakyp's sorrow
            AudioManager.playMusic(Music.ACT1_KOMUZ_SAD);
            // 🔊 Crackling hearth fire + wind ambience
            AudioManager.playSfx(Sfx.HEARTH_FIRE, 0.5);

            narration.dialogue = {
                character: storyteller,
                text: "act1_scene1_storyteller_1"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.HORSES, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: jakyp,
                text: "act1_scene1_jakyp_1"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.FALCON_DREAM, { width: 1920, height: 1080 });
            // 🔊 Stop hearth fire before dream sequences
            AudioManager.stopSfx(Sfx.HEARTH_FIRE);
            // 🎵 Dream: heartbeat + rising low drone
            AudioManager.playMusic(Music.ACT1_DREAM);
            // 🔊 White falcon wingbeat and screech
            AudioManager.playSfx(Sfx.EAGLE_SCREECH);

            narration.dialogue = {
                character: storyteller,
                text: "act1_scene1_storyteller_2"
            };
        },
        async () => {
            await showImage("bg", Backgrounds.YURTA, { width: 1920, height: 1080 });

            narration.dialogue = {
                character: jakyp,
                text: "act1_scene1_jakyp_2"
            };
        },
        async () => {
            narration.dialogue = "act1_scene1_choice_q";
            narration.choices = [
                newChoiceOption("act1_scene1_choice_1", act1_branch_a, {}, { type: "jump" }),
                newChoiceOption("act1_scene1_choice_2", act1_branch_b, {}, { type: "jump" })
            ];
        }
    ],
    {
        onLoadingLabel: () => {
            Assets.backgroundLoadBundle(["act1", "audio_act1"]);
        },
    }
);
