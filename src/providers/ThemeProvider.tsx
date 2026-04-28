import { CssVarsProvider, extendTheme } from "@mui/joy";
import {
    THEME_ID as MATERIAL_THEME_ID,
    ThemeProvider as MaterialCssVarsProvider,
    extendTheme as materialExtendTheme,
} from "@mui/material/styles";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ShadeGenerator from "shade-generator";

type SolidColorType = "black" | "white";

type ColorContextType = {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    solidColor: SolidColorType;
    setSolidColor: (color: SolidColorType) => void;
};

const ColorContext = createContext<ColorContextType>({
    primaryColor: "",
    setPrimaryColor: () => {},
    solidColor: "white",
    setSolidColor: () => {},
});

// Создаём один раз — materialTheme не зависит от state
const materialTheme = materialExtendTheme();

export function useEditColorProvider(): ColorContextType {
    const context = useContext(ColorContext);
    if (context === undefined) {
        throw new Error("useEditColorProvider must be used within MyThemeProvider");
    }
    return context;
}

/**
 * Генерирует 10 оттенков цвета для темы MUI Joy.
 * Вынесено за пределы компонента — чистая функция, нет замыканий.
 */
function get10ColorShades(color: string) {
    return {
        "50":  ShadeGenerator.hue(color).shade("10").hex(),
        "100": ShadeGenerator.hue(color).shade("20").hex(),
        "200": ShadeGenerator.hue(color).shade("40").hex(),
        "300": ShadeGenerator.hue(color).shade("60").hex(),
        "400": ShadeGenerator.hue(color).shade("80").hex(),
        "500": ShadeGenerator.hue(color).shade("100").hex(),
        "600": ShadeGenerator.hue(color).shade("200").hex(),
        "700": ShadeGenerator.hue(color).shade("300").hex(),
        "800": ShadeGenerator.hue(color).shade("400").hex(),
        "900": ShadeGenerator.hue(color).shade("500").hex(),
    } as const;
}

const SOLID_COLOR_VAR = {
    black: "var(--joy-palette-common-black)",
    white: "var(--joy-palette-common-white)",
} as const;

const COMPONENT_OVERRIDES = {
    JoyButton:     { styleOverrides: { root: { pointerEvents: "auto" as const, userSelect: "none" as const } } },
    JoyLink:       { styleOverrides: { root: { pointerEvents: "auto" as const } } },
    JoySvgIcon:    { styleOverrides: { root: { pointerEvents: "auto" as const } } },
    MuiSvgIcon:    { styleOverrides: { root: { pointerEvents: "auto" as const } } },
    JoyCard:       { styleOverrides: { root: { pointerEvents: "auto" as const } } },
    JoyIconButton: { styleOverrides: { root: { pointerEvents: "auto" as const } } },
} as const;

export default function MyThemeProvider({ children }: { children: React.ReactNode }) {
    const [primaryColor, setPrimaryColorState] = useState<string>("#ffffff");
    const [solidColor, setSolidColorState] = useState<SolidColorType>("black");

    // ИСПРАВЛЕНО: localStorage.setItem перенесён из useMemo в useEffect.
    // useMemo — вычисление, не место для побочных эффектов.
    useEffect(() => {
        localStorage.setItem("primaryColor", primaryColor);
    }, [primaryColor]);

    useEffect(() => {
        localStorage.setItem("solidColor", solidColor);
    }, [solidColor]);

    // ОПТИМИЗАЦИЯ: стабильные колбэки через useCallback
    const setPrimaryColor = useCallback((color: string) => {
        setPrimaryColorState(color);
    }, []);

    const setSolidColor = useCallback((color: SolidColorType) => {
        setSolidColorState(color);
    }, []);

    const theme = useMemo(() => {
        const colors = get10ColorShades(primaryColor);
        const solidColorVar = SOLID_COLOR_VAR[solidColor];

        const palette = {
            primary: {
                ...colors,
                solidColor: solidColorVar,
            },
        };

        return extendTheme({
            colorSchemes: {
                light: { palette },
                dark: { palette },
            },
            // ОПТИМИЗАЦИЯ: компонентные оверрайды вынесены в константу
            // и не пересоздаются при каждом изменении цвета
            components: COMPONENT_OVERRIDES,
        });
        // ВАЖНО: COMPONENT_OVERRIDES не включаем в deps — это константа
    }, [primaryColor, solidColor]);

    // ОПТИМИЗАЦИЯ: контекстное значение стабилизировано через useMemo
    const contextValue = useMemo<ColorContextType>(
        () => ({
            primaryColor,
            setPrimaryColor,
            solidColor,
            setSolidColor,
        }),
        [primaryColor, setPrimaryColor, solidColor, setSolidColor]
    );

    return (
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }} defaultMode="dark">
            <CssVarsProvider theme={theme} defaultMode="dark">
                <ColorContext.Provider value={contextValue}>
                    {children}
                </ColorContext.Provider>
            </CssVarsProvider>
        </MaterialCssVarsProvider>
    );
}
