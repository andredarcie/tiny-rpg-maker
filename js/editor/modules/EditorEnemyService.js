class EditorEnemyService {
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

    togglePlacement(forceOff = false) {
        const nextState = forceOff ? false : !this.state.placingEnemy;
        if (!nextState && this.state.placingEnemy === nextState) return;

        const enemyButton = this.dom.btnPlaceEnemy;
        const npcButton = this.dom.btnPlaceNpc;
        const canvas = this.dom.editorCanvas;

        if (!nextState) {
            this.state.placingEnemy = false;
            if (enemyButton) {
                enemyButton.textContent = 'Colocar caveira';
                enemyButton.classList.remove('placing');
            }
            if (!this.state.placingNpc && canvas) {
                canvas.style.cursor = 'default';
            }
            return;
        }

        this.state.placingEnemy = true;
        this.state.placingNpc = false;
        this.state.placingObjectType = null;

        if (npcButton) {
            npcButton.textContent = 'Colocar NPC no mapa';
            npcButton.classList.remove('placing');
        }
        if (enemyButton) {
            enemyButton.textContent = 'Cancelar colocacao';
            enemyButton.classList.add('placing');
        }
        if (canvas) {
            canvas.style.cursor = 'crosshair';
        }
        this.manager.objectService?.updatePlacementButtons();
    }

    placeEnemyAt(coord) {
        const roomIndex = this.state.activeRoomIndex;
        const existing = (this.gameEngine.getEnemyDefinitions?.() ?? []).find((enemy) =>
            enemy.roomIndex === roomIndex && enemy.x === coord.x && enemy.y === coord.y
        );
        if (existing) {
            return;
        }
        this.gameEngine.addEnemy({
            x: coord.x,
            y: coord.y,
            roomIndex,
            type: this.state.selectedEnemyType || 'skull'
        });
        this.manager.renderService.renderEnemies();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    removeEnemy(enemyId) {
        if (this.state.placingEnemy) {
            this.togglePlacement(true);
        }
        this.gameEngine.removeEnemy(enemyId);
        this.manager.renderService.renderEnemies();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }
}

if (typeof window !== 'undefined') {
    window.EditorEnemyService = EditorEnemyService;
}
