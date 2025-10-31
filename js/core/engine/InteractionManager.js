class InteractionManager {
    constructor(gameState, dialogManager) {
        this.gameState = gameState;
        this.dialogManager = dialogManager;
    }

    handlePlayerInteractions() {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();

        // Items
        for (const item of game.items) {
            if (item.roomIndex === player.roomIndex &&
                !item.collected &&
                item.x === player.x &&
                item.y === player.y) {
                item.collected = true;
                this.dialogManager.showDialog(item.text || "You picked up an item.");
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
                this.dialogManager.showDialog(message);
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
                const conditionalRewardId = this.gameState.normalizeVariableId?.(npc.conditionalRewardVariableId) ?? null;
                const conditionalText = typeof npc.conditionText === 'string' ? npc.conditionText : '';
                const baseText = typeof npc.text === 'string' ? npc.text : '';
                const useConditional = conditionId && this.gameState.isVariableOn?.(conditionId) && conditionalText.trim();
                let dialogText = useConditional ? conditionalText : baseText;
                if (!dialogText) {
                    dialogText = baseText || (useConditional ? conditionalText : '') || "Hello!";
                }
                let meta = null;
                if (useConditional) {
                    if (conditionalRewardId) {
                        meta = { setVariableId: conditionalRewardId, rewardAllowed: true };
                    }
                } else if (rewardId) {
                    meta = { setVariableId: rewardId, rewardAllowed: true };
                }
                this.dialogManager.showDialog(dialogText, meta || undefined);
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

    clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }
}

if (typeof window !== 'undefined') {
    window.InteractionManager = InteractionManager;
}

