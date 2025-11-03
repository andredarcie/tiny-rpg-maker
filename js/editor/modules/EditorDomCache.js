class EditorDomCache {
    constructor(root = document) {
        this.root = root;
        this.editorCanvas = root.getElementById('editor-canvas');
        this.selectedTilePreview = root.getElementById('selected-tile-preview');
        this.tileSummary = root.getElementById('tile-preset-summary');
        this.tileList = root.getElementById('tile-list');
        this.npcsList = root.getElementById('npcs-list');
        this.npcText = root.getElementById('npc-text');
        this.npcConditionalText = root.getElementById('npc-conditional-text');
        this.npcConditionalVariable = root.getElementById('npc-conditional-variable');
        this.npcRewardVariable = root.getElementById('npc-reward-variable');
        this.npcConditionalRewardVariable = root.getElementById('npc-conditional-reward-variable');
        this.worldGrid = root.getElementById('world-grid');
        this.titleInput = root.getElementById('game-title');
        this.fileInput = root.getElementById('file-input');
        this.btnPlaceDoor = root.getElementById('btn-place-door');
        this.btnPlaceDoorVariable = root.getElementById('btn-place-door-variable');
        this.btnPlaceKey = root.getElementById('btn-place-key');
        this.objectsList = root.getElementById('objects-list');
        this.btnAddNpc = root.getElementById('btn-add-npc');
        this.btnNpcDelete = root.getElementById('npc-delete');
        this.btnGenerateUrl = root.getElementById('btn-generate-url');
        this.btnUndo = root.getElementById('btn-undo');
        this.btnRedo = root.getElementById('btn-redo');
        this.enemyTypes = root.getElementById('enemy-types');
        this.enemiesList = root.getElementById('enemies-list');
        this.variablesList = root.getElementById('variables-list');
    }
}

if (typeof window !== 'undefined') {
    window.EditorDomCache = EditorDomCache;
}
