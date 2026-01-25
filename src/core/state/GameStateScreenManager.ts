
class GameStateScreenManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.canResetAfterGameOver = false;
        this.lastEndingText = '';
        this.gameOverResetTimer = null;
    }

    reset() {
        this.lastEndingText = '';
        this.clearGameOverCooldown();
        this.canResetAfterGameOver = false;
    }

    setActiveEndingText(text = '') {
        const normalized = typeof text === 'string' ? text.trim() : '';
        this.lastEndingText = normalized;
        return this.lastEndingText;
    }

    getActiveEndingText() {
        return this.lastEndingText;
    }

    startGameOverCooldown(duration) {
        this.canResetAfterGameOver = false;
        this.clearGameOverCooldown();
        const delay = Number.isFinite(duration) ? Math.max(0, duration) : 0;
        this.gameOverResetTimer = setTimeout(() => {
            this.canResetAfterGameOver = true;
            this.gameOverResetTimer = null;
        }, delay);
    }

    clearGameOverCooldown() {
        if (this.gameOverResetTimer) {
            clearTimeout(this.gameOverResetTimer);
            this.gameOverResetTimer = null;
        }
    }
}

export { GameStateScreenManager };
