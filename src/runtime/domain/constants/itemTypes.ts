const ITEM_TYPES = {
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
} as const;

type ItemType = (typeof ITEM_TYPES)[keyof typeof ITEM_TYPES];

export { ITEM_TYPES };
export type { ItemType };
