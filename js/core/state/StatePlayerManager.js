class StatePlayerManager {
    constructor(state, worldManager) {
        this.state = state;
        this.worldManager = worldManager;
        this.maxLevel = 9;
        this.baseMaxLives = 3;
    }

    setState(state) {
        this.state = state;
    }

    setWorldManager(worldManager) {
        this.worldManager = worldManager;
    }

    get player() {
        return this.state?.player;
    }

    getPlayer() {
        return this.player;
    }

    setPosition(x, y, roomIndex = null) {
        if (!this.player) return;
        this.player.lastX = this.player.x;
        this.player.x = this.worldManager.clampCoordinate(x);
        this.player.y = this.worldManager.clampCoordinate(y);
        if (roomIndex !== null && roomIndex !== undefined) {
            this.player.roomIndex = this.worldManager.clampRoomIndex(roomIndex);
        }
        this.ensurePlayerStats();
    }

    reset(start) {
        const fallback = start || { x: 1, y: 1, roomIndex: 0 };
        this.setPosition(fallback.x, fallback.y, fallback.roomIndex);
        if (!this.player) return;
        this.player.level = 1;
        this.player.maxLives = this.calculateMaxLives(this.player.level);
        this.player.currentLives = this.player.maxLives;
        this.player.lives = this.player.currentLives;
        this.player.keys = 0;
    }

    addKeys(amount = 1) {
        if (!this.player) return 0;
        const numeric = Number(amount);
        if (!Number.isFinite(numeric)) return this.player.keys;
        const delta = Math.floor(numeric);
        this.player.keys = Math.max(0, this.player.keys + delta);
        return this.player.keys;
    }

    consumeKey() {
        if (!this.player) return false;
        if (this.player.keys <= 0) return false;
        this.player.keys -= 1;
        return true;
    }

    getKeys() {
        return this.player?.keys ?? 0;
    }

    damage(amount = 1) {
        if (!this.player) return 0;
        this.ensurePlayerStats();
        const delta = Number.isFinite(amount) ? amount : 1;
        this.player.currentLives = Math.max(0, this.player.currentLives - delta);
        this.player.lives = this.player.currentLives;
        return this.player.currentLives;
    }

    getLives() {
        this.ensurePlayerStats();
        return this.player?.currentLives ?? 0;
    }

    getMaxLives() {
        this.ensurePlayerStats();
        return this.player?.maxLives ?? 0;
    }

    getLevel() {
        this.ensurePlayerStats();
        return this.player?.level ?? 1;
    }

    calculateMaxLives(level) {
        const numericLevel = Number.isFinite(level) ? Math.floor(level) : 1;
        return this.baseMaxLives + Math.max(0, numericLevel - 1);
    }

    clampLevel(level) {
        const numeric = Number.isFinite(level) ? Math.floor(level) : 1;
        return Math.max(1, Math.min(this.maxLevel, numeric));
    }

    ensurePlayerStats() {
        if (!this.player) return;
        const level = this.clampLevel(this.player.level ?? 1);
        this.player.level = level;
        const expectedMax = this.calculateMaxLives(level);
        this.player.maxLives = expectedMax;
        const currentLives = Number.isFinite(this.player.currentLives)
            ? Math.floor(this.player.currentLives)
            : this.player.maxLives;
        this.player.currentLives = Math.max(0, Math.min(this.player.maxLives, currentLives));
        this.player.lives = this.player.currentLives;
    }

    healToFull() {
        if (!this.player) return this.getLives();
        this.ensurePlayerStats();
        this.player.currentLives = this.player.maxLives;
        this.player.lives = this.player.currentLives;
        return this.player.currentLives;
    }

    handleEnemyDefeated() {
        if (!this.player) {
            return { leveledUp: false, level: 0, maxLives: 0, currentLives: 0 };
        }
        this.ensurePlayerStats();
        if (this.player.level >= this.maxLevel) {
            return {
                leveledUp: false,
                level: this.player.level,
                maxLives: this.player.maxLives,
                currentLives: this.player.currentLives
            };
        }
        this.player.level += 1;
        this.player.maxLives = this.calculateMaxLives(this.player.level);
        this.player.currentLives = this.player.maxLives;
        this.player.lives = this.player.currentLives;
        return {
            leveledUp: true,
            level: this.player.level,
            maxLives: this.player.maxLives,
            currentLives: this.player.currentLives
        };
    }
}

if (typeof window !== 'undefined') {
    window.StatePlayerManager = StatePlayerManager;
}

