import { useEffect } from "react";
import useTypewriterStore from "../stores/useTypewriterStore";
import useNarrationFunctions from "./useNarrationFunctions";
import { useQueryCanGoNext } from "./useQueryInterface";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import useSkipStore from "../stores/useSkipStore";

export default function useClickDetector() {
    const skipEnabled = useSkipStore((state) => state.enabled);
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);
    const { goNext } = useNarrationFunctions();
    const { data: canContinue = false } = useQueryCanGoNext();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Only capture clicks if left mouse button is pressed
            if (e.button !== 0) return;

            // Don't trigger if any menu overlay is open
            if (
                useSettingsScreenStore.getState().open ||
                useGameSaveScreenStore.getState().open ||
                useHistoryScreenStore.getState().open
            ) {
                return;
            }

            // Optional: If user is selecting text, don't trigger
            if (window.getSelection()?.toString().length) {
                return;
            }

            const target = e.target as HTMLElement | null;

            // Don't trigger if clicking on interactive elements
            if (
                target?.closest("button") ||
                target?.closest("input") ||
                target?.closest("a") ||
                target?.closest(".MuiSlider-root") ||
                target?.closest(".MuiSwitch-root") ||
                target?.closest("[role='slider']") ||
                target?.closest("[role='button']") ||
                target?.closest("[role='switch']") ||
                target?.closest("[role='menuitem']")
            ) {
                return;
            }

            // ── VN mechanic ───────────────────────────────────────
            const { inProgress, skipToEnd } = useTypewriterStore.getState();
            if (inProgress) {
                // Text is still typing → show it all at once
                skipToEnd();
                return;
            }
            // ─────────────────────────────────────────────────────

            if (canContinue) {
                if (skipEnabled) {
                    setSkipEnabled(false);
                }
                goNext();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault(); // Prevent browser context menu
            useSettingsScreenStore.getState().editOpen(); // Toggle settings menu
        };

        window.addEventListener("click", handleClick, { capture: true });
        window.addEventListener("contextmenu", handleContextMenu);
        return () => {
            window.removeEventListener("click", handleClick, { capture: true });
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [canContinue, goNext, skipEnabled, setSkipEnabled]);

    return null;
}
