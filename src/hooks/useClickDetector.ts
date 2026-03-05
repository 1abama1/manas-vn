import { useEffect } from "react";
import useNarrationFunctions from "./useNarrationFunctions";
import { useQueryCanGoNext } from "./useQueryInterface";
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

            if (canContinue) {
                if (skipEnabled) {
                    setSkipEnabled(false);
                }
                goNext();
            }
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [canContinue, goNext, skipEnabled, setSkipEnabled]);

    return null;
}
