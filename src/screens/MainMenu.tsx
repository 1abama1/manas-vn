import { canvas, ImageSprite, narration } from "@drincs/pixi-vn";
import { Box, CircularProgress } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import MenuButton from "../components/MenuButton";
import { CANVAS_UI_LAYER_NAME, NARRATION_ROUTE } from "../constans";
import useGameProps from "../hooks/useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../hooks/useQueryInterface";
import useQueryLastSave from "../hooks/useQueryLastSave";
import startLabel from "../labels/startLabel";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import { loadSave } from "../utils/save-utility";

export default function MainMenu() {
    const setOpenSettings = useSettingsScreenStore((state) => state.setOpen);
    const editHideInterface = useInterfaceStore((state) => state.setHidden);
    const editSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const queryClient = useQueryClient();
    const { data: lastSave = null, isLoading } = useQueryLastSave();
    const gameProps = useGameProps();
    const { uiTransition: t, navigate, notify } = gameProps;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        editHideInterface(false);
        let bg = new ImageSprite({ width: 1920, height: 1080 }, "background_main_menu");
        bg.load();
        let layer = canvas.getLayer(CANVAS_UI_LAYER_NAME);
        if (layer) {
            layer.addChild(bg);
        }

        return () => {
            canvas.getLayer(CANVAS_UI_LAYER_NAME)?.removeChildren();
        };
    });

    return (
        <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
            {/* ── Title ── */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.05 }}
                sx={{
                    position: "absolute",
                    top: { xs: "6%", sm: "8%", md: "10%" },
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                <Box
                    component="h1"
                    sx={{
                        margin: 0,
                        fontSize: { xs: "4rem", sm: "6rem", md: "8rem", lg: "10rem" },
                        fontWeight: 900,
                        letterSpacing: { xs: "0.3em", md: "0.45em" },
                        textTransform: "uppercase",
                        lineHeight: 1,
                        color: "rgba(255, 255, 255, 0.95)",
                        textShadow:
                            "0 2px 4px rgba(0,0,0,0.9), 0 6px 24px rgba(0,0,0,0.7), 0 0 60px rgba(255,255,255,0.08)",
                    }}
                >
                    {t("game_title")}
                </Box>
                {/* thin decorative line under the title */}
                <Box
                    sx={{
                        mx: "auto",
                        mt: { xs: 1, md: 1.5 },
                        width: { xs: "120px", sm: "180px", md: "240px" },
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                        opacity: 0.7,
                    }}
                />
            </Box>

            {/* ── Menu buttons ── */}
            <Stack
                direction='row'
                justifyContent='center'
                alignItems='flex-end'
                spacing={{ xs: 2, sm: 4, lg: 6 }}
                sx={{
                    height: "100%",
                    width: "100%",
                    paddingBottom: { xs: 4, sm: 6, md: 8, xl: 10 },
                }}
                component={motion.div}
                initial='closed'
                animate={"open"}
                exit='closed'
            >

                <MenuButton
                    onClick={() => {
                        if (!lastSave) {
                            return;
                        }
                        setLoading(true);
                        loadSave(lastSave, navigate)
                            .then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
                            .catch((e) => {
                                notify(t("fail_load"), { variant: "error" });
                                console.error(e);
                            })
                            .finally(() => setLoading(false));
                    }}
                    transitionDelay={0.1}
                    loading={isLoading}
                    disabled={(!isLoading && !lastSave) || loading}
                >
                    {t("continue")}
                </MenuButton>
                <MenuButton
                    onClick={async () => {
                        setLoading(true);
                        canvas.removeAll();
                        await navigate(NARRATION_ROUTE);
                        narration
                            .call(startLabel, gameProps)
                            .then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
                            .finally(() => setLoading(false));
                    }}
                    transitionDelay={0.2}
                    disabled={loading}
                >
                    {t("start")}
                </MenuButton>
                <MenuButton onClick={editSaveScreen} transitionDelay={0.3} disabled={loading}>
                    {t("load")}
                </MenuButton>
                <MenuButton onClick={() => setOpenSettings(true)} transitionDelay={0.4}>
                    {t("settings")}
                </MenuButton>
                {loading && (
                    <Box
                        sx={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                            padding: 0.5,
                        }}
                        className='motion-preset-pop'
                    >
                        <CircularProgress />
                    </Box>
                )}
            </Stack>
        </Box>
    );
}
