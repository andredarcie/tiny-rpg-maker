class RendererHudRenderer {
    constructor(gameState, entityRenderer, paletteManager) {
        this.gameState = gameState;
        this.entityRenderer = entityRenderer;
        this.paletteManager = paletteManager;
        this.padding = 4;
        this.gap = 6;
        this.backgroundColor = '#000000';
    }

    drawHUD(ctx, area = {}) {
        if (!ctx) return;
        const width = area.width ?? ctx.canvas?.width ?? 128;
        const height = area.height ?? 16;
        const padding = area.padding ?? this.padding;
        const accent = this.paletteManager?.getColor?.(7) || '#FFF1E8';

        ctx.save();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        if (typeof this.gameState.isGameOver === 'function' && this.gameState.isGameOver()) {
            ctx.restore();
            return;
        }

        const label = this.getLevelLabel();
        const fontSize = area.fontSize ?? Math.max(6, Math.floor(height * 0.4));
        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = 'middle';

        const mapCellSize = Math.max(4, Math.floor((height - padding * 2) / 3));
        const miniMapSize = mapCellSize * 3;
        const miniMapX = width - padding - miniMapSize;
        const miniMapY = Math.round(height / 2 - miniMapSize / 2);

        const labelWidth = label ? ctx.measureText(label).width : 0;
        const labelGap = label ? this.gap : 0;
        const rightReserved = miniMapSize + this.gap + labelWidth + labelGap;
        const availableWidth = Math.max(0, width - padding - rightReserved);

        const heartBaseSize = this.entityRenderer?.canvasHelper?.getTilePixelSize?.() ?? 16;
        const heartSize = Math.max(6, Math.min(height - padding * 2, heartBaseSize / 2));
        const heartStride = heartSize + 2;
        const heartsPerRow = Math.max(1, Math.floor(availableWidth / Math.max(heartStride, 1)));

        this.entityRenderer.drawHealth(ctx, {
            offsetX: padding,
            offsetY: padding + Math.max(0, (height - padding * 2 - heartSize) / 2),
            heartsPerRow,
            heartSize,
            gap: 2
        });

        if (label) {
            ctx.fillStyle = accent;
            ctx.textAlign = 'right';
            ctx.fillText(label, miniMapX - this.gap, height / 2);
        }

        this.drawMiniMap(ctx, miniMapX, miniMapY, mapCellSize, miniMapSize);

        ctx.restore();
    }

    getLevelLabel() {
        if (typeof this.gameState.getLevel !== 'function') {
            return null;
        }
        const level = this.gameState.getLevel();
        if (!Number.isFinite(level)) {
            return null;
        }
        return `LVL ${Math.max(1, Math.floor(level))}`;
    }

    drawMiniMap(ctx, x, y, cellSize, mapSize) {
        const rows = 3;
        const cols = 3;
        const bgColor = 'rgba(255,255,255,0.08)';
        const borderColor = 'rgba(255,255,255,0.25)';
        const activeColor = '#64b5f6';

        ctx.save();
        ctx.translate(x, y);

        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.strokeRect(-2, -2, mapSize + 4, mapSize + 4);

        const game = this.gameState.getGame?.() || {};
        const worldRows = Math.max(1, game.world?.rows || 1);
        const worldCols = Math.max(1, game.world?.cols || 1);
        const playerRoom = this.gameState.getPlayer?.()?.roomIndex ?? 0;
        const playerRow = Math.floor(playerRoom / worldCols);
        const playerCol = playerRoom % worldCols;
        const rowChunk = Math.max(1, Math.ceil(worldRows / rows));
        const colChunk = Math.max(1, Math.ceil(worldCols / cols));
        const activeRow = Math.min(rows - 1, Math.floor(playerRow / rowChunk));
        const activeCol = Math.min(cols - 1, Math.floor(playerCol / colChunk));

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = c * cellSize;
                const py = r * cellSize;
                ctx.fillStyle = r === activeRow && c === activeCol ? activeColor : bgColor;
                ctx.fillRect(px, py, cellSize, cellSize);
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
            }
        }

        ctx.restore();
    }
}

if (typeof window !== 'undefined') {
    window.RendererHudRenderer = RendererHudRenderer;
}
