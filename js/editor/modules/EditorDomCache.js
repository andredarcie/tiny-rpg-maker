class EditorDomCache {
    constructor(root = document) {
        this.root = root;
        this.editorCanvas = root.getElementById('editor-canvas');
        this.mapPosition = root.getElementById('editor-map-position');
        this.mapNavButtons = Array.from(root.querySelectorAll('.map-nav-button'));
        this.selectedTilePreview = root.getElementById('selected-tile-preview');
        this.tileSummary = root.getElementById('tile-preset-summary');
        this.tileList = root.getElementById('tile-list');
        this.npcsList = root.getElementById('npcs-list');
        this.npcText = root.getElementById('npc-text');
        this.npcConditionalText = root.getElementById('npc-conditional-text');
        this.npcConditionalVariable = root.getElementById('npc-conditional-variable');
        this.npcRewardVariable = root.getElementById('npc-reward-variable');
        this.npcConditionalRewardVariable = root.getElementById('npc-conditional-reward-variable');
        this.btnToggleNpcConditional = root.getElementById('btn-toggle-npc-conditional');
        this.npcConditionalSection = root.getElementById('npc-conditional-section');
        this.worldGrid = root.getElementById('world-grid');
        this.titleInput = root.getElementById('game-title');
        this.authorInput = root.getElementById('game-author');
        this.fileInput = root.getElementById('file-input');
        this.objectTypes = root.getElementById('object-types');
        this.objectsList = root.getElementById('objects-list');
        this.btnNpcDelete = root.getElementById('npc-delete');
        this.npcEditor = root.querySelector('.npc-editor');
        this.btnGenerateUrl = root.getElementById('btn-generate-url');
        this.btnUndo = root.getElementById('btn-undo');
        this.btnRedo = root.getElementById('btn-redo');
        this.enemyTypes = root.getElementById('enemy-types');
        this.enemiesList = root.getElementById('enemies-list');
    }
}

if (typeof window !== 'undefined') {
    window.EditorDomCache = EditorDomCache;
}
