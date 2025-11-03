class EditorObjectService {
    constructor(editorManager) {
        this.manager = editorManager;
    }

    get dom() {
        return this.manager.domCache;
    }

    get state() {
        return this.manager.state;
    }

    get gameEngine() {
        return this.manager.gameEngine;
    }

    togglePlacement(type, forceOff = false) {
        if (forceOff) {
            if (!this.state.placingObjectType) return;
            this.state.placingObjectType = null;
            this.updatePlacementButtons();
            if (!this.state.placingNpc && !this.state.placingEnemy && this.dom.editorCanvas) {
                this.dom.editorCanvas.style.cursor = 'default';
            }
            return;
        }

        if (!type) return;
        this.manager.npcService?.clearSelection?.();
        if (this.state.placingEnemy) {
            this.manager.enemyService.deactivatePlacement();
        }
        this.state.placingObjectType = this.state.placingObjectType === type ? null : type;
        this.updatePlacementButtons();
        if (this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = this.state.placingObjectType ? 'crosshair' : 'default';
        }
    }

    updatePlacementButtons() {
        const { btnPlaceDoor, btnPlaceDoorVariable, btnPlaceKey } = this.dom;
        const activeType = this.state.placingObjectType;

        if (btnPlaceDoor) {
            const active = activeType === 'door';
            btnPlaceDoor.classList.toggle('placing', active);
            btnPlaceDoor.textContent = active ? 'Cancelar colocacao' : 'Colocar porta';
        }
        if (btnPlaceDoorVariable) {
            const active = activeType === 'door-variable';
            btnPlaceDoorVariable.classList.toggle('placing', active);
            btnPlaceDoorVariable.textContent = active ? 'Cancelar colocacao' : 'Colocar porta magica';
        }
        if (btnPlaceKey) {
            const active = activeType === 'key';
            btnPlaceKey.classList.toggle('placing', active);
            btnPlaceKey.textContent = active ? 'Cancelar colocacao' : 'Colocar chave';
        }
    }

    placeObjectAt(type, coord, roomIndex) {
        const object = this.gameEngine.setObjectPosition(type, roomIndex, coord.x, coord.y);
        if (!object) return;
        this.manager.renderService.renderObjects();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    removeObject(type, roomIndex) {
        if (this.state.placingObjectType === type) {
            this.togglePlacement(type, true);
        }
        this.gameEngine.removeObject(type, roomIndex);
        this.manager.renderService.renderObjects();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }
}

if (typeof window !== 'undefined') {
    window.EditorObjectService = EditorObjectService;
}
