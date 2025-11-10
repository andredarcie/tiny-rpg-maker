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

        this.bindEvents();
        this.initialize();
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
        const {
            btnNpcDelete,
            btnGenerateUrl,
            btnUndo,
            btnRedo,
            titleInput,
            authorInput,
            npcText,
            npcConditionalText,
            npcConditionalVariable,
            npcRewardVariable,
            npcConditionalRewardVariable,
            btnToggleNpcConditional,
            fileInput,
            editorCanvas,
            enemyTypes,
            enemiesList,
            objectTypes,
            objectsList,
            tileList,
            npcsList,
            selectedTilePreview,
            worldGrid
        } = this.dom;

        btnNpcDelete?.addEventListener('click', () => this.npcService.removeSelectedNpc());
        btnToggleNpcConditional?.addEventListener('click', () => {
            this.state.conditionalDialogueExpanded = !this.state.conditionalDialogueExpanded;
            this.renderService.updateNpcForm();
        });

        enemyTypes?.addEventListener('click', (ev) => {
            const card = ev.target.closest('.enemy-card');
            if (!card) return;
            const type = card.dataset.type || null;
            if (!type) return;
            this.enemyService.selectEnemyType(type);
        });

        objectTypes?.addEventListener('click', (ev) => {
            const card = ev.target.closest('.object-type-card');
            if (!card) return;
            const type = card.dataset.type || null;
            if (!type) return;
            this.objectService.selectObjectType(type);
        });

        btnGenerateUrl?.addEventListener('click', () => this.shareService.generateShareableUrl());
        btnUndo?.addEventListener('click', () => this.undo());
        btnRedo?.addEventListener('click', () => this.redo());

        titleInput?.addEventListener('input', () => this.updateGameMetadata());
        authorInput?.addEventListener('input', () => this.updateGameMetadata());
        npcText?.addEventListener('input', () => this.npcService.updateNpcText(npcText.value));
        npcConditionalText?.addEventListener('input', () => this.npcService.updateNpcConditionalText(npcConditionalText.value));
        npcConditionalVariable?.addEventListener('change', (ev) => this.npcService.handleConditionVariableChange(ev.target.value));
        npcRewardVariable?.addEventListener('change', (ev) => this.npcService.handleRewardVariableChange(ev.target.value));
        npcConditionalRewardVariable?.addEventListener('change', (ev) => this.npcService.handleConditionalRewardVariableChange(ev.target.value));

        fileInput?.addEventListener('change', (ev) => this.shareService.loadGameFile(ev));

        tileList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('[data-tile-id]');
            if (!button) return;
            const tileId = Number(button.dataset.tileId);
            if (!Number.isFinite(tileId)) return;
            if (this.state.placingObjectType) {
                this.objectService.togglePlacement(this.state.placingObjectType, true);
            }
            this.npcService.clearSelection();
            this.enemyService.deactivatePlacement();
            this.selectedTileId = tileId;
            this.renderService.updateSelectedTilePreview();
            this.renderService.renderTileList();
        });

        npcsList?.addEventListener('click', (ev) => {
            const card = ev.target.closest('.npc-card');
            if (!card) return;
            const type = card.dataset.type || null;
            const id = card.dataset.id || null;
            this.npcService.updateNpcSelection(type, id);
        });

        objectsList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('.object-remove');
            if (!button) return;
            const card = button.closest('.object-card');
            if (!card) return;
            const type = card.dataset.type;
            const room = Number(card.dataset.roomIndex);
            if (!type || !Number.isFinite(room)) return;
            this.objectService.removeObject(type, room);
        });

        enemiesList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('[data-remove-enemy]');
            if (!button) return;
            const enemyId = button.dataset.removeEnemy;
            if (!enemyId) return;
            this.enemyService.removeEnemy(enemyId);
        });
        enemiesList?.addEventListener('change', (ev) => {
            const target = ev.target;
            if (!target || target.tagName !== 'SELECT') return;
            const enemyId = target.dataset.enemyVariable;
            if (!enemyId) return;
            const value = target.value || '';
            this.enemyService.handleEnemyVariableChange(enemyId, value);
        });

        worldGrid?.addEventListener('click', (ev) => {
            const cell = ev.target.closest('[data-room-index]');
            if (!cell) return;
            const index = Number(cell.dataset.roomIndex);
            this.worldService.setActiveRoom(index);
        });

        if (editorCanvas) {
            editorCanvas.addEventListener('pointerdown', (ev) => this.tileService.startPaint(ev));
            editorCanvas.addEventListener('pointermove', (ev) => this.tileService.continuePaint(ev));
        }
        window.addEventListener('pointerup', (ev) => this.tileService.finishPaint(ev));

        document.addEventListener('keydown', (ev) => this.handleKey(ev));
        window.addEventListener('resize', (ev) => this.handleCanvasResize(ev));
        document.addEventListener('editor-tab-activated', () =>
            requestAnimationFrame(() => this.handleCanvasResize(true))
        );
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

        const enemyDefinitions = EditorConstants.ENEMY_DEFINITIONS;
        if (enemyDefinitions.length > 0) {
            const hasCurrent = enemyDefinitions.some((entry) => entry.type === this.selectedEnemyType);
            if (!hasCurrent) {
                this.selectedEnemyType = enemyDefinitions[0].type;
            }
        }

        const objectDefinitions = EditorConstants.OBJECT_DEFINITIONS;
        if (objectDefinitions.length > 0) {
            const hasObjectSelected = objectDefinitions.some((entry) => entry.type === this.selectedObjectType);
            if (!hasObjectSelected) {
                this.selectedObjectType = objectDefinitions[0].type;
            }
        }

        this.renderAll();
        this.handleCanvasResize(true);
        this.history.pushCurrentState();
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
        const game = this.gameEngine.getGame();
        const title = (this.dom.titleInput?.value || '').trim() || 'Tiny RPG Maker';
        const author = (this.dom.authorInput?.value || '').trim();
        game.title = title;
        game.author = author;
        if (typeof this.gameEngine.syncDocumentTitle === 'function') {
            this.gameEngine.syncDocumentTitle();
        }
        if (typeof this.gameEngine.refreshIntroScreen === 'function') {
            this.gameEngine.refreshIntroScreen();
        }
        this.updateJSON();
    }

    updateJSON() {
        if (!this.dom.jsonArea) return;
        this.dom.jsonArea.value = JSON.stringify(this.gameEngine.exportGameData(), null, 2);
    }

    syncUI() {
        const game = this.gameEngine.getGame();
        if (this.dom.titleInput) {
            this.dom.titleInput.value = game.title || '';
        }
        if (this.dom.authorInput) {
            this.dom.authorInput.value = game.author || '';
        }
        this.updateJSON();
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
        if (!this.editorCanvas) return;
        const container = this.editorCanvas.parentElement;
        if (!container) return;

        const availableWidth = container.offsetWidth || container.clientWidth || 0;

        const maxCanvasSize = 512;
        let minCanvasSize = 128;
        const highestDivisor = Math.floor((availableWidth + minCanvasSize - 1) / minCanvasSize) * minCanvasSize;

        const size = Math.min(Math.max(highestDivisor, minCanvasSize), maxCanvasSize);
        if (!force && Math.abs(this.editorCanvas.width - size) < 1) {
            return;
        }

        this.editorCanvas.style.width = `${size}px`;
        this.editorCanvas.width = size;
        this.editorCanvas.height = size;
        this.renderService.renderEditor();
    }

    handleKey(ev) {
        if (ev.defaultPrevented) return;
        if (ev.key === 'Escape') {
            if (this.placingNpc || this.selectedNpcId || this.selectedNpcType) {
                this.npcService.clearSelection();
                ev.preventDefault();
                return;
            }
            if (this.placingEnemy) {
                this.enemyService.deactivatePlacement();
                ev.preventDefault();
                return;
            }
            if (this.placingObjectType) {
                this.objectService.togglePlacement(this.placingObjectType, true);
                ev.preventDefault();
                return;
            }
        }

        if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') {
            ev.preventDefault();
            if (ev.shiftKey) {
                this.redo();
            } else {
                this.undo();
            }
        }

        if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'y') {
            ev.preventDefault();
            this.redo();
        }
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
