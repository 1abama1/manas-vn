// ============================================================
// MUSIC — background looping tracks
// ============================================================
export enum Music {
    // Act I – Sorrow & Birth
    ACT1_KOMUZ_SAD = "music_act1_komuz_sad",      // Sad komuz melody (Ker Tolgoo style)
    ACT1_DREAM = "music_act1_dream",           // Heartbeat + rising sub-drone (dream sequence)
    ACT1_BIRTH_FLASH = "music_act1_birth_flash",     // Shimmer/chime flash at birth

    // Act II – The Khan
    ACT2_KOMUZ_TRIUMPH = "music_act2_komuz_triumph",   // Energetic, triumphant komuz chord
    ACT2_MARCH = "music_act2_march",           // Army march with drums, growing tension

    // Act III – Great Campaign
    ACT3_TENSION = "music_act3_tension",         // Fast-tempo tense komuz + drums
    ACT3_BATTLE = "music_act3_battle",          // War drums (dobulbas), battle chaos
    ACT3_AFTERMATH = "music_act3_aftermath",       // Quiet after the battle

    // Act IV – Farewell & Immortality
    ACT4_KOMUZ_GRIEF = "music_act4_komuz_grief",     // Mournful komuz (Kambarkan minor)
    ACT4_EPILOGUE = "music_act4_epilogue",        // Solemn komuz + orchestral strings/drums
}

// ============================================================
// SFX — one-shot sound effects
// ============================================================
export enum Sfx {
    // Act I Sfx
    HEARTH_FIRE = "sfx_hearth_fire",            // Crackling fire + wind ambience
    EAGLE_SCREECH = "sfx_eagle_screech",          // White falcon wing flap + screech
    BIRTH_CHIME = "sfx_birth_chime",            // Magical shimmer/chime at flash of light
    MANAS_BORN = "sfx_manas_born",             // Thunder → baby cry → leopard roar
    SPY_STING = "sfx_spy_sting",              // Ominous whoosh/sting (spy appears)
    KNIFE_DRAW = "sfx_knife_draw",             // Dagger unsheathed
    SPEAR_CATCH = "sfx_spear_catch",            // Snap of spear shaft caught by hand

    // Act II Sfx
    CROWD_CHANT = "sfx_crowd_chant",            // Thousands chanting "Manas! Manas!"
    SWORD_CLASH = "sfx_sword_clash",            // Oath ceremony – crossing blades
    WAR_HORN = "sfx_war_horn",               // Kerney (war horn) blast
    CAVALRY_CHARGE = "sfx_cavalry_charge",         // Rumble of thousands of hooves + armor

    // Act III Sfx
    CAMP_AMBIENCE = "sfx_camp_ambience",          // Horse neighing, metal clink, camp noise
    BATTLE_CHAOS = "sfx_battle_chaos",           // Drum, arrows, metal-on-metal
    ARROW_VOLLEY = "sfx_arrow_volley",           // Volley of arrows
    KONURBAY_RETREAT = "sfx_konurbay_retreat",       // Fast retreating hooves fading out
    AXE_STRIKE = "sfx_axe_strike",            // Dull meaty thud of axe blow
    EAR_RING = "sfx_ear_ring",               // High-pitched ear ringing (post-blow)
    BODY_FALL = "sfx_body_fall",              // Heavy body falling to ground

    // Act IV Sfx
    HEAVY_BREATH = "sfx_heavy_breath",           // Laboured dying breaths
    WIND_HOWL = "sfx_wind_howl",              // Mournful wind at moment of death
    FINAL_DRUM = "sfx_final_drum",             // Single mighty drum hit fading to echo
}
