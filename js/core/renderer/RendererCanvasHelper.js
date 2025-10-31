class RendererCanvasHelper {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
    }

    getTilePixelSize() {
        return Math.floor(this.canvas.width / 8);
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

    drawCustomTile(tileManager, tileId, px, py, size) {
        const tile = tileManager.getTile(tileId);
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

    drawTilePreview(tileManager, tileId, px, py, size, ctx = this.ctx) {
        const tile = tileManager.getTile(tileId);
        if (!tile) return;

        const step = Math.floor(size / 8);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                ctx.fillStyle = col;
                ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.RendererCanvasHelper = RendererCanvasHelper;
}

