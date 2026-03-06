import { storage } from "@drincs/pixi-vn";

export class GameProgressManager {
    static unlockCodex(codexId: "codex_tugol_kan" | "codex_jakyp_wealth") {
        storage.set(codexId, true);
    }

    static hasCodex(codexId: string): boolean {
        return storage.get(codexId) === true;
    }
}
