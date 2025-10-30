const editorObjectDefinitionsSource = (typeof module !== 'undefined' && module.exports)
    ? require('../core/ObjectDefinitions')
    : ((typeof window !== 'undefined' ? window.ObjectDefinitions : null) || {});

const EDITOR_OBJECT_DEFINITIONS = editorObjectDefinitionsSource.OBJECT_DEFINITIONS || [];
const OBJECT_TYPE_ORDER = ['door', 'door-variable', 'key'];

/**
 * EditorManager keeps the editor UI in sync with the runtime engine.
 */
class EditorManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.selectedTileId = null;
        this.selectedNpcId = null;
        this.selectedNpcType = null;
        this.activeRoomIndex = 0;
        this.placingNpc = false;
        this.placingEnemy = false;
        this.placingObjectType = null;
        this.selectedEnemyType = 'skull';
        this.mapPainting = false;
        this.history = { stack: [], index: -1 };
        this.npcTextUpdateTimer = null;
        this.suppressNpcFormUpdates = false;

        this.handleCanvasResize = this.handleCanvasResize.bind(this);
        this.finishMapPaint = this.finishMapPaint.bind(this);

        this.cacheDom();
        this.bindEvents();
        this.initialize();
    }

    cacheDom() {
        this.editorCanvas = document.getElementById('editor-canvas');
        this.ectx = this.editorCanvas?.getContext('2d') ?? null;
        if (this.ectx) this.ectx.imageSmoothingEnabled = false;

        this.selectedTilePreview = document.getElementById('selected-tile-preview');
        this.tileSummary = document.getElementById('tile-preset-summary');
        this.tileList = document.getElementById('tile-list');

        this.npcsList = document.getElementById('npcs-list');
        this.npcText = document.getElementById('npc-text');
        this.worldGrid = document.getElementById('world-grid');

        this.titleInput = document.getElementById('game-title');
        this.jsonArea = document.getElementById('json-area');
        this.fileInput = document.getElementById('file-input');

        this.btnPlaceDoor = document.getElementById('btn-place-door');
        this.btnPlaceDoorVariable = document.getElementById('btn-place-door-variable');
        this.btnPlaceKey = document.getElementById('btn-place-key');
        this.objectsList = document.getElementById('objects-list');

        this.btnAddNpc = document.getElementById('btn-add-npc');
        this.btnPlaceNpc = document.getElementById('btn-place-npc');
        this.btnNpcDelete = document.getElementById('npc-delete');
        this.btnGenerateUrl = document.getElementById('btn-generate-url');
        this.btnPlaceEnemy = document.getElementById('btn-place-enemy');
        this.enemiesList = document.getElementById('enemies-list');
        this.btnApplyJson = document.getElementById('btn-apply-json');
        this.btnUndo = document.getElementById('btn-undo');
        this.btnRedo = document.getElementById('btn-redo');

        this.variablesList = document.getElementById('variables-list');
        this.npcConditionalVariable = document.getElementById('npc-conditional-variable');
        this.npcConditionalText = document.getElementById('npc-conditional-text');
        this.npcRewardVariable = document.getElementById('npc-reward-variable');
    }

    bindEvents() {
        this.btnAddNpc?.addEventListener('click', () => this.addNPC());
        this.btnPlaceNpc?.addEventListener('click', () => this.toggleNpcPlacement());
        this.btnNpcDelete?.addEventListener('click', () => this.removeSelectedNpc());
        this.btnPlaceEnemy?.addEventListener('click', () => this.toggleEnemyPlacement());
        this.btnPlaceDoor?.addEventListener('click', () => this.toggleObjectPlacement('door'));
        this.btnPlaceDoorVariable?.addEventListener('click', () => this.toggleObjectPlacement('door-variable'));
        this.btnPlaceKey?.addEventListener('click', () => this.toggleObjectPlacement('key'));

        this.btnGenerateUrl?.addEventListener('click', () => this.generateShareableUrl());

        this.btnApplyJson?.addEventListener('click', () => this.applyJSON());
        this.btnUndo?.addEventListener('click', () => this.undo());
        this.btnRedo?.addEventListener('click', () => this.redo());

        this.titleInput?.addEventListener('input', () => this.updateGameTitle());
        this.npcText?.addEventListener('input', () => this.updateNpcText());
        this.npcConditionalText?.addEventListener('input', () => this.updateNpcConditionalText());
        this.npcConditionalVariable?.addEventListener('change', () => this.handleNpcConditionVariableChange());
        this.npcRewardVariable?.addEventListener('change', () => this.handleNpcRewardVariableChange());
        this.fileInput?.addEventListener('change', (ev) => this.loadGameFile(ev));

        this.variablesList?.addEventListener('click', (ev) => this.handleVariableToggleClick(ev));

        if (this.editorCanvas) {
            this.editorCanvas.addEventListener('pointerdown', (ev) => this.startMapPaint(ev));
            this.editorCanvas.addEventListener('pointermove', (ev) => this.continueMapPaint(ev));
        }
        window.addEventListener('pointerup', this.finishMapPaint);

        document.addEventListener('keydown', (ev) => this.handleKey(ev));
        window.addEventListener('resize', this.handleCanvasResize);
        document.addEventListener('editor-tab-activated', () => requestAnimationFrame(() => this.handleCanvasResize(true)));
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
        this.renderTileList();
        this.renderWorldGrid();
        this.renderNpcs();
        this.renderEnemies();
        this.renderObjects();
        this.renderVariables();
        this.renderEditor();
        this.updateSelectedTilePreview();
        this.handleCanvasResize(true);
        this.pushHistory();
    }

    startMapPaint(ev) {
        if (!this.editorCanvas) return;
        ev.preventDefault();
        this.mapPainting = true;
        if (ev.pointerId !== undefined && this.editorCanvas.setPointerCapture) {
            this.editorCanvas.setPointerCapture(ev.pointerId);
        }
        this.applyMapPaint(ev);
    }

    continueMapPaint(ev) {
        if (!this.mapPainting) return;
        this.applyMapPaint(ev);
    }

    finishMapPaint(ev) {
        if (!this.mapPainting) return;
        this.mapPainting = false;
        if (ev?.pointerId !== undefined && this.editorCanvas?.hasPointerCapture?.(ev.pointerId)) {
            this.editorCanvas.releasePointerCapture(ev.pointerId);
        }
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    applyMapPaint(ev) {
        const coord = this.getTileFromEvent(ev);
        if (!coord) return;

        const roomIndex = this.activeRoomIndex;

        if (this.placingNpc && this.selectedNpcId) {
            const npc = this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
            if (!npc) return;
            this.gameEngine.npcManager?.setNPCPosition?.(npc.id, coord.x, coord.y, roomIndex);
            this.toggleNpcPlacement(true);
            this.renderNpcs();
            this.renderEditor();
            this.gameEngine.draw();
            this.updateJSON();
            this.pushHistory();
            return;
        }

        if (this.placingEnemy) {
            const existing = (this.gameEngine.getEnemyDefinitions?.() ?? []).find((enemy) =>
                enemy.roomIndex === roomIndex && enemy.x === coord.x && enemy.y === coord.y
            );
            if (!existing) {
                this.gameEngine.addEnemy({ x: coord.x, y: coord.y, roomIndex, type: 'skull' });
                this.renderEnemies();
                this.renderEditor();
                this.gameEngine.draw();
                this.updateJSON();
                this.pushHistory();
            }
            return;
        }

        if (this.placingObjectType) {
            this.gameEngine.setObjectPosition(this.placingObjectType, roomIndex, coord.x, coord.y);
            this.toggleObjectPlacement(this.placingObjectType, true);
            this.renderObjects();
            this.renderWorldGrid();
            this.renderEditor();
            this.gameEngine.draw();
            this.updateJSON();
            this.pushHistory();
            return;
        }

        if (this.selectedTileId === null || this.selectedTileId === undefined) return;
        this.gameEngine.setMapTile(coord.x, coord.y, this.selectedTileId, roomIndex);
        this.renderEditor();
        this.gameEngine.draw();
    }

    getTileFromEvent(ev) {
        if (!this.editorCanvas) return null;
        const rect = this.editorCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const relX = (ev.clientX - rect.left) / rect.width;
        const relY = (ev.clientY - rect.top) / rect.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return null;
        return {
            x: Math.min(7, Math.floor(relX * 8)),
            y: Math.min(7, Math.floor(relY * 8))
        };
    }

    renderEditor() {
        if (!this.ectx || !this.editorCanvas) return;
        const game = this.gameEngine.getGame();
        const roomIndex = this.activeRoomIndex;
        const room = game.rooms?.[roomIndex];
        const tileSize = Math.floor(this.editorCanvas.width / 8);
        const tileMap = this.gameEngine.getTileMap(roomIndex);
        const ground = tileMap?.ground ?? [];
        const overlay = tileMap?.overlay ?? [];

        this.ectx.fillStyle = '#0a0c12';
        this.ectx.fillRect(0, 0, this.editorCanvas.width, this.editorCanvas.height);

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const groundId = ground[y]?.[x];
                if (groundId !== null && groundId !== undefined) {
                    this.gameEngine.renderer.drawTilePreviewAt(groundId, x * tileSize, y * tileSize, tileSize, this.ectx);
                } else if (room) {
                    const colorIndex = room.tiles?.[y]?.[x] ?? 0;
                    this.ectx.fillStyle = game.palette?.[colorIndex] ?? '#1a1d2b';
                    this.ectx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlay[y]?.[x];
                if (overlayId !== null && overlayId !== undefined) {
                    this.ectx.save();
                    this.ectx.globalAlpha = 0.92;
                    this.gameEngine.renderer.drawTilePreviewAt(overlayId, x * tileSize, y * tileSize, tileSize, this.ectx);
                    this.ectx.restore();
                    this.ectx.strokeStyle = 'rgba(100, 181, 246, 0.45)';
                    this.ectx.strokeRect(x * tileSize + 0.5, y * tileSize + 0.5, tileSize - 1, tileSize - 1);
                }
            }
        }

        const objects = this.gameEngine.getObjectsForRoom?.(roomIndex) ?? [];
        const objectStep = tileSize / 8;
        objects.forEach((object) => {
            const ox = object.x * tileSize;
            const oy = object.y * tileSize;
            this.gameEngine.renderer.drawObjectSprite(this.ectx, object.type, ox, oy, objectStep);
            let strokeColor = 'rgba(255, 255, 39, 0.6)';
            if (object.type === 'door') {
                strokeColor = 'rgba(255, 163, 0, 0.6)';
            } else if (object.type === 'door-variable') {
                strokeColor = 'rgba(64, 224, 208, 0.65)';
            }
            this.ectx.strokeStyle = strokeColor;
            this.ectx.lineWidth = 1;
            this.ectx.strokeRect(ox + 1, oy + 1, tileSize - 2, tileSize - 2);
        });

        const sprites = game.sprites ?? [];
        sprites.forEach((npc) => {
            if (npc.roomIndex !== roomIndex) return;
            const px = npc.x * tileSize;
            const py = npc.y * tileSize;
            this.ectx.fillStyle = '#64b5f6';
            this.ectx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);
            if (npc.id === this.selectedNpcId) {
                this.ectx.strokeStyle = '#ffeb3b';
                this.ectx.lineWidth = 2;
                this.ectx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
            }
        });

        const enemies = this.gameEngine.getEnemyDefinitions?.() ?? [];
        enemies.forEach((enemy) => {
            if (enemy.roomIndex !== roomIndex) return;
            const ex = enemy.x * tileSize;
            const ey = enemy.y * tileSize;
            this.gameEngine.renderer.drawEnemySprite(this.ectx, ex, ey, tileSize / 8);
        });

        this.ectx.strokeStyle = '#2a2f3f';
        this.ectx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) {
            this.ectx.beginPath();
            this.ectx.moveTo(0, i * tileSize);
            this.ectx.lineTo(8 * tileSize, i * tileSize);
            this.ectx.stroke();
            this.ectx.beginPath();
            this.ectx.moveTo(i * tileSize, 0);
            this.ectx.lineTo(i * tileSize, 8 * tileSize);
            this.ectx.stroke();
        }
    }

    renderTileList() {
        if (!this.tileList) return;
        const tiles = this.gameEngine.getTiles();
        if (this.tileSummary) {
            this.tileSummary.textContent = '';
        }

        const groups = new Map();
        tiles.forEach((tile) => {
            const category = tile.category || 'Diversos';
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category).push(tile);
        });

        const categoryOrder = ['Terreno', 'Natureza', 'Agua', 'Construcoes', 'Interior', 'Decoracao', 'Objetos', 'Diversos'];
        const categories = Array.from(groups.keys()).sort((a, b) => {
            const ia = categoryOrder.indexOf(a);
            const ib = categoryOrder.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });

        this.tileList.innerHTML = '';

        categories.forEach((category) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'tile-group';

            const heading = document.createElement('h4');
            heading.className = 'tile-group-title';
            heading.textContent = category;
            wrapper.appendChild(heading);

            const grid = document.createElement('div');
            grid.className = 'tile-group-grid';

            const categoryTiles = groups.get(category) || [];
            categoryTiles.forEach((tile) => {
                const card = document.createElement('div');
                card.className = 'tile-card';
                if (tile.id === this.selectedTileId) {
                    card.classList.add('selected');
                }

                const preview = document.createElement('canvas');
                preview.width = 64;
                preview.height = 64;
                const ctx = preview.getContext('2d');
                if (ctx) {
                    ctx.imageSmoothingEnabled = false;
                    this.gameEngine.renderer.drawTileOnCanvas(preview, tile);
                }

                const meta = document.createElement('div');
                meta.className = 'meta';

                const name = document.createElement('div');
                name.className = 'tile-name';
                name.textContent = tile.name || 'Tile';

                const info = document.createElement('div');
                info.className = 'tile-info';
                info.textContent = tile.collision ? 'Bloqueia movimento' : 'Passavel';

                meta.append(name, info);
                card.append(preview, meta);

                card.addEventListener('click', () => {
                    this.selectedTileId = tile.id;
                    this.updateSelectedTilePreview();
                    this.renderTileList();
                });

                grid.appendChild(card);
            });

            wrapper.appendChild(grid);
            this.tileList.appendChild(wrapper);
        });

        this.updateSelectedTilePreview();
    }

    updateSelectedTilePreview() {
        if (!this.selectedTilePreview) return;
        const ctx = this.selectedTilePreview.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, this.selectedTilePreview.width, this.selectedTilePreview.height);

        const tile = this.gameEngine.getTiles().find((t) => t.id === this.selectedTileId);
        if (!tile) return;
        this.gameEngine.renderer.drawTileOnCanvas(this.selectedTilePreview, tile);
    }

    renderNpcs() {
        if (!this.npcsList) return;
        this.gameEngine.npcManager?.ensureDefaultNPCs?.();
        const game = this.gameEngine.getGame();
        const definitions = this.gameEngine.npcManager?.getDefinitions?.() ?? [];
        const npcs = this.gameEngine.getSprites();
        this.npcsList.innerHTML = '';
        definitions.forEach((def) => {
            const npc = npcs.find((entry) => entry.type === def.type) || null;
            const card = document.createElement('div');
            card.className = 'npc-card';
            card.dataset.type = def.type;
            card.dataset.id = npc?.id || '';
            if (def.type === this.selectedNpcType) card.classList.add('selected');

            const preview = document.createElement('canvas');
            preview.className = 'npc-preview';
            preview.width = 48;
            preview.height = 48;
            this.drawNpcPreview(preview, def);

            const meta = document.createElement('div');
            meta.className = 'meta';

            const name = document.createElement('div');
            name.className = 'npc-name';
            name.textContent = def.name;

            const pos = document.createElement('div');
            pos.className = 'npc-position';
            if (npc?.placed) {
                const cols = game.world?.cols || 1;
                const roomRow = Math.floor(npc.roomIndex / cols) + 1;
                const roomCol = (npc.roomIndex % cols) + 1;
                pos.textContent = `Mapa (${roomCol}, ${roomRow}) - (${npc.x}, ${npc.y})`;
                card.classList.add('npc-card-placed');
            } else {
                pos.textContent = 'Disponivel';
                card.classList.add('npc-card-available');
            }

            meta.append(name, pos);
            card.append(preview, meta);

            card.addEventListener('click', () => {
                this.selectedNpcType = def.type;
                this.selectedNpcId = npc?.id || null;
                this.updateNpcSelection();
            });

            this.npcsList.appendChild(card);
        });

        if (this.btnAddNpc) {
            const remaining = definitions.some((def) => {
                const npc = npcs.find((entry) => entry.type === def.type);
                return !npc?.placed;
            });
            this.btnAddNpc.disabled = !remaining;
        }

        this.renderWorldGrid();
        this.updateNpcSelection();
    }

    drawNpcPreview(canvas, definition) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const renderer = this.gameEngine?.renderer;
        const sprite = renderer?.npcSprites?.[definition.type] || renderer?.npcSprites?.default || null;

        if (!sprite || !sprite.length || !sprite[0]?.length) {
            ctx.fillStyle = '#1D2B53';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '10px sans-serif';
            const label = (definition.previewLabel || definition.name || '?').slice(0, 1).toUpperCase();
            ctx.fillText(label, canvas.width / 2, canvas.height / 2);
            return;
        }

        const spriteHeight = sprite.length;
        const spriteWidth = sprite[0].length;
        const step = Math.max(1, Math.floor(Math.min(canvas.width / spriteWidth, canvas.height / spriteHeight)));
        const offsetX = Math.floor((canvas.width - spriteWidth * step) / 2);
        const offsetY = Math.floor((canvas.height - spriteHeight * step) / 2);

        if (renderer?.drawSprite) {
            renderer.drawSprite(ctx, sprite, offsetX, offsetY, step);
        } else {
            for (let y = 0; y < spriteHeight; y++) {
                for (let x = 0; x < spriteWidth; x++) {
                    const color = sprite[y][x];
                    if (!color) continue;
                    ctx.fillStyle = color;
                    ctx.fillRect(offsetX + x * step, offsetY + y * step, step, step);
                }
            }
        }
    }

    renderEnemies() {
        if (!this.enemiesList) return;
        const roomIndex = this.activeRoomIndex;
        const enemies = (this.gameEngine.getEnemyDefinitions?.() ?? []).filter((enemy) => enemy.roomIndex === roomIndex);
        this.enemiesList.innerHTML = '';

        if (!enemies.length) {
            const hint = document.createElement('p');
            hint.className = 'enemy-hint';
            hint.textContent = 'Nenhum inimigo colocado.';
            this.enemiesList.appendChild(hint);
            return;
        }

        enemies.forEach((enemy) => {
            const card = document.createElement('div');
            card.className = 'enemy-card';

            const info = document.createElement('span');
            info.textContent = `Caveira (${enemy.x}, ${enemy.y})`;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.addEventListener('click', () => this.removeEnemy(enemy.id));

            card.append(info, removeBtn);
            this.enemiesList.appendChild(card);
        });
        this.renderWorldGrid();
    }

    renderObjects() {
        if (!this.objectsList) return;
        const roomIndex = this.activeRoomIndex;
        const objects = this.gameEngine.getObjectsForRoom?.(roomIndex) ?? [];
        this.objectsList.innerHTML = '';
        const variableDefinitions = this.gameEngine.getVariableDefinitions?.() ?? [];
        const runtimeVariables = this.gameEngine.getRuntimeVariables?.() ?? [];

        OBJECT_TYPE_ORDER.forEach((type) => {
            const object = objects.find((entry) => entry.type === type) || null;
            const card = document.createElement('div');
            card.className = 'object-card';

            const name = document.createElement('div');
            name.className = 'object-name';
            name.textContent = this.getObjectLabel(type);

            const info = document.createElement('div');
            info.className = 'object-info';
            if (object) {
                if (type === 'door-variable') {
                    const variableDef = variableDefinitions.find((entry) => entry.id === object.variableId) || null;
                    const variableLabel = variableDef?.name || object.variableId || 'Nao configurada';
                    const runtimeValue = runtimeVariables.find((entry) => entry.id === object.variableId) || null;
                    const stateLabel = runtimeValue?.value ? 'ON' : 'OFF';
                    info.textContent = `(${object.x}, ${object.y}) - ${variableLabel} (${stateLabel})`;
                } else {
                    info.textContent = `(${object.x}, ${object.y})`;
                }
            } else {
                info.textContent = 'Nao colocado';
            }

            const header = document.createElement('div');
            header.className = 'object-header';
            header.append(name, info);
            card.appendChild(header);

            if (object) {
                if (type === 'door-variable') {
                    const config = document.createElement('div');
                    config.className = 'object-config';

                    const label = document.createElement('label');
                    label.className = 'object-config-label';
                    label.textContent = 'Variavel vinculada';

                    const select = document.createElement('select');
                    select.className = 'object-config-select';
                    variableDefinitions.forEach((variable) => {
                        const option = document.createElement('option');
                        option.value = variable.id;
                        option.textContent = variable.name || variable.id;
                        select.appendChild(option);
                    });
                    const fallbackId = variableDefinitions[0]?.id ?? '';
                    select.value = object.variableId || fallbackId;
                    select.addEventListener('change', () => {
                        const nextId = select.value;
                        this.gameEngine.setObjectVariable('door-variable', roomIndex, nextId);
                        this.renderObjects();
                        this.renderWorldGrid();
                        this.renderEditor();
                        this.gameEngine.draw();
                        this.updateJSON();
                        this.pushHistory();
                    });

                    label.appendChild(select);
                    config.appendChild(label);

                    const runtimeEntry = runtimeVariables.find((entry) => entry.id === (object.variableId || select.value)) || null;
                    const status = document.createElement('div');
                    status.className = 'object-status';
                    const isOn = Boolean(runtimeEntry?.value);
                    status.classList.toggle('is-on', isOn);
                    status.textContent = `Estado atual: ${isOn ? 'ON' : 'OFF'}`;
                    config.appendChild(status);

                    card.appendChild(config);
                }

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'object-remove';
                removeBtn.textContent = 'Remover';
                removeBtn.addEventListener('click', () => this.removeObject(type, roomIndex));
                card.appendChild(removeBtn);
            }

            this.objectsList.appendChild(card);
        });

        this.updateObjectPlacementButtons();
    }

    removeObject(type, roomIndex) {
        if (this.placingObjectType === type) {
            this.toggleObjectPlacement(type, true);
        }
        this.gameEngine.removeObject(type, roomIndex);
        this.renderObjects();
        this.renderWorldGrid();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    getObjectLabel(type) {
        const def = EDITOR_OBJECT_DEFINITIONS.find((entry) => entry.type === type);
        if (def?.name) return def.name;
        if (type === 'door') return 'Porta';
        if (type === 'key') return 'Chave';
        return type;
    }

    toggleObjectPlacement(type, forceOff = false) {
        if (forceOff) {
            if (!this.placingObjectType) return;
            this.placingObjectType = null;
            if (this.editorCanvas) {
                this.editorCanvas.style.cursor = 'default';
            }
            this.updateObjectPlacementButtons();
            return;
        }
        if (!type) return;
        if (this.placingNpc) {
            this.toggleNpcPlacement(true);
        }
        if (this.placingEnemy) {
            this.toggleEnemyPlacement(true);
        }
        this.placingObjectType = this.placingObjectType === type ? null : type;
        if (this.editorCanvas) {
            this.editorCanvas.style.cursor = this.placingObjectType ? 'crosshair' : 'default';
        }
        this.updateObjectPlacementButtons();
    }

    updateObjectPlacementButtons() {
        if (this.btnPlaceDoor) {
            const activeDoor = this.placingObjectType === 'door';
            this.btnPlaceDoor.classList.toggle('placing', activeDoor);
            this.btnPlaceDoor.textContent = activeDoor ? 'Cancelar colocacao' : 'Colocar porta';
        }
        if (this.btnPlaceDoorVariable) {
            const activeVariableDoor = this.placingObjectType === 'door-variable';
            this.btnPlaceDoorVariable.classList.toggle('placing', activeVariableDoor);
            this.btnPlaceDoorVariable.textContent = activeVariableDoor ? 'Cancelar colocacao' : 'Colocar porta magica';
        }
        if (this.btnPlaceKey) {
            const activeKey = this.placingObjectType === 'key';
            this.btnPlaceKey.classList.toggle('placing', activeKey);
            this.btnPlaceKey.textContent = activeKey ? 'Cancelar colocacao' : 'Colocar chave';
        }
    }

    renderVariables() {
        if (!this.variablesList) return;
        const variables = this.gameEngine.getVariableDefinitions?.() ?? [];
        this.variablesList.innerHTML = '';

        variables.forEach((variable) => {
            const card = document.createElement('div');
            card.className = 'variable-card';
            card.dataset.variableId = variable.id;
            card.classList.toggle('is-on', Boolean(variable.value));

            const label = document.createElement('div');
            label.className = 'variable-label';

            const swatch = document.createElement('span');
            swatch.className = 'variable-color';
            if (variable.color) {
                swatch.style.backgroundColor = variable.color;
            }

            const name = document.createElement('span');
            name.className = 'variable-name';
            name.textContent = variable.name || variable.id;

            label.append(swatch, name);

            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'variable-toggle';
            toggle.textContent = variable.value ? 'ON' : 'OFF';
            toggle.setAttribute('aria-pressed', variable.value ? 'true' : 'false');

            card.append(label, toggle);
            this.variablesList.appendChild(card);
        });
    }

    handleVariableToggleClick(ev) {
        const button = ev.target.closest('.variable-toggle');
        if (!button) return;
        const card = button.closest('.variable-card');
        const variableId = card?.dataset?.variableId;
        if (!variableId) return;
        ev.preventDefault();
        const isActive = card.classList.contains('is-on');
        this.toggleVariableDefault(variableId, !isActive);
    }

    toggleVariableDefault(variableId, nextValue = null) {
        if (!variableId || !this.gameEngine.setVariableDefault) return;
        const current = (this.gameEngine.getVariableDefinitions?.() ?? []).find((entry) => entry.id === variableId);
        const targetValue = nextValue !== null ? Boolean(nextValue) : !Boolean(current?.value);
        const changed = this.gameEngine.setVariableDefault(variableId, targetValue);
        if (!changed) return;
        this.renderVariables();
        this.renderObjects();
        this.updateNpcSelection();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    removeEnemy(enemyId) {
        if (this.placingEnemy) {
            this.toggleEnemyPlacement(true);
        }
        this.gameEngine.removeEnemy(enemyId);
        this.renderEnemies();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    setActiveRoom(index) {
        const target = Number(index);
        if (!Number.isFinite(target)) return;
        const clamped = Math.max(0, Math.min((this.gameEngine.getGame().rooms?.length || 1) - 1, Math.floor(target)));
        if (clamped === this.activeRoomIndex) return;
        if (this.placingNpc) {
            this.toggleNpcPlacement(true);
        }
        if (this.placingEnemy) {
            this.toggleEnemyPlacement(true);
        }
        this.activeRoomIndex = clamped;
        this.renderWorldGrid();
        this.renderObjects();
        this.renderEditor();
        this.renderEnemies();
    }

    renderWorldGrid() {
        if (!this.worldGrid) return;
        const game = this.gameEngine.getGame();
        const rows = game.world?.rows || 1;
        const cols = game.world?.cols || 1;
        const startIndex = game.start?.roomIndex ?? 0;
        const playerRoom = this.gameEngine.getState()?.player?.roomIndex ?? 0;
        const npcs = this.gameEngine.getSprites();
        const enemies = this.gameEngine.getEnemyDefinitions?.() ?? [];
        const objects = this.gameEngine.getObjects?.() ?? [];

        this.worldGrid.innerHTML = '';
        this.worldGrid.style.setProperty('--world-cols', cols);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'world-cell';
                if (index === this.activeRoomIndex) cell.classList.add('active');

                const label = document.createElement('span');
                label.className = 'world-cell-label';
                label.textContent = `${col + 1},${row + 1}`;
                cell.appendChild(label);

                const badges = document.createElement('div');
                badges.className = 'world-cell-badges';

                if (index === startIndex) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-start');
                    badge.textContent = 'Start';
                    badges.appendChild(badge);
                    cell.classList.add('start');
                }

                if (index === playerRoom) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-player');
                    badge.textContent = 'Player';
                    badges.appendChild(badge);
                    cell.classList.add('player');
                }

                if (npcs.some((npc) => npc.placed && npc.roomIndex === index)) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-npc');
                    badge.textContent = 'NPC';
                    badges.appendChild(badge);
                    cell.classList.add('has-npc');
                }

                if (enemies.some((enemy) => enemy.roomIndex === index)) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-enemy');
                    badge.textContent = 'Inimigo';
                    badges.appendChild(badge);
                    cell.classList.add('has-enemy');
                }

                const hasDoor = objects.some((object) => object.roomIndex === index && object.type === 'door');
                if (hasDoor) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-door');
                    badge.textContent = 'Porta';
                    badges.appendChild(badge);
                    cell.classList.add('has-door');
                }

                const hasVariableDoor = objects.some((object) => object.roomIndex === index && object.type === 'door-variable');
                if (hasVariableDoor) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-door-variable');
                    badge.textContent = 'Porta magica';
                    badges.appendChild(badge);
                    cell.classList.add('has-door-variable');
                }

                const hasKey = objects.some((object) => object.roomIndex === index && object.type === 'key');
                if (hasKey) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-key');
                    badge.textContent = 'Chave';
                    badges.appendChild(badge);
                    cell.classList.add('has-key');
                }

                if (badges.children.length) {
                    cell.appendChild(badges);
                }

                cell.title = `Mapa (${col + 1}, ${row + 1})`;
                cell.addEventListener('click', () => this.setActiveRoom(index));
                this.worldGrid.appendChild(cell);
            }
        }
    }

    addNPC() {
        this.gameEngine.npcManager?.ensureDefaultNPCs?.();
        const sprites = this.gameEngine.getSprites();
        const definitions = this.gameEngine.npcManager?.getDefinitions?.() ?? [];
        const available = definitions.map((def) => ({
            def,
            npc: sprites.find((entry) => entry.type === def.type) || null
        })).find((entry) => !entry.npc?.placed);

        if (!available) {
            alert('Todos os NPCs ja estao no mapa.');
            return;
        }

        if (!available.npc) {
            this.gameEngine.addSprite({ type: available.def.type, placed: false });
        }

        const npc = this.gameEngine.npcManager?.getNPCByType?.(available.def.type)
            || this.gameEngine.getSprites().find((entry) => entry.type === available.def.type)
            || null;

        this.selectedNpcType = available.def.type;
        this.selectedNpcId = npc?.id || null;
        this.renderNpcs();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    toggleNpcPlacement(skipRender = false) {
        const npc = this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (!npc) return;
        if (!skipRender && this.placingObjectType) {
            this.toggleObjectPlacement(null, true);
        }
        if (this.placingEnemy) {
            this.toggleEnemyPlacement(true);
        }
        if (this.placingNpc) {
            this.placingNpc = false;
            if (this.btnPlaceNpc) {
                const label = npc.placed ? 'Mover NPC no mapa' : 'Colocar NPC no mapa';
                this.btnPlaceNpc.textContent = label;
                this.btnPlaceNpc.classList.remove('placing');
            }
            if (!this.placingEnemy && this.editorCanvas) this.editorCanvas.style.cursor = 'default';
        } else if (this.selectedNpcId) {
            this.placingNpc = true;
            if (this.btnPlaceNpc) {
                this.btnPlaceNpc.textContent = 'Cancelar colocacao';
                this.btnPlaceNpc.classList.add('placing');
            }
            if (this.editorCanvas) this.editorCanvas.style.cursor = 'crosshair';
        }
        if (!skipRender) this.renderEditor();
    }

    toggleEnemyPlacement(forceOff = false) {
        const nextState = forceOff ? false : !this.placingEnemy;
        if (!forceOff && this.placingObjectType) {
            this.toggleObjectPlacement(null, true);
        }
        this.placingEnemy = nextState;
        if (this.placingEnemy) {
            this.placingNpc = false;
            if (this.btnPlaceNpc) {
                this.btnPlaceNpc.textContent = 'Colocar NPC no mapa';
                this.btnPlaceNpc.classList.remove('placing');
            }
            if (this.btnPlaceEnemy) {
                this.btnPlaceEnemy.textContent = 'Cancelar colocacao';
                this.btnPlaceEnemy.classList.add('placing');
            }
            if (this.editorCanvas) {
                this.editorCanvas.style.cursor = 'crosshair';
            }
        } else {
            if (this.btnPlaceEnemy) {
                this.btnPlaceEnemy.textContent = 'Colocar caveira';
                this.btnPlaceEnemy.classList.remove('placing');
            }
            if (!this.placingNpc && this.editorCanvas) {
                this.editorCanvas.style.cursor = 'default';
            }
        }
    }

    removeSelectedNpc() {
        if (!this.selectedNpcId) return;
        const removed = this.gameEngine.npcManager?.removeNPC?.(this.selectedNpcId);
        if (!removed) return;
        this.placingNpc = false;
        if (this.btnPlaceNpc) {
            this.btnPlaceNpc.textContent = 'Colocar NPC no mapa';
            this.btnPlaceNpc.classList.remove('placing');
            const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.selectedNpcId);
            this.btnPlaceNpc.disabled = !npc;
        }
        this.renderNpcs();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    updateNpcSelection() {
        if (this.npcsList) {
            this.npcsList.querySelectorAll('.npc-card').forEach((card) => {
                card.classList.toggle('selected', card.dataset.type === this.selectedNpcType);
            });
        }

        const npc = this.gameEngine.getSprites().find((s) => s.type === this.selectedNpcType) || null;
        this.selectedNpcId = npc?.id || null;
        const hasNpc = Boolean(npc);

        if (this.npcText) {
            this.npcText.disabled = !hasNpc;
            this.npcText.value = npc?.text || '';
        }

        this.suppressNpcFormUpdates = true;
        if (this.npcConditionalText) {
            this.npcConditionalText.disabled = !hasNpc;
            this.npcConditionalText.value = npc?.conditionText || '';
        }
        this.populateVariableSelect(this.npcConditionalVariable, npc?.conditionVariableId || '');
        if (this.npcConditionalVariable) {
            this.npcConditionalVariable.disabled = !hasNpc;
        }
        this.populateVariableSelect(this.npcRewardVariable, npc?.rewardVariableId || '');
        if (this.npcRewardVariable) {
            this.npcRewardVariable.disabled = !hasNpc;
        }
        this.suppressNpcFormUpdates = false;

        if (this.btnPlaceNpc) {
            if (!hasNpc) {
                this.btnPlaceNpc.disabled = true;
                this.btnPlaceNpc.textContent = 'Colocar NPC no mapa';
                this.btnPlaceNpc.classList.remove('placing');
            } else {
                this.btnPlaceNpc.disabled = false;
                if (!this.placingNpc) {
                    this.btnPlaceNpc.textContent = npc.placed ? 'Mover NPC no mapa' : 'Colocar NPC no mapa';
                    this.btnPlaceNpc.classList.remove('placing');
                }
            }
        }

        if (this.btnNpcDelete) {
            this.btnNpcDelete.disabled = !hasNpc || !npc.placed;
        }

        if (!hasNpc) {
            this.placingNpc = false;
            if (this.editorCanvas) this.editorCanvas.style.cursor = 'default';
        }
    }

    populateVariableSelect(selectElement, selectedId = '') {
        if (!selectElement) return;
        const variables = this.gameEngine.getVariableDefinitions?.() ?? [];
        const target = typeof selectedId === 'string' ? selectedId : '';

        const fragment = document.createDocumentFragment();
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Nenhuma';
        fragment.appendChild(emptyOption);

        variables.forEach((variable) => {
            const option = document.createElement('option');
            option.value = variable.id;
            option.textContent = variable.name || variable.id;
            fragment.appendChild(option);
        });

        selectElement.innerHTML = '';
        selectElement.appendChild(fragment);

        const hasTarget = variables.some((variable) => variable.id === target);
        selectElement.value = hasTarget ? target : '';
    }

    updateNpcText() {
        if (!this.selectedNpcId || !this.npcText || this.suppressNpcFormUpdates) return;
        const npc = this.gameEngine.npcManager?.getNPC?.(this.selectedNpcId)
            || this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (!npc) return;
        const newText = this.npcText.value;
        if (npc.text === newText) return;
        this.gameEngine.npcManager?.updateNPC?.(npc.id, { text: newText });
        if (this.npcTextUpdateTimer) {
            clearTimeout(this.npcTextUpdateTimer);
        }
        this.npcTextUpdateTimer = setTimeout(() => {
            this.updateJSON();
            this.gameEngine.draw();
            this.pushHistory();
            this.npcTextUpdateTimer = null;
        }, 250);
    }

    updateNpcConditionalText() {
        if (!this.selectedNpcId || !this.npcConditionalText || this.suppressNpcFormUpdates) return;
        const npc = this.gameEngine.npcManager?.getNPC?.(this.selectedNpcId)
            || this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (!npc) return;
        const newText = this.npcConditionalText.value;
        const current = npc.conditionText || '';
        if (current === newText) return;
        this.gameEngine.npcManager?.updateNPC?.(npc.id, { conditionText: newText });
        if (this.npcTextUpdateTimer) {
            clearTimeout(this.npcTextUpdateTimer);
        }
        this.npcTextUpdateTimer = setTimeout(() => {
            this.updateJSON();
            this.gameEngine.draw();
            this.pushHistory();
            this.npcTextUpdateTimer = null;
        }, 250);
    }

    handleNpcConditionVariableChange() {
        if (!this.selectedNpcId || !this.npcConditionalVariable || this.suppressNpcFormUpdates) return;
        const npc = this.gameEngine.npcManager?.getNPC?.(this.selectedNpcId)
            || this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (!npc) return;
        const rawValue = this.npcConditionalVariable.value || '';
        const normalized = rawValue || null;
        const current = npc.conditionVariableId || null;
        if (current === normalized) return;
        this.gameEngine.npcManager?.updateNPC?.(npc.id, { conditionVariableId: normalized });
        this.updateNpcSelection();
        this.updateJSON();
        this.gameEngine.draw();
        this.pushHistory();
    }

    handleNpcRewardVariableChange() {
        if (!this.selectedNpcId || !this.npcRewardVariable || this.suppressNpcFormUpdates) return;
        const npc = this.gameEngine.npcManager?.getNPC?.(this.selectedNpcId)
            || this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (!npc) return;
        const rawValue = this.npcRewardVariable.value || '';
        const normalized = rawValue || null;
        const current = npc.rewardVariableId || null;
        if (current === normalized) return;
        this.gameEngine.npcManager?.updateNPC?.(npc.id, { rewardVariableId: normalized });
        this.updateNpcSelection();
        this.updateJSON();
        this.gameEngine.draw();
        this.pushHistory();
    }

    handleCanvasResize(force = false) {
        if (!this.editorCanvas) return;
        const rect = this.editorCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = window.devicePixelRatio || 1;
        const size = Math.max(8, Math.ceil(Math.max(rect.width, rect.height) * dpr / 8) * 8);
        if (this.editorCanvas.width !== size || this.editorCanvas.height !== size) {
            this.editorCanvas.width = this.editorCanvas.height = size;
            if (this.ectx) this.ectx.imageSmoothingEnabled = false;
            this.renderEditor();
        } else if (force) {
            this.renderEditor();
        }
    }

    handleKey(ev) {
        const key = ev.key.toLowerCase();
        if ((ev.ctrlKey || ev.metaKey) && key === 'z') {
            ev.preventDefault();
            this.undo();
        } else if ((ev.ctrlKey || ev.metaKey) && key === 'y') {
            ev.preventDefault();
            this.redo();
        } else if (key === 'escape' && this.placingNpc) {
            this.toggleNpcPlacement();
        } else if (key === 'escape' && this.placingEnemy) {
            this.toggleEnemyPlacement(true);
        }
    }

    createNewGame() {
        const emptyLayer = () => Array.from({ length: 8 }, () => Array(8).fill(null));
        const data = {
            title: 'Novo Jogo',
            palette: ['#0e0f13', '#2e3140', '#f4f4f8'],
            roomSize: 8,
            rooms: [{ size: 8, bg: 0, tiles: Array.from({ length: 8 }, () => Array(8).fill(0)), walls: Array.from({ length: 8 }, () => Array(8).fill(false)) }],
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            items: [],
            exits: [],
            tileset: {
                tiles: [],
                map: {
                    ground: emptyLayer(),
                    overlay: emptyLayer()
                }
            }
        };
        this.restore(data);
        this.pushHistory();
    }

    async generateShareableUrl() {
        try {
            const share = window.TinyRPGShare;
            if (!share?.buildShareUrl) {
                throw new Error('TinyRPGShare indisponivel');
            }
            const gameData = this.gameEngine.exportGameData();
            const url = share.buildShareUrl(gameData);
            try {
                window.history?.replaceState?.(null, '', url);
            } catch {
                // ignore history update issues
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                alert('URL do jogo copiada para a area de transferencia!');
            } else {
                prompt('Copie a URL do seu jogo:', url);
            }
        } catch (error) {
            console.error(error);
            alert('Nao foi possivel gerar a URL do jogo.');
        }
    }

    saveGame() {
        const blob = new Blob([JSON.stringify(this.gameEngine.exportGameData(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tiny-rpg-maker.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    loadGameFile(ev) {
        const file = ev.target?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                this.restore(data);
                this.pushHistory();
            } catch {
                alert('Nao foi possivel carregar o arquivo.');
            }
        };
        reader.readAsText(file);
        ev.target.value = '';
    }

    applyJSON() {
        if (!this.jsonArea) return;
        try {
            const data = JSON.parse(this.jsonArea.value);
            this.restore(data);
            this.pushHistory();
        } catch {
            alert('JSON invalido.');
        }
    }

    restore(data) {
        this.gameEngine.importGameData(data);
        this.gameEngine.tileManager.ensureDefaultTiles();
        const tiles = this.gameEngine.getTiles();
        if (tiles.length && !tiles.find((t) => t.id === this.selectedTileId)) {
            this.selectedTileId = tiles[0].id;
        }
        const npcs = this.gameEngine.getSprites();
        if (!npcs.find((npc) => npc.id === this.selectedNpcId)) {
            this.selectedNpcId = null;
            this.placingNpc = false;
        }
        this.syncUI();
        this.renderTileList();
        this.renderNpcs();
        this.renderObjects();
        this.renderEnemies();
        this.renderVariables();
        this.renderEditor();
        this.updateSelectedTilePreview();
        this.gameEngine.draw();
        this.updateJSON();
    }

    pushHistory() {
        const snapshot = JSON.stringify(this.gameEngine.exportGameData());
        if (this.history.stack[this.history.index] === snapshot) return;
        this.history.stack = this.history.stack.slice(0, this.history.index + 1);
        this.history.stack.push(snapshot);
        this.history.index = this.history.stack.length - 1;
    }

    undo() {
        if (this.history.index <= 0) return;
        this.history.index -= 1;
        this.restore(JSON.parse(this.history.stack[this.history.index]));
    }

    redo() {
        if (this.history.index >= this.history.stack.length - 1) return;
        this.history.index += 1;
        this.restore(JSON.parse(this.history.stack[this.history.index]));
    }

    updateGameTitle() {
        const game = this.gameEngine.getGame();
        game.title = this.titleInput?.value || 'Tiny RPG Maker';
        this.updateJSON();
    }

    updateJSON() {
        if (!this.jsonArea) return;
        this.jsonArea.value = JSON.stringify(this.gameEngine.exportGameData(), null, 2);
    }

    syncUI() {
        const game = this.gameEngine.getGame();
        if (this.titleInput) this.titleInput.value = game.title || '';
        this.updateJSON();
    }

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditorManager;
} else {
    window.EditorManager = EditorManager;
}
