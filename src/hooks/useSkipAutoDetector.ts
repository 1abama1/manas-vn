import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { SKIP_DELAY } from "../constans";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useSkipStore from "../stores/useSkipStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import useDebouncedEffect from "./useDebouncedEffect";
import useInterval from "./useInterval";
import useEventListener from "./useKeyDetector";
import useNarrationFunctions from "./useNarrationFunctions";

export default function useSkipAutoDetector() {
    const skipEnabled = useSkipStore(useShallow((state) => state.enabled));
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);
    const autoEnabled = useAutoInfoStore(useShallow((state) => state.enabled));
    const autoTime = useAutoInfoStore(useShallow((state) => state.time));
    const typewriterInProgress = useTypewriterStore(useShallow((state) => state.inProgress));
    const { goNext } = useNarrationFunctions();
    const goNextRef = useRef(goNext);

    useEffect(() => {
        goNextRef.current = goNext;
    }, [goNext]);

    useInterval(() => goNextRef.current(), {
        delay: SKIP_DELAY,
        enabled: skipEnabled,
    });

    useDebouncedEffect(
        () => autoEnabled && !skipEnabled && goNextRef.current(),
        {
            delay: autoTime * 1000,
            enabled: autoEnabled && !skipEnabled && !typewriterInProgress,
        },
        [autoEnabled, skipEnabled]
    );

    useEventListener({
        type: "keydown",
        listener: (event) => {
            if (event.key === "Control" || event.key === "Tab") {
                event.preventDefault();
                setSkipEnabled(true);
            }
        },
    });
    useEventListener({
        type: "keyup",
        listener: (event) => {
            if (event.key === "Control" || event.key === "Tab") {
                event.preventDefault();
                setSkipEnabled(false);
                goNext();
            }
        },
    });

    return null;
}
