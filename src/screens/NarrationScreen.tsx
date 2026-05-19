import { useColorScheme } from "@mui/joy";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import clsx from "clsx";
import { memo, useCallback, useEffect, useRef } from "react";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import AnimatedDots from "../components/AnimatedDots";
import SliderResizer from "../components/SliderResizer";
import { useQueryDialogue } from "../hooks/useQueryInterface";
import useDialogueCardStore from "../stores/useDialogueCardStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import ChoiceMenu from "./ChoiceMenu";

export default function NarrationScreen() {
    // ОПТИМИЗАЦИЯ ZUSTAND: Дробим селекторы. useShallow для всего объекта state - антипаттерн, 
    // который ведет к лишним ререндерам, если меняется другое поле стора.
    const cardHeight = useDialogueCardStore((state) => state.height);
    const cardImageWidth = useDialogueCardStore((state) => state.imageWidth);
    const setCardImageWidth = useDialogueCardStore((state) => state.setImageWidth);

    const { data: dialogueData } = useQueryDialogue();
    const { text, character } = dialogueData ?? {};

    const hasContent = Boolean(text);
    const isInterfaceHidden = useInterfaceStore((state) => state.hidden);
    const hidden = isInterfaceHidden || !hasContent;

    const currentCardHeight = hasContent ? cardHeight : 0;

    const cardVarians = clsx({
        "motion-opacity-out-0 motion-translate-y-out-[50%] pointer-events-none": hidden,
        "motion-opacity-in-0 motion-translate-y-in-[50%] pointer-events-auto": !hidden,
    });

    const cardImageVarians = clsx(
        "hidden md:block", // Скрываем ползунок на смартфонах, чтобы не мешал пальцам
        {
            "motion-opacity-in-0 motion-translate-x-in-[-5%]": !hidden && character?.icon,
            "motion-opacity-out-0": hidden || !character?.icon,
        }
    );

    const paragraphRef = useRef<HTMLDivElement>(null);

    const handleCharacterAnimationComplete = useCallback(
        (ref: { current: HTMLSpanElement | null }) => {
            const paragraph = paragraphRef.current;
            const char = ref.current;
            if (paragraph && char) {
                paragraph.scrollTo({
                    top: char.offsetTop - paragraph.clientHeight / 2,
                    behavior: "auto",
                });
            }
        },
        [] // paragraphRef стабилен, зависимости не нужны
    );

    const handleImageWidthChange = useCallback(
        (_: Event | React.SyntheticEvent, value: number | number[]) => {
            if (typeof value !== "number") return;
            const clamped = Math.max(5, Math.min(75, value));
            setCardImageWidth(clamped);
        },
        [setCardImageWidth]
    );

    return (
        // ОПТИМИЗАЦИЯ СТИЛЕЙ: Замена <Box sx={{...}}> на <div> с классами Tailwind
        <div className="absolute flex flex-col h-full w-full">
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 min-h-0">
                    <ChoiceMenu />
                </div>
                <div
                    className={clsx("flex-none min-h-0 transition-all duration-300", cardVarians)}
                    style={{ height: `${currentCardHeight}%` }}
                >
                    <Card
                        key="dialogue-card"
                        orientation="horizontal"
                        className="overflow-hidden p-0 h-full w-full m-0 rounded-none border-b-0 border-l-0 border-r-0"
                        style={{ gap: '0.25rem' }}
                    >
                        {character?.icon && (
                            <AspectRatio
                                ratio="1"
                                // МОБИЛЬНАЯ АДАПТИВНОСТЬ: Фиксированная ширина на мобильных, переменная (из слайдера) на десктопе
                                className="motion-scale-x-in-0 shrink-0 h-full w-[80px] sm:w-[120px] md:w-[var(--card-img-width)]"
                                style={{ "--card-img-width": `${cardImageWidth}%` } as React.CSSProperties}
                            >
                                <img src={character.icon} loading="lazy" alt="Avatar" className="object-cover" />
                            </AspectRatio>
                        )}

                        <SliderResizer
                            orientation="horizontal"
                            max={100}
                            min={0}
                            value={cardImageWidth}
                            onChange={handleImageWidthChange}
                            className={clsx(
                                cardImageVarians,
                                !hidden && character?.icon ? "pointer-events-auto" : "pointer-events-none"
                            )}
                        />

                        <CardContent className="flex flex-col min-h-0 p-2 md:p-3">
                            <CharacterName character={character} hidden={hidden} />

                            <Sheet
                                ref={paragraphRef}
                                // Оставляем sx ТОЛЬКО для токенов палитры Joy UI, всю геометрию выносим в Tailwind
                                sx={{ bgcolor: "background.level1" }}
                                className="rounded-sm p-3 min-h-[10px] flex flex-1 overflow-auto h-full mx-0 md:mx-6 mb-0 pb-4 md:pb-5"
                            >
                                <NarrationScreenText
                                    text={text}
                                    onCharacterAnimationComplete={handleCharacterAnimationComplete}
                                />
                            </Sheet>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ─── CharacterName ──────────────────────────────────────────
type CharacterNameProps = {
    character: { name?: string; surname?: string; color?: string } | undefined;
    hidden: boolean;
};

const CharacterName = memo(function CharacterName({ character, hidden }: CharacterNameProps) {
    const hasName = Boolean(character?.name);
    return (
        <Typography
            className={clsx(
                "pl-2 ml-2 md:ml-4 md:h-[30px] font-bold text-lg sm:text-xl lg:text-2xl",
                hasName && !hidden
                    ? "motion-opacity-in-0 motion-translate-x-in-[-3%]"
                    : "motion-opacity-out-0"
            )}
            style={{ color: character?.color }}
        >
            {`${character?.name ?? ""} ${character?.surname ?? ""}`.trim()}
        </Typography>
    );
});

// ─── NarrationScreenText ────────────────────────────────────
type NarrationScreenTextProps = {
    text: string | undefined;
    onCharacterAnimationComplete: (ref: { current: HTMLSpanElement | null }) => void;
};

const NarrationScreenText = memo(function NarrationScreenText({
    text,
    onCharacterAnimationComplete,
}: NarrationScreenTextProps) {
    // ОПТИМИЗАЦИЯ ZUSTAND: useShallow для примитивов не нужен, он только добавляет overhead
    const typewriterDelay = useTypewriterStore((state) => state.delay);
    const startTypewriter = useTypewriterStore((state) => state.start);
    const endTypewriter   = useTypewriterStore((state) => state.end);
    const restoreDelay    = useTypewriterStore((state) => state.restoreDelay);
    const { mode } = useColorScheme();

    useEffect(() => {
        if (text) {
            restoreDelay();
            startTypewriter();
        }
    }, [text, restoreDelay, startTypewriter]);

    const handleAnimationComplete = useCallback(
        (definition: "visible" | "hidden") => {
            if (definition === "visible") endTypewriter();
        },
        [endTypewriter]
    );

    return (
        <div
            className={clsx(
                "prose prose-sm sm:prose-base md:prose-lg lg:prose-xl m-0 p-0 max-w-full",
                mode === "dark" && "dark:prose-invert"
            )}
        >
            <span>
                <MarkdownTypewriterHooks
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    delay={typewriterDelay}
                    motionProps={{
                        onAnimationComplete: handleAnimationComplete,
                        onCharacterAnimationComplete: onCharacterAnimationComplete,
                    }}
                    fallback={<AnimatedDots />}
                >
                    {text}
                </MarkdownTypewriterHooks>
            </span>
        </div>
    );
});
