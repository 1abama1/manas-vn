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
                    src: "/manas/mainmenu.png",
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
                    src: "/manas/black.png", // Fallback to black for now since white is missing
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
        // ====================================================
        // AUDIO BUNDLES  (place files under public/manas/audio/)
        // ====================================================
        {
            name: "audio_act1",
            assets: [
                // --- Music ---
                { alias: "music_act1_komuz_sad", src: "/manas/audio/music/act1_komuz_sad.mp3" },
                { alias: "music_act1_dream", src: "/manas/audio/music/act1_dream.mp3" },
                { alias: "music_act1_birth_flash", src: "/manas/audio/music/act1_birth_flash.mp3" },
                // --- SFX ---
                { alias: "sfx_hearth_fire", src: "/manas/audio/sfx/hearth_fire.mp3" },
                { alias: "sfx_eagle_screech", src: "/manas/audio/sfx/eagle_screech.mp3" },
                { alias: "sfx_birth_chime", src: "/manas/audio/sfx/birth_chime.mp3" },
                { alias: "sfx_manas_born", src: "/manas/audio/sfx/manas_born.mp3" },
                { alias: "sfx_spy_sting", src: "/manas/audio/sfx/spy_sting.mp3" },
                { alias: "sfx_knife_draw", src: "/manas/audio/sfx/knife_draw.mp3" },
                { alias: "sfx_spear_catch", src: "/manas/audio/sfx/spear_catch.mp3" },
            ],
        },
        {
            name: "audio_act2",
            assets: [
                // --- Music ---
                { alias: "music_act2_komuz_triumph", src: "/manas/audio/music/act2_komuz_triumph.mp3" },
                { alias: "music_act2_march", src: "/manas/audio/music/act2_march.mp3" },
                // --- SFX ---
                { alias: "sfx_crowd_chant", src: "/manas/audio/sfx/crowd_chant.mp3" },
                { alias: "sfx_sword_clash", src: "/manas/audio/sfx/sword_clash.mp3" },
                { alias: "sfx_war_horn", src: "/manas/audio/sfx/war_horn.mp3" },
                { alias: "sfx_cavalry_charge", src: "/manas/audio/sfx/cavalry_charge.mp3" },
            ],
        },
        {
            name: "audio_act3",
            assets: [
                // --- Music ---
                { alias: "music_act3_tension", src: "/manas/audio/music/act3_tension.mp3" },
                { alias: "music_act3_battle", src: "/manas/audio/music/act3_battle.mp3" },
                { alias: "music_act3_aftermath", src: "/manas/audio/music/act3_aftermath.mp3" },
                // --- SFX ---
                { alias: "sfx_camp_ambience", src: "/manas/audio/sfx/camp_ambience.mp3" },
                { alias: "sfx_battle_chaos", src: "/manas/audio/sfx/battle_chaos.mp3" },
                { alias: "sfx_arrow_volley", src: "/manas/audio/sfx/arrow_volley.mp3" },
                { alias: "sfx_konurbay_retreat", src: "/manas/audio/sfx/konurbay_retreat.mp3" },
                { alias: "sfx_axe_strike", src: "/manas/audio/sfx/axe_strike.mp3" },
                { alias: "sfx_ear_ring", src: "/manas/audio/sfx/ear_ring.mp3" },
                { alias: "sfx_body_fall", src: "/manas/audio/sfx/body_fall.mp3" },
            ],
        },
        {
            name: "audio_act4",
            assets: [
                // --- Music ---
                { alias: "music_act4_komuz_grief", src: "/manas/audio/music/act4_komuz_grief.mp3" },
                { alias: "music_act4_epilogue", src: "/manas/audio/music/act4_epilogue.mp3" },
                // --- SFX ---
                { alias: "sfx_heavy_breath", src: "/manas/audio/sfx/heavy_breath.mp3" },
                { alias: "sfx_wind_howl", src: "/manas/audio/sfx/wind_howl.mp3" },
                { alias: "sfx_final_drum", src: "/manas/audio/sfx/final_drum.mp3" },
            ],
        },
    ],
};
export default manifest;
