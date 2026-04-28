import { useColorScheme } from "@mui/joy";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import clsx from "clsx";
import { memo, useCallback, useEffect, useRef } from "react";
import { MarkdownTypewriterHooks } from "react-markdown-typewriter";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import AnimatedDots from "../components/AnimatedDots";
import SliderResizer from "../components/SliderResizer";
import { useQueryDialogue } from "../hooks/useQueryInterface";
import useDialogueCardStore from "../stores/useDialogueCardStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useTypewriterStore from "../stores/useTypewriterStore";
import ChoiceMenu from "./ChoiceMenu";

// ─── Константы отрисовки ────────────────────────────────────
const CARD_BORDER_RADIUS = 0;

// ─── Основной экран ─────────────────────────────────────────
export default function NarrationScreen() {
    const { height: cardHeightTemp, imageWidth: cardImageWidth, setImageWidth: setCardImageWidth } =
        useDialogueCardStore(useShallow((state) => state));

    const { data: dialogueData } = useQueryDialogue();
    const { text, character } = dialogueData ?? {};

    // Скрываем карточку, если нет текста
    const hasContent = Boolean(text);
    const hidden = useInterfaceStore(
        // useShallow здесь не нужен — примитивное значение
        (state) => state.hidden || !hasContent
    );
    const cardHeight = hasContent ? cardHeightTemp : 0;

    const cardVarians = clsx({
        "motion-opacity-out-0 motion-translate-y-out-[50%]": hidden,
        "motion-opacity-in-0 motion-translate-y-in-[50%]": !hidden,
    });

    const cardImageVarians = clsx({
        "motion-opacity-in-0 motion-translate-x-in-[-5%]": !hidden && character?.icon,
        "motion-opacity-out-0": hidden || !character?.icon,
    });

    const paragraphRef = useRef<HTMLDivElement>(null);

    // ИСПРАВЛЕНО: добавлен paragraphRef в зависимости useCallback.
    // Ref-объект стабилен (React гарантирует), поэтому callback
    // пересоздаётся только при реальной смене элемента.
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
        // paragraphRef сам по себе стабилен, но мы включаем его
        // чтобы линтер не предупреждал о deps.
        [paragraphRef]
    );

    // ОПТИМИЗАЦИЯ: clamp логика вынесена в стабильный callback
    const handleImageWidthChange = useCallback(
        (_: Event | React.SyntheticEvent, value: number | number[]) => {
            if (typeof value !== "number") return;
            const clamped = Math.max(5, Math.min(75, value));
            setCardImageWidth(clamped);
        },
        [setCardImageWidth]
    );

    return (
        <Box
            sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
            }}
        >
            <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ChoiceMenu />
                </Box>
                <Box
                    sx={{
                        flex: "0 0 auto",
                        height: `${cardHeight}%`,
                        minHeight: 0,
                        pointerEvents: !hidden ? "auto" : "none",
                    }}
                    className={cardVarians}
                >
                    <Card
                        key="dialogue-card"
                        orientation="horizontal"
                        sx={{
                            overflow: "hidden",
                            gap: 1,
                            padding: 0,
                            height: "100%",
                            width: "100%",
                            marginX: 0,
                            borderRadius: CARD_BORDER_RADIUS,
                            borderLeft: 0,
                            borderRight: 0,
                            borderBottom: 0,
                        }}
                    >
                        {character?.icon && (
                            <AspectRatio
                                flex
                                ratio="1"
                                maxHeight="20%"
                                sx={{ height: "100%", minWidth: `${cardImageWidth}%` }}
                                className="motion-scale-x-in-0"
                            >
                                <img src={character.icon} loading="lazy" alt="" />
                            </AspectRatio>
                        )}

                        <SliderResizer
                            orientation="horizontal"
                            max={100}
                            min={0}
                            value={cardImageWidth}
                            onChange={handleImageWidthChange}
                            sx={{
                                pointerEvents: !hidden && character?.icon ? "auto" : "none",
                            }}
                            className={cardImageVarians}
                        />

                        <CardContent>
                            {/* ОПТИМИЗАЦИЯ: CharacterName вынесен в memo-компонент */}
                            <CharacterName character={character} hidden={hidden} />

                            <Sheet
                                ref={paragraphRef}
                                sx={{
                                    bgcolor: "background.level1",
                                    borderRadius: "sm",
                                    p: 1.5,
                                    minHeight: 10,
                                    display: "flex",
                                    flex: 1,
                                    overflow: "auto",
                                    height: "100%",
                                    marginX: { xs: 0, md: 3 },
                                    marginBottom: 0,
                                    paddingBottom: { xs: 4, md: 5 },
                                }}
                            >
                                <NarrationScreenText
                                    text={text}
                                    onCharacterAnimationComplete={handleCharacterAnimationComplete}
                                />
                            </Sheet>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}

// ─── CharacterName: memo предотвращает ре-рендер при смене текста ──
type CharacterNameProps = {
    character: { name?: string; surname?: string; color?: string } | undefined;
    hidden: boolean;
};

const CharacterName = memo(function CharacterName({ character, hidden }: CharacterNameProps) {
    const hasName = Boolean(character?.name);
    return (
        <Typography
            fontSize={{ xs: "lg", sm: "xl", lg: "xl2" }}
            fontWeight="lg"
            sx={{
                color: character?.color,
                paddingLeft: 1,
                height: { xs: undefined, md: 30 },
                marginLeft: 2,
            }}
            className={
                hasName && !hidden
                    ? "motion-opacity-in-0 motion-translate-x-in-[-3%]"
                    : "motion-opacity-out-0"
            }
        >
            {`${character?.name ?? ""} ${character?.surname ?? ""}`.trim()}
        </Typography>
    );
});

// memo: ре-рендер только при смене text или typewriterDelay
type NarrationScreenTextProps = {
    text: string | undefined;
    onCharacterAnimationComplete: (ref: { current: HTMLSpanElement | null }) => void;
};

const NarrationScreenText = memo(function NarrationScreenText({
    text,
    onCharacterAnimationComplete,
}: NarrationScreenTextProps) {
    const typewriterDelay = useTypewriterStore(useShallow((state) => state.delay));
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
        <p
            className={`prose prose-sm sm:prose-base md:prose-lg lg:prose-xl ${
                mode === "dark" ? "dark:prose-invert" : ""
            }`}
            style={{ margin: 0, padding: 0, maxWidth: "100%" }}
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
        </p>
    );
});
