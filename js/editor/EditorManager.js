class EditorManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.state = new EditorState();
        this.domCache = new EditorDomCache(typeof document !== 'undefined' ? document : null);

        this.editorCanvas = this.domCache.editorCanvas || null;
        this.ectx = this.editorCanvas?.getContext('2d') ?? null;
        if (this.ectx) {
            this.ectx.imageSmoothingEnabled = false;
        }

        this.history = new EditorHistoryManager(this);
        this.renderService = new EditorRenderService(this);
        this.tileService = new EditorTileService(this);
        this.shareService = new EditorShareService(this);
        this.npcService = new EditorNpcService(this);
        this.enemyService = new EditorEnemyService(this);
        this.objectService = new EditorObjectService(this);
        this.variableService = new EditorVariableService(this);
        this.worldService = new EditorWorldService(this);
        this.uiController = new EditorUIController(this);
        this.eventBinder = new EditorEventBinder(this);
        this.interactionController = new EditorInteractionController(this);

        this.bindEvents();
        this.initialize();
        if (typeof document !== 'undefined') {
            document.addEventListener('language-changed', () => this.handleLanguageChange());
        }
    }

    // State accessors to keep compatibility with legacy references
    get selectedTileId() {
        return this.state.selectedTileId;
    }
    set selectedTileId(value) {
        this.state.selectedTileId = value;
    }

    get selectedNpcId() {
        return this.state.selectedNpcId;
    }
    set selectedNpcId(value) {
        this.state.selectedNpcId = value;
    }

    get selectedNpcType() {
        return this.state.selectedNpcType;
    }
    set selectedNpcType(value) {
        this.state.selectedNpcType = value;
    }

    get activeRoomIndex() {
        return this.state.activeRoomIndex;
    }
    set activeRoomIndex(value) {
        this.state.activeRoomIndex = value;
    }

    get placingNpc() {
        return this.state.placingNpc;
    }
    set placingNpc(value) {
        this.state.placingNpc = value;
    }

    get placingEnemy() {
        return this.state.placingEnemy;
    }
    set placingEnemy(value) {
        this.state.placingEnemy = value;
    }

    get placingObjectType() {
        return this.state.placingObjectType;
    }
    set placingObjectType(value) {
        this.state.placingObjectType = value;
    }

    get selectedObjectType() {
        return this.state.selectedObjectType;
    }
    set selectedObjectType(value) {
        this.state.selectedObjectType = value;
    }

    get selectedEnemyType() {
        return this.state.selectedEnemyType;
    }
    set selectedEnemyType(value) {
        this.state.selectedEnemyType = value;
    }

    get mapPainting() {
        return this.state.mapPainting;
    }
    set mapPainting(value) {
        this.state.mapPainting = value;
    }

    get dom() {
        return this.domCache;
    }

    bindEvents() {
        this.eventBinder.bind();
    }

    initialize() {
        this.gameEngine.tileManager.ensureDefaultTiles();
        const tiles = this.gameEngine.getTiles();
        if (tiles.length > 0) {
            this.selectedTileId = tiles[0].id;
        }

        this.syncUI();
        const startRoomIndex = this.gameEngine.getGame()?.start?.roomIndex ?? 0;
        const totalRooms = this.gameEngine.getGame()?.rooms?.length || 1;
        this.activeRoomIndex = Math.max(0, Math.min(totalRooms - 1, startRoomIndex));
        this.gameEngine.npcManager?.ensureDefaultNPCs?.();

        this.renderAll();
        this.updateMobilePanels();
        this.handleCanvasResize(true);
        this.history.pushCurrentState();
    }

    desselectAllAndRender() {
        const tileCleared = Boolean(this.tileService?.clearSelection?.({ render: false }));
        const npcCleared = Boolean(this.npcService?.clearSelection?.({ render: false }));
        const enemyCleared = Boolean(this.enemyService?.clearSelection?.({ render: false }));
        const objectCleared = Boolean(this.objectService?.clearSelection?.({ render: false }));

        if (tileCleared) {
            this.renderService.renderTileList();
            this.renderService.updateSelectedTilePreview();
        }
        if (npcCleared) {
            this.renderService.renderNpcs();
        }
        if (enemyCleared) {
            this.renderService.renderEnemyCatalog();
        }
        if (objectCleared) {
            this.renderService.renderObjectCatalog();
        }

        return tileCleared || npcCleared || enemyCleared || objectCleared;
    }

    renderAll() {
        this.renderService.renderTileList();
        this.renderService.renderWorldGrid();
        this.renderService.renderNpcs();
        this.renderService.renderEnemyCatalog();
        this.renderService.renderEnemies();
        this.renderService.renderObjectCatalog();
        this.renderService.renderObjects();
        this.renderService.renderEditor();
        this.renderService.updateSelectedTilePreview();
    }

    // Delegated rendering APIs for backward compatibility
    renderEditor() {
        this.renderService.renderEditor();
    }

    renderTileList() {
        this.renderService.renderTileList();
    }

    updateSelectedTilePreview() {
        this.renderService.updateSelectedTilePreview();
    }

    renderNpcs() {
        this.renderService.renderNpcs();
    }

    renderEnemies() {
        this.renderService.renderEnemies();
    }

    renderEnemyCatalog() {
        this.renderService.renderEnemyCatalog();
    }

    renderObjectCatalog() {
        this.renderService.renderObjectCatalog();
    }

    renderObjects() {
        this.renderService.renderObjects();
    }

    renderWorldGrid() {
        this.renderService.renderWorldGrid();
    }

    setActiveMobilePanel(panel) {
        this.uiController.setActiveMobilePanel(panel);
    }

    updateMobilePanels() {
        this.uiController.updateMobilePanels();
    }

    // Tile painting delegation
    startMapPaint(ev) {
        this.tileService.startPaint(ev);
    }

    continueMapPaint(ev) {
        this.tileService.continuePaint(ev);
    }

    finishMapPaint(ev) {
        this.tileService.finishPaint(ev);
    }

    // NPC delegation
    addNPC() {
        this.npcService.addNpc();
    }

    removeSelectedNpc() {
        this.npcService.removeSelectedNpc();
    }

    updateNpcSelection() {
        this.npcService.updateNpcSelection(this.selectedNpcType, this.selectedNpcId);
    }

    updateNpcText() {
        if (!this.dom.npcText) return;
        this.npcService.updateNpcText(this.dom.npcText.value);
    }

    updateNpcConditionalText() {
        if (!this.dom.npcConditionalText) return;
        this.npcService.updateNpcConditionalText(this.dom.npcConditionalText.value);
    }

    handleNpcConditionVariableChange() {
        const select = this.dom.npcConditionalVariable;
        if (!select) return;
        this.npcService.handleConditionVariableChange(select.value);
    }

    handleNpcRewardVariableChange() {
        const select = this.dom.npcRewardVariable;
        if (!select) return;
        this.npcService.handleRewardVariableChange(select.value);
    }

    handleNpcConditionalRewardVariableChange() {
        const select = this.dom.npcConditionalRewardVariable;
        if (!select) return;
        this.npcService.handleConditionalRewardVariableChange(select.value);
    }

    removeEnemy(enemyId) {
        this.enemyService.removeEnemy(enemyId);
    }

    removeObject(type, roomIndex) {
        this.objectService.removeObject(type, roomIndex);
    }

    toggleVariableDefault(variableId, nextValue = null) {
        this.variableService.toggle(variableId, nextValue);
    }

    // World delegation
    setActiveRoom(index) {
        this.worldService.setActiveRoom(index);
    }

    // Sharing & persistence
    generateShareableUrl() {
        return this.shareService.generateShareableUrl();
    }

    saveGame() {
        this.shareService.saveGame();
    }

    loadGameFile(ev) {
        this.shareService.loadGameFile(ev);
    }

    // History
    pushHistory() {
        this.history.pushCurrentState();
    }

    undo() {
        this.history.undo();
    }

    redo() {
        this.history.redo();
    }

    // Game title & JSON sync
    updateGameMetadata() {
        this.uiController.updateGameMetadata();
    }

    updateJSON() {
        this.uiController.updateJSON();
    }

    syncUI() {
        this.uiController.syncUI();
    }

    // Restore & import logic
    restore(data, options = {}) {
        const { skipHistory = false } = options;
        this.gameEngine.importGameData(data);
        this.gameEngine.tileManager.ensureDefaultTiles();

        const tiles = this.gameEngine.getTiles();
        if (tiles.length && !tiles.find((t) => t.id === this.selectedTileId)) {
            this.selectedTileId = tiles[0].id;
        }

        const npcs = this.gameEngine.getSprites();
        if (!npcs.find((npc) => npc.id === this.selectedNpcId)) {
            this.selectedNpcId = null;
            this.selectedNpcType = null;
            this.placingNpc = false;
        }

        const definitions = EditorConstants.ENEMY_DEFINITIONS;
        const normalizedType = typeof EnemyDefinitions?.normalizeType === 'function'
            ? EnemyDefinitions.normalizeType(this.selectedEnemyType)
            : this.selectedEnemyType;
        if (normalizedType !== this.selectedEnemyType) {
            this.selectedEnemyType = normalizedType;
        } else if (!definitions.some((entry) => entry.type === this.selectedEnemyType)) {
            this.selectedEnemyType = definitions[0]?.type || 'giant-rat';
        }

        this.renderAll();
        this.gameEngine.draw();
        this.syncUI();
        if (!skipHistory) {
            this.history.pushCurrentState();
        }
    }

    // Canvas & keyboard handling
    handleCanvasResize(force = false) {
        this.interactionController.handleCanvasResize(force);
    }

    handleLanguageChange() {
        this.uiController.handleLanguageChange();
    }

    refreshNpcLocalizedText() {
        this.uiController.refreshNpcLocalizedText();
    }

    handleKey(ev) {
        this.interactionController.handleKey(ev);
    }

    createNewGame() {
        const emptyLayer = () => Array.from({ length: 8 }, () => Array(8).fill(null));
        const data = {
            title: 'Novo Jogo',
            palette: ['#0e0f13', '#2e3140', '#f4f4f8'],
            roomSize: 8,
            rooms: [
                {
                    size: 8,
                    bg: 0,
                    tiles: Array.from({ length: 8 }, () => Array(8).fill(0)),
                    walls: Array.from({ length: 8 }, () => Array(8).fill(false))
                }
            ],
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            items: [],
            exits: [],
            objects: [],
            enemies: [],
            variables: [],
            tileset: {
                tiles: [],
                map: {
                    ground: emptyLayer(),
                    overlay: emptyLayer()
                }
            }
        };
        this.restore(data);
    }
}

if (typeof window !== 'undefined') {
    window.EditorManager = EditorManager;
}
