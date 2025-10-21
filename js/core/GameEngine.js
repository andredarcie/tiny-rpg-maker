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

        // Ensure there is at least a ground layer
        this.tileManager.ensureDefaultTiles();

        // Draw the first frame
        this.syncDocumentTitle();
        this.renderer.draw();
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
        if (candidateId) {
            const tile = this.tileManager.getTile(candidateId);
            if (tile?.collision) return; // blocked by a collidable tile
        }

        this.gameState.setPlayerPosition(nx, ny);
        this.checkInteractions();
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
        this.renderer.draw();
    }

    // Data helpers
    exportGameData() {
        return this.gameState.exportGameData();
    }

    importGameData(data) {
        this.gameState.importGameData(data);
        this.syncDocumentTitle();
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

    getSprites() {
        return this.npcManager.getNPCs();
    }

    createBlankTile(name) {
        return this.tileManager.createBlankTile(name);
    }

    addTile(tile) {
        return this.tileManager.addTile(tile);
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
} else {
    window.GameEngine = GameEngine;
}
