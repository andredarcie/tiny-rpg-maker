import { PlayerSpriteMatrices } from './PlayerSprites';
import { NpcSpriteMatrices } from './NpcSprites';
import { EnemySpriteMatrices } from './EnemySprites';
import { ObjectSpriteMatrices } from './ObjectSprites';

type SpriteMatrix = (number | null)[][];

class SpriteMatrixRegistry {
    static get(group, type = 'default') {
        const registries = {
            player: PlayerSpriteMatrices,
            npc: NpcSpriteMatrices,
            enemy: EnemySpriteMatrices,
            object: ObjectSpriteMatrices
        };
        const normalizedGroup = String(group || '').toLowerCase();
        const registry = registries[normalizedGroup];
        if (!registry) {
            throw new Error(`SpriteMatrixRegistry: registry not found for "${group}"`);
        }
        const key = type ?? 'default';
        const matrix = registry[key];
        if (!matrix) {
            throw new Error(`SpriteMatrixRegistry: sprite "${key}" not found for group "${normalizedGroup}"`);
        }
        return matrix as SpriteMatrix;
    }
}

export { SpriteMatrixRegistry };
