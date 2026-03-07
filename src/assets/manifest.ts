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
                    src: "/assets/bg_black.webp",
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
    ],
};
export default manifest;
