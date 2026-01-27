import type { Tileset } from '../runtime/domain/definitions/tileTypes';
import type { AnyRecord } from './common';

export type { AnyRecord } from './common';

export type TestSettings = {
    startLevel: number;
    skills: string[];
    godMode: boolean;
};

export type PlayerRuntimeState = {
    x: number;
    y: number;
    lastX: number;
    roomIndex: number;
    lastRoomChangeTime?: number | null;
    level: number;
    maxLives: number;
    currentLives: number;
    lives: number;
    keys: number;
    experience: number;
    damageShield: number;
    damageShieldMax: number;
    swordType: string | null;
    lastDamageReduction: number;
    godMode: boolean;
};

export type DialogState = {
    active: boolean;
    text: string;
    page: number;
    maxPages: number;
    meta: AnyRecord | null;
};

export type EnemyDefinition = {
    id: string;
    type: string;
    roomIndex: number;
    x: number;
    y: number;
    lastX: number;
    lives?: number;
    defeatVariableId?: string | null;
};

export type VariableDefinition = {
    id: string;
    value?: unknown;
};

export type PickupOverlayState = {
    active: boolean;
    name: string;
    spriteGroup: string | null;
    spriteType: string | null;
    effect: (() => void) | null;
};

export type PickupOverlayOptions = {
    name?: string;
    title?: string;
    spriteGroup?: string | null;
    spriteType?: string | null;
    effect?: (() => void) | null;
};

export type LevelUpChoice = {
    id: string;
    nameKey?: string;
};

export type LevelUpOverlayState = {
    active: boolean;
    choices: LevelUpChoice[];
    cursor: number;
};

export type LevelUpCelebrationState = {
    active: boolean;
    level: number | null;
    startTime: number;
    timeoutId: ReturnType<typeof setTimeout> | null;
    durationMs: number;
};

export type LevelUpCelebrationOptions = {
    durationMs?: number;
};

export type LevelUpCelebrationHideOptions = {
    skipResume?: boolean;
};

export type LevelUpResult = {
    leveledUp?: boolean;
    level?: number;
    levelsGained?: number;
};

export type GameDefinition = {
    title: string;
    author: string;
    palette: string[];
    roomSize: number;
    world: { rows: number; cols: number };
    rooms: AnyRecord[];
    start: { x: number; y: number; roomIndex: number };
    sprites: AnyRecord[];
    enemies: EnemyDefinition[];
    items: AnyRecord[];
    objects: AnyRecord[];
    variables: VariableDefinition[];
    exits: AnyRecord[];
    tileset: Tileset;
};

export type RuntimeState = {
    player: PlayerRuntimeState;
    dialog: DialogState;
    enemies: EnemyDefinition[];
    variables: VariableDefinition[];
    gameOver: boolean;
    gameOverReason: string | null;
    pickupOverlay: PickupOverlayState;
    levelUpOverlay: LevelUpOverlayState;
    levelUpCelebration: LevelUpCelebrationState;
    skillRuntime: AnyRecord | null;
};

export type ReviveSnapshot = {
    game: GameDefinition;
    state: RuntimeState;
};
