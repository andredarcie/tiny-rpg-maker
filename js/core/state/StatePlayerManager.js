class StatePlayerManager {
    constructor(state, worldManager) {
        this.state = state;
        this.worldManager = worldManager;
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
        this.player.x = this.worldManager.clampCoordinate(x);
        this.player.y = this.worldManager.clampCoordinate(y);
        if (roomIndex !== null && roomIndex !== undefined) {
            this.player.roomIndex = this.worldManager.clampRoomIndex(roomIndex);
        }
    }

    reset(start) {
        const fallback = start || { x: 1, y: 1, roomIndex: 0 };
        this.setPosition(fallback.x, fallback.y, fallback.roomIndex);
        if (!this.player) return;
        this.player.lives = 3;
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
        const delta = Number.isFinite(amount) ? amount : 1;
        this.player.lives = Math.max(0, this.player.lives - delta);
        return this.player.lives;
    }

    getLives() {
        return this.player?.lives ?? 0;
    }
}

if (typeof window !== 'undefined') {
    window.StatePlayerManager = StatePlayerManager;
}

