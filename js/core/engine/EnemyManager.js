const getEnemyLocaleText = (key, fallback = '') => {
    if (typeof TextResources !== 'undefined' && typeof TextResources.get === 'function') {
        const value = TextResources.get(key, fallback);
        return value || fallback || key || '';
    }
    return fallback || key || '';
};

class EnemyManager {
    constructor(gameState, renderer, tileManager, options = {}) {
        this.gameState = gameState;
        this.renderer = renderer;
        this.tileManager = tileManager;
        this.onPlayerDefeated = options.onPlayerDefeated || (() => {});
        this.interval = options.interval || 600;
        this.enemyMoveTimer = null;
        this.directions = options.directions || this.defaultDirections();
        this.dialogManager = options.dialogManager || null;
        this.fallbackMissChance = this.normalizeMissChance(
            options.missChance === undefined ? 0.25 : options.missChance
        );
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
            lastX: enemy.x ?? 0,
            defeatVariableId: enemy.defeatVariableId ?? null
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
        const missChance = this.getEnemyMissChance(enemy.type);
        const attackMissed = this.attackMissed(missChance);

        enemies.splice(enemyIndex, 1);

        if (attackMissed) {
            this.showMissFeedback();
        } else {
            const damage = this.getEnemyDamage(enemy.type);
            const lives = this.gameState.damagePlayer(damage);
            const reduction = typeof this.gameState.consumeLastDamageReduction === 'function'
                ? this.gameState.consumeLastDamageReduction()
                : 0;
            if (reduction > 0) {
                const indicator = this.renderer?.showCombatIndicator;
                const text = reduction >= damage
                    ? 'Ataque bloqueado!'
                    : `Bloqueado -${reduction}`;
                if (typeof indicator === 'function') {
                    indicator.call(this.renderer, text, { duration: 700 });
                }
            }
            if (lives <= 0) {
                this.onPlayerDefeated();
                return;
            }
        }

        const experienceReward = this.getExperienceReward(enemy.type);
        const defeatResult = typeof this.gameState.handleEnemyDefeated === 'function'
            ? this.gameState.handleEnemyDefeated(experienceReward)
            : typeof this.gameState.addExperience === 'function'
                ? this.gameState.addExperience(experienceReward)
                : null;
        if (defeatResult?.leveledUp) {
            if (this.dialogManager?.showDialog) {
                const finalLevel = Number.isFinite(defeatResult.level)
                    ? Math.max(1, Math.floor(defeatResult.level))
                    : null;
                const message = finalLevel ? `Level Up! Nivel ${finalLevel}` : 'Level Up!';
                this.dialogManager.showDialog(message, {
                    pauseGame: true,
                    resumePlayingOnClose: true,
                    pauseReason: 'level-up'
                });
            }
        }

        this.tryTriggerDefeatVariable(enemy);
        const flashScreen = this.renderer?.flashScreen;
        if (typeof flashScreen === 'function') {
            flashScreen.call(this.renderer, { intensity: 0.8, duration: 160 });
        }

        this.renderer.draw();
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

    getEnemyDefinition(type) {
        if (typeof EnemyDefinitions?.getEnemyDefinition === 'function') {
            return EnemyDefinitions.getEnemyDefinition(type);
        }
        return null;
    }

    getEnemyDamage(type) {
        const definition = this.getEnemyDefinition(type);
        if (definition && Number.isFinite(definition.damage)) {
            return Math.max(1, definition.damage);
        }
        return 1;
    }

    getExperienceReward(type) {
        if (typeof EnemyDefinitions?.getExperienceReward === 'function') {
            return EnemyDefinitions.getExperienceReward(type);
        }
        const definition = this.getEnemyDefinition(type);
        const reward = Number(definition?.experience);
        if (Number.isFinite(reward)) {
            return Math.max(0, Math.floor(reward));
        }
        return 0;
    }

    getEnemyMissChance(type) {
        if (typeof EnemyDefinitions?.getMissChance === 'function') {
            const explicit = EnemyDefinitions.getMissChance(type);
            if (explicit !== null && explicit !== undefined) {
                return this.normalizeMissChance(explicit);
            }
        }
        return this.fallbackMissChance;
    }

    normalizeMissChance(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return 0.25;
        }
        return Math.max(0, Math.min(1, numeric));
    }

    attackMissed(chance) {
        let normalized;
        if (chance === undefined) {
            normalized = this.normalizeMissChance(this.fallbackMissChance);
            this.fallbackMissChance = normalized;
        } else {
            normalized = this.normalizeMissChance(chance);
        }
        if (normalized <= 0) return false;
        if (normalized >= 1) return true;
        return Math.random() < normalized;
    }

    getDefeatVariableConfig(enemy) {
        if (!enemy) return null;
        const definition = this.getEnemyDefinition(enemy.type);
        const baseConfig = (definition?.activateVariableOnDefeat && typeof definition.activateVariableOnDefeat === 'object')
            ? definition.activateVariableOnDefeat
            : null;
        let variableId = typeof enemy.defeatVariableId === 'string' ? enemy.defeatVariableId : null;
        if (!variableId) {
            const fallbackId = typeof baseConfig?.variableId === 'string' ? baseConfig.variableId : null;
            variableId = fallbackId;
        }
        if (typeof this.gameState?.normalizeVariableId === 'function') {
            variableId = this.gameState.normalizeVariableId(variableId);
        }
        if (!variableId) return null;
        const persist = baseConfig?.persist !== undefined ? Boolean(baseConfig.persist) : true;
        let message = null;
        if (typeof baseConfig?.message === 'string' && baseConfig.message.trim().length) {
            message = baseConfig.message.trim();
        } else if (baseConfig?.messageKey) {
            message = getEnemyLocaleText(baseConfig.messageKey, baseConfig.message || '');
        } else if (definition?.defeatActivationMessageKey) {
            message = getEnemyLocaleText(
                definition.defeatActivationMessageKey,
                definition.defeatActivationMessage?.trim() || ''
            );
        } else if (typeof definition?.defeatActivationMessage === 'string' && definition.defeatActivationMessage.trim().length) {
            message = definition.defeatActivationMessage.trim();
        }
        return { variableId, persist, message };
    }

    tryTriggerDefeatVariable(enemy) {
        const config = this.getDefeatVariableConfig(enemy);
        if (!config) return false;
        const setter = this.gameState?.setVariableValue;
        if (typeof setter !== 'function') return false;
        const updated = setter.call(this.gameState, config.variableId, true, config.persist);
        const isActive = typeof this.gameState?.isVariableOn === 'function'
            ? this.gameState.isVariableOn(config.variableId)
            : updated;
        if (!updated && !isActive) {
            return false;
        }

        if (config.message) {
            const indicator = this.renderer?.showCombatIndicator;
            if (typeof indicator === 'function') {
                indicator.call(this.renderer, config.message, { duration: 900 });
            } else if (typeof console !== 'undefined' && typeof console.info === 'function') {
                console.info('[EnemyManager]', config.message);
            }
        }
        return true;
    }

    showMissFeedback() {
        const fn = this.renderer?.showCombatIndicator;
        if (typeof fn === 'function') {
            fn.call(this.renderer, 'Miss', { duration: 500 });
        }
    }
}

if (typeof window !== 'undefined') {
    window.EnemyManager = EnemyManager;
}
