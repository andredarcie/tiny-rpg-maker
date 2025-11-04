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
                keys: 0
            },
            dialog: { active: false, text: "", page: 1, maxPages: 1, meta: null },
            enemies: [],
            variables: []
        };

        this.worldManager = new StateWorldManager(this.game, roomSize);
        this.variableManager = new StateVariableManager(this.game, this.state);
        this.objectManager = new StateObjectManager(this.game, this.worldManager, this.variableManager);
        this.enemyManager = new StateEnemyManager(this.game, this.state, this.worldManager);
        this.playerManager = new StatePlayerManager(this.state, this.worldManager);
        this.dialogManager = new StateDialogManager(this.state);
        this.itemManager = new StateItemManager(this.game);
        this.dataManager = new StateDataManager({
            game: this.game,
            worldManager: this.worldManager,
            objectManager: this.objectManager,
            variableManager: this.variableManager
        });
        this.playing = true;
        this.ensureDefaultVariables();
        this.resetGame();

        document.addEventListener('game-tab-activated', () => this.playing = true);
        document.addEventListener('editor-tab-activated', () => this.playing = false);
    }

    createEmptyRoom(size, index = 0, cols = 1) {
        return this.worldManager.createEmptyRoom(size, index, cols);
    }

    createWorldRooms(rows, cols, size) {
        return this.worldManager.createWorldRooms(rows, cols, size);
    }

    createEmptyTileMap(size) {
        return this.worldManager.createEmptyTileMap(size);
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
        return this.playerManager.getPlayer();
    }

    getDialog() {
        return this.dialogManager.getDialog();
    }

    setPlayerPosition(x, y, roomIndex = null) {
        this.playerManager.setPosition(x, y, roomIndex);
    }

    setDialog(active, text = "", meta = null) {
        this.dialogManager.setDialog(active, text, meta);
    }

    setDialogPage(page) {
        this.dialogManager.setPage(page);
    }

    resetGame() {
        this.playerManager.reset(this.game.start);
        this.dialogManager.reset();
        this.enemyManager.resetRuntime();
        this.variableManager.resetRuntime();
        this.itemManager.resetItems();
        this.objectManager.resetRuntime();
    }

    exportGameData() {
        return this.dataManager.exportGameData();
    }

    importGameData(data) {
        this.dataManager.importGameData(data);
        this.enemyManager.setGame(this.game);
        this.itemManager.setGame(this.game);
        this.objectManager.setGame(this.game);
        this.variableManager.setGame(this.game);
        this.ensureDefaultVariables();
        this.resetGame();
    }

    normalizeRooms(rooms, totalRooms, cols) {
        return this.worldManager.normalizeRooms(rooms, totalRooms, cols);
    }

    normalizeTileMaps(source, totalRooms) {
        return this.worldManager.normalizeTileMaps(source, totalRooms);
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

    addKeys(amount = 1) {
        return this.playerManager.addKeys(amount);
    }

    consumeKey() {
        return this.playerManager.consumeKey();
    }

    getKeys() {
        return this.playerManager.getKeys();
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
        return this.variableManager.setVariableValue(variableId, value, persist);
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

    damagePlayer(amount = 1) {
        return this.playerManager.damage(amount);
    }

    getLives() {
        return this.playerManager.getLives();
    }

    getMaxLives() {
        return typeof this.playerManager.getMaxLives === 'function'
            ? this.playerManager.getMaxLives()
            : 0;
    }

    getLevel() {
        return typeof this.playerManager.getLevel === 'function'
            ? this.playerManager.getLevel()
            : 1;
    }

    healPlayerToFull() {
        return typeof this.playerManager.healToFull === 'function'
            ? this.playerManager.healToFull()
            : this.getLives();
    }

    handleEnemyDefeated() {
        return typeof this.playerManager.handleEnemyDefeated === 'function'
            ? this.playerManager.handleEnemyDefeated()
            : { leveledUp: false };
    }
}

if (typeof window !== 'undefined') {
    window.GameState = GameState;
}
