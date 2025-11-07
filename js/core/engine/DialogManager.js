class DialogManager {
    constructor(gameState, renderer) {
        this.gameState = gameState;
        this.renderer = renderer;
        this.pendingDialogAction = null;
    }

    showDialog(text, options = {}) {
        const hasOptions = options && Object.keys(options).length > 0;
        const meta = hasOptions ? { ...options } : null;
        if (meta?.pauseGame && typeof this.gameState.pauseGame === 'function') {
            const reason = meta.pauseReason || 'dialog';
            meta.pauseReason = reason;
            this.gameState.pauseGame(reason);
        }
        this.pendingDialogAction = meta;
        this.gameState.setDialog(true, text, meta);
    }

    completeDialog() {
        if (this.pendingDialogAction?.setVariableId &&
            this.pendingDialogAction.rewardAllowed !== false) {
            const [_, openedDoor] = this.gameState.setVariableValue?.(this.pendingDialogAction.setVariableId, true);
            if (openedDoor) {
                this.renderer.setIconOverPlayer('door-variable');
            }
        }
        this.pendingDialogAction = null;
    }

    closeDialog() {
        if (!this.gameState.getDialog().active) return;
        const pendingMeta = this.pendingDialogAction;
        this.completeDialog();
        this.gameState.setDialog(false);
        if (pendingMeta?.resumePlayingOnClose && typeof this.gameState.resumeGame === 'function') {
            const reason = pendingMeta.pauseReason || 'dialog';
            this.gameState.resumeGame(reason);
        }
        this.renderer.draw();
    }

    reset() {
        const pendingMeta = this.pendingDialogAction;
        this.pendingDialogAction = null;
        if (pendingMeta?.resumePlayingOnClose && typeof this.gameState.resumeGame === 'function') {
            const reason = pendingMeta.pauseReason || 'dialog';
            this.gameState.resumeGame(reason);
        }
    }
}

if (typeof window !== 'undefined') {
    window.DialogManager = DialogManager;
}
