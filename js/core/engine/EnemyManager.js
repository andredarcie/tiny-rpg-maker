const getEnemyLocaleText = (key, fallback = '') => {
    const value = TextResources.get(key, fallback);
    return value || fallback || '';
};

const formatEnemyLocaleText = (key, params = {}, fallback = '') => {
    const value = TextResources.format(key, params, fallback);
    return value || fallback || '';
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
        if (this.canAssassinate(enemy)) {
            this.assassinateEnemy(enemyIndex);
            return;
        }
        if (this.shouldIgnoreEnemyCollision(enemy)) {
            return;
        }
        const missChance = this.getEnemyMissChance(enemy.type);
        const attackMissed = this.attackMissed(missChance);

        enemies.splice(enemyIndex, 1);

        if (attackMissed) {
            this.showMissFeedback();
        } else {
            const damage = this.getEnemyDamage(enemy.type);
            const lives = this.gameState.damagePlayer(damage);
            const reduction = this.gameState.consumeLastDamageReduction();
            const revived = this.gameState.consumeRecentReviveFlag?.() || false;
            if (revived) {
                this.renderer.showCombatIndicator(getEnemyLocaleText('skills.necromancer.revive', ''), { duration: 900 });
            }
            if (reduction > 0) {
                const text = reduction >= damage
                    ? getEnemyLocaleText('combat.block.full', '')
                    : formatEnemyLocaleText('combat.block.partial', { value: reduction }, '');
                this.renderer.showCombatIndicator(text, { duration: 700 });
            }
            if (lives <= 0) {
                this.onPlayerDefeated();
                return;
            }
        }

        const experienceReward = this.getExperienceReward(enemy.type);
        const defeatResult = this.gameState.handleEnemyDefeated(experienceReward);
        if (defeatResult?.leveledUp && this.shouldStartLevelOverlay()) {
            this.gameState.startLevelUpSelectionIfNeeded?.();
        }

        this.tryTriggerDefeatVariable(enemy);
        this.renderer.flashScreen({ intensity: 0.8, duration: 160 });

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
            const enemy = enemies[index];
            if (this.canAssassinate(enemy)) {
                this.assassinateEnemy(index);
                return;
            }
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
        const OT = ObjectTypes;
        const blockingObject = this.gameState.getObjectAt?.(roomIndex, x, y) ?? null;
        if (!blockingObject) return false;
        if (blockingObject.type === OT.DOOR && !blockingObject.opened) return true;
        if (blockingObject.type === OT.DOOR_VARIABLE) {
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
            const enemy = this.gameState.getEnemies()?.[enemyIndex] || null;
            if (this.canAssassinate(enemy)) {
                this.assassinateEnemy(enemyIndex);
                return true;
            }
            this.handleEnemyCollision(enemyIndex);
            return true;
        }
        return false;
    }

    normalizeEnemyType(type) {
        return EnemyDefinitions.normalizeType(type);
    }

    getEnemyDefinition(type) {
        return EnemyDefinitions.getEnemyDefinition(type);
    }

    enemyHasEyes(enemy) {
        if (!enemy) return true;
        const definition = this.getEnemyDefinition(enemy.type);
        if (!definition) return true;
        if (definition.hasEyes === false) return false;
        return true;
    }

    shouldIgnoreEnemyCollision(_enemy) {
        // Stealth is handled directly in collision flows.
        return false;
    }

    canAssassinate(enemy) {
        const stealth = this.gameState.hasSkill?.('stealth');
        if (!stealth || !enemy) return false;
        const damage = this.getEnemyDamage(enemy.type);
        return damage <= 3;
    }

    assassinateEnemy(enemyIndex) {
        const enemies = this.gameState.getEnemies();
        const enemy = enemies?.[enemyIndex];
        if (!enemy) return;
        const type = this.normalizeEnemyType(enemy.type);
        enemies.splice(enemyIndex, 1);

        const experienceReward = this.getExperienceReward(type);
        const defeatResult = this.gameState.handleEnemyDefeated(experienceReward);
        if (defeatResult?.leveledUp && this.shouldStartLevelOverlay()) {
            this.gameState.startLevelUpSelectionIfNeeded?.();
        }
        this.tryTriggerDefeatVariable({ ...enemy, type });
        this.showStealthKillFeedback();
        this.renderer.flashScreen({ intensity: 0.4, duration: 120 });
        this.renderer.draw();
    }

    showStealthKillFeedback() {
        const text = getEnemyLocaleText('combat.stealthKill', '');
        if (!text) return;
        this.renderer.showCombatIndicator?.(text, { duration: 800 });
    }

    shouldStartLevelOverlay() {
        return Boolean(this.gameState?.getPendingLevelUpChoices?.() > 0);
    }

    getEnemyDamage(type) {
        const definition = this.getEnemyDefinition(type);
        if (definition && Number.isFinite(definition.damage)) {
            return Math.max(1, definition.damage);
        }
        return 1;
    }

    getExperienceReward(type) {
        return EnemyDefinitions.getExperienceReward(type);
    }

    getEnemyMissChance(type) {
        const explicit = EnemyDefinitions.getMissChance(type);
        if (explicit !== null && explicit !== undefined) {
            return this.normalizeMissChance(explicit);
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
        variableId = this.gameState.normalizeVariableId(variableId);
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
        const updated = this.gameState.setVariableValue(config.variableId, true, config.persist);
        const isActive = this.gameState.isVariableOn(config.variableId);
        if (!updated && !isActive) {
            return false;
        }

        if (config.message) {
            this.renderer.showCombatIndicator(config.message, { duration: 900 });
        }
        return true;
    }

    showMissFeedback() {
        this.renderer.showCombatIndicator('Miss', { duration: 500 });
    }
}

if (typeof window !== 'undefined') {
    window.EnemyManager = EnemyManager;
}
