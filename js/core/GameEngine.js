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
        this.interactionManager = new InteractionManager(this.gameState, this.dialogManager, {
            onPlayerVictory: () => this.handleGameCompletion()
        });
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

    isPickupOverlayActive() {
        return this.gameState.isPickupOverlayActive?.();
    }

    dismissPickupOverlay() {
        if (!this.gameState.isPickupOverlayActive?.()) return;
        this.gameState.hidePickupOverlay?.();
        this.renderer.draw();
    }

    isLevelUpCelebrationActive() {
        return this.gameState.isLevelUpCelebrationActive?.();
    }

    dismissLevelUpCelebration() {
        if (!this.gameState.isLevelUpCelebrationActive?.()) return;
        this.gameState.hideLevelUpCelebration?.();
        this.renderer.draw();
    }

    isLevelUpOverlayActive() {
        return this.gameState.isLevelUpOverlayActive?.();
    }

    moveLevelUpCursor(delta = 0) {
        if (!this.isLevelUpOverlayActive()) return;
        this.gameState.moveLevelUpCursor?.(delta);
        this.renderer.draw();
    }

    confirmLevelUpSelection() {
        if (!this.isLevelUpOverlayActive()) return;
        const overlay = this.gameState.getLevelUpOverlay?.();
        const selection = Number.isFinite(overlay?.cursor) ? overlay.cursor : 0;
        this.chooseLevelUpSkill(selection);
    }

    chooseLevelUpSkill(index = null) {
        if (!this.isLevelUpOverlayActive()) return;
        const choice = this.gameState.selectLevelUpSkill?.(index);
        if (choice) {
            const name = this.getSkillDisplayName(choice);
            const message = TextResources.format('skills.pickupMessage', { name }, '') || `Você aprendeu ${name}`;
            this.dialogManager.showDialog?.(message);
        }
        this.renderer.draw();
    }

    getSkillDisplayName(choice = null) {
        if (!choice) return 'skill';
        if (choice.nameKey) {
            const localized = TextResources.get(choice.nameKey, choice.id || 'skill');
            if (localized) return localized;
        }
        if (choice.id) return choice.id;
        return 'skill';
    }

    pickLevelUpChoiceFromPointer(clientX, clientY) {
        const overlay = this.gameState.getLevelUpOverlay?.();
        if (!overlay?.active) return null;
        const choices = Array.isArray(overlay.choices) ? overlay.choices : [];
        if (!choices.length) return null;
        const rect = this.canvas?.getBoundingClientRect?.();
        if (!rect || !Number.isFinite(clientX) || !Number.isFinite(clientY)) {
            return Number.isFinite(overlay.cursor) ? overlay.cursor : 0;
        }
        const scaleX = this.canvas.width / (rect.width || 1);
        const scaleY = this.canvas.height / (rect.height || 1);
        const canvasX = (clientX - rect.left) * scaleX;
        const canvasY = (clientY - rect.top) * scaleY;
        const pending = Math.max(0, this.gameState.getPendingLevelUpChoices?.() || 0);
        const layout = this.renderer?.overlayRenderer?.getLevelUpCardLayout?.({
            width: this.canvas.width,
            height: this.canvas.height,
            choicesLength: choices.length,
            hasPendingText: pending > 0
        });
        const rects = Array.isArray(layout?.rects) ? layout.rects : [];
        const hitIndex = rects.findIndex((r) => (
            canvasX >= r.x &&
            canvasX <= r.x + r.width &&
            canvasY >= r.y &&
            canvasY <= r.y + r.height
        ));
        if (hitIndex >= 0) {
            return hitIndex;
        }
        if (rects.length) {
            let bestIndex = 0;
            let bestDist = Number.POSITIVE_INFINITY;
            rects.forEach((r, idx) => {
                const cx = r.x + r.width / 2;
                const cy = r.y + r.height / 2;
                const dx = canvasX - cx;
                const dy = canvasY - cy;
                const dist = dx * dx + dy * dy;
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIndex = idx;
                }
            });
            return bestIndex;
        }
        return Number.isFinite(overlay.cursor) ? overlay.cursor : 0;
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

    getTestSettings() {
        return this.gameState.getTestSettings?.() || { startLevel: 1, skills: [], godMode: false };
    }

    updateTestSettings(settings = {}) {
        this.gameState.setTestSettings?.(settings);
        this.resetGame();
    }

    getMaxPlayerLevel() {
        return this.gameState.getMaxPlayerLevel?.() || 1;
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
        this.canDismissIntroScreen = true;
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
        this.renderer.setIntroData(this.introData);
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

    setPlayerEndText(roomIndex, text) {
        const normalized = this.gameState.setPlayerEndText?.(roomIndex, text) ?? '';
        this.renderer.draw();
        return normalized;
    }

    getPlayerEndText(roomIndex = null) {
        return this.gameState.getPlayerEndText?.(roomIndex) ?? '';
    }

    removeObject(type, roomIndex) {
        this.gameState.removeObject(type, roomIndex);
        this.renderer.draw();
    }

    getKeyCount() {
        return this.gameState.getKeys();
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
        const necroReady = this.gameState.prepareNecromancerRevive?.();
        this.enemyManager.stop();
        this.gameState.pauseGame?.('game-over');
        this.gameState.setGameOver?.(true, 'defeat');
        this.awaitingRestart = true;
        this.renderer.draw();
    }

    handleGameCompletion() {
        if (this.isGameOver()) return;
        this.enemyManager.stop();
        this.gameState.pauseGame?.('game-over');
        this.gameState.setGameOver?.(true, 'victory');
        this.awaitingRestart = true;
        this.renderer.draw();
    }

    isGameOver() {
        return this.gameState.isGameOver();
    }

    handleGameOverInteraction() {
        if (!this.isGameOver() || !this.gameState.canResetAfterGameOver) return;
        if (this.gameState.hasNecromancerReviveReady?.()) {
            const revived = this.gameState.reviveFromNecromancer?.();
            if (revived) {
                this.awaitingRestart = false;
                this.enemyManager.start();
                this.renderer.draw();
                return;
            }
        }
        this.resetGame();
    }
}

if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
