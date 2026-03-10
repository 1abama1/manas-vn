import { storage } from "@drincs/pixi-vn";

export class GameProgressManager {
    static unlockCodex(codexId: "codex_tugol_kan" | "codex_jakyp_wealth" | "codex_almambet_tactics" | "codex_chubak_fury") {
        storage.set(codexId, true);
    }

    static hasCodex(codexId: string): boolean {
        return storage.get(codexId) === true;
    }

}
