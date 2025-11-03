class EnemyManager {
    constructor(gameState, renderer, tileManager, options = {}) {
        this.gameState = gameState;
        this.renderer = renderer;
        this.tileManager = tileManager;
        this.onPlayerDefeated = options.onPlayerDefeated || (() => {});
        this.interval = options.interval || 600;
        this.enemyMoveTimer = null;
        this.directions = options.directions || this.defaultDirections();
    }

    getEnemyDefinitions() {
        return this.gameState.getEnemyDefinitions();
    }

    getActiveEnemies() {
        return this.gameState.getEnemies();
    }

    addEnemy(enemy) {
        const id = enemy.id || this.generateEnemyId();
        const type = this.normalizeEnemyType(enemy.type);
        this.gameState.addEnemy({
            id,
            type,
            roomIndex: enemy.roomIndex ?? 0,
            x: enemy.x ?? 0,
            y: enemy.y ?? 0,
            lastX: enemy.x ?? 0
        });
        this.renderer.draw();
        return id;
    }

    removeEnemy(enemyId) {
        this.gameState.removeEnemy(enemyId);
        this.renderer.draw();
    }

    generateEnemyId() {
        const cryptoObj = (typeof crypto !== 'undefined') ? crypto : (typeof window !== 'undefined' ? window.crypto : null);
        if (cryptoObj?.randomUUID) {
            return cryptoObj.randomUUID();
        }
        return `enemy-${Math.random().toString(36).slice(2, 10)}`;
    }

    start() {
        if (this.enemyMoveTimer) {
            clearInterval(this.enemyMoveTimer);
        }
        this.enemyMoveTimer = setInterval(() => this.tick(), this.interval);
    }

    stop() {
        if (this.enemyMoveTimer) {
            clearInterval(this.enemyMoveTimer);
            this.enemyMoveTimer = null;
        }
    }

    tick() {
        if (!this.gameState.playing) return;
        
        const enemies = this.gameState.getEnemies();
        if (!this.hasMovableEnemies(enemies)) return;

        const game = this.gameState.getGame();
        let moved = false;

        for (let i = 0; i < enemies.length; i++) {
            const result = this.tryMoveEnemy(enemies, i, game);
            if (result === 'moved') {
                moved = true;
            } else if (result === 'collided') {
                moved = true;
                break;
            }
        }

        if (moved) {
            this.renderer.draw();
        }
    }

    handleEnemyCollision(enemyIndex) {
        const enemies = this.gameState.getEnemies();
        const enemy = enemies[enemyIndex];
        if (!enemy) return;
        enemy.type = this.normalizeEnemyType(enemy.type);
        enemies.splice(enemyIndex, 1);
        const damage = this.getEnemyDamage(enemy.type);
        const lives = this.gameState.damagePlayer(damage);
        if (lives <= 0) {
            this.onPlayerDefeated();
        } else {
            this.renderer.draw();
        }
    }

    checkCollisionAt(x, y) {
        const enemies = this.gameState.getEnemies();
        const playerRoom = this.gameState.getPlayer().roomIndex;
        const index = enemies.findIndex((enemy) =>
            enemy.roomIndex === playerRoom &&
            enemy.x === x &&
            enemy.y === y
        );
        if (index !== -1) {
            this.handleEnemyCollision(index);
        }
    }

    clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }

    defaultDirections() {
        return [
            [0, 0],
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
    }

    hasMovableEnemies(enemies) {
        return Array.isArray(enemies) && enemies.length > 0;
    }

    tryMoveEnemy(enemies, index, game) {
        const enemy = enemies[index];
        if (!enemy) return 'none';
        enemy.type = this.normalizeEnemyType(enemy.type);

        const dir = this.pickRandomDirection();
        const target = this.getTargetPosition(enemy, dir);
        const roomIndex = enemy.roomIndex ?? 0;

        if (!this.canEnterTile(roomIndex, target.x, target.y, game, enemies, index)) {
            return 'none';
        }

        enemy.lastX = enemy.x;
        enemy.x = target.x;
        enemy.y = target.y;

        return this.resolvePostMove(roomIndex, target.x, target.y, index) ? 'collided' : 'moved';
    }

    pickRandomDirection() {
        const base = this.directions;
        return base[Math.floor(Math.random() * base.length)];
    }

    getTargetPosition(enemy, direction) {
        return {
            x: this.clamp(enemy.x + direction[0], 0, 7),
            y: this.clamp(enemy.y + direction[1], 0, 7)
        };
    }

    canEnterTile(roomIndex, x, y, game, enemies, movingIndex) {
        const room = game.rooms[roomIndex];
        if (!room) return false;
        if (room.walls?.[y]?.[x]) return false;
        if (this.isTileBlocked(roomIndex, x, y)) return false;
        if (this.hasBlockingObject(roomIndex, x, y)) return false;
        return !this.isOccupied(enemies, movingIndex, roomIndex, x, y);
    }

    isTileBlocked(roomIndex, x, y) {
        const tileMap = this.tileManager.getTileMap(roomIndex);
        const groundId = tileMap?.ground?.[y]?.[x] ?? null;
        const overlayId = tileMap?.overlay?.[y]?.[x] ?? null;
        const candidateId = overlayId ?? groundId;
        if (candidateId === null || candidateId === undefined) return false;
        const tile = this.tileManager.getTile(candidateId);
        return Boolean(tile?.collision);
    }

    hasBlockingObject(roomIndex, x, y) {
        const blockingObject = this.gameState.getObjectAt?.(roomIndex, x, y) ?? null;
        if (!blockingObject) return false;
        if (blockingObject.type === 'door' && !blockingObject.opened) return true;
        if (blockingObject.type === 'door-variable') {
            const isOpen = blockingObject.variableId
                ? this.gameState.isVariableOn(blockingObject.variableId)
                : false;
            return !isOpen;
        }
        return false;
    }

    isOccupied(enemies, movingIndex, roomIndex, x, y) {
        return enemies.some((other, index) =>
            index !== movingIndex &&
            other.roomIndex === roomIndex &&
            other.x === x &&
            other.y === y
        );
    }

    resolvePostMove(roomIndex, x, y, enemyIndex) {
        const player = this.gameState.getPlayer();
        if (player.roomIndex === roomIndex && player.x === x && player.y === y) {
            this.handleEnemyCollision(enemyIndex);
            return true;
        }
        return false;
    }

    normalizeEnemyType(type) {
        if (typeof EnemyDefinitions?.normalizeType === 'function') {
            return EnemyDefinitions.normalizeType(type);
        }
        return type || 'giant-rat';
    }

    getEnemyDamage(type) {
        if (typeof EnemyDefinitions?.getEnemyDefinition === 'function') {
            const definition = EnemyDefinitions.getEnemyDefinition(type);
            if (definition && Number.isFinite(definition.damage)) {
                return Math.max(1, definition.damage);
            }
        }
        return 1;
    }
}

if (typeof window !== 'undefined') {
    window.EnemyManager = EnemyManager;
}
