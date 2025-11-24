class DialogManager {
    constructor(gameState, renderer) {
        this.gameState = gameState;
        this.renderer = renderer;
        this.pendingDialogAction = null;
    }

    showDialog(text, options = {}) {
        const hasOptions = options && Object.keys(options).length > 0;
        const meta = hasOptions ? { ...options } : null;
        
        const reason = meta?.pauseReason || 'dialog';
        if (meta) meta.pauseReason = reason;
        this.gameState.pauseGame(reason);
        
        this.pendingDialogAction = meta;
        this.gameState.setDialog(true, text, meta);
    }

    completeDialog() {
        const OT = ObjectTypes;
        if (this.pendingDialogAction?.setVariableId &&
            this.pendingDialogAction.rewardAllowed !== false) {
            const [_, openedDoor] = this.gameState.setVariableValue?.(this.pendingDialogAction.setVariableId, true);
            if (openedDoor) {
                this.renderer.setIconOverPlayer(OT.DOOR_VARIABLE);
            }
        }
        this.pendingDialogAction = null;
    }

    closeDialog() {
        if (!this.gameState.getDialog().active) return;
        const pendingMeta = this.pendingDialogAction;
        this.completeDialog();
        this.gameState.setDialog(false);
        
        const reason = pendingMeta?.pauseReason || 'dialog';
        this.gameState.resumeGame(reason);
        
        this.renderer.draw();
    }

    reset() {
        const pendingMeta = this.pendingDialogAction;
        this.pendingDialogAction = null;
        
        const reason = pendingMeta?.pauseReason || 'dialog';
        this.gameState.resumeGame(reason);
    }
}

if (typeof window !== 'undefined') {
    window.DialogManager = DialogManager;
}
