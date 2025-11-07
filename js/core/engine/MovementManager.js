class MovementManager {
    constructor({ gameState, tileManager, renderer, dialogManager, interactionManager, enemyManager }) {
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.renderer = renderer;
        this.dialogManager = dialogManager;
        this.interactionManager = interactionManager;
        this.enemyManager = enemyManager;
    }

    tryMove(dx, dy) {
        if (typeof this.gameState.isGameOver === 'function' && this.gameState.isGameOver()) {
            return;
        }
        const dialog = this.gameState.getDialog();
        if (dialog.active) {
            if (dialog.page >= dialog.maxPages) {
                this.dialogManager.closeDialog();
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

        if (targetRoom.walls?.[targetY]?.[targetX]) return;

        const objectAtTarget = this.gameState.getObjectAt?.(targetRoomIndex, targetX, targetY) ?? null;
        if (objectAtTarget?.type === 'door-variable') {
            const variableId = objectAtTarget.variableId;
            const doorOpen = variableId ? this.gameState.isVariableOn(variableId) : false;
            if (!doorOpen) {
                const variable = variableId ? this.gameState.getVariable?.(variableId) ?? null : null;
                const variableLabel = variable?.name || variable?.id || variableId || 'uma variavel';
                const message = "Não abre com chave.";
                this.dialogManager.showDialog(message);
                this.renderer.draw();
                return;
            }
        }
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
                    ? `Voce usou uma chave para abrir a porta. Restam: ${remainingKeys}.`
                    : 'Voce usou uma chave para abrir a porta.';
                this.dialogManager.showDialog(message);
            } else {
                this.dialogManager.showDialog('Porta trancada. Precisa de uma chave.');
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
            if (tile?.collision) return;
        }

        this.gameState.setPlayerPosition(targetX, targetY, targetRoomIndex !== roomIndex ? targetRoomIndex : null);
        this.interactionManager.handlePlayerInteractions();
        const currentPlayer = this.gameState.getPlayer();
        this.enemyManager.checkCollisionAt(currentPlayer.x, currentPlayer.y);
        this.renderer.draw();
    }
}

if (typeof window !== 'undefined') {
    window.MovementManager = MovementManager;
}
