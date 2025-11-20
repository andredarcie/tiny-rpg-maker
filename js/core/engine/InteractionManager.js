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
                this.showPickupOverlay(object.type, () => {
                    this.gameState.addKeys?.(1);
                });
                return true;
            }
            case OT.LIFE_POTION: {
                const currentLives = this.gameState.getLives?.();
                const maxLives = this.gameState.getMaxLives?.();
                if (Number.isFinite(currentLives) && Number.isFinite(maxLives) && currentLives >= maxLives) {
                    return false;
                }
                object.collected = true;
                this.showPickupOverlay(object.type, () => {
                    this.gameState.addLife?.(1);
                });
                return true;
            }
            case OT.XP_SCROLL: {
                object.collected = true;
                this.showPickupOverlay(object.type, () => {
                    this.gameState.addExperience?.(30);
                });
                return true;
            }
            case OT.SWORD:
            case OT.SWORD_BRONZE:
            case OT.SWORD_WOOD: {
                if (!this.shouldPickupSword(object.type)) {
                    return false;
                }
                const durability = this.getSwordDurability(object.type);
                object.collected = true;
                this.showPickupOverlay(object.type, () => {
                    this.gameState.addDamageShield?.(durability, object.type);
                });
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

    getSwordPriority(type) {
        const OT = this.types;
        const priorityMap = {
            [OT.SWORD_WOOD]: 1,
            [OT.SWORD_BRONZE]: 2,
            [OT.SWORD]: 3
        };
        return priorityMap[type] || 0;
    }

    shouldPickupSword(type) {
        const currentType = this.gameState.getSwordType?.() || null;
        const currentPriority = this.getSwordPriority(currentType);
        const newPriority = this.getSwordPriority(type);
        return newPriority > currentPriority;
    }

    showPickupOverlay(type, effect = null) {
        const overlayName = this.getObjectDisplayName(type);
        this.gameState.showPickupOverlay?.({
            name: overlayName,
            spriteGroup: 'object',
            spriteType: type,
            effect
        });
    }

    getObjectDisplayName(type) {
        const definition = ObjectDefinitions.getObjectDefinition(type);
        if (!definition) {
            return type || '';
        }
        if (definition.nameKey) {
            const localized = TextResources.get(definition.nameKey, definition.name || type || '');
            if (localized) return localized;
        }
        if (definition.name) return definition.name;
        return type || '';
    }

    getInteractionText(key, fallback = '') {
        const value = TextResources.get(key, fallback);
        return value || fallback || '';
    }

    formatInteractionText(key, params = {}, fallback = '') {
        const value = TextResources.format(key, params, fallback);
        return value || fallback || '';
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
        const endingText = this.gameState.getPlayerEndText(object.roomIndex);
        this.gameState.setActiveEndingText?.(endingText || '');
        this.options?.onPlayerVictory?.();
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
