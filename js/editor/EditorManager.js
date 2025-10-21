/**
 * EditorManager - Gerencia todas as operações do editor
 */
class EditorManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.selectedTileId = null;
        this.selectedNpcId = null;
        this.placingNpc = false;
        this.activeTileId = null;
        this.history = { stack: [], index: -1 };
        this.handleCanvasResize = this.handleCanvasResize.bind(this);
        this.handleEditorTabActivated = this.handleEditorTabActivated.bind(this);
        
        this.setupDOMReferences();
        this.setupEventListeners();
        this.initialize();
    }

    setupDOMReferences() {
        // Canvas e contexto
        this.editorCanvas = document.getElementById('editor-canvas');
        this.ectx = this.editorCanvas.getContext('2d');
        this.ectx.imageSmoothingEnabled = false;
        this.selectedTilePreview = document.getElementById('selected-tile-preview');
        
        // Controles do editor de tile
        this.tileCanvas = document.getElementById('tile-canvas');
        this.tileCtx = this.tileCanvas.getContext('2d');
        this.tileCtx.imageSmoothingEnabled = false;
        this.tileColor = document.getElementById('tile-color');
        this.tileName = document.getElementById('tile-name');
        this.tileCollision = document.getElementById('tile-collision');
        this.tileList = document.getElementById('tile-list');
        
        // Controles de NPC
        this.npcsList = document.getElementById('npcs-list');
        this.npcText = document.getElementById('npc-text');
        
        // Controles gerais
        this.titleInput = document.getElementById('game-title');
        this.jsonArea = document.getElementById('json-area');
        this.fileInput = document.getElementById('file-input');
        
        // Botões
        this.btnAddTile = document.getElementById('btn-add-tile');
        this.btnAddTree = document.getElementById('btn-add-tree');
        this.btnAddNpc = document.getElementById('btn-add-npc');
        this.btnPlaceNpc = document.getElementById('btn-place-npc');
        this.btnNpcDelete = document.getElementById('npc-delete');
        this.btnNew = document.getElementById('btn-new');
        this.btnLoad = document.getElementById('btn-load');
        this.btnSave = document.getElementById('btn-save');
        this.btnExportHTML = document.getElementById('btn-export-html');
        this.btnApplyJson = document.getElementById('btn-apply-json');
        this.btnUndo = document.getElementById('btn-undo');
        this.btnRedo = document.getElementById('btn-redo');
        this.btnClearTile = document.getElementById('btn-clear-tile');
        this.btnDuplicateTile = document.getElementById('btn-duplicate-tile');
        this.btnRemoveTile = document.getElementById('btn-remove-tile');
    }

    setupEventListeners() {
        // Event listeners para tiles
        this.btnAddTile?.addEventListener('click', () => this.addNewTile());
        this.btnAddTree?.addEventListener('click', () => this.addTreeTile());
        this.btnClearTile?.addEventListener('click', () => this.clearActiveTile());
        this.btnDuplicateTile?.addEventListener('click', () => this.duplicateActiveTile());
        this.btnRemoveTile?.addEventListener('click', () => this.removeActiveTile());
        
        // Event listeners para NPCs
        this.btnAddNpc?.addEventListener('click', () => this.addNewNPC());
        this.btnPlaceNpc?.addEventListener('click', () => this.toggleNPCPLacement());
        this.btnNpcDelete?.addEventListener('click', () => this.deleteSelectedNPC());
        
        // Event listeners para arquivos
        this.btnNew?.addEventListener('click', () => this.createNewGame());
        this.btnLoad?.addEventListener('click', () => this.fileInput?.click());
        this.btnSave?.addEventListener('click', () => this.saveGame());
        this.btnExportHTML?.addEventListener('click', () => this.exportHTML());
        this.btnApplyJson?.addEventListener('click', () => this.applyJSON());
        
        // Event listeners para histórico
        this.btnUndo?.addEventListener('click', () => this.undo());
        this.btnRedo?.addEventListener('click', () => this.redo());
        
        // Event listeners para input
        this.titleInput?.addEventListener('input', () => this.updateGameTitle());
        this.npcText?.addEventListener('input', () => this.updateNPCDialog());
        this.tileName?.addEventListener('input', () => this.updateTileName());
        this.tileCollision?.addEventListener('change', () => this.updateTileCollision());
        
        // Event listeners para arquivo
        this.fileInput?.addEventListener('change', (e) => this.loadGameFile(e));
        
        // Event listeners para canvas
        this.setupCanvasEventListeners();
        this.setupTileEditorEventListeners();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        window.addEventListener('resize', this.handleCanvasResize);
        document.addEventListener('editor-tab-activated', this.handleEditorTabActivated);
    }

    setupCanvasEventListeners() {
        let painting = false;
        
        this.editorCanvas.addEventListener('mousedown', (e) => {
            painting = true;
            this.paintAt(e);
        });
        
        this.editorCanvas.addEventListener('mousemove', (e) => {
            if (painting) this.paintAt(e);
        });
        
        document.addEventListener('mouseup', () => {
            if (painting) {
                painting = false;
                this.pushHistory();
                this.updateJSONArea();
            }
        });
    }

    setupTileEditorEventListeners() {
        let tilePainting = false;
        
        this.tileCanvas.addEventListener('mousedown', (e) => {
            tilePainting = true;
            this.onTilePaint(e);
        });
        
        this.tileCanvas.addEventListener('mousemove', (e) => {
            if (tilePainting) this.onTilePaint(e);
        });
        
        document.addEventListener('mouseup', () => {
            tilePainting = false;
        });
    }

    resizeCanvasToDisplaySize(canvas, ctx, { square = false } = {}) {
        if (!canvas) return false;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const measuredWidth = rect.width;
        const measuredHeight = rect.height || rect.width;
        if (!measuredWidth || !measuredHeight) return false;
        
        let targetWidth = Math.max(1, Math.round(measuredWidth * dpr));
        let targetHeight = square ? targetWidth : Math.max(1, Math.round(measuredHeight * dpr));
        
        if (square) {
            const multiple = 8;
            const alignedSize = Math.max(multiple, Math.ceil(targetWidth / multiple) * multiple);
            targetWidth = alignedSize;
            targetHeight = alignedSize;
        }
        
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            if (ctx) {
                ctx.imageSmoothingEnabled = false;
            }
            return true;
        }
        return false;
    }

    handleCanvasResize(force = false) {
        const editorChanged = this.resizeCanvasToDisplaySize(this.editorCanvas, this.ectx, { square: true });
        const tileChanged = this.resizeCanvasToDisplaySize(this.tileCanvas, this.tileCtx, { square: true });
        
        if (editorChanged || force) {
            this.renderEditor();
        }
        if (tileChanged || force) {
            this.redrawTileEditor();
        }
    }

    handleEditorTabActivated() {
        requestAnimationFrame(() => this.handleCanvasResize(true));
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    this.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
            }
        }
    }

    initialize() {
        this.pushHistory();
        this.gameEngine.tileManager.ensureDefaultTiles();
        
        const tiles = this.gameEngine.getTiles();
        if (tiles.length > 0) {
            this.selectedTileId = tiles[0].id;
            this.updateSelectedTilePreview();
            this.reflectActiveTileToEditor();
        }
        
        this.syncUI();
        this.renderTileList();
        this.renderNpcsList();
        this.handleCanvasResize(true);
    }

    // Métodos de pintura
    paintAt(e) {
        if (this.placingNpc) {
            this.placeNpcAt(e);
            return;
        }
        
        const { x, y } = this.getTileFromEvent(e);
        if (x < 0 || y < 0 || x >= 8 || y >= 8) return;
        if (!this.selectedTileId) return;
        
        this.gameEngine.setMapTile(x, y, this.selectedTileId);
        this.renderEditor();
        this.gameEngine.draw();
    }

    getTileFromEvent(e) {
        const rect = this.editorCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return { x: -1, y: -1 };
        
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return { x: -1, y: -1 };
        const x = Math.min(7, Math.floor(relX * 8));
        const y = Math.min(7, Math.floor(relY * 8));
        return { x, y };
    }

    onTilePaint(e) {
        const rect = this.tileCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return;
        
        const x = Math.min(7, Math.floor(relX * 8));
        const y = Math.min(7, Math.floor(relY * 8));
        
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === this.activeTileId);
        if (!tile) return;
        
        tile.pixels[y][x] = this.tileColor.value;
        this.redrawTileEditor();
        this.updateSelectedTilePreview();
        this.renderTileList();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSONArea();
    }

    // Métodos de renderização
    renderEditor() {
        const tileMap = this.gameEngine.getTileMap();
        const sprites = this.gameEngine.getSprites();
        const size = 8;
        const tileSize = Math.floor(this.editorCanvas.width / size);
        const groundMap = tileMap?.ground || [];
        const overlayMap = tileMap?.overlay || [];

        this.ectx.fillStyle = '#0a0c12';
        this.ectx.fillRect(0, 0, this.editorCanvas.width, this.editorCanvas.height);

        // Desenhar tiles
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const groundId = groundMap[y]?.[x];
                if (groundId) {
                    this.drawTilePreviewAt(groundId, x * tileSize, y * tileSize, tileSize);
                }

                const overlayId = overlayMap[y]?.[x];
                if (overlayId) {
                    this.ectx.save();
                    this.ectx.globalAlpha = 0.95;
                    this.drawTilePreviewAt(overlayId, x * tileSize, y * tileSize, tileSize);
                    this.ectx.restore();
                    
                    this.ectx.strokeStyle = 'rgba(100, 181, 246, 0.45)';
                    this.ectx.lineWidth = 1;
                    this.ectx.strokeRect(x * tileSize + 0.5, y * tileSize + 0.5, tileSize - 1, tileSize - 1);
                }
            }
        }

        // Desenhar NPCs
        for (const npc of sprites) {
            if (npc.roomIndex === 0) {
                const x = npc.x * tileSize;
                const y = npc.y * tileSize;
                const size = tileSize;
                
                this.ectx.fillStyle = '#64b5f6';
                this.ectx.fillRect(x + 2, y + 2, size - 4, size - 4);
                
                this.ectx.strokeStyle = '#ffffff';
                this.ectx.lineWidth = 2;
                this.ectx.strokeRect(x + 2, y + 2, size - 4, size - 4);
                
                if (npc.id === this.selectedNpcId) {
                    this.ectx.strokeStyle = '#ffeb3b';
                    this.ectx.lineWidth = 3;
                    this.ectx.strokeRect(x, y, size, size);
                }
            }
        }

        // Desenhar grade
        this.ectx.strokeStyle = '#2a2f3f';
        this.ectx.lineWidth = 1;
        for (let i = 0; i <= size; i++) {
            this.ectx.beginPath();
            this.ectx.moveTo(0, i * tileSize);
            this.ectx.lineTo(size * tileSize, i * tileSize);
            this.ectx.stroke();
            this.ectx.beginPath();
            this.ectx.moveTo(i * tileSize, 0);
            this.ectx.lineTo(i * tileSize, size * tileSize);
            this.ectx.stroke();
        }
    }

    drawTilePreviewAt(tileId, px, py, size) {
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === tileId);
        if (!tile) return;
        
        const step = Math.floor(size / 8);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                this.ectx.fillStyle = col;
                this.ectx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    renderTileList() {
        const tiles = this.gameEngine.getTiles();
        this.tileList.innerHTML = '';
        
        for (const tile of tiles) {
            const card = document.createElement('div');
            card.className = 'tile-card';
            
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            this.gameEngine.renderer.drawTileOnCanvas(canvas, tile);
            
            canvas.addEventListener('click', () => {
                this.selectedTileId = tile.id;
                this.updateSelectedTilePreview();
                this.reflectActiveTileToEditor();
            });
            
            const meta = document.createElement('div');
            meta.className = 'meta';
            
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = tile.name || '';
            nameInput.addEventListener('input', () => {
                this.gameEngine.updateTile(tile.id, { name: nameInput.value });
                if (this.activeTileId === tile.id) {
                    this.tileName.value = nameInput.value;
                }
            });
            
            const row = document.createElement('div');
            row.className = 'row';
            
            const label = document.createElement('label');
            label.textContent = 'Colide';
            
            const collisionCheckbox = document.createElement('input');
            collisionCheckbox.type = 'checkbox';
            collisionCheckbox.checked = !!tile.collision;
            collisionCheckbox.addEventListener('change', () => {
                this.gameEngine.updateTile(tile.id, { collision: collisionCheckbox.checked });
            });
            
            label.prepend(collisionCheckbox);
            row.appendChild(label);
            meta.appendChild(nameInput);
            meta.appendChild(row);
            card.appendChild(canvas);
            card.appendChild(meta);
            this.tileList.appendChild(card);
        }
    }

    renderNpcsList() {
        const sprites = this.gameEngine.getSprites();
        this.npcsList.innerHTML = '';
        
        for (const npc of sprites) {
            const card = document.createElement('div');
            card.className = 'npc-card';
            card.setAttribute('data-npc-id', npc.id);
            if (this.selectedNpcId === npc.id) card.classList.add('selected');
            
            const preview = document.createElement('div');
            preview.className = 'npc-preview';
            preview.textContent = '👤';
            
            const meta = document.createElement('div');
            meta.className = 'meta';
            
            const name = document.createElement('div');
            name.className = 'npc-name';
            name.textContent = npc.name || 'NPC';
            
            const position = document.createElement('div');
            position.className = 'npc-position';
            position.textContent = `Sala ${npc.roomIndex + 1} - (${npc.x}, ${npc.y})`;
            
            const dialog = document.createElement('div');
            dialog.className = 'npc-dialog';
            dialog.textContent = npc.text || 'Sem diálogo';
            
            meta.appendChild(name);
            meta.appendChild(position);
            meta.appendChild(dialog);
            card.appendChild(preview);
            card.appendChild(meta);
            
            card.addEventListener('click', () => {
                this.selectedNpcId = npc.id;
                this.updateNpcSelection();
            });
            
            this.npcsList.appendChild(card);
        }
        
        this.reflectSelectedNpcToEditor();
    }

    // Métodos de NPC
    addNewNPC() {
        const npc = {
            id: this.generateId(),
            name: 'NPC ' + (this.gameEngine.getSprites().length + 1),
            x: 1,
            y: 1,
            roomIndex: 0,
            text: 'Olá!'
        };
        
        this.gameEngine.addSprite(npc);
        this.selectedNpcId = npc.id;
        this.renderNpcsList();
        this.reflectSelectedNpcToEditor();
        this.pushHistory();
        this.updateJSONArea();
    }

    toggleNPCPLacement() {
        if (this.placingNpc) {
            this.stopPlacingNpc();
        } else {
            this.startPlacingNpc();
        }
    }

    startPlacingNpc() {
        if (!this.selectedNpcId) return;
        this.placingNpc = true;
        this.btnPlaceNpc.textContent = 'Cancelar colocação';
        this.btnPlaceNpc.classList.add('placing');
        this.editorCanvas.style.cursor = 'crosshair';
    }

    stopPlacingNpc() {
        this.placingNpc = false;
        this.btnPlaceNpc.textContent = 'Colocar NPC no mapa';
        this.btnPlaceNpc.classList.remove('placing');
        this.editorCanvas.style.cursor = 'default';
    }

    placeNpcAt(e) {
        const { x, y } = this.getTileFromEvent(e);
        if (x < 0 || y < 0 || x >= 8 || y >= 8) return;
        if (!this.selectedNpcId) return;
        
        const sprites = this.gameEngine.getSprites();
        const npc = sprites.find(s => s.id === this.selectedNpcId);
        if (!npc) return;
        
        npc.x = x;
        npc.y = y;
        npc.roomIndex = 0;
        
        this.stopPlacingNpc();
        this.pushHistory();
        this.renderNpcsList();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSONArea();
    }

    deleteSelectedNPC() {
        if (!this.selectedNpcId) return;
        
        const sprites = this.gameEngine.getSprites();
        const index = sprites.findIndex(s => s.id === this.selectedNpcId);
        if (index >= 0) {
            sprites.splice(index, 1);
            this.selectedNpcId = null;
            this.renderNpcsList();
            this.reflectSelectedNpcToEditor();
            this.renderEditor();
            this.gameEngine.draw();
            this.pushHistory();
            this.updateJSONArea();
        }
    }

    updateNpcSelection() {
        document.querySelectorAll('.npc-card').forEach(card => card.classList.remove('selected'));
        if (this.selectedNpcId) {
            const card = document.querySelector(`[data-npc-id="${this.selectedNpcId}"]`);
            if (card) card.classList.add('selected');
        }
        this.reflectSelectedNpcToEditor();
    }

    reflectSelectedNpcToEditor() {
        const sprites = this.gameEngine.getSprites();
        const npc = sprites.find(s => s.id === this.selectedNpcId);
        if (!npc) {
            this.npcText.value = '';
            this.btnPlaceNpc.disabled = true;
            return;
        }
        this.npcText.value = npc.text || '';
        this.btnPlaceNpc.disabled = false;
    }

    updateNPCDialog() {
        if (!this.selectedNpcId) return;
        const sprites = this.gameEngine.getSprites();
        const npc = sprites.find(s => s.id === this.selectedNpcId);
        if (!npc) return;
        npc.text = this.npcText.value;
        this.renderNpcsList();
        this.updateJSONArea();
    }

    // Métodos de tile
    addNewTile() {
        const tile = this.gameEngine.createBlankTile('Tile');
        this.gameEngine.addTile(tile);
        this.selectedTileId = tile.id;
        this.updateSelectedTilePreview();
        this.reflectActiveTileToEditor();
        this.renderTileList();
    }

    addTreeTile() {
        const tree = this.gameEngine.tileManager.createDefaultTree();
        this.gameEngine.addTile(tree);
        this.selectedTileId = tree.id;
        this.updateSelectedTilePreview();
        this.reflectActiveTileToEditor();
        this.renderTileList();
    }

    clearActiveTile() {
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === this.activeTileId);
        if (!tile) return;
        
        tile.pixels = Array.from({ length: 8 }, () => Array(8).fill('transparent'));
        this.redrawTileEditor();
        this.updateSelectedTilePreview();
        this.renderTileList();
        this.gameEngine.draw();
    }

    duplicateActiveTile() {
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === this.activeTileId);
        if (!tile) return;
        
        const copy = {
            id: this.generateId(),
            name: (tile.name || 'Tile') + ' (cópia)',
            pixels: tile.pixels.map(r => r.slice()),
            collision: tile.collision
        };
        
        this.gameEngine.addTile(copy);
        this.renderTileList();
    }

    removeActiveTile() {
        const tiles = this.gameEngine.getTiles();
        const index = tiles.findIndex(t => t.id === this.activeTileId);
        if (index >= 0) {
            tiles.splice(index, 1);
            if (this.selectedTileId === this.activeTileId) {
                this.selectedTileId = null;
            }
            this.activeTileId = null;
        }
        this.renderTileList();
        this.renderEditor();
        this.updateSelectedTilePreview();
    }

    updateSelectedTilePreview() {
        const ctx = this.selectedTilePreview.getContext('2d');
        ctx.clearRect(0, 0, this.selectedTilePreview.width, this.selectedTilePreview.height);
        if (!this.selectedTileId) return;
        
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === this.selectedTileId);
        if (!tile) return;
        
        this.gameEngine.renderer.drawTileOnCanvas(this.selectedTilePreview, tile);
    }

    reflectActiveTileToEditor() {
        this.activeTileId = this.selectedTileId;
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === this.activeTileId);
        
        if (!tile) {
            this.tileCtx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
            this.tileName.value = '';
            this.tileCollision.checked = false;
            return;
        }
        
        this.tileName.value = tile.name || '';
        this.tileCollision.checked = !!tile.collision;
        this.redrawTileEditor();
    }

    redrawTileEditor() {
        const tiles = this.gameEngine.getTiles();
        const tile = tiles.find(t => t.id === this.activeTileId);
        if (!tile) return;
        
        this.tileCtx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
        this.tileCtx.fillStyle = '#0a0c12';
        this.tileCtx.fillRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
        
        const gridStep = Math.floor(this.tileCanvas.width / 8);
        this.tileCtx.strokeStyle = '#2a2f3f';
        
        for (let i = 0; i <= 8; i++) {
            this.tileCtx.beginPath();
            this.tileCtx.moveTo(0, i * gridStep);
            this.tileCtx.lineTo(8 * gridStep, i * gridStep);
            this.tileCtx.stroke();
            this.tileCtx.beginPath();
            this.tileCtx.moveTo(i * gridStep, 0);
            this.tileCtx.lineTo(i * gridStep, 8 * gridStep);
            this.tileCtx.stroke();
        }
        
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                this.tileCtx.fillStyle = col;
                this.tileCtx.fillRect(x * gridStep, y * gridStep, gridStep, gridStep);
            }
        }
    }

    updateTileName() {
        if (!this.activeTileId) return;
        this.gameEngine.updateTile(this.activeTileId, { name: this.tileName.value });
        this.renderTileList();
    }

    updateTileCollision() {
        if (!this.activeTileId) return;
        this.gameEngine.updateTile(this.activeTileId, { collision: this.tileCollision.checked });
        this.renderTileList();
        this.gameEngine.draw();
    }

    // Métodos de histórico
    pushHistory() {
        const data = this.gameEngine.exportGameData();
        this.history.stack = this.history.stack.slice(0, this.history.index + 1);
        this.history.stack.push(JSON.stringify(data));
        this.history.index = this.history.stack.length - 1;
    }

    undo() {
        if (this.history.index <= 0) return;
        this.history.index--;
        const data = JSON.parse(this.history.stack[this.history.index]);
        this.gameEngine.importGameData(data);
        this.syncUI();
        this.renderEditor();
        this.renderNpcsList();
        this.gameEngine.draw();
    }

    redo() {
        if (this.history.index >= this.history.stack.length - 1) return;
        this.history.index++;
        const data = JSON.parse(this.history.stack[this.history.index]);
        this.gameEngine.importGameData(data);
        this.syncUI();
        this.renderEditor();
        this.renderNpcsList();
        this.gameEngine.draw();
    }

    // Métodos de arquivo
    createNewGame() {
        const data = {
            title: 'Novo Jogo',
            palette: ['#0e0f13', '#2e3140', '#f4f4f8'],
            roomSize: 8,
            rooms: [{ size: 8, bg: 0, tiles: Array.from({ length: 8 }, () => Array(8).fill(0)), walls: Array.from({ length: 8 }, () => Array(8).fill(false)) }],
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [], items: [], exits: [],
            tileset: {
                tiles: [this.gameEngine.createBlankTile('Padrao')],
                map: {
                    ground: Array.from({ length: 8 }, () => Array(8).fill(null)),
                    overlay: Array.from({ length: 8 }, () => Array(8).fill(null))
                }
            }
        };
        
        this.gameEngine.importGameData(data);
        this.pushHistory();
        this.syncUI();
        this.renderTileList();
        this.renderNpcsList();
        this.renderEditor();
        
        const tiles = this.gameEngine.getTiles();
        if (tiles.length > 0) {
            this.selectedTileId = tiles[0].id;
            this.updateSelectedTilePreview();
            this.reflectActiveTileToEditor();
        }
        
        this.gameEngine.draw();
    }

    saveGame() {
        const data = JSON.stringify(this.gameEngine.exportGameData(), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bitsy-mini.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    loadGameFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                this.gameEngine.importGameData(data);
                this.pushHistory();
                this.syncUI();
                this.renderTileList();
                this.renderEditor();
                this.renderNpcsList();
                
                const tiles = this.gameEngine.getTiles();
                if (tiles.length > 0) {
                    this.selectedTileId = tiles[0].id;
                    this.updateSelectedTilePreview();
                    this.reflectActiveTileToEditor();
                }
                
                this.gameEngine.draw();
            } catch (e) {
                alert('JSON inválido');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    applyJSON() {
        try {
            const data = JSON.parse(this.jsonArea.value);
            this.gameEngine.importGameData(data);
            this.pushHistory();
            this.syncUI();
            this.renderTileList();
            this.renderNpcsList();
            this.renderEditor();
            
            const tiles = this.gameEngine.getTiles();
            if (tiles.length > 0) {
                this.selectedTileId = tiles[0].id;
                this.updateSelectedTilePreview();
                this.reflectActiveTileToEditor();
            }
            
            this.gameEngine.draw();
        } catch (e) {
            alert('JSON inválido');
        }
    }

    exportHTML() {
        const gameData = this.gameEngine.exportGameData();
        const htmlContent = this.generateStandaloneHTML(gameData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (gameData.title || 'meu-jogo') + '.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    generateStandaloneHTML(gameData) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${gameData.title || 'Meu Jogo'}</title>
    <style>
        :root {
            --bg: #0e0f13;
            --panel: #151821;
            --text: #e6e7eb;
            --muted: #9aa0aa;
            --accent: #64b5f6;
            --border: #232734;
        }

        * { box-sizing: border-box; }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji";
            color: var(--text);
            background: radial-gradient(1200px 600px at 50% -200px, #182036 0%, var(--bg) 60%);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .game-container {
            background: #0a0c12;
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,.4);
        }

        .game-title {
            text-align: center;
            margin-bottom: 16px;
            font-size: 18px;
            font-weight: 700;
        }

        .game-canvas-wrap {
            background: #0a0c12;
            border: 1px solid var(--border);
            padding: 8px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,.4) inset;
        }

        canvas { 
            image-rendering: pixelated; 
            image-rendering: crisp-edges; 
        }

        .game-controls {
            margin-top: 12px;
            text-align: center;
            color: var(--muted);
            font-size: 14px;
        }

        .game-controls button {
            background: #0f1422;
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 8px 16px;
            margin: 0 4px;
            cursor: pointer;
            font: inherit;
        }

        .game-controls button:hover {
            border-color: #2d3242;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="game-title">${gameData.title || 'Meu Jogo'}</div>
        <div class="game-canvas-wrap">
            <canvas id="game-canvas" width="128" height="128"></canvas>
        </div>
        <div class="game-controls">
            <button id="btn-reset">Reiniciar</button>
            <span>Setas para mover • Z para interagir</span>
        </div>
    </div>

    <script>
        // Game data embedded
        const GAME_DATA = ${JSON.stringify(gameData)};

        // Standalone game engine
        (function() {
            "use strict";

            const canvas = document.getElementById("game-canvas");
            const ctx = canvas.getContext("2d");
            const game = GAME_DATA;

            const state = {
                player: { x: game.start.x, y: game.start.y, roomIndex: game.start.roomIndex },
                dialog: { active: false, text: "" },
            };

            function getTilePixelSize() {
                return Math.floor(canvas.width / 8);
            }

            function currentRoom() {
                return game.rooms[state.player.roomIndex];
            }

            function color(idx) { 
                return game.palette[idx] || "#f4f4f8"; 
            }

            function clearCanvas() {
                ctx.fillStyle = color(currentRoom().bg);
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            function drawCustomTile(tileId, px, py, size) {
                const tile = game.tileset.tiles.find(t => t.id === tileId);
                if (!tile) return;
                const step = Math.floor(size / 8);
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const col = tile.pixels[y][x];
                        if (!col || col === 'transparent') continue;
                        ctx.fillStyle = col;
                        ctx.fillRect(px + x * step, py + y * step, step, step);
                    }
                }
            }

            function draw() {
                clearCanvas();
                const room = currentRoom();
                const tileSize = getTilePixelSize();

                const groundMap = game.tileset.map.ground || [];
                const overlayMap = game.tileset.map.overlay || [];

                // tiles personalizados
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const groundId = groundMap[y]?.[x];
                        if (groundId) {
                            drawCustomTile(groundId, x * tileSize, y * tileSize, tileSize);
                        } else {
                            const colIdx = room.tiles[y][x];
                            ctx.fillStyle = color(colIdx);
                            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                        }

                        const overlayId = overlayMap[y]?.[x];
                        if (overlayId) {
                            drawCustomTile(overlayId, x * tileSize, y * tileSize, tileSize);
                        }
                    }
                }

                // paredes
                ctx.fillStyle = color(1);
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        if (room.walls[y][x]) {
                            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                        }
                    }
                }

                // itens
                ctx.fillStyle = color(2);
                for (const item of game.items) {
                    if (item.roomIndex !== state.player.roomIndex || item.collected) continue;
                    ctx.fillRect(item.x * tileSize + tileSize * 0.25, item.y * tileSize + tileSize * 0.25, tileSize * 0.5, tileSize * 0.5);
                }

                // sprites (NPCs)
                ctx.fillStyle = color(2);
                for (const s of game.sprites) {
                    if (s.roomIndex !== state.player.roomIndex) continue;
                    ctx.fillRect(s.x * tileSize + 2, s.y * tileSize + 2, tileSize - 4, tileSize - 4);
                }

                // jogador
                ctx.strokeStyle = color(2);
                ctx.lineWidth = Math.max(1, Math.floor(tileSize / 6));
                ctx.strokeRect(state.player.x * tileSize + 2, state.player.y * tileSize + 2, tileSize - 4, tileSize - 4);

                // diálogo se ativo
                if (state.dialog.active) {
                    drawDialog(state.dialog.text);
                }
            }

            function drawDialog(text) {
                const pad = 6;
                const w = canvas.width - pad * 2;
                const h = 40;
                const x = pad;
                const y = canvas.height - h - pad;
                ctx.fillStyle = "rgba(0,0,0,0.7)";
                ctx.fillRect(x, y, w, h);
                ctx.strokeStyle = color(2);
                ctx.strokeRect(x, y, w, h);
                ctx.fillStyle = color(2);
                ctx.font = "10px monospace";
                wrapText(text, x + 8, y + 14, w - 16, 12);
            }

            function wrapText(text, x, y, maxWidth, lineHeight) {
                const words = text.split(/\\s+/);
                let line = "";
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + " ";
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && i > 0) {
                        ctx.fillText(line, x, y);
                        line = words[i] + " ";
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y);
            }

            function clamp(v, a, b) { 
                return Math.max(a, Math.min(b, v)); 
            }

            function tryMove(dx, dy) {
                if (state.dialog.active) { 
                    state.dialog.active = false; 
                    draw(); 
                    return; 
                }
                const room = currentRoom();
                const nx = clamp(state.player.x + dx, 0, 7);
                const ny = clamp(state.player.y + dy, 0, 7);
                if (room.walls[ny][nx]) return; // colisao por parede

                const overlayId = game.tileset.map.overlay[ny]?.[nx] ?? null;
                const groundId = game.tileset.map.ground[ny]?.[nx] ?? null;
                const candidateId = overlayId ?? groundId;
                if (candidateId) {
                    const tile = game.tileset.tiles.find(t => t.id === candidateId);
                    if (tile?.collision) return; // colisao por tile
                }

                state.player.x = nx;
                state.player.y = ny;
                checkInteractions();
                draw();
            }

            function checkInteractions() {
                // itens
                for (const item of game.items) {
                    if (item.roomIndex === state.player.roomIndex && !item.collected && item.x === state.player.x && item.y === state.player.y) {
                        item.collected = true;
                        showDialog(item.text || "Você pegou um item.");
                        break;
                    }
                }
                // sprites
                for (const s of game.sprites) {
                    if (s.roomIndex === state.player.roomIndex && s.x === state.player.x && s.y === state.player.y) {
                        showDialog(s.text || "Olá!");
                        break;
                    }
                }
                // saídas
                for (const ex of game.exits) {
                    if (ex.roomIndex === state.player.roomIndex && ex.x === state.player.x && ex.y === state.player.y) {
                        if (game.rooms[ex.targetRoomIndex]) {
                            state.player.roomIndex = ex.targetRoomIndex;
                            state.player.x = clamp(ex.targetX, 0, 7);
                            state.player.y = clamp(ex.targetY, 0, 7);
                        }
                        break;
                    }
                }
            }

            function showDialog(text) {
                state.dialog.active = true;
                state.dialog.text = text;
            }

            function resetGame() {
                state.player.x = game.start.x;
                state.player.y = game.start.y;
                state.player.roomIndex = game.start.roomIndex;
                for (const i of game.items) i.collected = false;
                state.dialog.active = false;
                draw();
            }

            // Input
            document.addEventListener("keydown", (ev) => {
                switch (ev.key) {
                    case "ArrowLeft": tryMove(-1, 0); break;
                    case "ArrowRight": tryMove(1, 0); break;
                    case "ArrowUp": tryMove(0, -1); break;
                    case "ArrowDown": tryMove(0, 1); break;
                    case "z":
                    case "Z":
                    case "Enter":
                    case " ":
                        if (state.dialog.active) { 
                            state.dialog.active = false; 
                            draw(); 
                        }
                        break;
                }
            });

            document.getElementById("btn-reset").addEventListener("click", resetGame);

            // Start
            draw();
        })();
    </script>
</body>
</html>`;
    }

    // Métodos utilitários
    generateId() {
        return (window.crypto?.randomUUID?.() || ('id-' + Math.random().toString(36).slice(2, 9)));
    }

    syncUI() {
        const game = this.gameEngine.getGame();
        this.titleInput.value = game.title || '';
        this.updateJSONArea();
    }

    updateGameTitle() {
        const game = this.gameEngine.getGame();
        game.title = this.titleInput.value || 'Meu Jogo';
        document.title = game.title;
        this.updateJSONArea();
    }

    updateJSONArea() {
        this.jsonArea.value = JSON.stringify(this.gameEngine.exportGameData(), null, 2);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditorManager;
} else {
    window.EditorManager = EditorManager;
}

