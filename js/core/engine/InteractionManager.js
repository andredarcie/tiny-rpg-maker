class InteractionManager {
    constructor(gameState, dialogManager, options = {}) {
        this.gameState = gameState;
        this.dialogManager = dialogManager;
        this.options = options;
    }

    get types() {
        return ObjectTypes;
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
                : this.getInteractionText('objects.item.pickup', '');
            if (text) {
                this.dialogManager.showDialog(text);
            }
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

        const OT = this.types;
        switch (object.type) {
            case OT.KEY: {
                object.collected = true;
                const totalKeys = this.gameState.addKeys?.(1);
                const message = Number.isFinite(totalKeys)
                    ? this.formatInteractionText('objects.key.pickup.count', { value: totalKeys }, '')
                    : this.getInteractionText('objects.key.pickup.single', '');
                if (message) {
                    this.dialogManager.showDialog(message);
                }
                return true;
            }
            case OT.LIFE_POTION: {
                object.collected = true;
                this.gameState.addLife?.(1);
                const message = this.getInteractionText('objects.potion.used', '');
                if (message) {
                    this.dialogManager.showDialog(message);
                }
                return true;
            }
            case OT.XP_SCROLL: {
                object.collected = true;
                const result = this.gameState.addExperience?.(30);
                let message = this.formatInteractionText('objects.xpScroll.read', { value: 30 }, '');
                if (result?.leveledUp) {
                    const gained = Number.isFinite(result.levelsGained) && result.levelsGained > 0
                        ? result.levelsGained
                        : 1;
                    const levelText = this.formatInteractionText('objects.xpScroll.levelUp', { value: gained }, '');
                    message = [message, levelText].filter(Boolean).join(' ').trim();
                }
                if (message) {
                    this.dialogManager.showDialog(message);
                }
                return true;
            }
            case OT.SWORD:
            case OT.SWORD_BRONZE:
            case OT.SWORD_WOOD: {
                const durability = this.getSwordDurability(object.type);
                object.collected = true;
                this.gameState.addDamageShield?.(durability, object.type);
                const message = this.buildSwordDialog(object.type, durability);
                this.dialogManager.showDialog(message);
                return true;
            }
            default:
                return false;
        }
    }

    getSwordDurability(type) {
        const OT = this.types;
        switch (type) {
            case OT.SWORD_WOOD:
                return 1;
            case OT.SWORD_BRONZE:
                return 2;
            case OT.SWORD:
            default:
                return 3;
        }
    }

    buildSwordDialog(type, durability) {
        const OT = this.types;
        const { name } = this.getSwordName(type);
        const key = durability === 1
            ? 'objects.sword.pickup.single'
            : 'objects.sword.pickup.multi';
        const fallback = '';
        if (typeof TextResources?.format === 'function') {
            return TextResources.format(key, { name, value: durability }, fallback);
        }
        return '';
    }

    getSwordName(type) {
        const OT = this.types;
        const nameMap = {
            [OT.SWORD]: { key: 'objects.label.sword', fallback: OT.SWORD },
            [OT.SWORD_BRONZE]: { key: 'objects.label.swordBronze', fallback: OT.SWORD_BRONZE },
            [OT.SWORD_WOOD]: { key: 'objects.label.swordWood', fallback: OT.SWORD_WOOD }
        };
        const entry = nameMap[type] || nameMap[OT.SWORD];
        const name = typeof TextResources?.get === 'function'
            ? TextResources.get(entry.key, entry.fallback)
            : entry.fallback;
        return { name };
    }

    getInteractionText(key, fallback = '') {
        if (typeof TextResources?.get === 'function') {
            const value = TextResources.get(key, fallback);
            return value || fallback || '';
        }
        return fallback || '';
    }

    formatInteractionText(key, params = {}, fallback = '') {
        if (typeof TextResources?.format === 'function') {
            const value = TextResources.format(key, params, fallback);
            return value || fallback || '';
        }
        return fallback || '';
    }

    handleSwitch(object) {
        const OT = this.types;
        if (object.type !== OT.SWITCH) return false;
        object.on = !object.on;
        const variableId = this.gameState.normalizeVariableId?.(object.variableId) ?? null;
        if (variableId) {
            this.gameState.setVariableValue?.(variableId, object.on);
        }
        const message = object.on
            ? this.getInteractionText('objects.switch.onMessage', '')
            : this.getInteractionText('objects.switch.offMessage', '');
        if (message) {
            this.dialogManager.showDialog(message);
        }
        return true;
    }

    handlePlayerEnd(object) {
        const OT = this.types;
        if (object.type !== OT.PLAYER_END) return false;
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
