import { storage } from "@drincs/pixi-vn";

type CodexId = "codex_tugol_kan" | "codex_jakyp_wealth" | "codex_almambet_tactics" | "codex_chubak_fury";

export class GameProgressManager {
    static unlockCodex(codexId: CodexId) {
        storage.set(codexId, true);
    }

    static hasCodex(codexId: CodexId): boolean {
        return storage.get<boolean>(codexId) === true;
    }

}
