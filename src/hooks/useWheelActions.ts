import { stepHistory, StepLabelProps } from "@drincs/pixi-vn";
import { narration } from "@drincs/pixi-vn/narration";
import { useQueryClient } from "@tanstack/react-query";
import { throttle } from "es-toolkit";
import { useCallback, useEffect, useRef } from "react";
import { HTML_CANVAS_LAYER_NAME, HTML_UI_LAYER_NAME } from "../constans";
import useStepStore from "../stores/useStepStore";
import useGameProps from "./useGameProps";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

function isScrollableElement(element: HTMLElement | null): boolean {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;

    const isScrollable =
        (overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight;

    return isScrollable;
}

function hasScrollableParent(target: EventTarget | null): boolean {
    let el = target as HTMLElement | null;

    while (el) {
        if (isScrollableElement(el)) {
            return true;
        }
        el = el.parentElement;
    }

    return false;
}

function isInsideRoot(target: EventTarget | null, selector: string): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.closest("#" + selector) !== null;
}

export function useWheelActions({
    throttleMs = 300,
    minDelta = 20,
}: {
    throttleMs?: number;
    minDelta?: number;
} = {}) {
    const pendingAsync = useRef(0);
    const setLoading = useStepStore((state) => state.setLoading);
    const queryClient = useQueryClient();
    const gameProps = useGameProps();

    const gamePropsRef = useRef(gameProps);
    useEffect(() => {
        gamePropsRef.current = gameProps;
    }, [gameProps]);

    const runAsync = useCallback(async (fn: (props: StepLabelProps) => Promise<unknown>) => {
        try {
            pendingAsync.current += 1;
            setLoading(pendingAsync.current > 0);
            await fn(gamePropsRef.current);
        } finally {
            pendingAsync.current -= 1;
            setLoading(pendingAsync.current > 0);
            if (pendingAsync.current === 0) {
                queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
            }
        }
    }, [setLoading, queryClient]);

    const handleWheelRef = useRef(
        throttle(async (event: WheelEvent, runAsyncFn: typeof runAsync, minDeltaVal: number) => {
            if (!(isInsideRoot(event.target, HTML_UI_LAYER_NAME) || isInsideRoot(event.target, HTML_CANVAS_LAYER_NAME)))
                return;
            if (hasScrollableParent(event.target)) return;

            // block native scroll
            event.preventDefault();

            const { deltaY } = event;

            // ignore micro-movements
            if (Math.abs(deltaY) < minDeltaVal) return;

            if (deltaY < 0) {
                // ⬆️ Scroll up
                await runAsyncFn(narration.continue.bind(narration));
            }

            if (deltaY > 0) {
                // ⬇️ Scroll down
                await runAsyncFn(stepHistory.back.bind(stepHistory));
            }
        }, throttleMs)
    );

    // Update throttle if throttleMs changes (rarely happens, but for completeness)
    useEffect(() => {
        handleWheelRef.current = throttle(handleWheelRef.current, throttleMs);
    }, [throttleMs]);

    const onWheel = useCallback((event: WheelEvent) => {
        handleWheelRef.current(event, runAsync, minDelta);
    }, [runAsync, minDelta]);

    useEffect(() => {
        window.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", onWheel);
            handleWheelRef.current.cancel();
        };
    }, [onWheel]);

    return null;
}
