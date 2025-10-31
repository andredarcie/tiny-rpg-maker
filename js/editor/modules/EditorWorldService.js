class EditorWorldService {
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

    setActiveRoom(index) {
        const target = Number(index);
        if (!Number.isFinite(target)) return;
        const totalRooms = this.gameEngine.getGame().rooms?.length || 1;
        const clamped = Math.max(0, Math.min(totalRooms - 1, Math.floor(target)));
        if (clamped === this.state.activeRoomIndex) return;

        if (this.state.placingNpc) {
            this.manager.npcService.togglePlacement(true);
        }
        if (this.state.placingEnemy) {
            this.manager.enemyService.togglePlacement(true);
        }
        this.state.activeRoomIndex = clamped;
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderObjects();
        this.manager.renderService.renderEditor();
        this.manager.renderService.renderEnemies();
    }
}

if (typeof window !== 'undefined') {
    window.EditorWorldService = EditorWorldService;
}

