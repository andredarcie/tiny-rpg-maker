class RendererEntityRenderer {
    constructor(gameState, tileManager, spriteFactory, canvasHelper, paletteManager) {
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.spriteFactory = spriteFactory;
        this.canvasHelper = canvasHelper;
        this.paletteManager = paletteManager;
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
            const sprite = npcSprites[npc.type] || npcSprites.default;
            this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
        }
    }

    drawEnemies(ctx) {
        const enemies = this.gameState.getEnemies?.() ?? [];
        if (!enemies.length) return;
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        const enemySprite = this.spriteFactory.getEnemySprite();

        enemies.forEach((enemy) => {
            if (enemy.roomIndex !== player.roomIndex) return;
            this.canvasHelper.drawSprite(ctx, enemySprite, enemy.x * tileSize, enemy.y * tileSize, step);
        });
    }

    drawPlayer(ctx) {
        const player = this.gameState.getPlayer();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const step = tileSize / 8;
        const px = player.x * tileSize;
        const py = player.y * tileSize;

        this.canvasHelper.drawSprite(ctx, this.spriteFactory.getPlayerSprite(), px, py, step);
    }
}

if (typeof window !== 'undefined') {
    window.RendererEntityRenderer = RendererEntityRenderer;
}
