class StateEnemyManager {
    constructor(game, state, worldManager) {
        this.game = game;
        this.state = state;
        this.worldManager = worldManager;
    }

    setGame(game) {
        this.game = game;
    }

    setState(state) {
        this.state = state;
    }

    setWorldManager(worldManager) {
        this.worldManager = worldManager;
    }

    cloneEnemies(enemies) {
        return (enemies || []).map((enemy) => ({
            id: enemy.id,
            type: enemy.type || 'skull',
            roomIndex: this.worldManager.clampRoomIndex(enemy.roomIndex ?? 0),
            x: this.worldManager.clampCoordinate(enemy.x ?? 0),
            y: this.worldManager.clampCoordinate(enemy.y ?? 0),
            lastX: this.worldManager.clampCoordinate(enemy.x ?? 0),
            lives: enemy.lives ?? 1
        }));
    }

    resetRuntime() {
        if (!this.state) return [];
        this.state.enemies = this.cloneEnemies(this.game?.enemies);
        return this.state.enemies;
    }

    getEnemies() {
        return this.state?.enemies ?? [];
    }

    getEnemyDefinitions() {
        return this.game?.enemies ?? [];
    }

    addEnemy(enemy) {
        if (!this.game || !this.state) return;
        const entry = {
            id: enemy.id,
            type: enemy.type || 'skull',
            roomIndex: this.worldManager.clampRoomIndex(enemy.roomIndex ?? 0),
            x: this.worldManager.clampCoordinate(enemy.x ?? 0),
            y: this.worldManager.clampCoordinate(enemy.y ?? 0),
            lastX: this.worldManager.clampCoordinate(enemy.x ?? 0)
        };
        this.game.enemies.push(entry);
        this.state.enemies.push({ ...entry });
    }

    removeEnemy(enemyId) {
        if (!this.game || !this.state) return;
        this.game.enemies = this.game.enemies.filter((enemy) => enemy.id !== enemyId);
        this.state.enemies = this.state.enemies.filter((enemy) => enemy.id !== enemyId);
    }

    setEnemyPosition(enemyId, x, y, roomIndex = null) {
        const enemy = this.getEnemies().find((entry) => entry.id === enemyId);
        if (!enemy) return;
        enemy.lastX = enemy.x;
        enemy.x = this.worldManager.clampCoordinate(x);
        enemy.y = this.worldManager.clampCoordinate(y);
        if (roomIndex !== null && roomIndex !== undefined) {
            enemy.roomIndex = this.worldManager.clampRoomIndex(roomIndex);
        }
    }
}

if (typeof window !== 'undefined') {
    window.StateEnemyManager = StateEnemyManager;
}

