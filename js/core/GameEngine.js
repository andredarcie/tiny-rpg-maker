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
        this.inputManager = new InputManager(this);
        this.enemyMoveTimer = null;
        this.pendingDialogAction = null;

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
            if (dialog.page >= dialog.maxPages) {
                this.closeDialog();
                return;
            }
            this.gameState.setDialogPage(dialog.page + 1);
            this.renderer.draw();
            return;
        }

        const player = this.gameState.getPlayer();
        const roomIndex = player.roomIndex;
        const currentCoords = this.gameState.getRoomCoords(roomIndex);
        const limit = this.gameState.game.roomSize - 1;

        let targetRoomIndex = roomIndex;
        let targetX = player.x + dx;
        let targetY = player.y + dy;

        if (targetX < 0) {
            const nextCol = currentCoords.col - 1;
            const neighbor = this.gameState.getRoomIndex(currentCoords.row, nextCol);
            if (neighbor !== null) {
                targetRoomIndex = neighbor;
                targetX = limit;
            } else {
                targetX = 0;
            }
        } else if (targetX > limit) {
            const nextCol = currentCoords.col + 1;
            const neighbor = this.gameState.getRoomIndex(currentCoords.row, nextCol);
            if (neighbor !== null) {
                targetRoomIndex = neighbor;
                targetX = 0;
            } else {
                targetX = limit;
            }
        }

        if (targetY < 0) {
            const nextRow = currentCoords.row - 1;
            const neighbor = this.gameState.getRoomIndex(nextRow, currentCoords.col);
            if (neighbor !== null) {
                targetRoomIndex = neighbor;
                targetY = limit;
            } else {
                targetY = 0;
            }
        } else if (targetY > limit) {
            const nextRow = currentCoords.row + 1;
            const neighbor = this.gameState.getRoomIndex(nextRow, currentCoords.col);
            if (neighbor !== null) {
                targetRoomIndex = neighbor;
                targetY = 0;
            } else {
                targetY = limit;
            }
        }

        const targetRoom = this.gameState.getGame().rooms?.[targetRoomIndex];
        if (!targetRoom) return;

        if (targetRoom.walls?.[targetY]?.[targetX]) return; // blocked by a wall

        const objectAtTarget = this.gameState.getObjectAt?.(targetRoomIndex, targetX, targetY) ?? null;
        if (objectAtTarget?.type === 'door' && !objectAtTarget.opened) {
            const consumeKey = typeof this.gameState.consumeKey === 'function'
                ? this.gameState.consumeKey()
                : false;
            if (consumeKey) {
                objectAtTarget.opened = true;
                const remainingKeys = typeof this.gameState.getKeys === 'function'
                    ? this.gameState.getKeys()
                    : null;
                const message = Number.isFinite(remainingKeys)
                    ? `Voce usou uma chave para abrir a porta. Chaves restantes: ${remainingKeys}.`
                    : 'Voce usou uma chave para abrir a porta.';
                this.showDialog(message);
            } else {
                this.showDialog('A porta esta trancada. Voce precisa de uma chave.');
                this.renderer.draw();
                return;
            }
        }

        const tileMap = this.tileManager.getTileMap(targetRoomIndex);
        const overlayId = tileMap?.overlay?.[targetY]?.[targetX] ?? null;
        const groundId = tileMap?.ground?.[targetY]?.[targetX] ?? null;
        const candidateId = overlayId ?? groundId;
        if (candidateId !== null && candidateId !== undefined) {
            const tile = this.tileManager.getTile(candidateId);
            if (tile?.collision) return; // blocked by a collidable tile
        }

        this.gameState.setPlayerPosition(targetX, targetY, targetRoomIndex !== roomIndex ? targetRoomIndex : null);
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

        // Objetos
        const objects = this.gameState.getObjectsForRoom?.(player.roomIndex) ?? [];
        for (const object of objects) {
            if (object.type !== 'key') continue;
            if (object.collected) continue;
            if (object.x === player.x && object.y === player.y) {
                object.collected = true;
                const totalKeys = typeof this.gameState.addKeys === 'function'
                    ? this.gameState.addKeys(1)
                    : null;
                const message = Number.isFinite(totalKeys)
                    ? `Voce pegou uma chave. Agora possui ${totalKeys}.`
                    : 'Voce pegou uma chave.';
                this.showDialog(message);
                break;
            }
        }

        // NPCs
        for (const npc of game.sprites) {
            if (!npc.placed) continue;
            if (npc.roomIndex === player.roomIndex &&
                npc.x === player.x &&
                npc.y === player.y) {
                const conditionId = this.gameState.normalizeVariableId?.(npc.conditionVariableId) ?? null;
                const rewardId = this.gameState.normalizeVariableId?.(npc.rewardVariableId) ?? null;
                const conditionalText = typeof npc.conditionText === 'string' ? npc.conditionText : '';
                const baseText = typeof npc.text === 'string' ? npc.text : '';
                const useConditional = conditionId && this.gameState.isVariableOn?.(conditionId) && conditionalText.trim();
                let dialogText = useConditional ? conditionalText : baseText;
                if (!dialogText) {
                    dialogText = baseText || (useConditional ? conditionalText : '') || "Hello!";
                }
                const meta = (!useConditional && rewardId)
                    ? { setVariableId: rewardId, rewardAllowed: true }
                    : null;
                this.showDialog(dialogText, meta || undefined);
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

    showDialog(text, options = {}) {
        const meta = options && Object.keys(options).length ? { ...options } : null;
        this.pendingDialogAction = meta;
        this.gameState.setDialog(true, text, meta);
    }

    completeDialog() {
        if (this.pendingDialogAction?.setVariableId &&
            this.pendingDialogAction.rewardAllowed !== false) {
            this.gameState.setVariableValue?.(this.pendingDialogAction.setVariableId, true);
        }
        this.pendingDialogAction = null;
    }

    closeDialog() {
        if (!this.gameState.getDialog().active) return;
        this.completeDialog();
        this.gameState.setDialog(false);
        this.renderer.draw();
    }

    resetGame() {
        this.gameState.resetGame();
        this.startEnemyLoop();
        this.pendingDialogAction = null;
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
        this.pendingDialogAction = null;
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

            const tileMap = this.tileManager.getTileMap(roomIndex);
            const groundId = tileMap?.ground?.[ny]?.[nx] ?? null;
            const overlayId = tileMap?.overlay?.[ny]?.[nx] ?? null;
            const candidateId = overlayId ?? groundId;
            if (candidateId !== null && candidateId !== undefined) {
                const tile = this.tileManager.getTile(candidateId);
                if (tile?.collision) continue;
            }

            const blockingObject = this.gameState.getObjectAt?.(roomIndex, nx, ny) ?? null;
            if (blockingObject?.type === 'door' && !blockingObject.opened) continue;

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
