class EditorRenderService {
    constructor(editorManager) {
        this.manager = editorManager;
    }

    get dom() {
        return this.manager.domCache;
    }

    get gameEngine() {
        return this.manager.gameEngine;
    }

    get state() {
        return this.manager.state;
    }

    renderEditor() {
        const ctx = this.manager.ectx;
        const canvas = this.dom.editorCanvas;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const tileSize = Math.floor(canvas.width / 8);
        const roomIndex = this.state.activeRoomIndex;
        const tileMap = this.gameEngine.getTileMap(roomIndex);
        const ground = tileMap?.ground || [];
        const overlay = tileMap?.overlay || [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const groundId = ground[y]?.[x];
                if (groundId !== null && groundId !== undefined) {
                    this.drawTile(
                        ctx,
                        groundId,
                        x * tileSize,
                        y * tileSize,
                        tileSize
                    );
                } else {
                    ctx.fillStyle = '#141414';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlay[y]?.[x];
                if (overlayId !== null && overlayId !== undefined) {
                    this.drawTile(
                        ctx,
                        overlayId,
                        x * tileSize,
                        y * tileSize,
                        tileSize
                    );
                }
            }
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        for (let x = 0; x <= 8; x++) {
            ctx.beginPath();
            ctx.moveTo(x * tileSize, 0);
            ctx.lineTo(x * tileSize, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= 8; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * tileSize);
            ctx.lineTo(canvas.width, y * tileSize);
            ctx.stroke();
        }

        this.drawEntities(tileSize);
    }

    drawEntities(tileSize) {
        const ctx = this.manager.ectx;
        const roomIndex = this.state.activeRoomIndex;
        const step = tileSize / 8;

        const objects = this.gameEngine.getObjectsForRoom(roomIndex);
        for (const object of objects) {
            this.gameEngine.renderer.drawObjectSprite(
                ctx,
                object.type,
                object.x * tileSize,
                object.y * tileSize,
                step
            );
        }

        const npcs = this.gameEngine.getSprites().filter((npc) => npc.roomIndex === roomIndex && npc.placed);
        for (const npc of npcs) {
            const sprite = this.gameEngine.renderer.npcSprites[npc.type] ||
                this.gameEngine.renderer.npcSprites.default;
            this.gameEngine.renderer.drawSprite(
                ctx,
                sprite,
                npc.x * tileSize,
                npc.y * tileSize,
                step
            );
        }

        const enemies = this.gameEngine.getActiveEnemies().filter((enemy) => enemy.roomIndex === roomIndex);
        const enemySprite = this.gameEngine.renderer.enemySprite;
        for (const enemy of enemies) {
            this.gameEngine.renderer.drawSprite(
                ctx,
                enemySprite,
                enemy.x * tileSize,
                enemy.y * tileSize,
                step
            );
        }
    }

    drawTile(ctx, tileId, px, py, size) {
        const tile = this.manager.gameEngine.tileManager.getTile(tileId);
        if (!tile || !Array.isArray(tile.pixels)) return;
        const step = Math.max(1, Math.floor(size / 8));
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y]?.[x];
                if (!col || col === 'transparent') continue;
                ctx.fillStyle = col;
                ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    renderTileList() {
        const tileList = this.dom.tileList;
        if (!tileList) return;

        const tiles = this.gameEngine.getTiles();
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

        tileList.innerHTML = '';
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
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'tile-card';
            card.dataset.tileId = String(tile.id);
            if (tile.id === this.manager.selectedTileId) {
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

            card.appendChild(preview);
            grid.appendChild(card);
        });

        wrapper.appendChild(grid);
        tileList.appendChild(wrapper);
        });
    }

    renderNpcs() {
        const list = this.dom.npcsList;
        if (!list) return;

        this.gameEngine.npcManager?.ensureDefaultNPCs?.();
        const game = this.gameEngine.getGame();
        const definitions = this.gameEngine.npcManager?.getDefinitions?.() ?? [];
        const npcs = this.gameEngine.getSprites();

        list.innerHTML = '';
        definitions.forEach((def) => {
            const npc = npcs.find((entry) => entry.type === def.type) || null;
            const card = document.createElement('div');
            card.className = 'npc-card';
            card.dataset.type = def.type;
            card.dataset.id = npc?.id || '';
            if (def.type === this.manager.selectedNpcType) {
                card.classList.add('selected');
            }
            if (npc?.placed) {
                card.classList.add('npc-card-placed');
            } else {
                card.classList.add('npc-card-available');
            }

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
            } else {
                pos.textContent = 'Disponivel';
            }

            meta.append(name, pos);
            card.append(preview, meta);
            list.appendChild(card);
        });

        this.updateNpcForm();
    }

    drawNpcPreview(canvas, definition) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;

        const npcSprites = this.gameEngine.renderer.npcSprites;
        const sprite = npcSprites[definition.type] || npcSprites.default;
        const step = canvas.width / 8;

        for (let y = 0; y < sprite.length; y++) {
            for (let x = 0; x < sprite[y].length; x++) {
                const col = sprite[y][x];
                if (!col) continue;
                ctx.fillStyle = col;
                ctx.fillRect(x * step, y * step, step, step);
            }
        }
    }

    updateNpcForm() {
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.manager.selectedNpcId);
        const { npcText, npcConditionalText, npcConditionalVariable, npcRewardVariable, npcConditionalRewardVariable } = this.dom;
        const hasNpc = Boolean(npc);

        if (npcText) {
            npcText.disabled = !hasNpc;
            npcText.value = npc?.text || '';
        }

        if (npcConditionalText) {
            npcConditionalText.disabled = !hasNpc;
            npcConditionalText.value = npc?.conditionText || '';
        }

        this.manager.npcService.populateVariableSelect(npcConditionalVariable, npc?.conditionVariableId || '');
        this.manager.npcService.populateVariableSelect(npcRewardVariable, npc?.rewardVariableId || '');
        this.manager.npcService.populateVariableSelect(npcConditionalRewardVariable, npc?.conditionalRewardVariableId || '');

        if (npcConditionalVariable) npcConditionalVariable.disabled = !hasNpc;
        if (npcRewardVariable) npcRewardVariable.disabled = !hasNpc;
        if (npcConditionalRewardVariable) npcConditionalRewardVariable.disabled = !hasNpc;

        const btnPlaceNpc = this.dom.btnPlaceNpc;
        if (btnPlaceNpc) {
            if (!hasNpc) {
                btnPlaceNpc.disabled = true;
                btnPlaceNpc.textContent = 'Colocar NPC no mapa';
                btnPlaceNpc.classList.remove('placing');
            } else {
                btnPlaceNpc.disabled = false;
                if (!this.manager.placingNpc) {
                    btnPlaceNpc.textContent = npc.placed ? 'Mover NPC no mapa' : 'Colocar NPC no mapa';
                    btnPlaceNpc.classList.remove('placing');
                }
            }
        }

        const btnNpcDelete = this.dom.btnNpcDelete;
        if (btnNpcDelete) {
            btnNpcDelete.disabled = !hasNpc || !npc?.placed;
        }
    }

    renderEnemies() {
        const list = this.dom.enemiesList;
        if (!list) return;
        list.innerHTML = '';

        const enemies = this.gameEngine.getActiveEnemies().filter((enemy) => enemy.roomIndex === this.state.activeRoomIndex);
        enemies.forEach((enemy) => {
            const item = document.createElement('li');
            item.className = 'enemy-item';

            const label = document.createElement('span');
            label.textContent = `${enemy.type || 'skull'} @ (${enemy.x}, ${enemy.y})`;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'enemy-remove';
            removeBtn.dataset.removeEnemy = enemy.id;
            removeBtn.textContent = 'Remover';

            item.append(label, removeBtn);
            list.appendChild(item);
        });
    }

    renderObjects() {
        const container = this.dom.objectsList;
        if (!container) return;
        container.innerHTML = '';

        const objects = this.gameEngine.getObjectsForRoom(this.state.activeRoomIndex);
        const runtimeVariables = this.gameEngine.getRuntimeVariables?.() ?? [];
        const runtimeMap = new Map(runtimeVariables.map((entry) => [entry.id, entry.value]));
        const definitions = EditorConstants.OBJECT_DEFINITIONS;

        objects.forEach((object) => {
            const card = document.createElement('div');
            card.className = 'object-card';
            card.dataset.type = object.type;
            card.dataset.roomIndex = String(object.roomIndex);

            const header = document.createElement('div');
            header.className = 'object-header';

            const title = document.createElement('h4');
            title.textContent = this.getObjectLabel(object.type, definitions);
            header.appendChild(title);

            const position = document.createElement('span');
            position.className = 'object-position';
            position.textContent = `(${object.x}, ${object.y})`;
            header.appendChild(position);

            card.appendChild(header);

            if (object.type === 'door-variable') {
                const label = document.createElement('label');
                label.textContent = 'Variavel associada:';

                const select = document.createElement('select');
                this.manager.npcService.populateVariableSelect(select, object.variableId || '');
                select.addEventListener('change', () => {
                    this.gameEngine.setObjectVariable('door-variable', object.roomIndex, select.value);
                    this.renderObjects();
                    this.renderWorldGrid();
                    this.manager.updateJSON();
                    this.manager.history.pushCurrentState();
                });
                label.appendChild(select);
                card.appendChild(label);

                const status = document.createElement('div');
                status.className = 'object-status';
                const valueId = select.value || object.variableId;
                const isOn = Boolean(runtimeMap.get(valueId || ''));
                status.classList.toggle('is-on', isOn);
                status.textContent = `Estado atual: ${isOn ? 'ON' : 'OFF'}`;
                card.appendChild(status);
            }

            if (object.type === 'door' && object.opened) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Porta aberta';
                card.appendChild(badge);
            }

            if (object.type === 'key' && object.collected) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Chave coletada';
                card.appendChild(badge);
            }

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'object-remove';
            removeBtn.dataset.type = object.type;
            removeBtn.dataset.roomIndex = String(object.roomIndex);
            removeBtn.textContent = 'Remover';
            card.appendChild(removeBtn);

            container.appendChild(card);
        });

        this.manager.objectService.updatePlacementButtons();
    }

    getObjectLabel(type, definitions) {
        const def = definitions.find((entry) => entry.type === type);
        if (def?.name) return def.name;
        if (type === 'door') return 'Porta';
        if (type === 'door-variable') return 'Porta magica';
        if (type === 'key') return 'Chave';
        return type;
    }

    renderVariables() {
        const container = this.dom.variablesList;
        if (!container) return;
        container.innerHTML = '';

        const variables = this.gameEngine.getVariableDefinitions?.() ?? [];
        const runtimeValues = this.gameEngine.getRuntimeVariables?.() ?? [];
        const runtimeMap = new Map(runtimeValues.map((entry) => [entry.id, entry.value]));

        variables.forEach((variable) => {
            const card = document.createElement('div');
            card.className = 'variable-card';
            card.dataset.variableId = variable.id;
            const isOn = Boolean(runtimeMap.get(variable.id) ?? variable.value);
            if (isOn) {
                card.classList.add('is-on');
            }

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
            toggle.textContent = isOn ? 'ON' : 'OFF';
            toggle.setAttribute('aria-pressed', isOn ? 'true' : 'false');

            card.append(label, toggle);
            container.appendChild(card);
        });
    }

    renderWorldGrid() {
        const grid = this.dom.worldGrid;
        if (!grid) return;

        const game = this.gameEngine.getGame();
        const rows = game.world?.rows || 1;
        const cols = game.world?.cols || 1;
        const startIndex = game.start?.roomIndex ?? 0;
        const playerRoom = this.gameEngine.getState()?.player?.roomIndex ?? 0;
        const npcs = this.gameEngine.getSprites();
        const enemies = this.gameEngine.getEnemyDefinitions?.() ?? [];
        const objects = this.gameEngine.getObjects?.() ?? [];

        grid.innerHTML = '';
        grid.style.setProperty('--world-cols', cols);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'world-cell';
                cell.dataset.roomIndex = String(index);
                if (index === this.state.activeRoomIndex) {
                    cell.classList.add('active');
                }

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

                if (objects.some((object) => object.roomIndex === index && object.type === 'door')) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-door');
                    badge.textContent = 'Porta';
                    badges.appendChild(badge);
                    cell.classList.add('has-door');
                }

                if (objects.some((object) => object.roomIndex === index && object.type === 'door-variable')) {
                    const badge = document.createElement('span');
                    badge.classList.add('world-cell-badge', 'badge-door-variable');
                    badge.textContent = 'Porta magica';
                    badges.appendChild(badge);
                    cell.classList.add('has-door-variable');
                }

                if (objects.some((object) => object.roomIndex === index && object.type === 'key')) {
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
                grid.appendChild(cell);
            }
        }
    }

    updateSelectedTilePreview() {
        const preview = this.dom.selectedTilePreview;
        const tile = this.gameEngine.getTiles().find((entry) => entry.id === this.manager.selectedTileId);
        if (!preview || !tile) return;
        this.gameEngine.renderer.drawTileOnCanvas(preview, tile);
        if (this.dom.tileSummary) {
            this.dom.tileSummary.textContent = tile.name || `Tile ${tile.id}`;
        }
    }
}

if (typeof window !== 'undefined') {
    window.EditorRenderService = EditorRenderService;
}
