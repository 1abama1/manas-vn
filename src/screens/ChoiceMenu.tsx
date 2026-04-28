import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Grid } from "@mui/joy";
import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import ChoiceButton from "../components/ChoiceButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryChoiceMenuOptions } from "../hooks/useQueryInterface";
import useInterfaceStore from "../stores/useInterfaceStore";
import useStepStore from "../stores/useStepStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import type { StoredIndexedChoiceInterface } from "@drincs/pixi-vn";

/**
 * ОПТИМИЗАЦИЯ: убран локальный useState(open) + useDebouncedEffect.
 *
 * Исходный код использовал дополнительный state и debounce в 100ms,
 * чтобы «скрыть» меню. Это создавало лишний ре-рендер-цикл:
 *   menu изменился → debounce 100ms → setOpen(false) → ещё рендер.
 *
 * Теперь видимость вычисляется напрямую из существующих данных.
 * TanStack Query + Zustand уже реактивны — дополнительный state не нужен.
 */
export default function ChoiceMenu() {
    const nextStepLoading = useStepStore((state) => state.loading);
    const { data: menu = [] } = useQueryChoiceMenuOptions();
    const typewriterInProgress = useTypewriterStore(useShallow((state) => state.inProgress));
    const hidden = useInterfaceStore(useShallow((state) => state.hidden));
    const { selectChoice } = useNarrationFunctions();

    const isVisible = !hidden && menu.length > 0 && !typewriterInProgress;

    if (!isVisible) return null;

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowSpacing={2}
            sx={{
                overflow: "auto",
                height: "100%",
                gap: 1,
                width: "100%",
                pointerEvents: "auto",
                margin: 0,
            }}
            role="menu"
        >
            {menu.map((item, index) => (
                <Grid key={`choice-${index}`} justifyContent="center" alignItems="center">
                    <ChoiceMenuItem
                        item={item}
                        index={index}
                        loading={nextStepLoading}
                        onSelect={selectChoice}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

// ОПТИМИЗАЦИЯ: каждая кнопка выбора обёрнута в memo.
// При загрузке nextStepLoading все кнопки не перерисовываются — 
// только та, которая изменилась (loading state передаётся явно).
type ChoiceMenuItemProps = {
    item: StoredIndexedChoiceInterface & { text: string };
    index: number;
    loading: boolean;
    onSelect: (item: StoredIndexedChoiceInterface) => Promise<void>;
};

const ChoiceMenuItem = memo(function ChoiceMenuItem({
    item,
    index,
    loading,
    onSelect,
}: ChoiceMenuItemProps) {
    const handleClick = useCallback(() => {
        onSelect(item);
    }, [item, onSelect]);

    return (
        <ChoiceButton
            loading={loading}
            onClick={handleClick}
            sx={{ left: 0, right: 0 }}
            className={`motion-opacity-in-0 motion-translate-y-in-[50%] motion-delay-[${index * 200}ms]`}
            startDecorator={item.type === "close" ? <KeyboardReturnIcon /> : undefined}
        >
            {item.text}
        </ChoiceButton>
    );
});
