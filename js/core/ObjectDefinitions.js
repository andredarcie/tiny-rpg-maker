const OBJECT_TYPES = {
    PLAYER_START: 'player-start',
    PLAYER_END: 'player-end',
    SWITCH: 'switch',
    DOOR: 'door',
    DOOR_VARIABLE: 'door-variable',
    KEY: 'key',
    LIFE_POTION: 'life-potion',
    XP_SCROLL: 'xp-scroll',
    SWORD: 'sword',
    SWORD_BRONZE: 'sword-bronze',
    SWORD_WOOD: 'sword-wood'
};

/**
 * ObjectDefinitions encapsula os objetos interativos disponiveis no editor.
 */
class ObjectDefinitions {
    static OBJECT_DEFINITIONS = [
        {
            type: OBJECT_TYPES.PLAYER_START,
            id: 'object-player-start',
            name: 'Inicio do Jogador',
            nameKey: 'objects.label.playerStart',
            behavior: {
                order: 10,
                tags: ['placeable', 'player-start', 'global-unique', 'hidden-in-runtime']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null,  1,  1,  1,  1,  1,  1, null ],
                [ null,  1,  3,  3,  3,  3,  1, null ],
                [ null,  1,  3,  3, 11,  3,  1, null ],
                [ null,  1,  3, 11,  3,  3,  1, null ],
                [ null,  1,  3,  3,  3,  3,  1, null ],
                [ null,  1,  1,  1,  1,  1,  1, null ],
                [ null, null, null, null, null, null, null, null ]
            ]
        },
        {
            type: OBJECT_TYPES.PLAYER_END,
            id: 'object-player-end',
            name: 'Fim do Jogo',
            nameKey: 'objects.label.playerEnd',
            behavior: {
                order: 20,
                tags: ['placeable', 'player-end', 'per-room-unique']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null,  1,  1,  1,  1,  1,  1, null ],
                [ null,  1,  2,  2,  2,  2,  1, null ],
                [ null,  1,  2,  2, 14,  2,  1, null ],
                [ null,  1,  2, 14,  2,  2,  1, null ],
                [ null,  1,  2,  2,  2,  2,  1, null ],
                [ null,  1,  1,  1,  1,  1,  1, null ],
                [ null, null, null, null, null, null, null, null ]
            ]
        },
        {
            type: OBJECT_TYPES.SWITCH,
            id: 'object-switch',
            name: 'Alavanca',
            nameKey: 'objects.label.switch',
            behavior: {
                order: 30,
                tags: ['placeable', 'switch', 'requires-variable']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [  8, null, null, null, null, null, null, null ],
                [ null,  6, null, null, null, null, null, null ],
                [ null, null,  6, null, null, null, null, null ],
                [ null, null, null,  6, null, null, null, null ],
                [ null, null,  6,  1,  1,  6, null, null ],
                [ null,  6,  6,  6,  6,  6,  6, null ],
                [ null, null, null, null, null, null, null, null ]
            ],
            spriteOn: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, 12 ],
                [ null, null, null, null, null, null,  6, null ],
                [ null, null, null, null, null,  6, null, null ],
                [ null, null, null, null,  6, null, null, null ],
                [ null, null,  6,  1,  1,  6, null, null ],
                [ null,  6,  6,  6,  6,  6,  6, null ],
                [ null, null, null, null, null, null, null, null ]
            ]
        },
        {
            type: OBJECT_TYPES.KEY,
            id: 'object-key',
            name: 'Chave',
            nameKey: 'objects.label.key',
            behavior: {
                order: 60,
                tags: ['placeable', 'collectible', 'hide-when-collected']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ 10, 10,  7, null, null, null, null, null ],
                [ 10, null, 10, 10, 10, 10, 10, 10 ],
                [  9,  9,  9, null, null,  9, null,  9 ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ]
            ]
        },
        {
            type: OBJECT_TYPES.DOOR,
            id: 'object-door',
            name: 'Porta',
            nameKey: 'objects.label.door',
            behavior: {
                order: 40,
                tags: ['placeable', 'door', 'locked-door', 'hide-when-opened']
            },
            sprite: [
                [ null,  4,  4,  4,  4,  4,  4, null ],
                [  4,  9,  9,  9,  9,  9,  9,  4 ],
                [  4,  9,  9,  9,  9,  9,  9,  4 ],
                [  4,  9,  9,  9,  0,  0,  9,  4 ],
                [  4,  9,  9,  9,  0,  0,  9,  4 ],
                [  4,  9,  9,  9,  9,  0,  9,  4 ],
                [  4,  9,  9,  9,  9,  9,  9,  4 ],
                [  4,  9,  9,  9,  9,  9,  9,  4 ]
            ]
        },
        {
            type: OBJECT_TYPES.DOOR_VARIABLE,
            id: 'object-door-variable',
            name: 'Porta Magica',
            nameKey: 'objects.label.doorVariable',
            behavior: {
                order: 50,
                tags: ['placeable', 'door', 'requires-variable', 'variable-door', 'hide-when-variable-open']
            },
            sprite: [
                [ null,  7, null,  7, null,  7, null,  7 ],
                [ null,  6,  6,  6,  6,  6,  6,  6 ],
                [ null,  6, 13,  6, 13,  6, 13,  6 ],
                [ null,  6, null,  6, null,  6, null,  6 ],
                [ null,  6, null,  6, null,  6, null,  5 ],
                [ null,  6,  6,  6,  6,  6,  6,  6 ],
                [ null,  6, 13,  6, 13,  6, 13,  6 ],
                [ null,  6, null,  6, null,  6, null,  6 ]
            ]
        },
        {
            type: OBJECT_TYPES.LIFE_POTION,
            id: 'object-life-potion',
            name: 'Pocao de Vida',
            nameKey: 'objects.label.lifePotion',
            behavior: {
                order: 70,
                tags: ['placeable', 'collectible', 'hide-when-collected']
            },
            sprite: [
                [ null, null,  1,  1,  1,  1, null, null ],
                [ null,  1,  1,  1,  1,  1,  1, null ],
                [ null, null,  6, null, null,  6, null, null ],
                [ null, null,  6,  8,  8,  6, null, null ],
                [ null,  6,  8,  8,  8,  8,  6, null ],
                [  6,  8,  8,  8,  6,  8,  8,  6 ],
                [ null,  6,  8,  6,  8,  8,  6, null ],
                [ null, null,  6,  6,  6,  6, null, null ]
            ]
        },
        {
            type: OBJECT_TYPES.XP_SCROLL,
            id: 'object-xp-scroll',
            name: 'Pergaminho de XP',
            nameKey: 'objects.label.xpScroll',
            behavior: {
                order: 110,
                tags: ['placeable', 'collectible', 'hide-when-collected']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null,  6,  6,  6,  6,  6,  6 ],
                [ null, null,  6,  1,  1,  1,  6,  0 ],
                [ null, null,  6,  6,  6,  6,  6, null ],
                [ null, null,  6,  1,  1,  1,  6, null ],
                [ null, null,  6,  6,  6,  6,  6, null ],
                [ null,  0,  6,  1,  1,  6,  6, null ],
                [ null,  6,  6,  6,  6,  6,  6, null ]
            ]
        },
        {
            type: OBJECT_TYPES.SWORD,
            id: 'object-sword',
            name: 'Espada',
            nameKey: 'objects.label.sword',
            behavior: {
                order: 80,
                swordDurability: 3,
                tags: ['placeable', 'collectible', 'sword', 'hide-when-collected']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [  6,  6, null, null, null, null, null, null ],
                [  6,  6,  6, null, null, null, null, null ],
                [ null,  6,  6,  6, null, null, null, null ],
                [ null, null,  6,  6,  6, null,  1, null ],
                [ null, null, null,  6,  8,  1,  1, null ],
                [ null, null, null, null,  1,  1, null, null ],
                [ null, null, null,  1,  1, null,  1, null ]
            ]
        },
        {
            type: OBJECT_TYPES.SWORD_BRONZE,
            id: 'object-sword-bronze',
            name: 'Espada de Bronze',
            nameKey: 'objects.label.swordBronze',
            behavior: {
                order: 90,
                swordDurability: 2,
                tags: ['placeable', 'collectible', 'sword', 'hide-when-collected']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [  9,  9, null, null, null, null, null, null ],
                [  9, 10,  9, null, null, null, null, null ],
                [ null,  9,  9, 10, null, null, null, null ],
                [ null, null,  9,  9, 10, null,  1, null ],
                [ null, null, null,  9,  9,  1,  1, null ],
                [ null, null, null, null,  1,  1, null, null ],
                [ null, null, null,  1,  1, null,  1, null ]
            ]
        },
        {
            type: OBJECT_TYPES.SWORD_WOOD,
            id: 'object-sword-wood',
            name: 'Espada de Madeira',
            nameKey: 'objects.label.swordWood',
            behavior: {
                order: 100,
                swordDurability: 1,
                tags: ['placeable', 'collectible', 'sword', 'hide-when-collected']
            },
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [  4,  4, null, null, null, null, null, null ],
                [  4,  5,  4, null, null, null, null, null ],
                [ null,  4,  4,  5, null, null, null, null ],
                [ null, null,  4,  4,  5, null,  1, null ],
                [ null, null, null,  4,  9,  1,  1, null ],
                [ null, null, null, null,  1,  1, null, null ],
                [ null, null, null,  1,  1, null,  1, null ]
            ]
        }
    ];

    static get definitions() {
        return this.OBJECT_DEFINITIONS;
    }

    static get TYPES() {
        return OBJECT_TYPES;
    }

    static getObjectDefinition(type) {
        return this.OBJECT_DEFINITIONS.find((entry) => entry.type === type) || null;
    }

    static get behaviorMap() {
        if (!this._behaviorMap) {
            const data = new Map();
            this.OBJECT_DEFINITIONS.forEach((definition, index) => {
                const config = definition.behavior || {};
                const tags = Array.isArray(config.tags) ? config.tags.slice() : [];
                data.set(definition.type, {
                    order: Number.isFinite(config.order) ? config.order : 100 + index,
                    tags,
                    tagSet: new Set(tags),
                    swordDurability: Number.isFinite(config.swordDurability)
                        ? Math.max(0, config.swordDurability)
                        : null
                });
            });
            this._behaviorMap = data;
        }
        return this._behaviorMap;
    }

    static getTags(type) {
        const behavior = this.behaviorMap.get(type);
        return behavior?.tags || [];
    }

    static hasTag(type, tag) {
        if (!tag) return false;
        const normalizedTag = String(tag);
        const behavior = this.behaviorMap.get(type);
        return behavior?.tagSet?.has(normalizedTag) || false;
    }

    static getTypesByTag(tag) {
        if (!tag) return [];
        const normalized = String(tag);
        const result = [];
        this.OBJECT_DEFINITIONS.forEach((definition) => {
            if (this.hasTag(definition.type, normalized)) {
                result.push(definition.type);
            }
        });
        return result;
    }

    static getEditorTypeOrder() {
        return [...this.OBJECT_DEFINITIONS]
            .sort((a, b) => {
                const ao = this.behaviorMap.get(a.type)?.order ?? 0;
                const bo = this.behaviorMap.get(b.type)?.order ?? 0;
                return ao - bo;
            })
            .map((definition) => definition.type);
    }

    static getPlaceableTypes() {
        const types = this.getTypesByTag('placeable');
        if (types.length) return types;
        const OT = OBJECT_TYPES;
        return [
            OT.DOOR,
            OT.DOOR_VARIABLE,
            OT.KEY,
            OT.LIFE_POTION,
            OT.XP_SCROLL,
            OT.SWORD,
            OT.SWORD_BRONZE,
            OT.SWORD_WOOD,
            OT.PLAYER_START,
            OT.PLAYER_END,
            OT.SWITCH
        ].filter(Boolean);
    }

    static getCollectibleTypes() {
        const types = this.getTypesByTag('collectible');
        if (types.length) return types;
        const OT = OBJECT_TYPES;
        return [OT.KEY, OT.LIFE_POTION, OT.XP_SCROLL, OT.SWORD, OT.SWORD_BRONZE, OT.SWORD_WOOD].filter(Boolean);
    }

    static isCollectible(type) {
        return this.hasTag(type, 'collectible');
    }

    static shouldHideWhenCollected(type) {
        return this.hasTag(type, 'hide-when-collected');
    }

    static shouldHideWhenOpened(type) {
        return this.hasTag(type, 'hide-when-opened');
    }

    static shouldHideWhenVariableOpen(type) {
        return this.hasTag(type, 'hide-when-variable-open');
    }

    static isHiddenInRuntime(type) {
        return this.hasTag(type, 'hidden-in-runtime');
    }

    static requiresVariable(type) {
        return this.hasTag(type, 'requires-variable');
    }

    static isDoor(type) {
        return this.hasTag(type, 'door');
    }

    static isVariableDoor(type) {
        return this.hasTag(type, 'variable-door');
    }

    static isLockedDoor(type) {
        return this.hasTag(type, 'locked-door');
    }

    static isSwitch(type) {
        return this.hasTag(type, 'switch');
    }

    static isPlayerStart(type) {
        return this.hasTag(type, 'player-start');
    }

    static isPlayerEnd(type) {
        return this.hasTag(type, 'player-end');
    }

    static getSwordDurability(type) {
        const behavior = this.behaviorMap.get(type);
        if (!behavior) return null;
        if (Number.isFinite(behavior.swordDurability)) {
            return behavior.swordDurability;
        }
        return null;
    }
}

window.ObjectDefinitions = ObjectDefinitions;
window.ObjectTypes = window.ObjectTypes || OBJECT_TYPES;
