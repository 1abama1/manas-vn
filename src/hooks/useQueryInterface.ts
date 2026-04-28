import { CharacterInterface, narration, stepHistory } from "@drincs/pixi-vn";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export const INTERFACE_DATA_USE_QUEY_KEY = "interface_data_use_quey_key";

// ─── Типы ───────────────────────────────────────────────────
type PlainCharacter = {
    id: string;
    name?: string;
    surname?: string;
    icon?: string;
    color?: string;
};

type DialogueModel = {
    text?: string;
    character?: PlainCharacter;
};

// ─────────────────────────────────────────────────────────────
// HELPER: стабильная сериализация Character для сравнения
// TanStack Query использует структурное сравнение данных,
// но вложенные объекты без стабильного identity вызывают
// лишние ре-рендеры. Мы возвращаем plain object с примитивами.
// ─────────────────────────────────────────────────────────────
const characterCache = new Map<string, PlainCharacter>();

function resolveCharacter(
    character: CharacterInterface | string | undefined,
    t: (key: string) => string,
    lang: string
): PlainCharacter | undefined {
    if (!character) return undefined;

    const isString = typeof character === "string";
    const charId = isString ? character : character.id;
    const cacheKey = `${charId}_${lang}`;

    if (characterCache.has(cacheKey)) {
        return characterCache.get(cacheKey);
    }

    const resolved: PlainCharacter = isString
        ? { id: character, name: t(character) }
        : {
            id: character.id,
            name: character.name ? t(character.name) : undefined,
            surname: character.surname ? t(character.surname) : undefined,
            icon: character.icon,
            color: character.color,
        };

    characterCache.set(cacheKey, resolved);
    return resolved;
}

const textCache = new Map<string, string>();

function resolveText(
    text: string | string[] | undefined,
    t: (key: string) => string,
    lang: string
): string | undefined {
    if (!text) return undefined;
    
    const rawText = Array.isArray(text) ? text.join("|") : text;
    const cacheKey = `${rawText}_${lang}`;

    if (textCache.has(cacheKey)) {
        return textCache.get(cacheKey);
    }

    const resolved = Array.isArray(text) ? text.map((v) => t(v)).join(" ") : t(text);
    textCache.set(cacheKey, resolved);
    return resolved;
}

// ─── Хуки ───────────────────────────────────────────────────

const CAN_GO_BACK_USE_QUEY_KEY = "can_go_back_use_quey_key";
export function useQueryCanGoBack() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_BACK_USE_QUEY_KEY],
        queryFn: () => stepHistory.canGoBack,
        // Булево значение — структурное сравнение O(1)
        structuralSharing: true,
    });
}

const CHOICE_MENU_OPTIONS_USE_QUEY_KEY = "choice_menu_options_use_quey_key";
export function useQueryChoiceMenuOptions() {
    const { t, i18n } = useTranslation(["narration"]);
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CHOICE_MENU_OPTIONS_USE_QUEY_KEY, i18n.language],
        queryFn: () =>
            (narration.choices ?? []).map((option) => ({
                ...option,
                text: typeof option.text === "string"
                    ? t(option.text)
                    : option.text.map((v) => t(v)).join(" "),
            })),
        structuralSharing: true,
    });
}

const INPUT_VALUE_USE_QUEY_KEY = "input_value_use_quey_key";
export function useQueryInputValue<T>() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, INPUT_VALUE_USE_QUEY_KEY],
        queryFn: () => ({
            isRequired: narration.isRequiredInput,
            type: narration.inputType,
            currentValue: narration.inputValue as T | undefined,
        }),
        structuralSharing: true,
    });
}

const DIALOGUE_USE_QUEY_KEY = "dialogue_use_quey_key";
export function useQueryDialogue() {
    const { t, i18n } = useTranslation(["narration"]);

    return useQuery<DialogueModel>({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, DIALOGUE_USE_QUEY_KEY, i18n.language],
        queryFn: (): DialogueModel => {
            const dialogue = narration.dialogue;

            // Если нет диалога — возвращаем стабильный пустой объект
            // (TanStack Query кэширует его и не вызывает ре-рендер)
            if (!dialogue) return EMPTY_DIALOGUE;

            return {
                text: resolveText(dialogue.text, t, i18n.language),
                character: resolveCharacter(dialogue.character, t, i18n.language),
            };
        },
        // structuralSharing — TanStack сравнивает предыдущий и новый результат.
        // Если plain objects идентичны по значениям — подписчики НЕ ре-рендерятся.
        structuralSharing: true,
    });
}

// Стабильный объект-sentinel — не пересоздаётся между рендерами
const EMPTY_DIALOGUE: DialogueModel = Object.freeze({});

const CAN_GO_NEXT_USE_QUEY_KEY = "can_go_next_use_quey_key";
export function useQueryCanGoNext() {
    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, CAN_GO_NEXT_USE_QUEY_KEY],
        queryFn: () => narration.canContinue && !narration.isRequiredInput,
        structuralSharing: true,
    });
}

const NARRATIVE_HISTORY_USE_QUEY_KEY = "narrative_history_use_quey_key";
export function useQueryNarrativeHistory({ searchString }: { searchString?: string }) {
    const { t, i18n } = useTranslation(["narration"]);

    return useQuery({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY, NARRATIVE_HISTORY_USE_QUEY_KEY, searchString, i18n.language],
        queryFn: async () => {
            const items = stepHistory.narrativeHistory.map((step) => {
                const char = step.dialogue?.character;
                let characterName: string | undefined;
                let icon: string | undefined;

                if (typeof char === "string") {
                    characterName = t(char);
                } else if (char) {
                    characterName = char.name
                        ? t(char.name) + (char.surname ? " " + t(char.surname) : "")
                        : undefined;
                    icon = char.icon;
                }

                return {
                    character: characterName,
                    text: resolveText(step.dialogue?.text, t, i18n.language) ?? "",
                    icon,
                    choices: step.choices,
                    inputValue: step.inputValue,
                };
            });

            if (!searchString) return items;

            const lower = searchString.toLowerCase();
            return items.filter(
                (d) =>
                    d.character?.toLowerCase().includes(lower) ||
                    d.text?.toLowerCase().includes(lower)
            );
        },
        structuralSharing: true,
    });
}
