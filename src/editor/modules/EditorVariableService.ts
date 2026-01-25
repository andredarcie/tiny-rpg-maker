
type EditorVariableManagerLike = {
    domCache: any;
    gameEngine: any;
    renderService: { renderObjects: () => void };
    npcService: { updateNpcSelection: (type: unknown, id: unknown) => void };
    state: { selectedNpcType: unknown; selectedNpcId: unknown };
    updateJSON: () => void;
    history: { pushCurrentState: () => void };
};

class EditorVariableService {
    manager: EditorVariableManagerLike;

    constructor(editorManager: EditorVariableManagerLike) {
        this.manager = editorManager;
    }

    get dom() {
        return this.manager.domCache;
    }

    get gameEngine() {
        return this.manager.gameEngine;
    }

    toggle(variableId: string, nextValue: boolean | null = null) {
        if (!variableId || !this.gameEngine.setVariableDefault) return;
        const current = (this.gameEngine.getVariableDefinitions?.() ?? []).find((entry) => entry.id === variableId);
        const targetValue = nextValue !== null ? Boolean(nextValue) : !Boolean(current?.value);
        const changed = this.gameEngine.setVariableDefault(variableId, targetValue);
        if (!changed) return;
        this.manager.renderService.renderObjects();
        this.manager.npcService.updateNpcSelection(this.manager.state.selectedNpcType, this.manager.state.selectedNpcId);
        this.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }
}

export { EditorVariableService };
