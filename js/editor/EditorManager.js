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
            btnAddNpc,
            btnPlaceNpc,
            btnNpcDelete,
            btnPlaceEnemy,
            btnPlaceDoor,
            btnPlaceDoorVariable,
            btnPlaceKey,
            btnGenerateUrl,
            btnApplyJson,
            btnUndo,
            btnRedo,
            titleInput,
            npcText,
            npcConditionalText,
            npcConditionalVariable,
            npcRewardVariable,
            npcConditionalRewardVariable,
            fileInput,
            variablesList,
            editorCanvas,
            enemiesList,
            objectsList,
            tileList,
            npcsList,
            selectedTilePreview,
            worldGrid
        } = this.dom;

        btnAddNpc?.addEventListener('click', () => this.npcService.addNpc());
        btnPlaceNpc?.addEventListener('click', () => this.npcService.togglePlacement());
        btnNpcDelete?.addEventListener('click', () => this.npcService.removeSelectedNpc());

        btnPlaceEnemy?.addEventListener('click', () => this.enemyService.togglePlacement());

        btnPlaceDoor?.addEventListener('click', () => this.objectService.togglePlacement('door'));
        btnPlaceDoorVariable?.addEventListener('click', () => this.objectService.togglePlacement('door-variable'));
        btnPlaceKey?.addEventListener('click', () => this.objectService.togglePlacement('key'));

        btnGenerateUrl?.addEventListener('click', () => this.shareService.generateShareableUrl());
        btnApplyJson?.addEventListener('click', () => this.shareService.applyJSON());
        btnUndo?.addEventListener('click', () => this.undo());
        btnRedo?.addEventListener('click', () => this.redo());

        titleInput?.addEventListener('input', () => this.updateGameTitle());
        npcText?.addEventListener('input', () => this.npcService.updateNpcText(npcText.value));
        npcConditionalText?.addEventListener('input', () => this.npcService.updateNpcConditionalText(npcConditionalText.value));
        npcConditionalVariable?.addEventListener('change', (ev) => this.npcService.handleConditionVariableChange(ev.target.value));
        npcRewardVariable?.addEventListener('change', (ev) => this.npcService.handleRewardVariableChange(ev.target.value));
        npcConditionalRewardVariable?.addEventListener('change', (ev) => this.npcService.handleConditionalRewardVariableChange(ev.target.value));

        fileInput?.addEventListener('change', (ev) => this.shareService.loadGameFile(ev));

        variablesList?.addEventListener('click', (ev) => this.handleVariableToggleClick(ev));

        tileList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('[data-tile-id]');
            if (!button) return;
            const tileId = Number(button.dataset.tileId);
            if (!Number.isFinite(tileId)) return;
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

        this.renderAll();
        this.handleCanvasResize(true);
        this.history.pushCurrentState();
    }

    renderAll() {
        this.renderService.renderTileList();
        this.renderService.renderWorldGrid();
        this.renderService.renderNpcs();
        this.renderService.renderEnemies();
        this.renderService.renderObjects();
        this.renderService.renderVariables();
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

    renderObjects() {
        this.renderService.renderObjects();
    }

    renderVariables() {
        this.renderService.renderVariables();
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

    toggleNpcPlacement(forceOff = false) {
        this.npcService.togglePlacement(forceOff);
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

    // Enemy delegation
    toggleEnemyPlacement(forceOff = false) {
        this.enemyService.togglePlacement(forceOff);
    }

    removeEnemy(enemyId) {
        this.enemyService.removeEnemy(enemyId);
    }

    // Object delegation
    toggleObjectPlacement(type, forceOff = false) {
        this.objectService.togglePlacement(type, forceOff);
    }

    removeObject(type, roomIndex) {
        this.objectService.removeObject(type, roomIndex);
    }

    // Variable delegation
    handleVariableToggleClick(ev) {
        const button = ev.target.closest('.variable-toggle');
        if (!button) return;
        const card = button.closest('.variable-card');
        const variableId = card?.dataset?.variableId;
        if (!variableId) return;
        ev.preventDefault();
        const isActive = card.classList.contains('is-on');
        this.variableService.toggle(variableId, !isActive);
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

    applyJSON() {
        this.shareService.applyJSON();
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
    updateGameTitle() {
        const game = this.gameEngine.getGame();
        game.title = this.dom.titleInput?.value || 'Tiny RPG Maker';
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

        const enemies = this.gameEngine.getActiveEnemies();
        if (!enemies.find((enemy) => enemy.type === this.selectedEnemyType)) {
            this.selectedEnemyType = 'skull';
        }

        this.renderAll();
        this.gameEngine.draw();
        this.updateJSON();
        if (!skipHistory) {
            this.history.pushCurrentState();
        }
    }

    // Canvas & keyboard handling
    handleCanvasResize(force = false) {
        if (!this.editorCanvas) return;
        const container = this.editorCanvas.parentElement;
        if (!container) return;

        const size = Math.min(container.clientWidth, container.clientHeight);
        if (!force && Math.abs(this.editorCanvas.width - size) < 1) {
            return;
        }

        this.editorCanvas.width = size;
        this.editorCanvas.height = size;
        this.renderService.renderEditor();
    }

    handleKey(ev) {
        if (ev.defaultPrevented) return;
        if (ev.key === 'Escape') {
            if (this.placingNpc) {
                this.npcService.togglePlacement(true);
                ev.preventDefault();
                return;
            }
            if (this.placingEnemy) {
                this.enemyService.togglePlacement(true);
                ev.preventDefault();
                return;
            }
            if (this.placingObjectType) {
                this.objectService.togglePlacement(null, true);
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
