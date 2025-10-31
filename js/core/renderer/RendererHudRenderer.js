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
        const keys = typeof this.gameState.getKeys === 'function'
            ? this.gameState.getKeys()
            : 0;
        hud.textContent = `Vidas: ${lives} | Chaves: ${keys}`;
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

