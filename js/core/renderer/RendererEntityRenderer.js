class RendererEntityRenderer {
    constructor(gameState, tileManager, spriteFactory, canvasHelper, paletteManager) {
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.spriteFactory = spriteFactory;
        this.canvasHelper = canvasHelper;
        this.paletteManager = paletteManager;
    }

    setViewportOffset(offsetY = 0) {
        this.viewportOffsetY = Number.isFinite(offsetY) ? Math.max(0, offsetY) : 0;
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
            if (object.type === 'player-start') continue;
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
            let sprite = objectSprites?.[object.type];
            if (object.type === 'switch' && object.on) {
                sprite = objectSprites?.[`${object.type}--on`] || sprite;
            }
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
        if (!enemies.length) return;
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        enemies.forEach((enemy) => {
            if (enemy.roomIndex !== player.roomIndex) return;
            const baseSprite = this.spriteFactory.getEnemySprite(enemy.type);
            if (!baseSprite) return;
            const sprite = this.adjustSpriteHorizontally(enemy.x, enemy.lastX, baseSprite);
            const px = enemy.x * tileSize;
            const py = enemy.y * tileSize;
            this.canvasHelper.drawSprite(ctx, sprite, px, py, step);

            const damage = this.getEnemyDamage(enemy.type);
            this.drawEnemyDamageMarkers(ctx, px, py, tileSize, damage);
        });
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

    drawEnemyDamageMarkers(ctx, px, py, tileSize, damage) {
        if (!ctx) return;
        const markers = Math.max(1, Math.floor(damage));
        const size = Math.max(2, Math.floor(tileSize / 8));
        const gap = Math.max(1, Math.floor(size / 2));
        const totalWidth = markers * size + (markers - 1) * gap;
        const startX = Math.round(px + tileSize / 2 - totalWidth / 2);
        const startY = Math.round(py - size - gap);
        const fill = '#000000';
        const stroke = this.paletteManager.getColor(6) || '#5F574F';
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        for (let i = 0; i < markers; i++) {
            const mx = startX + i * (size + gap);
            ctx.fillRect(mx, startY, size, size);
            ctx.strokeRect(mx + 0.5, startY + 0.5, size - 1, size - 1);
        }
    }

    cleanupEnemyLabels() {
        // Legacy no-op: labels are now rendered directly on the canvas.
    }
}

if (typeof window !== 'undefined') {
    window.RendererEntityRenderer = RendererEntityRenderer;
}
