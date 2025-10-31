class EditorState {
    constructor() {
        this.selectedTileId = null;
        this.selectedNpcId = null;
        this.selectedNpcType = null;
        this.activeRoomIndex = 0;
        this.placingNpc = false;
        this.placingEnemy = false;
        this.placingObjectType = null;
        this.selectedEnemyType = 'skull';
        this.mapPainting = false;
        this.skipMapHistory = false;
        this.npcTextUpdateTimer = null;
        this.suppressNpcFormUpdates = false;
    }
}

if (typeof window !== 'undefined') {
    window.EditorState = EditorState;
}
