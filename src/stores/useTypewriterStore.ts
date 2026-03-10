import { create } from "zustand";

type TypewriterStoreType = {
    /**
     * The delay in milliseconds between each character
     */
    delay: number;
    /**
     * Saved user delay (never 0) — restored after skip
     */
    savedDelay: number;
    /**
     * Set the delay in milliseconds between each character
     */
    setDelay: (value: number) => void;
    /**
     * True while the typewriter animation is running (is_typing)
     */
    inProgress: boolean;
    /**
     * Start the typewriter effect
     */
    start: () => void;
    /**
     * End the typewriter effect
     */
    end: () => void;
    /**
     * Skip current animation — set delay to 0 so the typewriter finishes instantly.
     * Call restoreDelay() after the dialogue advances to restore normal speed.
     */
    skipToEnd: () => void;
    /**
     * Restore the delay to the saved user value (called when new dialogue starts)
     */
    restoreDelay: () => void;
};

const DEFAULT_DELAY = 10;

const useTypewriterStore = create<TypewriterStoreType>((set, get) => {
    const persisted =
        typeof localStorage.getItem("typewriter_delay_millisecond") === "number"
            ? parseInt(localStorage.getItem("typewriter_delay_millisecond")!)
            : DEFAULT_DELAY;
    return {
        delay: persisted,
        savedDelay: persisted,
        setDelay: (value: number) => {
            if (typeof value === "number") {
                localStorage.setItem("typewriter_delay_millisecond", value.toString());
                set({ delay: value, savedDelay: value });
            }
        },
        inProgress: false,
        start: () => set({ inProgress: true }),
        end: () => set({ inProgress: false }),
        skipToEnd: () => {
            // Setting delay to 0 makes MarkdownTypewriterHooks render all chars instantly
            set({ delay: 0 });
        },
        restoreDelay: () => {
            const saved = get().savedDelay || DEFAULT_DELAY;
            set({ delay: saved });
        },
    };
});
export default useTypewriterStore;
