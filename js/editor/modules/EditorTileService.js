class EditorTileService {
    constructor(editorManager) {
        this.manager = editorManager;
    }

    get dom() {
        return this.manager.domCache;
    }

    get state() {
        return this.manager.state;
    }

    startPaint(ev) {
        const canvas = this.dom.editorCanvas;
        if (!canvas) return;
        ev.preventDefault();
        this.state.mapPainting = true;
        if (ev.pointerId !== undefined && canvas.setPointerCapture) {
            canvas.setPointerCapture(ev.pointerId);
        }
        this.applyPaint(ev);
    }

    continuePaint(ev) {
        if (!this.state.mapPainting) return;
        this.applyPaint(ev);
    }

    finishPaint(ev) {
        if (!this.state.mapPainting) return;
        this.state.mapPainting = false;
        const canvas = this.dom.editorCanvas;
        if (ev?.pointerId !== undefined && canvas?.hasPointerCapture?.(ev.pointerId)) {
            canvas.releasePointerCapture(ev.pointerId);
        }
        if (this.state.skipMapHistory) {
            this.state.skipMapHistory = false;
            return;
        }
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    applyPaint(ev) {
        const coord = this.getTileFromEvent(ev);
        if (!coord) return;
        const roomIndex = this.state.activeRoomIndex;

        if (this.state.placingNpc) {
            this.manager.npcService.placeNpcAt(coord);
            this.state.skipMapHistory = true;
            return;
        }
        if (this.state.placingEnemy) {
            this.manager.enemyService.placeEnemyAt(coord);
            this.state.skipMapHistory = true;
            return;
        }
        if (this.state.placingObjectType) {
            this.manager.objectService.placeObjectAt(this.state.placingObjectType, coord, roomIndex);
            this.state.skipMapHistory = true;
            return;
        }

        if (this.state.selectedTileId === null || this.state.selectedTileId === undefined) return;
        this.manager.gameEngine.setMapTile(coord.x, coord.y, this.state.selectedTileId, roomIndex);
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
    }

    getTileFromEvent(ev) {
        const canvas = this.dom.editorCanvas;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const relX = (ev.clientX - rect.left) / rect.width;
        const relY = (ev.clientY - rect.top) / rect.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return null;
        return {
            x: Math.min(7, Math.floor(relX * 8)),
            y: Math.min(7, Math.floor(relY * 8))
        };
    }
}

if (typeof window !== 'undefined') {
    window.EditorTileService = EditorTileService;
}
