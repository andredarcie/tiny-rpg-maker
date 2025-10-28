const npcDefinitionsSource = (typeof module !== 'undefined' && module.exports)
    ? require('./NPCDefinitions')
    : ((typeof window !== 'undefined' ? window.NPCDefinitions : null) || {});

const NPC_DEFINITIONS = npcDefinitionsSource.NPC_DEFINITIONS || [];

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
        this.npcSprites = this.buildNpcSprites();
        this.enemySprite = this.buildEnemySprite();
        this.hudElement = typeof document !== 'undefined'
            ? document.getElementById('game-hud')
            : null;
        this.minimapElement = typeof document !== 'undefined'
            ? document.getElementById('game-minimap')
            : null;
        this.minimapCells = null;
    }

    draw() {
        this.clearCanvas();
        this.drawBackground();
        this.drawTiles();
        this.drawWalls();
        this.drawItems();
        this.drawNPCs();
        this.drawEnemies();
        this.drawPlayer();
        this.drawDialog();
        this.drawHUD();
        this.drawMinimap();
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
        const player = this.gameState.getPlayer?.() ?? { roomIndex: 0 };
        const tileMap = this.tileManager.getTileMap(player.roomIndex ?? 0);
        const groundMap = tileMap?.ground || [];
        const overlayMap = tileMap?.overlay || [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const groundId = groundMap[y]?.[x];
                if (groundId !== null && groundId !== undefined) {
                    this.drawCustomTile(groundId, x * tileSize, y * tileSize, tileSize);
                } else {
                    const colIdx = room.tiles[y][x];
                    this.ctx.fillStyle = this.getColor(colIdx);
                    this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlayMap[y]?.[x];
                if (overlayId !== null && overlayId !== undefined) {
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

        const step = tileSize / 8;
        for (const npc of game.sprites) {
            if (!npc.placed) continue;
            if (npc.roomIndex !== player.roomIndex) continue;
            const px = npc.x * tileSize;
            const py = npc.y * tileSize;
            const sprite = this.npcSprites[npc.type] || this.npcSprites.default;
            this.drawSprite(this.ctx, sprite, px, py, step);
        }
    }

    drawEnemies() {
        const enemies = this.gameState.getEnemies?.() ?? [];
        if (!enemies.length) return;
        const player = this.gameState.getPlayer();
        const tileSize = this.getTilePixelSize();
        const step = tileSize / 8;

        enemies.forEach((enemy) => {
            if (enemy.roomIndex !== player.roomIndex) return;
            this.drawEnemySprite(this.ctx, enemy.x * tileSize, enemy.y * tileSize, step);
        });
    }

    drawEnemySprite(ctx, px, py, step) {
        this.drawSprite(ctx, this.enemySprite, px, py, step);
    }

    drawPlayer() {
        const player = this.gameState.getPlayer();
        const tileSize = this.getTilePixelSize();
        const step = tileSize / 8;
        const px = player.x * tileSize;
        const py = player.y * tileSize;

        this.drawSprite(this.ctx, this.playerSprite, px, py, step);
    }

    drawDialog() {
        const dialog = this.gameState.getDialog();
        
        if (!dialog.active || !dialog.text) return;
        dialog.page+=1;
        
        this.drawDialogBox(dialog);
    }

    drawHUD() {
        if (!this.gameState.getLives) {
            if (this.hudElement) {
                this.hudElement.style.visibility = 'hidden';
            }
            return;
        }

        const hud = this.hudElement;
        if (!hud) return;
        const lives = this.gameState.getLives();
        hud.textContent = `Vidas: ${lives}`;
        hud.style.visibility = 'visible';
    }

    drawMinimap() {
        if (!this.minimapElement) return;
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer?.() ?? { roomIndex: 0 };
        const rows = game.world?.rows || 1;
        const cols = game.world?.cols || 1;
        const total = rows * cols;

        if (!this.minimapCells || this.minimapCells.length !== total) {
            this.minimapElement.innerHTML = '';
            this.minimapElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            this.minimapCells = [];
            for (let i = 0; i < total; i++) {
                const cell = document.createElement('div');
                cell.className = 'game-minimap-cell';
                this.minimapElement.appendChild(cell);
                this.minimapCells.push(cell);
            }
        }

        if (!this.minimapCells || !this.minimapCells.length) return;
        const clampedRoom = Math.max(0, Math.min(this.minimapCells.length - 1, player.roomIndex ?? 0));
        for (let i = 0; i < this.minimapCells.length; i++) {
            this.minimapCells[i].classList.toggle('active', i === clampedRoom);
        }
    }

    drawDialogBox(dialog) {
        const pad = 6;
        const w = this.canvas.width - pad * 2;
        const h = 40;
        const x = pad;
        const y = this.canvas.height - h - pad;

        this.ctx.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx.fillRect(x, y, w, h);

        const accent = this.getColor(7) || "#FFF1E8";
        this.ctx.strokeStyle = accent;
        this.ctx.strokeRect(x, y, w, h);

        this.ctx.fillStyle = accent;
        this.ctx.font = "10px monospace";

        const lineHeight = 12;
        const maxWidth = w - 16;

        const pages = this.calculateDialogPages(dialog, this.ctx, maxWidth, lineHeight, h - 8);
        // Página atual
        const pageIndex = dialog.page - 1;
        const lines = pages[pageIndex] || [];

        // Desenha cada linha
        let ty = y + 14;
        for (const line of lines) {
            this.ctx.fillText(line, x + 8, ty);
            ty += lineHeight;
        }
    }

    calculateDialogPages(dialog, ctx, maxWidth, lineHeight, boxHeight) {
        const words = dialog.text.split(/\s+/);
        let line = "";
        let lines = [];

        // Quebra o texto em linhas
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line.trim());
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());
        // Calcula quantas linhas cabem por página
        const linesPerPage = Math.floor(boxHeight / lineHeight);
        const pages = [];

        for (let i = 0; i < lines.length; i += linesPerPage) {
            pages.push(lines.slice(i, i + linesPerPage));
        }

        dialog.maxPages = pages.length;
        return pages;
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

    drawSprite(ctx, sprite, px, py, step) {
        if (!sprite) return;
        for (let y = 0; y < sprite.length; y++) {
            const row = sprite[y];
            for (let x = 0; x < row.length; x++) {
                const col = row[x];
                if (!col) continue;
                ctx.fillStyle = col;
                ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
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

    getPicoPalette() {
        return (typeof window !== 'undefined' && window.PICO8_COLORS)
            ? window.PICO8_COLORS
            : [
                "#000000", "#1D2B53", "#7E2553", "#008751",
                "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
                "#FF004D", "#FFA300", "#FFFF27", "#00E756",
                "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
            ];
    }

    buildPlayerSprite() {
        const picoPalette = this.getPicoPalette();

        const pixels = [
            [ null, null, 15, 15, 15, 15, null, null ],
            [  6, null, 15, 12, 15, 12, null, null ],
            [ null,  1, 15, 15, 15, 15, null, null ],
            [  1,  9,  4, 15, 15,  9,  9, null ],
            [ null, 15,  9,  4,  4,  9, 15, null ],
            [ null, null,  9,  9,  9,  4, null, null ],
            [ null, null,  1,  1,  1,  1, null, null ],
            [ null, null,  1, null, null,  1, null, null ]
        ];

        return pixels.map((row) =>
            row.map((value) => {
                if (value === null || value === undefined) return null;
                return picoPalette[value] ?? null;
            })
        );
    }

    buildNpcSprites() {
        const picoPalette = this.getPicoPalette();
        const mapPixels = (pixels) => {
            if (!Array.isArray(pixels)) return this.buildNpcSprite(picoPalette);
            return pixels.map((row) =>
                row.map((value) => {
                    if (value === null || value === undefined) return null;
                    return picoPalette[value] ?? null;
                })
            );
        };

        const sprites = {};
        for (const def of NPC_DEFINITIONS) {
            sprites[def.type] = mapPixels(def.sprite);
        }
        sprites.default = this.buildNpcSprite(picoPalette);
        return sprites;
    }

    buildNpcSprite(palette = null) {
        const picoPalette = palette || this.getPicoPalette();
        const pixels = [
            [ null, null, null,  5,  5,  5, null, null ],
            [ null, null,  5,  5,  5,  5,  5, null ],
            [ null, null,  7,  1,  7,  1,  7, null ],
            [  5, null,  7,  7,  7,  7,  7, null ],
            [  5, null,  5,  5,  5,  5,  5, null ],
            [  5,  7,  6,  5,  5,  5,  6, null ],
            [  5, null,  6,  6,  5,  6,  6, null ],
            [  5, null,  6,  6,  6,  6,  6, null ]
        ];

        return pixels.map((row) =>
            row.map((value) => {
                if (value === null || value === undefined) return null;
                return picoPalette[value] ?? null;
            })
        );
    }

    buildEnemySprite() {
        const picoPalette = this.getPicoPalette();

        const pixels = [
            [ null, null,  6, null, null, null,  6, null ],
            [ null, null,  6,  6,  6,  6,  6, null ],
            [ null, null,  6,  6,  8,  6,  8, null ],
            [ null, null,  6,  6,  6,  6,  6, null ],
            [ null, null,  1,  1,  6,  1,  1, null ],
            [ null, null,  6,  1,  1,  1,  6, null ],
            [ null, null, null,  1,  1,  1, null, null ],
            [ null, null, null,  6, null,  6, null, null ]
        ];

        return pixels.map((row) =>
            row.map((value) => {
                if (value === null || value === undefined) return null;
                return picoPalette[value] ?? null;
            })
        );
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Renderer;
} else {
    window.Renderer = Renderer;
}




