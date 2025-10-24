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
        this.renderer = new Renderer(canvas, this.gameState, this.tileManager, this.npcManager);
        this.inputManager = new InputManager(this);
        this.enemyMoveTimer = null;

        // Ensure there is at least a ground layer
        this.tileManager.ensureDefaultTiles();

        // Draw the first frame
        this.syncDocumentTitle();
        this.renderer.draw();
        this.startEnemyLoop();
    }

    // Movement and interaction handling
    tryMove(dx, dy) {
        const dialog = this.gameState.getDialog();
        if (dialog.active) {
            this.gameState.setDialog(false);
            this.renderer.draw();
            return;
        }

        const room = this.gameState.getCurrentRoom();
        const player = this.gameState.getPlayer();

        const nx = this.clamp(player.x + dx, 0, 7);
        const ny = this.clamp(player.y + dy, 0, 7);

        if (room.walls[ny][nx]) return; // blocked by a wall

        const tileMap = this.tileManager.getTileMap();
        const overlayId = tileMap?.overlay?.[ny]?.[nx] ?? null;
        const groundId = tileMap?.ground?.[ny]?.[nx] ?? null;
        const candidateId = overlayId ?? groundId;
        if (candidateId !== null && candidateId !== undefined) {
            const tile = this.tileManager.getTile(candidateId);
            if (tile?.collision) return; // blocked by a collidable tile
        }

        this.gameState.setPlayerPosition(nx, ny);
        this.checkInteractions();
        this.checkEnemyCollisionAt(this.gameState.getPlayer().x, this.gameState.getPlayer().y);
        this.renderer.draw();
    }

    checkInteractions() {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();

        // Items
        for (const item of game.items) {
            if (item.roomIndex === player.roomIndex &&
                !item.collected &&
                item.x === player.x &&
                item.y === player.y) {
                item.collected = true;
                this.showDialog(item.text || "You picked up an item.");
                break;
            }
        }

        // NPCs
        for (const npc of game.sprites) {
            if (npc.roomIndex === player.roomIndex &&
                npc.x === player.x &&
                npc.y === player.y) {
                this.showDialog(npc.text || "Hello!");
                break;
            }
        }

        // Room exits
        for (const exit of game.exits) {
            if (exit.roomIndex === player.roomIndex &&
                exit.x === player.x &&
                exit.y === player.y) {
                if (game.rooms[exit.targetRoomIndex]) {
                    this.gameState.setPlayerPosition(
                        this.clamp(exit.targetX, 0, 7),
                        this.clamp(exit.targetY, 0, 7),
                        exit.targetRoomIndex
                    );
                }
                break;
            }
        }
    }

    showDialog(text) {
        this.gameState.setDialog(true, text);
    }

    resetGame() {
        this.gameState.resetGame();
        this.startEnemyLoop();
        this.renderer.draw();
    }

    // Data helpers
    exportGameData() {
        return this.gameState.exportGameData();
    }

    importGameData(data) {
        this.gameState.importGameData(data);
        this.tileManager.ensureDefaultTiles();
        this.syncDocumentTitle();
        this.startEnemyLoop();
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

    getTileMap() {
        return this.tileManager.getTileMap();
    }

    getTilePresetNames() {
        return this.tileManager.getPresetTileNames();
    }

    getSprites() {
        return this.npcManager.getNPCs();
    }

    updateTile(tileId, data) {
        this.tileManager.updateTile(tileId, data);
    }

    setMapTile(x, y, tileId) {
        this.tileManager.setMapTile(x, y, tileId);
    }

    addSprite(npc) {
        return this.npcManager.addNPC(npc);
    }

    // Enemy helpers
    getEnemyDefinitions() {
        return this.gameState.getEnemyDefinitions();
    }

    getActiveEnemies() {
        return this.gameState.getEnemies();
    }

    addEnemy(enemy) {
        const id = enemy.id || this.generateEnemyId();
        this.gameState.addEnemy({
            id,
            type: enemy.type || 'skull',
            roomIndex: enemy.roomIndex ?? 0,
            x: enemy.x ?? 0,
            y: enemy.y ?? 0
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

    startEnemyLoop() {
        if (this.enemyMoveTimer) {
            clearInterval(this.enemyMoveTimer);
        }
        this.enemyMoveTimer = setInterval(() => this.tickEnemies(), 600);
    }

    tickEnemies() {
        const enemies = this.gameState.getEnemies();
        if (!enemies || !enemies.length) return;

        let moved = false;
        const game = this.gameState.getGame();
        const tileMap = this.tileManager.getTileMap();
        const directions = [
            [0, 0],
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const nx = this.clamp(enemy.x + dir[0], 0, 7);
            const ny = this.clamp(enemy.y + dir[1], 0, 7);
            const roomIndex = enemy.roomIndex ?? 0;
            const room = game.rooms[roomIndex];
            if (!room) continue;
            if (room.walls[ny][nx]) continue;

            const groundId = tileMap?.ground?.[ny]?.[nx] ?? null;
            const overlayId = tileMap?.overlay?.[ny]?.[nx] ?? null;
            const candidateId = overlayId ?? groundId;
            if (candidateId !== null && candidateId !== undefined) {
                const tile = this.tileManager.getTile(candidateId);
                if (tile?.collision) continue;
            }

            const occupied = enemies.some((other, index) =>
                index !== i &&
                other.roomIndex === roomIndex &&
                other.x === nx &&
                other.y === ny
            );
            if (occupied) continue;

            enemy.x = nx;
            enemy.y = ny;
            moved = true;

            const player = this.gameState.getPlayer();
            if (player.roomIndex === roomIndex && player.x === nx && player.y === ny) {
                this.handleEnemyCollision(i);
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
        enemies.splice(enemyIndex, 1);
        const lives = this.gameState.damagePlayer(1);
        if (lives <= 0) {
            this.resetGame();
        } else {
            this.renderer.draw();
        }
    }

    checkEnemyCollisionAt(x, y) {
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
} else {
    window.GameEngine = GameEngine;
}
