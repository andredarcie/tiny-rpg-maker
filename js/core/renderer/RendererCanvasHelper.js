class RendererCanvasHelper {
    constructor(canvas, context, tileManager) {
        this.canvas = canvas;
        this.ctx = context;
        this.tileManager = tileManager || null;
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

    resolveTilePixels(tile, frameOverride = null) {
        if (this.tileManager?.getTilePixels) {
            return this.tileManager.getTilePixels(tile, frameOverride);
        }
        if (Array.isArray(tile?.frames) && tile.frames.length) {
            return tile.frames[0];
        }
        return Array.isArray(tile?.pixels) ? tile.pixels : null;
    }

    drawCustomTile(tileId, px, py, size, frameOverride = null) {
        if (!this.tileManager) return;
        const tile = this.tileManager.getTile(tileId);
        if (!tile) return;
        const pixels = this.resolveTilePixels(tile, frameOverride);
        if (!pixels) return;

        const step = Math.max(1, Math.floor(size / 8));
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = pixels[y]?.[x];
                if (!col || col === 'transparent') continue;
                this.ctx.fillStyle = col;
                this.ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    drawTileOnCanvas(canvas, tile, frameOverride = null) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const pixels = this.resolveTilePixels(tile, frameOverride);
        if (!pixels) return;

        const step = Math.max(1, Math.floor(canvas.width / 8));
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = pixels[y]?.[x];
                if (!col || col === 'transparent') continue;
                ctx.fillStyle = col;
                ctx.fillRect(x * step, y * step, step, step);
            }
        }
    }

    drawTilePreview(tileId, px, py, size, ctx = this.ctx, frameOverride = null) {
        if (!this.tileManager) return;
        const tile = this.tileManager.getTile(tileId);
        if (!tile) return;
        const pixels = this.resolveTilePixels(tile, frameOverride);
        if (!pixels) return;

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
    window.RendererCanvasHelper = RendererCanvasHelper;
}
