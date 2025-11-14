class InteractionManager {
    constructor(gameState, dialogManager, options = {}) {
        this.gameState = gameState;
        this.dialogManager = dialogManager;
        this.options = options;
    }

    handlePlayerInteractions() {
        const game = this.gameState.getGame();
        const player = this.gameState.getPlayer();

        this.checkItems(game.items, player);
        this.checkObjects(player);
        this.checkNpcs(game.sprites, player);
        this.checkRoomExits(game.exits, game.rooms, player);
    }

    checkItems(items, player) {
        if (!Array.isArray(items)) return;
        for (const item of items) {
            const sameTile = item.roomIndex === player.roomIndex &&
                item.x === player.x &&
                item.y === player.y;
            if (!sameTile || item.collected) continue;

            item.collected = true;
            const text = typeof item.text === 'string'
                ? item.text
                : 'You picked up an item.';
            this.dialogManager.showDialog(text);
            break;
        }
    }

    checkObjects(player) {
        const objects = this.gameState.getObjectsForRoom?.(player.roomIndex) || [];
        for (const object of objects) {
            if (object.x !== player.x || object.y !== player.y) continue;

            if (this.handleCollectibleObject(object)) break;
            if (this.handleSwitch(object)) break;
            if (this.handlePlayerEnd(object)) break;
        }
    }

    handleCollectibleObject(object) {
        if (object.collected) {
            return false;
        }

        switch (object.type) {
            case 'key': {
                object.collected = true;
                const totalKeys = this.gameState.addKeys?.(1);
                const message = Number.isFinite(totalKeys)
                    ? `Voce pegou uma chave. Possui ${totalKeys}.`
                    : 'Voce pegou uma chave.';
                this.dialogManager.showDialog(message);
                return true;
            }
            case 'life-potion': {
                object.collected = true;
                this.gameState.addLife?.(1);
                this.dialogManager.showDialog('Voce usou uma pocao de vida.');
                return true;
            }
            case 'xp-scroll': {
                object.collected = true;
                const result = this.gameState.addExperience?.(30);
                let message = 'Voce leu um pergaminho de XP e ganhou 30 de experiencia.';
                if (result?.leveledUp) {
                    const gained = Number.isFinite(result.levelsGained) && result.levelsGained > 0
                        ? result.levelsGained
                        : 1;
                    message += ` Nivel +${gained}!`;
                }
                this.dialogManager.showDialog(message);
                return true;
            }
            case 'sword': {
                object.collected = true;
                this.gameState.addDamageShield?.(1);
                this.dialogManager.showDialog('Voce pegou uma espada! Ela bloqueia 1 dano do proximo ataque inimigo.');
                return true;
            }
            default:
                return false;
        }
    }

    handleSwitch(object) {
        if (object.type !== 'switch') return false;
        object.on = !object.on;
        const variableId = this.gameState.normalizeVariableId?.(object.variableId) ?? null;
        if (variableId) {
            this.gameState.setVariableValue?.(variableId, object.on);
        }
        const message = object.on ? 'Alavanca ligada.' : 'Alavanca desligada.';
        this.dialogManager.showDialog(message);
        return true;
    }

    handlePlayerEnd(object) {
        if (object.type !== 'player-end') return false;
        if (typeof this.gameState.getPlayerEndText === 'function') {
            const endingText = this.gameState.getPlayerEndText(object.roomIndex);
            this.gameState.setActiveEndingText?.(endingText || '');
        }
        if (typeof this.options?.onPlayerVictory === 'function') {
            this.options.onPlayerVictory();
        }
        return true;
    }

    checkNpcs(npcs, player) {
        for (const npc of npcs) {
            if (!npc.placed) continue;
            const sameTile = npc.roomIndex === player.roomIndex &&
                npc.x === player.x &&
                npc.y === player.y;
            if (!sameTile) continue;

            const dialogText = this.getNpcDialogText(npc);
            const meta = this.getNpcDialogMeta(npc);
            this.dialogManager.showDialog(dialogText, meta);
            break;
        }
    }

    getNpcDialogText(npc) {
        const conditionId = this.gameState.normalizeVariableId?.(npc.conditionVariableId) ?? null;
        const hasConditionText = typeof npc.conditionText === 'string' && npc.conditionText.trim().length > 0;
        const conditionActive = Boolean(conditionId && this.gameState.isVariableOn?.(conditionId));
        const useConditionText = conditionActive && hasConditionText;

        if (useConditionText) {
            return npc.conditionText;
        }

        if (typeof npc.text === 'string' && npc.text.trim()) {
            return npc.text;
        }

        if (useConditionText) {
            return npc.conditionText || '';
        }

        return npc.text || 'Hello!';
    }

    getNpcDialogMeta(npc) {
        const conditionId = this.gameState.normalizeVariableId?.(npc.conditionVariableId) ?? null;
        const rewardId = this.gameState.normalizeVariableId?.(npc.rewardVariableId) ?? null;
        const conditionalRewardId = this.gameState.normalizeVariableId?.(npc.conditionalRewardVariableId) ?? null;
        const hasConditionText = typeof npc.conditionText === 'string' && npc.conditionText.trim().length > 0;
        const conditionActive = Boolean(conditionId && this.gameState.isVariableOn?.(conditionId) && hasConditionText);

        if (conditionActive && conditionalRewardId) {
            return { setVariableId: conditionalRewardId, rewardAllowed: true };
        }

        if (!conditionActive && rewardId) {
            return { setVariableId: rewardId, rewardAllowed: true };
        }

        return undefined;
    }

    checkRoomExits(exits, rooms, player) {
        if (!Array.isArray(exits)) return;
        for (const exit of exits) {
            const sameTile = exit.roomIndex === player.roomIndex &&
                exit.x === player.x &&
                exit.y === player.y;
            if (!sameTile) continue;

            if (rooms[exit.targetRoomIndex]) {
                this.gameState.setPlayerPosition(
                    this.clamp(exit.targetX, 0, 7),
                    this.clamp(exit.targetY, 0, 7),
                    exit.targetRoomIndex
                );
            }
            break;
        }
    }

    clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }
}

if (typeof window !== 'undefined') {
    window.InteractionManager = InteractionManager;
}
