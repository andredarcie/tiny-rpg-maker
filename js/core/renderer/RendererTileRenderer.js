class RendererTileRenderer {
    constructor(gameState, tileManager, paletteManager, canvasHelper) {
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.paletteManager = paletteManager;
        this.canvasHelper = canvasHelper;
    }

    clearCanvas(ctx, canvas) {
        const room = this.gameState.getCurrentRoom();
        const bgColor = this.paletteManager.getColor(room.bg);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawBackground(ctx, canvas) {
        const room = this.gameState.getCurrentRoom();
        const bgColor = this.paletteManager.getColor(room.bg);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawTiles(ctx, canvas) {
        const room = this.gameState.getCurrentRoom();
        const tileSize = this.canvasHelper.getTilePixelSize();
        const player = this.gameState.getPlayer?.() ?? { roomIndex: 0 };
        const tileMap = this.tileManager.getTileMap(player.roomIndex ?? 0);
        const groundMap = tileMap?.ground || [];
        const overlayMap = tileMap?.overlay || [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const groundId = groundMap[y]?.[x];
                if (groundId !== null && groundId !== undefined) {
                    this.canvasHelper.drawCustomTile(groundId, x * tileSize, y * tileSize, tileSize);
                } else {
                    const colIdx = room.tiles[y][x];
                    ctx.fillStyle = this.paletteManager.getColor(colIdx);
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlayMap[y]?.[x];
                if (overlayId !== null && overlayId !== undefined) {
                    this.canvasHelper.drawCustomTile(overlayId, x * tileSize, y * tileSize, tileSize);
                }
            }
        }
    }

    drawWalls(ctx) {
        const room = this.gameState.getCurrentRoom();
        const tileSize = this.canvasHelper.getTilePixelSize();

        ctx.fillStyle = this.paletteManager.getColor(1);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (room.walls[y][x]) {
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.RendererTileRenderer = RendererTileRenderer;
}
