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
        const normalizedType = this.normalizeType(type ?? this.state.placingObjectType ?? this.manager.selectedObjectType);
        if (forceOff) {
            if (!this.state.placingObjectType) return;
            this.state.placingObjectType = null;
            if (!this.state.placingNpc && !this.state.placingEnemy && this.dom.editorCanvas) {
                this.dom.editorCanvas.style.cursor = 'default';
            }
            this.manager.renderObjectCatalog();
            return;
        }

        if (!normalizedType) return;
        if (this.state.placingObjectType === normalizedType) {
            this.state.placingObjectType = null;
            if (!this.state.placingNpc && !this.state.placingEnemy && this.dom.editorCanvas) {
                this.dom.editorCanvas.style.cursor = 'default';
            }
            this.manager.renderObjectCatalog();
            return;
        }
        this.selectObjectType(normalizedType);
    }

    updatePlacementButtons() {
        this.manager.renderObjectCatalog();
    }

    placeObjectAt(type, coord, roomIndex) {
        const object = this.gameEngine.setObjectPosition(type, roomIndex, coord.x, coord.y);
        if (!object) return;
        this.manager.renderService.renderObjects();
        this.manager.renderObjectCatalog();
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
        this.manager.renderObjectCatalog();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    selectObjectType(type) {
        const normalized = this.normalizeType(type);
        if (!normalized) return;
        if (this.manager.selectedObjectType !== normalized) {
            this.manager.selectedObjectType = normalized;
        }
        this.activatePlacement(normalized);
    }

    activatePlacement(type = null) {
        const targetType = this.normalizeType(type ?? this.manager.selectedObjectType);
        if (!targetType) return;
        this.manager.npcService?.clearSelection?.();
        if (this.state.placingEnemy) {
            this.manager.enemyService.deactivatePlacement();
        }
        this.state.placingNpc = false;
        this.state.placingObjectType = targetType;
        this.manager.selectedObjectType = targetType;
        if (this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = 'crosshair';
        }
        this.manager.renderObjectCatalog();
    }

    normalizeType(type) {
        if (typeof type !== 'string' || !type.length) return null;
        const definitions = EditorConstants.OBJECT_DEFINITIONS;
        if (Array.isArray(definitions) && definitions.length) {
            const normalized = definitions.find((entry) => entry.type === type)?.type || null;
            if (normalized) return normalized;
        }
        const fallbackTypes = new Set(['player-start', 'player-end', 'switch', 'door', 'door-variable', 'key', 'life-potion', 'sword', 'xp-scroll']);
        return fallbackTypes.has(type) ? type : null;
    }
}

if (typeof window !== 'undefined') {
    window.EditorObjectService = EditorObjectService;
}
