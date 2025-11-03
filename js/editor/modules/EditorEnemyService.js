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

    activatePlacement() {
        const definition = this.getEnemyDefinition(this.manager.selectedEnemyType);
        if (!definition) return;
        if (this.state.placingEnemy) return;

        this.manager.npcService?.clearSelection?.();
        if (this.state.placingObjectType) {
            this.manager.objectService?.togglePlacement?.(this.state.placingObjectType, true);
        }

        this.state.placingEnemy = true;
        this.state.placingNpc = false;
        this.state.placingObjectType = null;

        if (this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = 'crosshair';
        }
    }

    deactivatePlacement() {
        if (!this.state.placingEnemy) return;
        this.state.placingEnemy = false;
        if (!this.state.placingNpc && !this.state.placingObjectType && this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = 'default';
        }
    }

    placeEnemyAt(coord) {
        const roomIndex = this.state.activeRoomIndex;
        const existing = (this.gameEngine.getEnemyDefinitions?.() ?? []).find((enemy) =>
            enemy.roomIndex === roomIndex && enemy.x === coord.x && enemy.y === coord.y
        );
        if (existing) {
            return;
        }
        const definition = this.getEnemyDefinition(this.state.selectedEnemyType);
        const fallback = EditorConstants.ENEMY_DEFINITIONS[0]?.type || 'giant-rat';
        const type = definition?.type || fallback;
        this.gameEngine.addEnemy({
            x: coord.x,
            y: coord.y,
            roomIndex,
            type
        });
        this.manager.renderService.renderEnemies();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    removeEnemy(enemyId) {
        this.gameEngine.removeEnemy(enemyId);
        this.manager.renderService.renderEnemies();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    selectEnemyType(type) {
        const definition = this.getEnemyDefinition(type);
        if (!definition) return;
        if (this.state.selectedEnemyType !== definition.type) {
            this.manager.selectedEnemyType = definition.type;
            this.manager.renderEnemyCatalog();
        }
        this.activatePlacement();
    }

    getEnemyDefinition(type = null) {
        const target = typeof type === 'string' && type.length > 0
            ? type
            : this.state.selectedEnemyType;
        if (typeof EnemyDefinitions?.getEnemyDefinition === 'function') {
            const definition = EnemyDefinitions.getEnemyDefinition(target);
            if (definition) {
                return definition;
            }
        }
        const definitions = EditorConstants.ENEMY_DEFINITIONS;
        return definitions.find((entry) => entry.type === target) ||
            definitions.find((entry) => Array.isArray(entry.aliases) && entry.aliases.includes(target)) ||
            null;
    }

}

if (typeof window !== 'undefined') {
    window.EditorEnemyService = EditorEnemyService;
}
