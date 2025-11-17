class GameStatePlayerFacade {
    constructor(gameState, playerManager) {
        this.gameState = gameState;
        this.playerManager = playerManager;
    }

    getPlayer() {
        return this.playerManager.getPlayer();
    }

    setPlayerPosition(x, y, roomIndex = null) {
        this.playerManager.setPosition(x, y, roomIndex);
    }

    resetPlayer() {
        this.playerManager.reset(this.gameState.game.start);
    }

    addKeys(amount = 1) {
        return this.playerManager.addKeys(amount);
    }

    addLife(amount = 1) {
        return typeof this.playerManager.gainLives === 'function'
            ? this.playerManager.gainLives(amount)
            : this.playerManager.getLives();
    }

    addDamageShield(amount = 1) {
        return typeof this.playerManager.addDamageShield === 'function'
            ? this.playerManager.addDamageShield(amount)
            : 0;
    }

    getDamageShield() {
        return typeof this.playerManager.getDamageShield === 'function'
            ? this.playerManager.getDamageShield()
            : 0;
    }

    consumeKey() {
        return this.playerManager.consumeKey();
    }

    getKeys() {
        return this.playerManager.getKeys();
    }

    getMaxKeys() {
        return this.playerManager.getMaxKeys();
    }

    consumeLastDamageReduction() {
        return typeof this.playerManager.consumeLastDamageReduction === 'function'
            ? this.playerManager.consumeLastDamageReduction()
            : 0;
    }

    damage(amount = 0) {
        return this.playerManager.damage(amount);
    }

    getLives() {
        return this.playerManager.getLives();
    }

    getMaxLives() {
        return typeof this.playerManager.getMaxLives === 'function'
            ? this.playerManager.getMaxLives()
            : this.playerManager.getLives();
    }

    getLevel() {
        return typeof this.playerManager.getLevel === 'function'
            ? this.playerManager.getLevel()
            : 1;
    }

    healPlayerToFull() {
        return typeof this.playerManager.healToFull === 'function'
            ? this.playerManager.healToFull()
            : this.playerManager.getLives();
    }

    getExperience() {
        return typeof this.playerManager.getExperience === 'function'
            ? this.playerManager.getExperience()
            : 0;
    }

    getExperienceToNext() {
        return typeof this.playerManager.getExperienceToNext === 'function'
            ? this.playerManager.getExperienceToNext()
            : 0;
    }

    addExperience(amount = 0) {
        return typeof this.playerManager.addExperience === 'function'
            ? this.playerManager.addExperience(amount)
            : { leveledUp: false, levelsGained: 0 };
    }

    handleEnemyDefeated(experienceReward = 0) {
        return typeof this.playerManager.handleEnemyDefeated === 'function'
            ? this.playerManager.handleEnemyDefeated(experienceReward)
            : { leveledUp: false };
    }
}

if (typeof window !== 'undefined') {
    window.GameStatePlayerFacade = GameStatePlayerFacade;
}
