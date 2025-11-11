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
        this.renderer = new Renderer(canvas, this.gameState, this.tileManager, this.npcManager, this);
        this.dialogManager = new DialogManager(this.gameState, this.renderer);
        this.interactionManager = new InteractionManager(this.gameState, this.dialogManager);
        this.enemyManager = new EnemyManager(this.gameState, this.renderer, this.tileManager, {
            onPlayerDefeated: () => this.handlePlayerDefeat(),
            dialogManager: this.dialogManager
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
        this.awaitingRestart = false;
        this.introVisible = false;
        this.introStartTime = 0;
        this.introData = { title: 'Tiny RPG Maker', author: '' };
        this.canDismissIntroScreen = false;
        this.timeToResetAfterIntro = 2000;
        this.setupIntroScreen();

        // Ensure there is at least a ground layer
        this.tileManager.ensureDefaultTiles();

        // Draw the first frame
        this.syncDocumentTitle();
        this.renderer.draw();
        this.showIntroScreen();
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
        this.awaitingRestart = false;
        this.gameState.setGameOver?.(false);
        this.gameState.resumeGame?.('game-over');
        this.gameState.resetGame();
        this.startEnemyLoop();
        this.dialogManager.reset();
        this.renderer.draw();
        this.showIntroScreen();
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
        this.showIntroScreen();
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

    setupIntroScreen() {
        if (typeof document === 'undefined') return;
        this.refreshIntroScreen();
    }

    showIntroScreen() {
        this.canDismissIntroScreen = false;
        setTimeout(() => {
            this.canDismissIntroScreen = true;
        }, this.timeToResetAfterIntro);

        this.refreshIntroScreen();
        this.introVisible = true;
        this.introStartTime = (typeof performance !== 'undefined' && performance.now)
            ? performance.now()
            : Date.now();
        this.gameState.pauseGame?.('intro-screen');
        this.renderer.draw();
    }

    dismissIntroScreen() {
        if (!this.introVisible || !this.canDismissIntroScreen) return false;
        this.introVisible = false;
        this.gameState.resumeGame?.('intro-screen');
        this.renderer.draw();
        return true;
    }

    isIntroVisible() {
        return Boolean(this.introVisible);
    }

    refreshIntroScreen() {
        const game = this.getGame();
        this.introData = {
            title: game.title || 'Tiny RPG Maker',
            author: (game.author || '').trim()
        };
        if (typeof this.renderer?.setIntroData === 'function') {
            this.renderer.setIntroData(this.introData);
        }
    }

    getIntroData() {
        return this.introData || { title: 'Tiny RPG Maker', author: '' };
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
        const [changed, _] = this.gameState.setVariableValue(variableId, value, true);
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

    setEnemyVariable(enemyId, variableId = null) {
        if (typeof this.gameState.setEnemyVariable !== 'function') {
            return false;
        }
        const changed = this.gameState.setEnemyVariable(enemyId, variableId);
        if (changed) {
            this.renderer.draw();
        }
        return changed;
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

    handlePlayerDefeat() {
        this.enemyManager.stop();
        this.gameState.pauseGame?.('game-over');
        this.gameState.setGameOver?.(true);
        this.awaitingRestart = true;
        this.renderer.draw();
    }

    isGameOver() {
        if (typeof this.gameState.isGameOver === 'function') {
            return this.gameState.isGameOver();
        }
        return this.awaitingRestart;
    }

    handleGameOverInteraction() {
        if (!this.isGameOver() || !this.gameState.canResetAfterGameOver) return;
        this.resetGame();
    }
}

if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
