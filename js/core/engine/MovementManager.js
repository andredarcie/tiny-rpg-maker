const getMovementText = (key, fallback = '') => {
    const value = TextResources.get(key, fallback);
    return value || fallback || '';
};

const formatMovementText = (key, params = {}, fallback = '') => {
    const value = TextResources.format(key, params, fallback);
    return value || fallback || '';
};

class MovementManager {
    constructor({ gameState, tileManager, renderer, dialogManager, interactionManager, enemyManager }) {
        this.gameState = gameState;
        this.tileManager = tileManager;
        this.renderer = renderer;
        this.dialogManager = dialogManager;
        this.interactionManager = interactionManager;
        this.enemyManager = enemyManager;
        this.transitioning = false;
    }

    tryMove(dx, dy) {
        if (this.transitioning) {
            return;
        }
        if (this.gameState.isGameOver()) {
            return;
        }
        if (this.gameState.isPickupOverlayActive?.()) {
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
        const direction = this.getDirectionFromDelta(dx, dy);
        const roomIndex = player.roomIndex;
        const previousPosition = {
            x: player?.x ?? 0,
            y: player?.y ?? 0,
            roomIndex,
            lastX: player?.lastX ?? player?.x ?? 0,
            facingLeft: (player?.x ?? 0) < (player?.lastX ?? player?.x ?? 0)
        };
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

        const enteringNewRoom = targetRoomIndex !== roomIndex;

        const targetRoom = this.gameState.getGame().rooms?.[targetRoomIndex];
        if (!targetRoom) {
            if (enteringNewRoom) {
                this.flashBlockedEdge(direction, { x: targetX, y: targetY });
            }
            return;
        }

        if (targetRoom.walls?.[targetY]?.[targetX]) {
            if (enteringNewRoom) {
                this.flashBlockedEdge(direction, { x: targetX, y: targetY });
            }
            return;
        }

        const OT = ObjectTypes;
        const objectAtTarget = this.gameState.getObjectAt(targetRoomIndex, targetX, targetY) ?? null;
        const isVariableDoor = Boolean(objectAtTarget?.isVariableDoor);
        if (isVariableDoor) {
            const variableId = objectAtTarget?.variableId;
            const doorOpen = variableId ? this.gameState.isVariableOn(variableId) : false;
            if (!doorOpen) {
                this.dialogManager.showDialog(getMovementText('doors.variableLocked'));
                this.renderer.draw();
                return;
            }
        }
        const isLockedDoor = Boolean(objectAtTarget?.isLockedDoor);
        if (isLockedDoor && !objectAtTarget?.opened) {
            const consumeKey = this.gameState.consumeKey();
            if (consumeKey) {
                if (objectAtTarget) {
                    objectAtTarget.opened = true;
                }
                const remainingKeys = this.gameState.getKeys();
                const message = Number.isFinite(remainingKeys)
                    ? formatMovementText('doors.openedRemaining', { value: remainingKeys })
                    : getMovementText('doors.opened');
                this.dialogManager.showDialog(message);
            } else {
                this.dialogManager.showDialog(getMovementText('doors.locked'));
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
            if (tile?.collision) {
                if (enteringNewRoom) {
                    this.flashBlockedEdge(direction, { x: targetX, y: targetY });
                }
                return;
            }
        }

        const supportsTransition = enteringNewRoom;
        const fromFrame = supportsTransition ? this.renderer.captureGameplayFrame() : null;

        this.gameState.setPlayerPosition(
            targetX,
            targetY,
            targetRoomIndex !== roomIndex ? targetRoomIndex : null
        );
        if (enteringNewRoom) {
            const updatedPlayer = this.gameState.getPlayer();
            if (updatedPlayer) {
                if (dx !== 0) {
                    updatedPlayer.lastX = updatedPlayer.x - Math.sign(dx);
                } else if (previousPosition.lastX !== undefined) {
                    updatedPlayer.lastX = previousPosition.lastX;
                }
            }
        }
        this.interactionManager.handlePlayerInteractions();
        const currentPlayer = this.gameState.getPlayer();
        this.enemyManager.checkCollisionAt(currentPlayer.x, currentPlayer.y);

        if (supportsTransition && fromFrame) {
            this.renderer.draw();
            const toFrame = this.renderer.captureGameplayFrame();
            if (toFrame) {
                const started = this.renderer.startRoomTransition({
                    direction,
                    fromFrame,
                    toFrame,
                    playerPath: {
                        from: previousPosition,
                        to: { x: targetX, y: targetY, roomIndex: targetRoomIndex },
                        facingLeft: dx < 0
                            ? true
                            : dx > 0
                                ? false
                                : previousPosition.facingLeft
                    },
                    onComplete: () => {
                        this.transitioning = false;
                        this.renderer.draw();
                    }
                });
                if (started) {
                    this.transitioning = true;
                    return;
                }
            }
        }

        this.renderer.draw();
    }

    getDirectionFromDelta(dx, dy) {
        if (dx < 0) return 'left';
        if (dx > 0) return 'right';
        if (dy < 0) return 'up';
        if (dy > 0) return 'down';
        return '';
    }

    flashBlockedEdge(direction, coords = null) {
        if (!direction) return;
        this.renderer.flashEdge(direction, {
            duration: 240,
            tileX: coords?.x,
            tileY: coords?.y
        });
        this.renderer.draw();
    }
}

if (typeof window !== 'undefined') {
    window.MovementManager = MovementManager;
}
