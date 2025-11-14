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
                lastDamageReduction: 0
            },
            dialog: { active: false, text: "", page: 1, maxPages: 1, meta: null },
            enemies: [],
            variables: [],
            gameOver: false,
            gameOverReason: null
        };

        this.worldManager = new StateWorldManager(this.game, roomSize);
        this.variableManager = new StateVariableManager(this.game, this.state);
        this.objectManager = new StateObjectManager(this.game, this.worldManager, this.variableManager);
        this.enemyManager = new StateEnemyManager(this.game, this.state, this.worldManager);
        this.playerManager = new StatePlayerManager(this.state, this.worldManager);
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

        document.addEventListener('game-tab-activated', () => this.resumeGame('tab'));
        document.addEventListener('editor-tab-activated', () => this.pauseGame('tab'));
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

    resetGame() {
        this.screenManager.reset();
        this.playerFacade.resetPlayer();
        this.dialogManager.reset();
        this.enemyManager.resetRuntime();
        this.variableManager.resetRuntime();
        this.itemManager.resetItems();
        this.objectManager.resetRuntime();
        this.objectManager.ensurePlayerStartObject();
        this.setGameOver(false);
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

    addDamageShield(amount = 1) {
        return this.playerFacade.addDamageShield(amount);
    }

    getDamageShield() {
        return this.playerFacade.getDamageShield();
    }

    consumeKey() {
        return this.playerFacade.consumeKey();
    }

    getKeys() {
        return this.playerFacade.getKeys();
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
        this.enemyManager.addEnemy(enemy);
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
        return this.playerFacade.addExperience(amount);
    }

    handleEnemyDefeated(experienceReward = 0) {
        return this.playerFacade.handleEnemyDefeated(experienceReward);
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
