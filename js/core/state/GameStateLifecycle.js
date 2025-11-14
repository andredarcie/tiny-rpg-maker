class GameStateLifecycle {
    constructor(gameState, screenManager, options = {}) {
        this.gameState = gameState;
        this.screenManager = screenManager;
        this.pauseReasons = new Set();
        this.timeToResetAfterGameOver = Number.isFinite(options.timeToResetAfterGameOver)
            ? Math.max(0, options.timeToResetAfterGameOver)
            : 2000;
    }

    pauseGame(reason = 'manual') {
        const label = reason || 'manual';
        this.pauseReasons.add(label);
        this.updatePlayingLock();
    }

    resumeGame(reason = 'manual') {
        if (reason === null || reason === undefined) {
            this.pauseReasons.clear();
        } else {
            this.pauseReasons.delete(reason || 'manual');
        }
        this.updatePlayingLock();
    }

    updatePlayingLock() {
        this.gameState.playing = this.pauseReasons.size === 0;
    }

    setGameOver(active = true, reason = 'defeat') {
        const state = this.gameState.state;
        if (!state) return;
        const activeValue = Boolean(active);
        if (activeValue) {
            this.screenManager.startGameOverCooldown(this.timeToResetAfterGameOver);
        }
        state.gameOver = activeValue;
        state.gameOverReason = activeValue ? (reason || 'defeat') : null;
    }

    isGameOver() {
        return Boolean(this.gameState.state?.gameOver);
    }

    getGameOverReason() {
        return this.gameState.state?.gameOverReason || 'defeat';
    }
}

if (typeof window !== 'undefined') {
    window.GameStateLifecycle = GameStateLifecycle;
}
