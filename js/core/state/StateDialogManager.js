class StateDialogManager {
    constructor(state) {
        this.state = state;
    }

    setState(state) {
        this.state = state;
    }

    get dialog() {
        return this.state?.dialog;
    }

    getDialog() {
        return this.dialog;
    }

    setDialog(active, text = "", meta = null) {
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

    setPage(page) {
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

if (typeof window !== 'undefined') {
    window.StateDialogManager = StateDialogManager;
}

