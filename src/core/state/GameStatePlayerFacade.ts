
class GameStatePlayerFacade {
    constructor(gameState: unknown, playerManager: unknown) {
        this.gameState = gameState;
        this.playerManager = playerManager;
    }

    getPlayer() {
        return this.playerManager.getPlayer();
    }

    setPlayerPosition(x: number, y: number, roomIndex: number | null = null) {
        this.playerManager.setPosition(x, y, roomIndex);
    }

    resetPlayer() {
        this.playerManager.reset(this.gameState.game.start);
    }

    addKeys(amount = 1) {
        return this.playerManager.addKeys(amount);
    }

    addLife(amount = 1) {
        return this.playerManager.gainLives(amount);
    }

    addDamageShield(amount = 1, type = null) {
        return this.playerManager.addDamageShield(amount, type);
    }

    getDamageShield() {
        return this.playerManager.getDamageShield();
    }

    getDamageShieldMax() {
        return this.playerManager.getDamageShieldMax();
    }

    getSwordType() {
        return this.playerManager.getSwordType();
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
        return this.playerManager.consumeLastDamageReduction();
    }

    damage(amount = 0) {
        return this.playerManager.damage(amount);
    }

    isOnDamageCooldown() {
        return this.playerManager.isOnDamageCooldown();
    }

    getLives() {
        return this.playerManager.getLives();
    }

    getMaxLives() {
        return this.playerManager.getMaxLives();
    }

    getLevel() {
        return this.playerManager.getLevel();
    }

    healPlayerToFull() {
        return this.playerManager.healToFull();
    }

    getExperience() {
        return this.playerManager.getExperience();
    }

    getExperienceToNext() {
        return this.playerManager.getExperienceToNext();
    }

    addExperience(amount = 0) {
        return this.playerManager.addExperience(amount);
    }

    handleEnemyDefeated(experienceReward = 0) {
        return this.playerManager.handleEnemyDefeated(experienceReward);
    }
}

export { GameStatePlayerFacade };
