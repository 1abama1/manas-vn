import { AssetsManifest } from "@drincs/pixi-vn";
import { MAIN_MENU_ROUTE } from "../constans";
import startLabel from "../labels/startLabel";
/**
 * Manifest for the assets used in the game.
 * You can read more about the manifest here: https://pixijs.com/8.x/guides/components/assets#loading-multiple-assets
 */
const manifest: AssetsManifest = {
    bundles: [
        // screens
        {
            name: MAIN_MENU_ROUTE,
            assets: [
                {
                    alias: "background_main_menu",
                    src: "/manas/mainmenu.png",
                },
            ],
        },
        // labels
        {
            name: startLabel.id,
            assets: [
                {
                    alias: "bg01-hallway",
                    src: "/assets/mainmenu.png",
                },
            ],
        },

        // characters
        {
            name: "act1",
            assets: [
                // === Backgrounds ===
                {
                    alias: "bg_yurta",
                    src: "/manas/act1/scene-1/1.jpeg",
                },
                {
                    alias: "bg_black",
                    src: "/manas/black.png",
                },
                {
                    alias: "bg_balbal",
                    src: "/manas/act1/scene-1/4a.jpeg",
                },
                {
                    alias: "bg_horses",
                    src: "/manas/act1/scene-1/4b.jpeg",
                },
                {
                    alias: "bg_yurta_outside",
                    src: "/manas/act1/scene-2/1.png",
                },
                {
                    alias: "bg_eagle_space",
                    src: "/manas/act1/scene-1/3a.jpeg",
                },
                {
                    alias: "bg_white",
                    src: "/assets/bg_white.webp",
                },

                // === Characters ===
                {
                    alias: "storyteller_base",
                    src: "/manas/act1/scene-1/2.png",
                },
                {
                    alias: "manas_baby",
                    src: "/manas/act1/scene-2/4.png",
                },
                {
                    alias: "jakyp_sad",
                    src: "/manas/act1/scene-1/3.png",
                },
                {
                    alias: "spy_attack",
                    src: "/manas/act1/scene-2/3.png",
                },
                {
                    alias: "jakyp_hope",
                    src: "/manas/act1/scene-1/3.png", // Reusing the same sprite
                },
                {
                    alias: "chiyirdi_shock",
                    src: "/manas/act1/scene-2/2.png",
                },
                {
                    alias: "manas_neon_eyes",
                    src: "/manas/act1/scene-2/4.png",
                },
            ],
        },
        {
            name: "act2",
            assets: [
                // Backgrounds
                {
                    alias: "bg_steppe_army",
                    src: "/manas/act-2/scene-1/1-bg.jpeg",
                },
                {
                    alias: "bg_yurta_night",
                    src: "/manas/act-2/scene-1/2a.jpeg",
                },
                {
                    alias: "bg_kanykei_room",
                    src: "/manas/act-2/scene-1/2b.jpeg",
                },
                {
                    alias: "bg_oath_hill",
                    src: "/manas/act-2/scene-2/1-bg.jpeg",
                },

                // Characters
                {
                    alias: "manas_adult",
                    src: "/manas/sprites/adult-manas.png",
                },
                {
                    alias: "bakai_base",
                    src: "/manas/sprites/bakai.png",
                },
                {
                    alias: "almambet_base",
                    src: "/manas/sprites/almanbet.png",
                },
                {
                    alias: "kanykei_base",
                    src: "/manas/sprites/kanykei.png",
                }
            ],
        },
        {
            name: "act3",
            assets: [
                // Backgrounds
                {
                    alias: "bg_beijing_walls",
                    src: "/manas/act-3/scene-1/1-bg.jpeg",
                },
                {
                    alias: "bg_almambet_camp",
                    src: "/manas/act-3/scene-1/2a-bg.jpeg",
                },
                {
                    alias: "bg_chubak_camp",
                    src: "/manas/act-3/scene-1/2b-bg.jpeg",
                },
                {
                    alias: "bg_battle_chaos",
                    src: "/manas/act-3/scene-2/1-bg.jpeg",
                },
                {
                    alias: "bg_final_prayer",
                    src: "/manas/act-3/scene-2/2-bg.jpeg",
                },

                // Characters
                {
                    alias: "chubak_base",
                    src: "/manas/sprites/chubak.png",
                },
                {
                    alias: "konurbay_base",
                    src: "/manas/sprites/konurbai.png",
                }
            ],
        },
        {
            name: "act4",
            assets: [
                // Backgrounds
                {
                    alias: "bg_last_will",
                    src: "/manas/act-4/scene-1/1-bg.jpeg",
                },
                {
                    alias: "bg_immortality",
                    src: "/manas/act-4/scene-2/1-bg.jpeg",
                },

                // Characters
                {
                    alias: "manas_wounded",
                    src: "/manas/sprites/almost-dead-manas.png",
                },
                {
                    alias: "kanykei_mourning",
                    src: "/manas/sprites/crying-kanykei.png",
                }
            ],
        },
    ],
};
export default manifest;
