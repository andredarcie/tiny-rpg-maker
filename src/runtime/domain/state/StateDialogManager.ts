
import type { AnyRecord, DialogState, RuntimeState } from '../../../types/gameState';

class StateDialogManager {
    state: RuntimeState | null;

    constructor(state: RuntimeState | null) {
        this.state = state;
    }

    setState(state: RuntimeState | null) {
        this.state = state;
    }

    get dialog() {
        return this.state?.dialog ?? null;
    }

    getDialog(): DialogState {
        return this.dialog ?? { active: false, text: '', page: 1, maxPages: 1, meta: null };
    }

    setDialog(active: boolean, text: string = "", meta: AnyRecord | null = null) {
        const dialog = this.dialog;
        if (!dialog) return;
        if (!active) {
            dialog.active = false;
            dialog.text = "";
            dialog.page = 1;
            dialog.maxPages = 1;
            dialog.meta = null;
            return;
        }
        dialog.active = true;
        dialog.text = text;
        dialog.page = 1;
        dialog.maxPages = 1;
        dialog.meta = meta || null;
    }

    setPage(page: number) {
        const dialog = this.dialog;
        if (!dialog) return;
        const numeric = Number(page);
        if (!Number.isFinite(numeric)) return;
        const maxPages = Math.max(1, dialog.maxPages || 1);
        const clamped = Math.min(Math.max(1, Math.floor(numeric)), maxPages);
        dialog.page = clamped;
    }

    reset() {
        this.setDialog(false);
    }
}

export { StateDialogManager };
