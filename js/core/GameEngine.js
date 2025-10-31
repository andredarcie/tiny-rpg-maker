/**
 * GameEngine coordinates every core module in the runtime.
 */
class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;

        // Boot core subsystems
        this.gameState = new GameState();
        this.tileManager = new TileManager(this.gameState);
        this.npcManager = new NPCManager(this.gameState);
        this.npcManager.ensureDefaultNPCs?.();
        this.renderer = new Renderer(canvas, this.gameState, this.tileManager, this.npcManager);
        this.dialogManager = new DialogManager(this.gameState, this.renderer);
        this.interactionManager = new InteractionManager(this.gameState, this.dialogManager);
        this.enemyManager = new EnemyManager(this.gameState, this.renderer, this.tileManager, {
            onPlayerDefeated: () => this.resetGame()
        });
        this.movementManager = new MovementManager({
            gameState: this.gameState,
            tileManager: this.tileManager,
            renderer: this.renderer,
            dialogManager: this.dialogManager,
            interactionManager: this.interactionManager,
            enemyManager: this.enemyManager
        });
        this.inputManager = new InputManager(this);

        // Ensure there is at least a ground layer
        this.tileManager.ensureDefaultTiles();

        // Draw the first frame
        this.syncDocumentTitle();
        this.renderer.draw();
        this.startEnemyLoop();
    }

    // Movement and interaction handling
    tryMove(dx, dy) {
        this.movementManager.tryMove(dx, dy);
    }

    checkInteractions() {
        this.interactionManager.handlePlayerInteractions();
    }

    showDialog(text, options = {}) {
        this.dialogManager.showDialog(text, options);
    }

    completeDialog() {
        this.dialogManager.completeDialog();
    }

    closeDialog() {
        this.dialogManager.closeDialog();
    }

    resetGame() {
        this.gameState.resetGame();
        this.startEnemyLoop();
        this.dialogManager.reset();
        this.renderer.draw();
    }

    // Data helpers
    exportGameData() {
        return this.gameState.exportGameData();
    }

    importGameData(data) {
        this.gameState.importGameData(data);
        this.npcManager.ensureDefaultNPCs?.();
        this.tileManager.ensureDefaultTiles();
        this.syncDocumentTitle();
        this.startEnemyLoop();
        this.dialogManager.reset();
        this.renderer.draw();
    }

    // Compatibility accessors
    getState() {
        return this.gameState.getState();
    }

    getGame() {
        return this.gameState.getGame();
    }

    draw() {
        this.renderer.draw();
    }

    // Utility helpers
    clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }

    syncDocumentTitle() {
        const game = this.gameState.getGame();
        document.title = game.title || 'Tiny RPG Maker';
    }

    // Editor-facing helpers
    getTiles() {
        return this.tileManager.getTiles();
    }

    getTileMap(roomIndex = null) {
        const playerRoom = this.gameState.getPlayer()?.roomIndex ?? 0;
        const targetRoom = roomIndex === null || roomIndex === undefined ? playerRoom : roomIndex;
        return this.tileManager.getTileMap(targetRoom);
    }

    getTilePresetNames() {
        return this.tileManager.getPresetTileNames();
    }

    getVariableDefinitions() {
        return this.gameState.getVariableDefinitions();
    }

    getRuntimeVariables() {
        return this.gameState.getVariables();
    }

    setVariableDefault(variableId, value) {
        const changed = this.gameState.setVariableValue(variableId, value, true);
        if (changed) {
            this.renderer.draw();
        }
        return changed;
    }

    isVariableOn(variableId) {
        return this.gameState.isVariableOn(variableId);
    }

    getObjects() {
        return this.gameState.getObjects();
    }

    getObjectsForRoom(roomIndex = null) {
        const playerRoom = this.gameState.getPlayer()?.roomIndex ?? 0;
        const targetRoom = roomIndex === null || roomIndex === undefined ? playerRoom : roomIndex;
        return this.gameState.getObjectsForRoom(targetRoom);
    }

    setObjectPosition(type, roomIndex, x, y) {
        const entry = this.gameState.setObjectPosition(type, roomIndex, x, y);
        this.renderer.draw();
        return entry;
    }

    setObjectVariable(type, roomIndex, variableId) {
        const updated = this.gameState.setObjectVariable?.(type, roomIndex, variableId);
        this.renderer.draw();
        return updated;
    }

    removeObject(type, roomIndex) {
        this.gameState.removeObject(type, roomIndex);
        this.renderer.draw();
    }

    getKeyCount() {
        return typeof this.gameState.getKeys === 'function'
            ? this.gameState.getKeys()
            : 0;
    }

    getSprites() {
        this.npcManager.ensureDefaultNPCs?.();
        return this.npcManager.getNPCs();
    }

    updateTile(tileId, data) {
        this.tileManager.updateTile(tileId, data);
    }

    setMapTile(x, y, tileId, roomIndex = null) {
        const playerRoom = this.gameState.getPlayer()?.roomIndex ?? 0;
        const targetRoom = roomIndex === null || roomIndex === undefined ? playerRoom : roomIndex;
        this.tileManager.setMapTile(x, y, tileId, targetRoom);
    }

    addSprite(npc) {
        return this.npcManager.addNPC(npc);
    }

    // Enemy helpers
    getEnemyDefinitions() {
        return this.enemyManager.getEnemyDefinitions();
    }

    getActiveEnemies() {
        return this.enemyManager.getActiveEnemies();
    }

    addEnemy(enemy) {
        return this.enemyManager.addEnemy(enemy);
    }

    removeEnemy(enemyId) {
        this.enemyManager.removeEnemy(enemyId);
    }

    generateEnemyId() {
        return this.enemyManager.generateEnemyId();
    }

    startEnemyLoop() {
        this.enemyManager.start();
    }

    tickEnemies() {
        this.enemyManager.tick();
    }

    handleEnemyCollision(enemyIndex) {
        this.enemyManager.handleEnemyCollision(enemyIndex);
    }

    checkEnemyCollisionAt(x, y) {
        this.enemyManager.checkCollisionAt(x, y);
    }
}

if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
