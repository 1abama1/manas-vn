import { create } from "zustand";

const DEFAULT_DELAY = 10;
const LS_KEY = "typewriter_delay_millisecond";

// ИСПРАВЛЕНО: было `typeof localStorage.getItem(...) === "number"` — 
// это всегда false, т.к. getItem возвращает string | null, а не number.
function loadPersistedDelay(): number {
    const raw = localStorage.getItem(LS_KEY);
    if (raw === null) return DEFAULT_DELAY;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? DEFAULT_DELAY : parsed;
}

type TypewriterStoreType = {
    delay: number;
    savedDelay: number;
    setDelay: (value: number) => void;
    inProgress: boolean;
    start: () => void;
    end: () => void;
    skipToEnd: () => void;
    restoreDelay: () => void;
};

const useTypewriterStore = create<TypewriterStoreType>((set, get) => {
    const persisted = loadPersistedDelay();

    return {
        delay: persisted,
        savedDelay: persisted,

        setDelay: (value: number) => {
            if (typeof value !== "number" || isNaN(value)) return;
            localStorage.setItem(LS_KEY, value.toString());
            set({ delay: value, savedDelay: value });
        },

        inProgress: false,
        start: () => set({ inProgress: true }),
        end:   () => set({ inProgress: false }),

        skipToEnd: () => {
            // delay=0 заставляет MarkdownTypewriterHooks отрисовать всё мгновенно
            set({ delay: 0, inProgress: false });
        },

        restoreDelay: () => {
            const saved = get().savedDelay;
            set({ delay: saved > 0 ? saved : DEFAULT_DELAY });
        },
    };
});

export default useTypewriterStore; 
