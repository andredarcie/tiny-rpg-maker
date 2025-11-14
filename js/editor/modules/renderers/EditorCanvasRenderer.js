class EditorCanvasRenderer extends EditorRendererBase {
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
                    this.drawTile(ctx, groundId, x * tileSize, y * tileSize, tileSize);
                } else {
                    ctx.fillStyle = '#141414';
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlay[y]?.[x];
                if (overlayId !== null && overlayId !== undefined) {
                    this.drawTile(ctx, overlayId, x * tileSize, y * tileSize, tileSize);
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
}

if (typeof window !== 'undefined') {
    window.EditorCanvasRenderer = EditorCanvasRenderer;
}
