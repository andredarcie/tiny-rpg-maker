class RendererHudRenderer {
    constructor(gameState) {
        this.gameState = gameState;
        this.hudElement = typeof document !== 'undefined'
            ? document.getElementById('game-hud')
            : null;
    }

    drawHUD() {
        if (typeof this.gameState.getLives !== 'function') {
            this.hide();
            return;
        }
        const hud = this.hudElement;
        if (!hud) return;
        const lives = this.gameState.getLives();
        const maxLives = typeof this.gameState.getMaxLives === 'function'
            ? this.gameState.getMaxLives()
            : lives;
        const level = typeof this.gameState.getLevel === 'function'
            ? this.gameState.getLevel()
            : null;
        const keys = typeof this.gameState.getKeys === 'function'
            ? this.gameState.getKeys()
            : 0;
        const livesLabel = Number.isFinite(maxLives) && maxLives > 0
            ? `${lives}/${maxLives}`
            : `${lives}`;
        const levelLabel = Number.isFinite(level) ? ` | Nivel: ${level}` : '';
        hud.textContent = `Vidas: ${livesLabel}${levelLabel} | Chaves: ${keys}`;
        hud.style.visibility = 'visible';
    }

    hide() {
        if (this.hudElement) {
            this.hudElement.style.visibility = 'hidden';
        }
    }
}

if (typeof window !== 'undefined') {
    window.RendererHudRenderer = RendererHudRenderer;
}
