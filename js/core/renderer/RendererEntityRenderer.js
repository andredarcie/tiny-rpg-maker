class RendererEntityRenderer {
    constructor(gameState, tileManager, spriteFactory, canvasHelper, paletteManager) {
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.spriteFactory = spriteFactory;
        this.canvasHelper = canvasHelper;
        this.paletteManager = paletteManager;
        this.enemyLabelCache = new Map();
        this.enemyLabelNodes = new Map();
        this.enemyLabelRoot = null;
        this.healthIconDefinitions = {}
        this.setupHealthIcons();
        this.setupEditorModeWatcher();
    }

    drawObjects(ctx) {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        const objects = Array.isArray(game.objects) ? game.objects : [];
        const objectSprites = this.spriteFactory.getObjectSprites();

        for (const object of objects) {
            if (object.roomIndex !== player.roomIndex) continue;
            if (object.type === 'key' && object.collected) continue;
            if (object.type === 'life-potion' && object.collected) continue;
            if (object.type === 'xp-scroll' && object.collected) continue;
            if (object.type === 'sword' && object.collected) continue;
            if (object.type === 'door' && object.opened) continue;
            if (object.type === 'door-variable') {
                const isOpen = object.variableId
                    ? this.gameState.isVariableOn?.(object.variableId)
                    : false;
                if (isOpen) continue;
            }
            const sprite = objectSprites?.[object.type];
            if (!sprite) continue;
            const px = object.x * tileSize;
            const py = object.y * tileSize;
            this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
        }
    }

    drawItems(ctx) {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();

        ctx.fillStyle = this.paletteManager.getColor(2);
        for (const item of game.items) {
            if (item.roomIndex !== player.roomIndex || item.collected) continue;
            ctx.fillRect(
                item.x * tileSize + tileSize * 0.25,
                item.y * tileSize + tileSize * 0.25,
                tileSize * 0.5,
                tileSize * 0.5
            );
        }
    }

    drawNPCs(ctx) {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        const npcSprites = this.spriteFactory.getNpcSprites();

        for (const npc of game.sprites) {
            if (!npc.placed) continue;
            if (npc.roomIndex !== player.roomIndex) continue;
            const px = npc.x * tileSize;
            const py = npc.y * tileSize;
            let sprite = npcSprites[npc.type] || npcSprites.default;
            sprite = this.adjustSpriteHorizontally(player.x, npc.x, sprite);
            this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
        }
    }

    drawEnemies(ctx) {
        const enemies = this.gameState.getEnemies?.() ?? [];
        const canvas = this.canvasHelper?.canvas || null;
        const rect = canvas?.getBoundingClientRect?.();
        const isEditor = typeof document !== 'undefined' && document.body?.classList?.contains?.('editor-mode');
        if (!enemies.length || !rect || !rect.width || !rect.height || isEditor || typeof document === 'undefined') {
            this.cleanupEnemyLabels(new Set());
            return;
        }
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        let scaleX = 1;
        let scaleY = 1;
        const root = this.ensureEnemyLabelRoot();
        if (!root) {
            this.cleanupEnemyLabels(new Set());
            return;
        }
        scaleX = rect.width / canvas.width;
        scaleY = rect.height / canvas.height;
        const activeLabels = new Set();
        enemies.forEach((enemy) => {
            if (enemy.roomIndex !== player.roomIndex) return;
            const baseSprite = this.spriteFactory.getEnemySprite(enemy.type);
            if (!baseSprite) return;
            const sprite = this.adjustSpriteHorizontally(enemy.x, enemy.lastX, baseSprite);
            const px = enemy.x * tileSize;
            const py = enemy.y * tileSize;
            this.canvasHelper.drawSprite(ctx, sprite, px, py, step);

            const damage = this.getEnemyDamage(enemy.type);
            const label = this.getOrCreateEnemyLabelElement(enemy, damage);
            if (label) {
                const screenX = rect.left + (px + tileSize / 2) * scaleX;
                const screenY = rect.top + (py - tileSize * 0.2) * scaleY;
                this.positionEnemyLabel(label, screenX, screenY);
                activeLabels.add(this.getEnemyLabelKey(enemy));
            }
        });
        this.cleanupEnemyLabels(activeLabels);
    }

    drawPlayer(ctx) {
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        const px = player.x * tileSize;
        const py = player.y * tileSize;
        let sprite = this.spriteFactory.getPlayerSprite()
        sprite = this.adjustSpriteHorizontally(player.x, player.lastX, sprite);
        this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
    }

    drawHealth(ctx) {
        const currentLives = this.gameState.getLives();
        const maxLives = this.gameState.getMaxLives();

        let tileSize = this.canvasHelper.getTilePixelSize();
        tileSize = tileSize / 2;
        const step = tileSize / 8;
        let livesBreakLine = 5;

        for (let i=0; i < maxLives; i++) {
            let sprite = this.healthIconDefinitions.full;
            if (i >= currentLives) {
                sprite = this.healthIconDefinitions.empty;
            }
            const yStep = Math.floor(i/livesBreakLine);
            const px = (i-livesBreakLine*yStep) * tileSize;
            const py = yStep * tileSize;
            this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
        }
    }

    drawTileIconOnPlayer(ctx, tileId) {
        const objectSprites = this.spriteFactory.getObjectSprites();
        let tileSprite = objectSprites?.[tileId];
        if (!tileSprite) return;

        const player = this.gameState.getPlayer();
        let tileSize = this.canvasHelper.getTilePixelSize();
        tileSize = tileSize / 2;
        const step = tileSize / 8;
        const px = (player.x+0.2) * tileSize * 2;
        const py = (player.y-1) * tileSize * 2;
        this.canvasHelper.drawSprite(ctx, tileSprite, px, py, step);
    }

    adjustSpriteHorizontally(targetX, baseX, sprite) {
        if (targetX < baseX) {
            return this.spriteFactory.turnSpriteHorizontally(sprite);
        }
        return sprite;
    }

    getEnemyDamage(type) {
        if (typeof EnemyDefinitions?.getEnemyDefinition === 'function') {
            const def = EnemyDefinitions.getEnemyDefinition(type);
            if (def && Number.isFinite(def.damage)) {
                return Math.max(1, def.damage);
            }
        }
        if (typeof EnemyDefinitions?.normalizeType === 'function') {
            const normalized = EnemyDefinitions.normalizeType(type);
            const def = typeof EnemyDefinitions?.getEnemyDefinition === 'function'
                ? EnemyDefinitions.getEnemyDefinition(normalized)
                : null;
            if (def && Number.isFinite(def.damage)) {
                return Math.max(1, def.damage);
            }
        }
        return 1;
    }

    getEnemyLabelKey(enemy) {
        return enemy?.id || `${enemy?.type || 'enemy'}-${enemy?.roomIndex ?? 0}-${enemy?.x ?? 0}-${enemy?.y ?? 0}`;
    }

    ensureEnemyLabelRoot() {
        if (this.enemyLabelRoot && this.enemyLabelRoot.isConnected) {
            return this.enemyLabelRoot;
        }
        if (typeof document === 'undefined') return null;
        const root = document.createElement('div');
        root.className = 'enemy-label-layer';
        document.body.appendChild(root);
        this.enemyLabelRoot = root;
        return root;
    }

    getOrCreateEnemyLabelElement(enemy, damage) {
        const key = this.getEnemyLabelKey(enemy);
        if (!key) return null;
        const root = this.ensureEnemyLabelRoot();
        if (!root) return null;
        let record = this.enemyLabelNodes.get(key);
        const text = `Attack: ${damage}`;
        if (!record) {
            const element = document.createElement('div');
            element.className = 'enemy-damage-label';
            element.dataset.enemyId = key;
            element.textContent = text;
            root.appendChild(element);
            record = { element, text };
            this.enemyLabelNodes.set(key, record);
        } else if (record.text !== text) {
            record.element.textContent = text;
            record.text = text;
        }
        return record.element;
    }

    positionEnemyLabel(element, screenX, screenY) {
        if (!element) return;
        element.style.left = `${screenX}px`;
        element.style.top = `${screenY}px`;
    }

    cleanupEnemyLabels(activeKeys = new Set()) {
        if (!this.enemyLabelNodes) return;
        for (const [key, record] of Array.from(this.enemyLabelNodes.entries())) {
            if (!activeKeys.has(key)) {
                if (record.element?.parentNode) {
                    record.element.parentNode.removeChild(record.element);
                }
                this.enemyLabelNodes.delete(key);
            }
        }
        if (this.enemyLabelRoot && this.enemyLabelRoot.childElementCount === 0) {
            this.enemyLabelRoot.remove();
            this.enemyLabelRoot = null;
        }
    }

    setupEditorModeWatcher() {
        if (typeof document === 'undefined') return;
        const body = document.body;
        if (!body) return;
        const handleModeChange = () => {
            if (body.classList.contains('editor-mode')) {
                this.cleanupEnemyLabels(new Set());
            }
        };
        if (typeof MutationObserver === 'function') {
            this.editorModeObserver = new MutationObserver(() => handleModeChange());
            this.editorModeObserver.observe(body, { attributes: true, attributeFilter: ['class'] });
        }
        document.addEventListener?.('editor-tab-activated', handleModeChange);
        handleModeChange();
    }

    setupHealthIcons() {
        const white = this.paletteManager.getColor(7);
        const red = this.paletteManager.getColor(8);
        this.healthIconDefinitions = {
            full: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null,red,red, null,red,red, null ],
                [ null,red,red,red,red,red,white,red ],
                [ null,red,red,red,red,red,red,red ],
                [ null, null,red,red,red,red,red, null ],
                [ null, null, null,red,red,red, null, null ],
                [ null, null, null, null,red, null, null, null ]
            ],
            empty: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null,red,red, null,red,red, null ],
                [ null,red,null,null,red,null,null,red ],
                [ null,red,null,null,null,null,null,red ],
                [ null, null,red,null,null,null,red, null ],
                [ null, null, null,red,null,red, null, null ],
                [ null, null, null, null,red, null, null, null ]
            ]
        }
    }
}

if (typeof window !== 'undefined') {
    window.RendererEntityRenderer = RendererEntityRenderer;
}
