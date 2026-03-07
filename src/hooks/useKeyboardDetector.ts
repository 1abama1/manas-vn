import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import useSkipStore from "../stores/useSkipStore";
import { saveGameToIndexDB } from "../utils/save-utility";
import useEventListener from "./useKeyDetector";
import useNarrationFunctions from "./useNarrationFunctions";
import { useQueryCanGoBack, useQueryCanGoNext } from "./useQueryInterface";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "./useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "./useQuerySaves";

export default function useKeyboardDetector() {
    const setOpenLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { data: lastSave = null } = useQueryLastSave();

    const skipEnabled = useSkipStore((state) => state.enabled);
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);

    const { goNext, goBack } = useNarrationFunctions();
    const { data: canContinue = false } = useQueryCanGoNext();
    const { data: canGoBack = false } = useQueryCanGoBack();

    const onkeydown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyS":
                    if (event.altKey) {
                        if (location.pathname === "/") {
                            console.log("Can't save on home page");
                            break;
                        }
                        saveGameToIndexDB()
                            .then((save) => {
                                queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                                queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                                enqueueSnackbar(t("success_save"), { variant: "success" });
                            })
                            .catch(() => {
                                enqueueSnackbar(t("fail_save"), { variant: "error" });
                            });
                    }
                    break;
                case "KeyL":
                    if (event.altKey) {
                        if (!lastSave) {
                            console.log("No save to load");
                            return;
                        }
                        setOpenLoadAlert(lastSave);
                    }
                    break;
                case "Space":
                case "Enter":
                case "ArrowRight":
                    if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
                        if (
                            useSettingsScreenStore.getState().open ||
                            useGameSaveScreenStore.getState().open ||
                            useHistoryScreenStore.getState().open
                        ) {
                            return;
                        }
                        if (canContinue) {
                            if (skipEnabled) {
                                setSkipEnabled(false);
                            }
                            goNext();
                            event.preventDefault(); // Prevent page scrolling on Space
                        }
                    }
                    break;
                case "ArrowLeft":
                    if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
                        if (
                            useSettingsScreenStore.getState().open ||
                            useGameSaveScreenStore.getState().open ||
                            useHistoryScreenStore.getState().open
                        ) {
                            return;
                        }
                        if (canGoBack) {
                            if (skipEnabled) {
                                setSkipEnabled(false);
                            }
                            goBack();
                        }
                    }
                    break;
            }
        },
        [location, lastSave, queryClient, t, canContinue, canGoBack, goNext, goBack, skipEnabled, setSkipEnabled]
    );

    useEventListener({ type: "keydown", listener: onkeydown });

    return null;
}
