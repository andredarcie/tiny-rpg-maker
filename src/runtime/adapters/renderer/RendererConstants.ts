import { EnemyDefinitions } from '../../domain/definitions/EnemyDefinitions';
import { NPCDefinitions } from '../../domain/definitions/NPCDefinitions';
import { ItemDefinitions } from '../../domain/definitions/ItemDefinitions';

export type SpriteMatrix = (number | null)[][];

export type NpcDefinition = {
    type: string;
    sprite: SpriteMatrix;
};

export type ObjectDefinition = {
    type: string;
    sprite?: SpriteMatrix;
    spriteOn?: SpriteMatrix;
};

export type EnemyDefinition = {
    type: string;
    sprite?: SpriteMatrix;
    aliases?: string[];
};

class RendererConstants {
    private static _npcDefinitions?: NpcDefinition[];
    private static _objectDefinitions?: ObjectDefinition[];
    private static _enemyDefinitions?: EnemyDefinition[];

    static get NPC_DEFINITIONS() {
        if (!this._npcDefinitions || !this._npcDefinitions.length) {
            this._npcDefinitions = NPCDefinitions.definitions;
        }
        return this._npcDefinitions;
    }

    static get OBJECT_DEFINITIONS() {
        if (!this._objectDefinitions || !this._objectDefinitions.length) {
            this._objectDefinitions = ItemDefinitions.definitions;
        }
        return this._objectDefinitions;
    }

    static get ENEMY_DEFINITIONS() {
        if (!this._enemyDefinitions || !this._enemyDefinitions.length) {
            this._enemyDefinitions = EnemyDefinitions.definitions;
        }
        return this._enemyDefinitions;
    }

    static get DEFAULT_PALETTE() {
        return [
            "#000000", "#1D2B53", "#7E2553", "#008751",
            "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
            "#FF004D", "#FFA300", "#FFFF27", "#00E756",
            "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
        ];
    }
}

export { RendererConstants };
