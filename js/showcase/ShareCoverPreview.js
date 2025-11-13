class ShareCoverPreview {
    constructor(options = {}) {
        this.width = Math.max(64, options.width ?? 256);
        this.height = Math.max(64, options.height ?? this.width);
        const devicePixelRatio = options.devicePixelRatio || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
        this.dpr = Math.max(1, Math.min(3, devicePixelRatio));
        this.canvas = options.canvas instanceof HTMLCanvasElement ? options.canvas : document.createElement('canvas');
        this.canvas.width = Math.round(this.width * this.dpr);
        this.canvas.height = Math.round(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx = this.canvas.getContext('2d');
        if (this.ctx && this.dpr !== 1) {
            this.ctx.scale(this.dpr, this.dpr);
        }
    }

    static extractShareCode(value = '') {
        const text = String(value || '').trim();
        if (!text) return '';
        if (text.startsWith('#')) {
            return text.slice(1);
        }
        if (text.includes('://')) {
            try {
                const parsed = new URL(text, window.location?.origin || undefined);
                return parsed.hash?.replace(/^#/, '') || '';
            } catch {
                // ignore and fall through
            }
        }
        return text.includes('.') ? text : '';
    }

    static decodeShareUrl(shareUrl) {
        if (typeof ShareDecoder?.decodeShareCode !== 'function') {
            throw new Error('ShareDecoder is unavailable');
        }
        const code = ShareCoverPreview.extractShareCode(shareUrl);
        if (!code) {
            throw new Error('No share code found in the provided URL.');
        }
        const data = ShareDecoder.decodeShareCode(code);
        if (!data) {
            throw new Error('Unable to decode the provided share code.');
        }
        return data;
    }

    static ensureTileCache() {
        if (this.tileCache) return;
        const tiles = window.TileDefinitions?.TILE_PRESETS || [];
        this.tileCache = new Map();
        tiles.forEach((tile) => {
            if (tile && typeof tile.id === 'number') {
                this.tileCache.set(tile.id, tile.pixels);
            }
        });
    }

    static getTilePixels(tileId) {
        if (!Number.isFinite(tileId) || tileId < 0) return null;
        this.ensureTileCache();
        return this.tileCache.get(tileId) || null;
    }

    renderFromUrl(shareUrl) {
        this.gameData = ShareCoverPreview.decodeShareUrl(shareUrl);
        this.render();
        return this.canvas;
    }

    render() {
        if (!this.ctx) return this.canvas;
        this.clear();
        this.drawBackdrop();
        this.drawMapPreview(this.gameData?.tileset?.map);
        this.drawIntroOverlay();
        return this.canvas;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawBackdrop() {
        const ctx = this.ctx;
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, '#04060e');
        gradient.addColorStop(1, '#101b3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    drawMapPreview(map = {}) {
        const ground = Array.isArray(map?.ground) ? map.ground : [];
        const overlay = Array.isArray(map?.overlay) ? map.overlay : [];
        const rows = Math.max(ground.length, overlay.length, 8);
        const cols = Math.max(
            ground.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0),
            overlay.reduce((max, row) => Math.max(max, Array.isArray(row) ? row.length : 0), 0),
            8
        );
        const gridSize = Math.min(this.width * 0.85, this.height * 0.78);
        const tileWidth = gridSize / cols;
        const tileHeight = gridSize / rows;
        const mapWidth = cols * tileWidth;
        const mapHeight = rows * tileHeight;
        const offsetX = (this.width - mapWidth) / 2;
        const offsetY = (this.height - mapHeight) / 2;

        const ctx = this.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 24;
        ctx.fillStyle = 'rgba(6, 8, 18, 0.92)';
        ctx.fillRect(offsetX - 10, offsetY - 10, mapWidth + 20, mapHeight + 20);
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeRect(offsetX - 6, offsetY - 6, mapWidth + 12, mapHeight + 12);

        const drawLayer = (layer) => {
            layer.forEach((row, y) => {
                if (!Array.isArray(row)) return;
                row.forEach((tileId, x) => {
                    if (!Number.isFinite(tileId) || tileId < 0) return;
                    this.drawTile(tileId, offsetX + x * tileWidth, offsetY + y * tileHeight, tileWidth, tileHeight);
                });
            });
        };

        drawLayer(ground);
        drawLayer(overlay);

        ctx.restore();
    }

    drawTile(tileId, px, py, width, height) {
        const pixels = ShareCoverPreview.getTilePixels(tileId);
        if (!pixels) return;
        const ctx = this.ctx;
        const rows = pixels.length || 8;
        const cols = pixels[0]?.length || 8;
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        for (let y = 0; y < rows; y++) {
            const row = pixels[y];
            if (!Array.isArray(row)) continue;
            for (let x = 0; x < cols; x++) {
                const color = row[x];
                if (!color || color === 'transparent') continue;
                ctx.fillStyle = color;
                ctx.fillRect(px + x * cellWidth, py + y * cellHeight, cellWidth, cellHeight);
            }
        }
    }

    drawIntroOverlay() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        ctx.save();
        ctx.fillStyle = 'rgba(4, 6, 14, 0.78)';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 2;
        ctx.strokeRect(3, 3, width - 6, height - 6);

        const title = (this.gameData?.title || 'Tiny RPG Maker').trim() || 'Tiny RPG Maker';
        const author = (this.gameData?.author || '').trim();
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fitText = (text, maxWidth, baseSize) => {
            let size = baseSize;
            ctx.font = `${size}px "Space Mono", monospace`;
            while (ctx.measureText(text).width > maxWidth && size > 12) {
                size -= 1;
                ctx.font = `${size}px "Space Mono", monospace`;
            }
            return size;
        };

        const titleSize = fitText(title, width * 0.9, Math.max(18, Math.floor(height / 9)));
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${titleSize}px "Space Mono", monospace`;
        ctx.fillText(title, centerX, centerY - height * 0.12);

        if (author) {
            const authorText = `por ${author}`;
            ctx.fillStyle = 'rgba(255,255,255,0.82)';
            const authorSize = fitText(authorText, width * 0.8, Math.max(14, Math.floor(height / 16)));
            ctx.font = `${authorSize}px "Space Mono", monospace`;
            ctx.fillText(authorText, centerX, centerY - height * 0.02);
        }

        ctx.fillStyle = 'rgba(100, 181, 246, 0.95)';
        ctx.font = `${Math.max(12, Math.floor(height / 18))}px "Space Mono", monospace`;
        ctx.fillText('Iniciar aventura', centerX, centerY + height * 0.16);

        ctx.restore();
    }
}

if (typeof window !== 'undefined') {
    window.ShareCoverPreview = ShareCoverPreview;
}
