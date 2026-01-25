
class EditorHistoryManager {
    constructor(editorManager) {
        this.editorManager = editorManager;
        this.stack = [];
        this.index = -1;
    }

    pushSnapshot(snapshot) {
        if (this.stack[this.index] === snapshot) return;
        this.stack = this.stack.slice(0, this.index + 1);
        this.stack.push(snapshot);
        this.index = this.stack.length - 1;
    }

    pushCurrentState() {
        const snapshot = JSON.stringify(this.editorManager.gameEngine.exportGameData());
        this.pushSnapshot(snapshot);
    }

    canUndo() {
        return this.index > 0;
    }

    canRedo() {
        return this.index < this.stack.length - 1;
    }

    undo() {
        if (!this.canUndo()) return;
        this.index -= 1;
        this.restoreCurrent();
    }

    redo() {
        if (!this.canRedo()) return;
        this.index += 1;
        this.restoreCurrent();
    }

    restoreCurrent() {
        const snapshot = this.stack[this.index];
        if (!snapshot) return;
        const data = JSON.parse(snapshot);
        this.editorManager.restore(data, { skipHistory: true });
    }
}

export { EditorHistoryManager };
