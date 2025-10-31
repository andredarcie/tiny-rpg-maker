class DialogManager {
    constructor(gameState, renderer) {
        this.gameState = gameState;
        this.renderer = renderer;
        this.pendingDialogAction = null;
    }

    showDialog(text, options = {}) {
        const hasOptions = options && Object.keys(options).length > 0;
        const meta = hasOptions ? { ...options } : null;
        this.pendingDialogAction = meta;
        this.gameState.setDialog(true, text, meta);
    }

    completeDialog() {
        if (this.pendingDialogAction?.setVariableId &&
            this.pendingDialogAction.rewardAllowed !== false) {
            this.gameState.setVariableValue?.(this.pendingDialogAction.setVariableId, true);
        }
        this.pendingDialogAction = null;
    }

    closeDialog() {
        if (!this.gameState.getDialog().active) return;
        this.completeDialog();
        this.gameState.setDialog(false);
        this.renderer.draw();
    }

    reset() {
        this.pendingDialogAction = null;
    }
}

if (typeof window !== 'undefined') {
    window.DialogManager = DialogManager;
}

