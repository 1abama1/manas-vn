import { Assets } from "@drincs/pixi-vn";
import manifest from "../assets/manifest";
import { MAIN_MENU_ROUTE } from "../constans";

// Множество имён бандлов, которые были загружены
const _loadedBundles = new Set<string>();

// Бандлы, которые НИКОГДА не выгружаются (core assets)
const PERSISTENT_BUNDLES = new Set<string>([
    MAIN_MENU_ROUTE,
    // Добавь сюда имена бандлов с UI-спрайтами, если появятся
]);

/**
 * Инициализирует манифест ассетов и загружает бандл главного меню.
 * Вызывается один раз при старте приложения.
 */
export async function defineAssets(): Promise<void> {
    await Assets.init({ manifest });

    try {
        await Assets.loadBundle(MAIN_MENU_ROUTE);
        _loadedBundles.add(MAIN_MENU_ROUTE);
    } catch (error) {
        console.error("[Assets] Failed to load main menu bundle:", error);
        throw new Error("Не удалось загрузить ресурсы главного меню.");
    }

    // Фоновая предзагрузка остальных бандлов НЕ делается здесь намеренно.
    // Каждый лейбл загружает свой бандл через onLoadingLabel.
    // Это снижает начальное потребление памяти с ~300MB до ~50MB.
}

/**
 * Загружает бандл по имени и отмечает его как загруженный.
 * Безопасно вызывать повторно — PixiJS кэширует загруженные ассеты.
 */
export async function loadBundle(bundleName: string): Promise<void> {
    if (_loadedBundles.has(bundleName)) return; // уже загружен

    try {
        await Assets.loadBundle(bundleName);
        _loadedBundles.add(bundleName);
        console.debug(`[Assets] Loaded bundle: ${bundleName}`);
    } catch (e) {
        console.error(`[Assets] Failed to load bundle: ${bundleName}`, e);
    }
}

/**
 * Выгружает бандлы, которые НЕ входят в keepBundles.
 *
 * Вызывать при переходе между актами (например, из act2 в act3),
 * чтобы освободить GPU-память от текстур предыдущего акта.
 *
 * @param keepBundles - бандлы, которые НУЖНО оставить в памяти
 *
 * @example
 * // В начале act3:
 * await unloadUnusedBundles(["act3", "audio_act3"]);
 */
export async function unloadUnusedBundles(keepBundles: string[]): Promise<void> {
    const keepSet = new Set([...keepBundles, ...PERSISTENT_BUNDLES]);
    const toUnload: string[] = [];

    for (const bundleName of _loadedBundles) {
        if (!keepSet.has(bundleName)) {
            toUnload.push(bundleName);
        }
    }

    if (toUnload.length === 0) return;

    await Promise.all(
        toUnload.map(async (bundleName) => {
            try {
                // Assets.unloadBundle выгружает текстуры из VRAM и RAM
                await Assets.unloadBundle(bundleName);
                _loadedBundles.delete(bundleName);
                console.debug(`[Assets] Unloaded bundle: ${bundleName}`);
            } catch (e) {
                console.warn(`[Assets] Failed to unload bundle: ${bundleName}`, e);
            }
        })
    );
}

/**
 * Резолвит alias ассета в реальный URL через кэш PixiJS.
 */
export function getPixiJSAsset(asset: string): string {
    return Assets.resolver.resolve(asset)?.src ?? asset;
}

/**
 * Возвращает список всех имён бандлов из манифеста.
 */
export function getAllBundleNames(): string[] {
    return (manifest.bundles ?? []).map((b) => b.name);
}
