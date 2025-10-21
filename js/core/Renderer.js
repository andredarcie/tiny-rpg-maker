/**
 * Renderer handles drawing the game scene and editor surfaces.
 */
class Renderer {
    constructor(canvas, gameState, tileManager, npcManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.npcManager = npcManager;
        this.playerSprite = this.buildPlayerSprite();
    }

    draw() {
        this.clearCanvas();
        this.drawBackground();
        this.drawTiles();
        this.drawWalls();
        this.drawItems();
        this.drawNPCs();
        this.drawPlayer();
        this.drawDialog();
    }

    clearCanvas() {
        const room = this.gameState.getCurrentRoom();
        const bgColor = this.getColor(room.bg);
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        const room = this.gameState.getCurrentRoom();
        const bgColor = this.getColor(room.bg);
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawTiles() {
        const room = this.gameState.getCurrentRoom();
        const tileSize = this.getTilePixelSize();
        const tileMap = this.tileManager.getTileMap();
        const groundMap = tileMap?.ground || [];
        const overlayMap = tileMap?.overlay || [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const groundId = groundMap[y]?.[x];
                if (groundId) {
                    this.drawCustomTile(groundId, x * tileSize, y * tileSize, tileSize);
                } else {
                    const colIdx = room.tiles[y][x];
                    this.ctx.fillStyle = this.getColor(colIdx);
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlayMap[y]?.[x];
                if (overlayId) {
                    this.drawCustomTile(overlayId, x * tileSize, y * tileSize, tileSize);
                }
            }
        }
    }

    drawWalls() {
        const room = this.gameState.getCurrentRoom();
        const tileSize = this.getTilePixelSize();

        this.ctx.fillStyle = this.getColor(1);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (room.walls[y][x]) {
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
    }

    drawItems() {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();
        const tileSize = this.getTilePixelSize();

        this.ctx.fillStyle = this.getColor(2);
        for (const item of game.items) {
            if (item.roomIndex !== player.roomIndex || item.collected) continue;
            this.ctx.fillRect(
                item.x * tileSize + tileSize * 0.25,
                item.y * tileSize + tileSize * 0.25,
                tileSize * 0.5,
                tileSize * 0.5
            );
        }
    }

    drawNPCs() {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();
        const tileSize = this.getTilePixelSize();

        this.ctx.fillStyle = this.getColor(2);
        for (const npc of game.sprites) {
            if (npc.roomIndex !== player.roomIndex) continue;
            this.ctx.fillRect(
                npc.x * tileSize + 2,
                npc.y * tileSize + 2,
                tileSize - 4,
                tileSize - 4
            );
        }
    }

    drawPlayer() {
        const player = this.gameState.getPlayer();
        const tileSize = this.getTilePixelSize();
        const step = tileSize / 8;
        const px = player.x * tileSize;
        const py = player.y * tileSize;

        for (let y = 0; y < this.playerSprite.length; y++) {
            const row = this.playerSprite[y];
            for (let x = 0; x < row.length; x++) {
                const col = row[x];
                if (!col) continue;
                this.ctx.fillStyle = col;
                this.ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    drawDialog() {
        const dialog = this.gameState.getDialog();
        if (!dialog.active || !dialog.text) return;
        this.drawDialogBox(dialog.text);
    }

    drawDialogBox(text) {
        const pad = 6;
        const w = this.canvas.width - pad * 2;
        const h = 40;
        const x = pad;
        const y = this.canvas.height - h - pad;

        this.ctx.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx.fillRect(x, y, w, h);

        this.ctx.strokeStyle = this.getColor(2);
        this.ctx.strokeRect(x, y, w, h);

        this.ctx.fillStyle = this.getColor(2);
        this.ctx.font = "10px monospace";
        this.wrapText(text, x + 8, y + 14, w - 16, 12);
    }

    drawCustomTile(tileId, px, py, size) {
        const tile = this.tileManager.getTile(tileId);
        if (!tile) return;

        const step = Math.floor(size / 8);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                this.ctx.fillStyle = col;
                this.ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(/\s+/);
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = this.ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                this.ctx.fillText(line, x, y);
                line = words[i] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        this.ctx.fillText(line, x, y);
    }

    getTilePixelSize() {
        return Math.floor(this.canvas.width / 8);
    }

    getColor(idx) {
        const game = this.gameState.getGame();
        return game.palette[idx] || "#f4f4f8";
    }

    // Editor helpers
    drawTileOnCanvas(canvas, tile) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const step = Math.floor(canvas.width / 8);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                ctx.fillStyle = col;
                ctx.fillRect(x * step, y * step, step, step);
            }
        }
    }

    drawTilePreviewAt(tileId, px, py, size, ctx) {
        const tile = this.tileManager.getTile(tileId);
        if (!tile) return;
        const targetCtx = ctx || this.ctx;

        const step = Math.floor(size / 8);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                targetCtx.fillStyle = col;
                targetCtx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    buildPlayerSprite() {
        const palette = {
            '.': null,
            'O': '#1e2136', // outline
            'A': '#d4dae8', // armor
            'H': '#f4c9a2', // skin
            'C': '#3f4ea5', // cloth
            'G': '#f2b705', // gold accent
            'S': '#dfe4ec'  // sword
        };

        const rows = [
            "..AAAS..",
            ".AHHHSA.",
            "OAHGHSA.",
            "OACGCSA.",
            "OACCCSA.",
            ".ACCCAO.",
            ".A..A.O.",
            "O....O.."
        ];

        return rows.map((row) => row.split('').map((ch) => palette[ch] ?? null));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
} else {
    window.Renderer = Renderer;
}
