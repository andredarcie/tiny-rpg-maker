/**
 * GameState stores the persistent game definition and runtime state.
 */
class GameState {
    constructor() {
        const worldRows = 3;
        const worldCols = 3;
        const roomSize = 8;
        const totalRooms = worldRows * worldCols;

        this.game = {
            title: "My Tiny RPG Game",
            author: "",
            palette: ['#000000', '#1D2B53', '#FFF1E8'],
            roomSize,
            world: {
                rows: worldRows,
                cols: worldCols
            },
            rooms: StateWorldManager.createWorldRooms(worldRows, worldCols, roomSize),
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            enemies: [],
            items: [],
            objects: [],
            variables: [],
            exits: [],
            tileset: {
                tiles: [],
                maps: Array.from({ length: totalRooms }, () => StateWorldManager.createEmptyTileMap(roomSize))
            }
        };
        this.game.tileset.map = this.game.tileset.maps[0];

        this.state = {
            player: {
                x: 1,
                y: 1,
                lastX: 1,
                roomIndex: 0,
                level: 1,
                maxLives: 3,
                currentLives: 3,
                lives: 3,
                keys: 0,
                experience: 0,
                damageShield: 0,
                damageShieldMax: 0,
                swordType: null,
                lastDamageReduction: 0
            },
            dialog: { active: false, text: "", page: 1, maxPages: 1, meta: null },
            enemies: [],
            variables: [],
            gameOver: false,
            gameOverReason: null,
            pickupOverlay: {
                active: false,
                name: '',
                spriteGroup: null,
                spriteType: null,
                effect: null
            },
            levelUpOverlay: {
                active: false,
                choices: [],
                cursor: 0
            },
            levelUpCelebration: {
                active: false,
                level: null,
                startTime: 0,
                timeoutId: 0,
                durationMs: 3000
            },
            skillRuntime: null
        };

        this.worldManager = new StateWorldManager(this.game, roomSize);
        this.variableManager = new StateVariableManager(this.game, this.state);
        this.objectManager = new StateObjectManager(this.game, this.worldManager, this.variableManager);
        this.enemyManager = new StateEnemyManager(this.game, this.state, this.worldManager);
        this.skillManager = new StateSkillManager(this.state);
        this.playerManager = new StatePlayerManager(this.state, this.worldManager, this.skillManager);
        this.playerManager.setSkillManager?.(this.skillManager);
        this.dialogManager = new StateDialogManager(this.state);
        this.itemManager = new StateItemManager(this.game);
        this.worldFacade = new GameStateWorldFacade(this, this.worldManager);
        this.playerFacade = new GameStatePlayerFacade(this, this.playerManager);
        this.screenManager = new GameStateScreenManager(this);
        this.dataManager = new StateDataManager({
            game: this.game,
            worldManager: this.worldManager,
            objectManager: this.objectManager,
            variableManager: this.variableManager
        });
        this.dataFacade = new GameStateDataFacade(this, this.dataManager);
        this.playing = false;
        this.lifecycle = new GameStateLifecycle(this, this.screenManager, { timeToResetAfterGameOver: 2000 });
        this.ensureDefaultVariables();
        this.resetGame();
        this.reviveSnapshot = null;

        this.editorMode = false;
        document.addEventListener('game-tab-activated', () => {
            this.setEditorMode(false);
        });
        document.addEventListener('editor-tab-activated', () => {
            this.setEditorMode(true);
        });
    }

    createEmptyRoom(size, index = 0, cols = 1) {
        return this.worldFacade.createEmptyRoom(size, index, cols);
    }

    createWorldRooms(rows, cols, size) {
        return this.worldFacade.createWorldRooms(rows, cols, size);
    }

    createEmptyTileMap(size) {
        return this.worldFacade.createEmptyTileMap(size);
    }

    getGame() {
        return this.game;
    }

    getState() {
        return this.state;
    }

    getCurrentRoom() {
        const index = this.worldManager.clampRoomIndex(this.state.player.roomIndex);
        this.state.player.roomIndex = index;
        return this.game.rooms[index];
    }

    getPlayer() {
        return this.playerFacade.getPlayer();
    }

    getSkills() {
        return this.skillManager.getOwnedSkills();
    }

    hasSkill(skillId) {
        return this.skillManager.hasSkill(skillId);
    }

    getPendingLevelUpChoices() {
        return this.skillManager.getPendingSelections();
    }

    isLevelUpOverlayActive() {
        return this.skillManager.isOverlayActive();
    }

    getLevelUpOverlay() {
        return this.skillManager.getOverlay();
    }

    startLevelUpSelectionIfNeeded() {
        if (this.isLevelUpCelebrationActive()) {
            return null;
        }
        if (this.skillManager.hasPendingSelections() && !this.skillManager.isOverlayActive()) {
            const started = this.skillManager.startLevelSelection();
            if (started) {
                this.pauseGame('level-up');
            }
        }
    }

    queueLevelUpChoices(count = 1, latestLevel = null) {
        this.skillManager.queueLevelUps(count, latestLevel);
        this.startLevelUpSelectionIfNeeded();
        return this.skillManager.getPendingSelections();
    }

    moveLevelUpCursor(delta = 0) {
        const cursor = this.skillManager.moveCursor(delta);
        return cursor;
    }

    selectLevelUpSkill(index = null) {
        if (!this.skillManager.isOverlayActive()) {
            return null;
        }
        const choice = this.skillManager.completeSelection(index);
        if (choice?.id === 'max-life') {
            this.playerManager.healToFull();
        }
        if (this.skillManager.hasPendingSelections()) {
            const started = this.skillManager.startLevelSelection();
            if (started) {
                this.pauseGame('level-up');
            }
        } else {
            this.resumeGame('level-up');
        }
        return choice;
    }

    consumeRecentReviveFlag() {
        return this.skillManager.consumeRecentReviveFlag();
    }

    getDialog() {
        return this.dialogManager.getDialog();
    }

    setPlayerPosition(x, y, roomIndex = null) {
        this.playerFacade.setPlayerPosition(x, y, roomIndex);
    }

    setDialog(active, text = "", meta = null) {
        this.dialogManager.setDialog(active, text, meta);
    }

    setDialogPage(page) {
        this.dialogManager.setPage(page);
    }

    setEditorMode(active = false) {
        this.editorMode = Boolean(active);
    }

    isEditorModeActive() {
        return Boolean(this.editorMode);
    }

    resetGame() {
        this.screenManager.reset();
        this.skillManager.resetRuntime();
        this.playerFacade.resetPlayer();
        this.dialogManager.reset();
        this.enemyManager.resetRuntime();
        this.variableManager.resetRuntime();
        this.itemManager.resetItems();
        this.objectManager.resetRuntime();
        this.objectManager.ensurePlayerStartObject();
        this.setGameOver(false);
        this.hidePickupOverlay();
        this.clearNecromancerRevive();
        this.hideLevelUpCelebration({ skipResume: true });
        this.resumeGame('game-over');
    }

    exportGameData() {
        return this.dataFacade.exportGameData();
    }

    importGameData(data) {
        this.dataFacade.importGameData(data);
    }

    normalizeRooms(rooms, totalRooms, cols) {
        return this.worldFacade.normalizeRooms(rooms, totalRooms, cols);
    }

    normalizeTileMaps(source, totalRooms) {
        return this.worldFacade.normalizeTileMaps(source, totalRooms);
    }

    normalizeObjects(objects) {
        return this.objectManager.normalizeObjects(objects);
    }

    cloneEnemies(enemies) {
        return this.enemyManager.cloneEnemies(enemies);
    }

    generateObjectId(type, roomIndex) {
        return this.objectManager.generateObjectId(type, roomIndex);
    }

    getObjects() {
        return this.objectManager.getObjects();
    }

    getObjectsForRoom(roomIndex) {
        return this.objectManager.getObjectsForRoom(roomIndex);
    }

    getObjectAt(roomIndex, x, y) {
        return this.objectManager.getObjectAt(roomIndex, x, y);
    }

    setObjectPosition(type, roomIndex, x, y) {
        return this.objectManager.setObjectPosition(type, roomIndex, x, y);
    }

    removeObject(type, roomIndex) {
        this.objectManager.removeObject(type, roomIndex);
    }

    setObjectVariable(type, roomIndex, variableId) {
        return this.objectManager.setObjectVariable(type, roomIndex, variableId);
    }

    setPlayerEndText(roomIndex, text) {
        return this.objectManager.setPlayerEndText(roomIndex, text);
    }

    getPlayerEndText(roomIndex = null) {
        return this.objectManager.getPlayerEndText(roomIndex);
    }

    setActiveEndingText(text = '') {
        return this.screenManager.setActiveEndingText(text);
    }

    getActiveEndingText() {
        return this.screenManager.getActiveEndingText();
    }

    addKeys(amount = 1) {
        return this.playerFacade.addKeys(amount);
    }

    addLife(amount = 1) {
        return this.playerFacade.addLife(amount);
    }

    addDamageShield(amount = 1, type = null) {
        return this.playerFacade.addDamageShield(amount, type);
    }

    getDamageShield() {
        return this.playerFacade.getDamageShield();
    }

    getDamageShieldMax() {
        return this.playerFacade.getDamageShieldMax();
    }

    getSwordType() {
        return this.playerFacade.getSwordType();
    }

    consumeKey() {
        return this.playerFacade.consumeKey();
    }

    getKeys() {
        return this.playerFacade.getKeys();
    }

    getMaxKeys() {
        return this.playerFacade.getMaxKeys();
    }

    consumeLastDamageReduction() {
        return this.playerFacade.consumeLastDamageReduction();
    }

    ensureDefaultVariables() {
        return this.variableManager.ensureDefaultVariables();
    }

    cloneVariables(list) {
        return this.variableManager.cloneVariables(list);
    }

    normalizeVariables(source) {
        return this.variableManager.normalizeVariables(source);
    }

    getVariableDefinitions() {
        return this.variableManager.getVariableDefinitions();
    }

    getVariables() {
        return this.variableManager.getVariables();
    }

    normalizeVariableId(variableId) {
        return this.variableManager.normalizeVariableId(variableId);
    }

    getVariable(variableId) {
        return this.variableManager.getVariable(variableId);
    }

    isVariableOn(variableId) {
        return this.variableManager.isVariableOn(variableId);
    }

    setVariableValue(variableId, value, persist = false) {
        const success = this.variableManager.setVariableValue(variableId, value, persist);
        let openedMagicDoor = false;
        if (success) {
            openedMagicDoor = this.objectManager.checkOpenedMagicDoor(variableId, value)
            this.objectManager.syncSwitchState?.(variableId, value);
        }
        return [success, openedMagicDoor];
    }

    getEnemies() {
        return this.enemyManager.getEnemies();
    }

    getEnemyDefinitions() {
        return this.enemyManager.getEnemyDefinitions();
    }

    clampRoomIndex(value) {
        return this.worldManager.clampRoomIndex(value);
    }

    clampCoordinate(value) {
        return this.worldManager.clampCoordinate(value);
    }

    getWorldRows() {
        return this.worldManager.getWorldRows();
    }

    getWorldCols() {
        return this.worldManager.getWorldCols();
    }

    getRoomCoords(index) {
        return this.worldManager.getRoomCoords(index);
    }

    getRoomIndex(row, col) {
        return this.worldManager.getRoomIndex(row, col);
    }

    addEnemy(enemy) {
        return this.enemyManager.addEnemy(enemy);
    }

    removeEnemy(enemyId) {
        this.enemyManager.removeEnemy(enemyId);
    }

    setEnemyPosition(enemyId, x, y, roomIndex = null) {
        this.enemyManager.setEnemyPosition(enemyId, x, y, roomIndex);
    }

    setEnemyVariable(enemyId, variableId = null) {
        const normalized = this.normalizeVariableId(variableId);
        return this.enemyManager.setEnemyVariable(enemyId, normalized);
    }

    damagePlayer(amount = 1) {
        return this.playerFacade.damage(amount);
    }

    getLives() {
        return this.playerFacade.getLives();
    }

    getMaxLives() {
        return this.playerFacade.getMaxLives();
    }

    getLevel() {
        return this.playerFacade.getLevel();
    }

    healPlayerToFull() {
        return this.playerFacade.healPlayerToFull();
    }

    getExperience() {
        return this.playerFacade.getExperience();
    }

    getExperienceToNext() {
        return this.playerFacade.getExperienceToNext();
    }

    addExperience(amount = 0) {
        const result = this.playerFacade.addExperience(amount);
        return this.processLevelUpResult(result);
    }

    handleEnemyDefeated(experienceReward = 0) {
        const result = this.playerFacade.handleEnemyDefeated(experienceReward);
        return this.processLevelUpResult(result);
    }

    processLevelUpResult(result = null) {
        if (result?.leveledUp) {
            this.showLevelUpCelebration(result.level);
            const levels = Number.isFinite(result.levelsGained)
                ? Math.max(1, Math.floor(result.levelsGained))
                : 1;
            this.queueLevelUpChoices(levels, result.level);
        }
        return result;
    }

    getPickupOverlay() {
        if (!this.state.pickupOverlay) {
            this.state.pickupOverlay = {
                active: false,
                name: '',
                spriteGroup: null,
                spriteType: null,
                effect: null
            };
        }
        return this.state.pickupOverlay;
    }

    showPickupOverlay(options = {}) {
        const overlay = this.getPickupOverlay();
        overlay.active = true;
        overlay.name = options.name || options.title || '';
        overlay.spriteGroup = options.spriteGroup || null;
        overlay.spriteType = options.spriteType || null;
        overlay.effect = typeof options.effect === 'function' ? options.effect : null;
        this.pauseGame('pickup-overlay');
    }

    hidePickupOverlay() {
        const overlay = this.getPickupOverlay();
        if (!overlay.active) return;
        overlay.active = false;
        const effect = overlay.effect;
        overlay.effect = null;
        overlay.name = '';
        overlay.spriteGroup = null;
        overlay.spriteType = null;
        if (typeof effect === 'function') {
            try {
                effect();
            } catch (err) {
                console.error('Pickup overlay effect error:', err);
            }
        }
        this.resumeGame('pickup-overlay');
    }

    isPickupOverlayActive() {
        return Boolean(this.getPickupOverlay().active);
    }

    getLevelUpCelebration() {
        if (!this.state.levelUpCelebration) {
            this.state.levelUpCelebration = {
                active: false,
                level: null,
                startTime: 0,
                timeoutId: 0,
                durationMs: 3000
            };
        }
        return this.state.levelUpCelebration;
    }

    showLevelUpCelebration(level = null, options = {}) {
        const overlay = this.getLevelUpCelebration();
        const numericLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : this.getLevel();
        overlay.active = true;
        overlay.level = numericLevel;
        overlay.startTime = this.getNow();
        overlay.durationMs = Number.isFinite(options.durationMs)
            ? Math.max(300, Math.floor(options.durationMs))
            : (overlay.durationMs || 3000);
        if (overlay.timeoutId) {
            clearTimeout(overlay.timeoutId);
            overlay.timeoutId = 0;
        }
        const duration = overlay.durationMs || 3000;
        overlay.timeoutId = setTimeout(() => this.hideLevelUpCelebration(), duration);
        this.pauseGame('level-up-celebration');
    }

    hideLevelUpCelebration({ skipResume = false } = {}) {
        const overlay = this.getLevelUpCelebration();
        if (overlay.timeoutId) {
            clearTimeout(overlay.timeoutId);
            overlay.timeoutId = 0;
        }
        const wasActive = overlay.active;
        overlay.active = false;
        overlay.level = null;
        overlay.startTime = 0;
        overlay.durationMs = overlay.durationMs || 3000;
        if (wasActive && !skipResume) {
            this.resumeGame('level-up-celebration');
            this.startLevelUpSelectionIfNeeded();
        }
    }

    isLevelUpCelebrationActive() {
        return Boolean(this.getLevelUpCelebration().active);
    }

    getNow() {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now();
        }
        return Date.now();
    }

    enableGameOverInteraction() {
        this.screenManager.clearGameOverCooldown?.();
        this.screenManager.canResetAfterGameOver = true;
    }

    prepareNecromancerRevive() {
        if (!this.skillManager.hasPendingManualRevive?.()) {
            return false;
        }
        this.reviveSnapshot = this.captureReviveSnapshot();
        return Boolean(this.reviveSnapshot);
    }

    hasNecromancerReviveReady() {
        return Boolean(this.skillManager.hasPendingManualRevive?.() && this.reviveSnapshot);
    }

    reviveFromNecromancer() {
        if (!this.hasNecromancerReviveReady()) return false;
        const restored = this.restoreReviveSnapshot(this.reviveSnapshot);
        this.reviveSnapshot = null;
        if (!restored) {
            return false;
        }
        const consumed = this.skillManager.consumeManualRevive?.();
        if (!consumed) {
            return false;
        }
        if (this.state?.player) {
            const maxLives = Number.isFinite(this.state.player.maxLives)
                ? Math.max(1, Math.floor(this.state.player.maxLives))
                : 1;
            this.state.player.currentLives = maxLives;
            this.state.player.lives = maxLives;
        }
        this.lifecycle.setGameOver(false, null);
        this.lifecycle.resumeGame('game-over');
        this.screenManager.clearGameOverCooldown?.();
        return true;
    }

    clearNecromancerRevive() {
        this.reviveSnapshot = null;
        this.skillManager.clearManualReviveFlag?.();
    }

    captureReviveSnapshot() {
        try {
            const gameCopy = this.safeClone(this.game);
            const stateCopy = this.safeClone(this.state);
            return { game: gameCopy, state: stateCopy };
        } catch (err) {
            console.error('Failed to capture revive snapshot', err);
            return null;
        }
    }

    restoreReviveSnapshot(snapshot = null) {
        if (!snapshot?.game || !snapshot?.state) return false;
        try {
            this.assignData(this.game, snapshot.game);
            this.assignData(this.state, snapshot.state);
            this.worldManager.setGame?.(this.game);
            this.objectManager.setGame?.(this.game);
            this.variableManager.setGame?.(this.game);
            this.itemManager.setGame?.(this.game);
            return true;
        } catch (err) {
            console.error('Failed to restore revive snapshot', err);
            return false;
        }
    }

    assignData(target, source) {
        if (!target || !source) return;
        Object.keys(target).forEach((key) => {
            delete target[key];
        });
        Object.keys(source).forEach((key) => {
            target[key] = this.safeClone(source[key]);
        });
    }

    safeClone(value) {
        if (typeof structuredClone === 'function') {
            return structuredClone(value);
        }
        return JSON.parse(JSON.stringify(value));
    }

    pauseGame(reason = 'manual') {
        this.lifecycle.pauseGame(reason);
    }

    resumeGame(reason = 'manual') {
        this.lifecycle.resumeGame(reason);
    }

    setGameOver(active = true, reason = 'defeat') {
        this.lifecycle.setGameOver(active, reason);
    }

    isGameOver() {
        return this.lifecycle.isGameOver();
    }

    getGameOverReason() {
        return this.lifecycle.getGameOverReason();
    }

    get canResetAfterGameOver() {
        return this.screenManager.canResetAfterGameOver;
    }
}

if (typeof window !== 'undefined') {
    window.GameState = GameState;
}
