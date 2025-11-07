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
        if (typeof this.gameState.isGameOver === 'function' && this.gameState.isGameOver()) {
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
        const experience = typeof this.gameState.getExperience === 'function'
            ? this.gameState.getExperience()
            : null;
        const experienceToNext = typeof this.gameState.getExperienceToNext === 'function'
            ? this.gameState.getExperienceToNext()
            : null;
        const keys = typeof this.gameState.getKeys === 'function'
            ? this.gameState.getKeys()
            : 0;
        const parts = [];
        if (Number.isFinite(level)) {
            parts.push(`Nivel: ${level}`);
        }
        if (Number.isFinite(experience)) {
            const currentExp = Math.max(0, Math.floor(experience));
            let xpLabel;
            if (Number.isFinite(experienceToNext)) {
                if (experienceToNext > 0) {
                    xpLabel = `${currentExp}/${Math.max(1, Math.floor(experienceToNext))}`;
                } else {
                    xpLabel = 'Max';
                }
            } else {
                xpLabel = `${currentExp}`;
            }
            parts.push(`XP: ${xpLabel}`);
        }
        parts.push(`Chaves: ${keys}`);
        hud.textContent = parts.join(' | ');
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
