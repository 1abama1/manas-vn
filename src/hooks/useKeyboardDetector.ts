import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import useSkipStore from "../stores/useSkipStore";
import useTypewriterStore from "../stores/useTypewriterStore";
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

    const canContinueRef = useRef(canContinue);
    const canGoBackRef = useRef(canGoBack);
    const lastSaveRef = useRef(lastSave);
    const skipEnabledRef = useRef(skipEnabled);
    const locationRef = useRef(location);

    useEffect(() => {
        canContinueRef.current = canContinue;
        canGoBackRef.current = canGoBack;
        lastSaveRef.current = lastSave;
        skipEnabledRef.current = skipEnabled;
        locationRef.current = location;
    }, [canContinue, canGoBack, lastSave, skipEnabled, location]);

    const queryClientRef = useRef(queryClient);
    const tRef = useRef(t);
    const setOpenLoadAlertRef = useRef(setOpenLoadAlert);
    const setSkipEnabledRef = useRef(setSkipEnabled);
    const goNextRef = useRef(goNext);
    const goBackRef = useRef(goBack);
    const enqueueSnackbarRef = useRef(enqueueSnackbar);

    useEffect(() => {
        queryClientRef.current = queryClient;
        tRef.current = t;
        setOpenLoadAlertRef.current = setOpenLoadAlert;
        setSkipEnabledRef.current = setSkipEnabled;
        goNextRef.current = goNext;
        goBackRef.current = goBack;
        enqueueSnackbarRef.current = enqueueSnackbar;
    }, [queryClient, t, setOpenLoadAlert, setSkipEnabled, goNext, goBack, enqueueSnackbar]);

    const onkeydown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyS":
                    if (event.altKey) {
                        if (locationRef.current.pathname === "/") {
                            console.log("Can't save on home page");
                            break;
                        }
                        saveGameToIndexDB()
                            .then((save) => {
                                queryClientRef.current.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                                queryClientRef.current.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                                enqueueSnackbarRef.current(tRef.current("success_save"), { variant: "success" });
                            })
                            .catch(() => {
                                enqueueSnackbarRef.current(tRef.current("fail_save"), { variant: "error" });
                            });
                    }
                    break;
                case "KeyL":
                    if (event.altKey) {
                        if (!lastSaveRef.current) {
                            console.log("No save to load");
                            return;
                        }
                        setOpenLoadAlertRef.current(lastSaveRef.current);
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
                        event.preventDefault(); // Prevent page scrolling on Space

                        // ── VN mechanic ───────────────────────────────────────
                        const { inProgress, skipToEnd } = useTypewriterStore.getState();
                        if (inProgress) {
                            // Text still printing → show all at once
                            skipToEnd();
                            break;
                        }
                        // ─────────────────────────────────────────────────────

                        if (canContinueRef.current) {
                            if (skipEnabledRef.current) {
                                setSkipEnabledRef.current(false);
                            }
                            goNextRef.current();
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
                        if (canGoBackRef.current) {
                            if (skipEnabledRef.current) {
                                setSkipEnabledRef.current(false);
                            }
                            goBackRef.current();
                        }
                    }
                    break;
            }
        },
        [] // Stable callback
    );

    useEventListener({ type: "keydown", listener: onkeydown });

    return null;
}
