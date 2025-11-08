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
        const fontSize = area.fontSize ?? Math.max(8, Math.floor(height * 0.55));
        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = 'middle';

        const labelWidth = label ? ctx.measureText(label).width : 0;
        const availableWidth = Math.max(0, width - padding * 2 - (label ? (labelWidth + this.gap) : 0));
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
            ctx.fillText(label, width - padding, height / 2);
        }

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
}

if (typeof window !== 'undefined') {
    window.RendererHudRenderer = RendererHudRenderer;
}
