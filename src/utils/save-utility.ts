import { canvas, Game } from "@drincs/pixi-vn";
import { NavigateFunction } from "react-router-dom";
import {
    LOADING_ROUTE,
    MAIN_MENU_ROUTE,
    NARRATION_ROUTE,
    REFRESH_SAVE_LOCAL_STORAGE_KEY,
} from "../constans";
import GameSaveData from "../models/GameSaveData";
import {
    deleteRowFromIndexDB,
    getLastRowFromIndexDB,
    getListFromIndexDB,
    getRowFromIndexDB,
    INDEXED_DB_SAVE_TABLE,
    putRowIntoIndexDB,
} from "./indexedDB-utility";

const SAVE_FILE_EXTENSION = "json";

export function createGameSave(options?: { image?: string; name?: string }): GameSaveData {
    return {
        saveData: Game.exportGameState(),
        gameVersion: __APP_VERSION__,
        date: new Date(),
        name: options?.name ?? "",
        image: options?.image,
    };
}

export async function loadSave(saveData: GameSaveData, navigate: NavigateFunction): Promise<void> {
    await navigate(LOADING_ROUTE);
    await Game.restoreGameState(saveData.saveData, navigate);
}

/**
 * Сохраняет игру в IndexedDB.
 *
 * ИСПРАВЛЕНО: убрано двойное обращение к БД.
 * Исходная версия делала put() + отдельный getLastRow() для получения id.
 * Теперь мы назначаем id ДО записи и возвращаем готовый объект.
 */
export async function saveGameToIndexDB(
    info: Partial<GameSaveData> & { id?: number } = {},
    data = createGameSave()
): Promise<GameSaveData & { id: number }> {
    // Скриншот делаем заранее, пока canvas ещё не изменился
    const image = info.image ?? (await canvas.extractImage());

    let id = info.id;

    // Если id не задан — вычисляем id как lastId + 1 (одно чтение вместо двух)
    if (id === undefined) {
        const lastSave = await getLastRowFromIndexDB<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE);
        id = lastSave ? lastSave.id + 1 : 0;
    }

    const item: GameSaveData & { id: number } = {
        ...data,
        ...info,
        id,
        image,
    };

    await putRowIntoIndexDB(INDEXED_DB_SAVE_TABLE, item);

    // Возвращаем объект напрямую — нет нужды читать из БД ещё раз
    return item;
}

export async function getSaveFromIndexDB(id: number): Promise<(GameSaveData & { id: number }) | null> {
    return getRowFromIndexDB(INDEXED_DB_SAVE_TABLE, id);
}

export async function getLastSaveFromIndexDB(): Promise<(GameSaveData & { id: number }) | null> {
    const list = await getListFromIndexDB<GameSaveData & { id: number }>(INDEXED_DB_SAVE_TABLE, {
        pagination: { limit: 1, offset: 0 },
        order: { field: "date", direction: "prev" },
    });
    return list[0] ?? null;
}

export async function deleteSaveFromIndexDB(id: number): Promise<void> {
    return deleteRowFromIndexDB(INDEXED_DB_SAVE_TABLE, id);
}

export function downloadGameSave(data: GameSaveData = createGameSave()): void {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${__APP_NAME__}-${__APP_VERSION__}-${data.name} ${data.date.toISOString()}.${SAVE_FILE_EXTENSION}`;
    a.click();
    // ИСПРАВЛЕНО: освобождаем object URL после клика
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadGameSaveFromFile(navigate: NavigateFunction, afterLoad?: () => void): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = `application/${SAVE_FILE_EXTENSION}`;
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const jsonString = ev.target?.result as string;
            navigate(LOADING_ROUTE);
            const saveData: GameSaveData = JSON.parse(jsonString);
            loadSave(saveData, navigate)
                .then(() => afterLoad?.())
                .catch(() => navigate(NARRATION_ROUTE));
        };
        reader.readAsText(file);
    };
    input.click();
}

export async function addRefreshSave(): Promise<void> {
    const data = createGameSave();
    const jsonString = JSON.stringify(data);
    if (jsonString) {
        localStorage.setItem(REFRESH_SAVE_LOCAL_STORAGE_KEY, jsonString);
    }
}

export async function loadRefreshSave(navigate: NavigateFunction): Promise<void> {
    const jsonString = localStorage.getItem(REFRESH_SAVE_LOCAL_STORAGE_KEY);
    if (!jsonString) {
        navigate(MAIN_MENU_ROUTE);
        return;
    }

    navigate(LOADING_ROUTE);
    const data: GameSaveData = JSON.parse(jsonString);

    return loadSave(data, navigate)
        .then(() => localStorage.removeItem(REFRESH_SAVE_LOCAL_STORAGE_KEY))
        .catch(() => navigate(MAIN_MENU_ROUTE));
} 
