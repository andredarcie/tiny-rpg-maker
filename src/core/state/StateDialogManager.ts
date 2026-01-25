
import type { AnyRecord } from '../../types/gameState';

class StateDialogManager {
    constructor(state: unknown) {
        this.state = state;
    }

    setState(state: unknown) {
        this.state = state;
    }

    get dialog() {
        return this.state?.dialog;
    }

    getDialog() {
        return this.dialog;
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
