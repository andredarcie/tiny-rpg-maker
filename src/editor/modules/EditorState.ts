
class EditorState {
    constructor() {
        this.selectedTileId = null;
        this.selectedNpcId = null;
        this.selectedNpcType = null;
        this.activeRoomIndex = 0;
        this.placingNpc = false;
        this.placingEnemy = false;
        this.placingObjectType = null;
        this.selectedObjectType = null;
        this.selectedEnemyType = null;
        this.mapPainting = false;
        this.skipMapHistory = false;
        this.npcTextUpdateTimer = null;
        this.suppressNpcFormUpdates = false;
        this.conditionalDialogueExpanded = false;
        this.activeMobilePanel = 'tiles';
        this.npcVariantFilter = 'human';
        this.playerEndTextUpdateTimer = null;
        this.variablePanelCollapsed = true;
        this.skillPanelCollapsed = true;
        this.testPanelCollapsed = true;
    }
}

export { EditorState };
