class EditorRenderService {
    constructor(editorManager) {
        this.manager = editorManager;
        this.handleTileAnimationFrame = () => {
            this.renderEditor();
            this.updateSelectedTilePreview();
        };
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('tile-animation-frame', this.handleTileAnimationFrame);
        }
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
        const renderer = this.gameEngine.renderer;
        const enemySprites = renderer.enemySprites || {};
        for (const enemy of enemies) {
            const sprite = enemySprites[enemy.type] || renderer.enemySprite;
            if (!sprite) continue;
            renderer.drawSprite(
                ctx,
                sprite,
                enemy.x * tileSize,
                enemy.y * tileSize,
                step
            );
        }
    }

    drawTile(ctx, tileId, px, py, size) {
        const tileManager = this.manager.gameEngine.tileManager;
        const tile = tileManager.getTile(tileId);
        if (!tile) return;
        const pixels = tileManager.getTilePixels(tile);
        if (!Array.isArray(pixels)) return;
        const step = Math.max(1, Math.floor(size / 8));
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = pixels[y]?.[x];
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

        const orderedTiles = [];
        categories.forEach((category) => {
            const categoryTiles = groups.get(category) || [];
            categoryTiles.forEach((tile) => orderedTiles.push(tile));
        });

        tileList.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'tile-grid';

        orderedTiles.forEach((tile) => {
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

        tileList.appendChild(grid);
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
        const {
            npcText,
            npcConditionalText,
            npcConditionalVariable,
            npcRewardVariable,
            npcConditionalRewardVariable,
            btnToggleNpcConditional,
            npcConditionalSection
        } = this.dom;
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

        const btnNpcDelete = this.dom.btnNpcDelete;
        if (btnNpcDelete) {
            btnNpcDelete.disabled = !hasNpc || !npc?.placed;
        }

        const expanded = Boolean(this.manager.state.conditionalDialogueExpanded);
        if (npcConditionalSection) {
            npcConditionalSection.hidden = !expanded;
        }
        if (btnToggleNpcConditional) {
            btnToggleNpcConditional.textContent = expanded
                ? 'Ocultar dialogo alternativo'
                : 'Criar dialogo alternativo';
            btnToggleNpcConditional.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
    }

    renderEnemies() {
        const list = this.dom.enemiesList;
        if (!list) return;
        list.innerHTML = '';

        const activeRoom = this.state.activeRoomIndex;
        const enemies = this.gameEngine
            .getActiveEnemies()
            .filter((enemy) => enemy.roomIndex === activeRoom);
        if (!enemies.length) return;

        const definitions = EditorConstants.ENEMY_DEFINITIONS;
        const definitionMap = new Map();
        definitions.forEach((entry) => {
            definitionMap.set(entry.type, entry);
            if (Array.isArray(entry.aliases)) {
                entry.aliases.forEach((alias) => definitionMap.set(alias, entry));
            }
        });

        enemies.forEach((enemy) => {
            const definition = definitionMap.get(enemy.type);
            const item = document.createElement('div');
            item.className = 'enemy-item';

            const label = document.createElement('span');
            const displayName = this.getEnemyDisplayName(definition, enemy.type);
            const damageInfo = Number.isFinite(definition?.damage)
                ? ` - Dano: ${definition.damage}`
                : '';
            label.textContent = `${displayName} @ (${enemy.x}, ${enemy.y})${damageInfo}`;

            const variableWrapper = document.createElement('label');
            variableWrapper.className = 'enemy-variable-wrapper';
            variableWrapper.textContent = 'Variável: ';

            const variableSelect = document.createElement('select');
            variableSelect.className = 'enemy-variable-select';
            variableSelect.dataset.enemyVariable = enemy.id;
            this.manager.npcService.populateVariableSelect(
                variableSelect,
                enemy.defeatVariableId || ''
            );
            variableWrapper.appendChild(variableSelect);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'enemy-remove';
            removeBtn.dataset.removeEnemy = enemy.id;
            removeBtn.textContent = 'Remover';

            const controls = document.createElement('div');
            controls.className = 'enemy-controls';
            controls.append(variableWrapper, removeBtn);

            item.append(label, controls);
            list.appendChild(item);
        });
    }

    renderEnemyCatalog() {
        const container = this.dom.enemyTypes;
        if (!container) return;
        container.innerHTML = '';

        const definitions = EditorConstants.ENEMY_DEFINITIONS;
        if (!definitions.length) return;

        const selectedType = this.manager.selectedEnemyType;

        definitions.forEach((definition) => {
            const card = document.createElement('div');
            card.className = 'enemy-card';
            card.dataset.type = definition.type;
            if (definition.type === selectedType) {
                card.classList.add('selected');
            }

            const preview = document.createElement('canvas');
            preview.className = 'enemy-preview';
            preview.width = 48;
            preview.height = 48;
            this.drawEnemyPreview(preview, definition);

            const meta = document.createElement('div');
            meta.className = 'enemy-meta';

            const name = document.createElement('div');
            name.className = 'enemy-name';
            name.textContent = this.getEnemyDisplayName(definition, definition.type);

            const damage = document.createElement('div');
            damage.className = 'enemy-damage';
            const damageValue = Number.isFinite(definition.damage) ? definition.damage : '?';
            damage.textContent = `Dano: ${damageValue}`;

            meta.append(name, damage);
            card.append(preview, meta);
            container.appendChild(card);
        });
    }

    renderObjectCatalog() {
        const container = this.dom.objectTypes;
        if (!container) return;
        container.innerHTML = '';

        const definitions = EditorConstants.OBJECT_DEFINITIONS;
        if (!Array.isArray(definitions) || !definitions.length) return;

        const selectedType = this.manager.selectedObjectType;
        const placedObjects = this.gameEngine.getObjectsForRoom(this.state.activeRoomIndex) || [];
        const placedTypes = new Set(placedObjects.map((object) => object.type));

        definitions.forEach((definition) => {
            const card = document.createElement('div');
            card.className = 'object-type-card';
            card.dataset.type = definition.type;
            if (definition.type === selectedType) {
                card.classList.add('selected');
            }
            if (placedTypes.has(definition.type)) {
                card.classList.add('placed');
            }

            const preview = document.createElement('canvas');
            preview.width = 48;
            preview.height = 48;
            preview.className = 'object-type-preview';
            this.drawObjectPreview(preview, definition.type);

            const meta = document.createElement('div');
            meta.className = 'object-type-meta';

            const name = document.createElement('div');
            name.className = 'object-type-name';
            name.textContent = definition.name || definition.type;

            const info = document.createElement('div');
            info.className = 'object-type-info';
            info.textContent = placedTypes.has(definition.type)
                ? 'Ja no mapa (1 por cenario)'
                : 'Disponivel (1 por cenario)';

            meta.append(name, info);
            card.append(preview, meta);
            container.appendChild(card);
        });
    }

    drawEnemyPreview(canvas, definition) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;

        const renderer = this.gameEngine.renderer;
        let sprite = renderer?.enemySprites?.[definition.type] ?? null;
        if (!sprite && renderer?.enemySprite) {
            sprite = renderer.enemySprite;
        }

        if (!sprite && Array.isArray(definition.sprite) && renderer?.spriteFactory?.mapPixels) {
            const palette = renderer.paletteManager?.getPicoPalette?.() || RendererConstants.DEFAULT_PALETTE;
            sprite = renderer.spriteFactory.mapPixels(definition.sprite, palette);
        }

        if (!Array.isArray(sprite)) return;
        const step = canvas.width / 8;
        for (let y = 0; y < sprite.length; y++) {
            const row = sprite[y];
            if (!Array.isArray(row)) continue;
            for (let x = 0; x < row.length; x++) {
                const color = row[x];
                if (!color) continue;
                ctx.fillStyle = color;
                ctx.fillRect(x * step, y * step, step, step);
            }
        }
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

            const preview = document.createElement('canvas');
            preview.className = 'object-preview';
            preview.width = 48;
            preview.height = 48;
            this.drawObjectPreview(preview, object.type);

            const body = document.createElement('div');
            body.className = 'object-body';

            const header = document.createElement('div');
            header.className = 'object-header';

            const title = document.createElement('h4');
            title.className = 'object-name';
            title.textContent = this.getObjectLabel(object.type, definitions);
            header.appendChild(title);

            const position = document.createElement('span');
            position.className = 'object-position';
            position.textContent = `(${object.x}, ${object.y})`;
            header.appendChild(position);

            body.appendChild(header);

            if (object.type === 'door-variable') {
                const config = document.createElement('div');
                config.className = 'object-config';

                const label = document.createElement('label');
                label.className = 'object-config-label';

                const select = document.createElement('select');
                select.className = 'object-config-select';
                this.manager.npcService.populateVariableSelect(select, object.variableId || '');
                select.addEventListener('change', () => {
                    this.gameEngine.setObjectVariable('door-variable', object.roomIndex, select.value);
                    this.renderObjects();
                    this.renderWorldGrid();
                    this.manager.updateJSON();
                    this.manager.history.pushCurrentState();
                });
                label.append('Variavel associada: ', select);
                config.appendChild(label);

                const status = document.createElement('div');
                status.className = 'object-status';
                const valueId = select.value || object.variableId;
                const isOn = Boolean(runtimeMap.get(valueId || ''));
                status.classList.toggle('is-on', isOn);
                status.textContent = `Estado atual: ${isOn ? 'ON' : 'OFF'}`;
                config.appendChild(status);
                body.appendChild(config);
            }

            if (object.type === 'door' && object.opened) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Porta aberta';
                body.appendChild(badge);
            }

            if (object.type === 'key' && object.collected) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Chave coletada';
                body.appendChild(badge);
            }

            if (object.type === 'life-potion' && object.collected) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Pocao coletada';
                body.appendChild(badge);
            }

            if (object.type === 'xp-scroll' && object.collected) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Pergaminho usado';
                body.appendChild(badge);
            }

            if (object.type === 'sword' && object.collected) {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Espada quebrada';
                body.appendChild(badge);
            }

            if (object.type !== 'player-start') {
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'object-remove';
                removeBtn.dataset.type = object.type;
                removeBtn.dataset.roomIndex = String(object.roomIndex);
                removeBtn.textContent = 'Remover';
                body.appendChild(removeBtn);
            } else {
                const badge = document.createElement('div');
                badge.className = 'object-status';
                badge.textContent = 'Marcador inicial';
                body.appendChild(badge);
            }

            card.append(preview, body);
            container.appendChild(card);
        });
    }

    getObjectLabel(type, definitions) {
        const def = definitions.find((entry) => entry.type === type);
        if (def?.name) return def.name;
        if (type === 'door') return 'Porta';
        if (type === 'door-variable') return 'Porta magica';
        if (type === 'key') return 'Chave';
        if (type === 'life-potion') return 'Pocao de Vida';
        if (type === 'sword') return 'Espada';
        if (type === 'xp-scroll') return 'Pergaminho de XP';
        return type;
    }

    drawObjectPreview(canvas, type) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderer = this.gameEngine.renderer;
        if (!renderer?.drawObjectSprite) return;
        const step = canvas.width / 8;
        renderer.drawObjectSprite(ctx, type, 0, 0, step);
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

    getEnemyDisplayName(definition, fallback = '') {
        const raw = definition?.name || fallback || '';
        if (!raw) return 'Inimigo';
        const cleaned = raw
            .replace(/[^\w\s\u00C0-\u024F'()-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return cleaned || fallback || 'Inimigo';
    }
}

if (typeof window !== 'undefined') {
    window.EditorRenderService = EditorRenderService;
}
