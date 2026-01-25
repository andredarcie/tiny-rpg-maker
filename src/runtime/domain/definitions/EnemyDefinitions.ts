import { SpriteMatrixRegistry } from '../sprites/SpriteMatrixRegistry';

type SpriteMatrix = (number | null)[][];

type EnemyDefinition = {
    type: string;
    id: string;
    name: string;
    nameKey: string;
    description: string;
    damage: number;
    missChance: number;
    experience: number;
    hasEyes: boolean;
    sprite: SpriteMatrix;
    aliases?: string[];
    boss?: boolean;
    defeatActivationMessage?: string;
    defeatActivationMessageKey?: string;
};

type EnemyTypeInput = EnemyDefinition['type'] | null | undefined;
/**
 * EnemyDefinitions concentra os inimigos disponiveis para o editor.
 */
class EnemyDefinitions {
    static ENEMY_DEFINITIONS: EnemyDefinition[] = [
        {
            type: 'giant-rat',
            id: 'enemy-giant-rat',
            name: '🐀 Rato Gigante',
            nameKey: 'enemies.names.giantRat',
            description: 'o primeiro inimigo fraco.',
            damage: 1,
            missChance: 0.10,
            experience: 3,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'giant-rat')
        },
        {
            type: 'bandit',
            id: 'enemy-bandit',
            name: '🧔 Bandido',
            nameKey: 'enemies.names.bandit',
            description: 'inimigo humano comum.',
            damage: 2,
            missChance: 0.25,
            experience: 4,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'bandit')
        },
        {
            type: 'skeleton',
            id: 'enemy-skeleton',
            name: '💀 Esqueleto',
            nameKey: 'enemies.names.skeleton',
            description: 'o morto-vivo clássico.',
            damage: 3,
            missChance: 0.25,
            experience: 5,
            aliases: ['skull'],
            hasEyes: false,
            sprite: SpriteMatrixRegistry.get('enemy', 'skeleton')
        },
        {
            type: 'dark-knight',
            id: 'enemy-dark-knight',
            name: '⚔️ Cavaleiro Negro',
            nameKey: 'enemies.names.darkKnight',
            description: 'o guerreiro corrompido.',
            damage: 4,
            missChance: 0.18,
            experience: 7,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'dark-knight')
        },
        {
            type: 'necromancer',
            id: 'enemy-necromancer',
            name: '🧙‍♂️ Necro',
            nameKey: 'enemies.names.necromancer',
            description: 'o mago das trevas.',
            damage: 5,
            missChance: 0.12,
            experience: 8,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'necromancer')
        },
        {
            type: 'dragon',
            id: 'enemy-dragon',
            name: '🐉 Dragão',
            nameKey: 'enemies.names.dragon',
            description: 'o monstro lendário.',
            damage: 6,
            missChance: 0.08,
            defeatActivationMessage: 'Selo do Dragão ativado!',
            defeatActivationMessageKey: 'enemies.defeat.dragon',
            experience: 9,
            hasEyes: true,
            boss: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'dragon')
        },
        {
            type: 'fallen-king',
            id: 'enemy-fallen-king',
            name: '👑 Rei Caído',
            nameKey: 'enemies.names.fallenKing',
            description: 'o chefe trágico corrompido pelo poder.',
            damage: 7,
            missChance: 0.08,
            defeatActivationMessage: 'Selo Real despertou!',
            defeatActivationMessageKey: 'enemies.defeat.fallenKing',
            experience: 10,
            hasEyes: true,
            boss: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'fallen-king')
        },
        {
            type: 'ancient-demon',
            id: 'enemy-ancient-demon',
            name: '😈 Demônio Ancião',
            nameKey: 'enemies.names.ancientDemon',
            description: 'o mal primordial e final.',
            damage: 8,
            missChance: 0.05,
            defeatActivationMessage: 'Selo Demoníaco ativo!',
            defeatActivationMessageKey: 'enemies.defeat.ancientDemon',
            aliases: ['boss'],
            experience: 11,
            hasEyes: false,
            boss: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'ancient-demon')
        }
    ];

    static get definitions(): EnemyDefinition[] {
        return this.ENEMY_DEFINITIONS;
    }

    static getDefault(): EnemyDefinition | null {
        return this.ENEMY_DEFINITIONS[0] || null;
    }

    static getEnemyDefinition(type: EnemyTypeInput): EnemyDefinition | null {
        if (typeof type !== 'string' || !type) return null;
        const direct = this.ENEMY_DEFINITIONS.find((entry) => entry.type === type);
        if (direct) return direct;
        return this.ENEMY_DEFINITIONS.find((entry) =>
            Array.isArray(entry.aliases) && entry.aliases.includes(type)
        ) || null;
    }

    static normalizeType(type: EnemyTypeInput): EnemyDefinition['type'] {
        const definition = this.getEnemyDefinition(type);
        if (definition) return definition.type;
        return this.getDefault()?.type || 'giant-rat';
    }

    static getExperienceReward(type: EnemyTypeInput): number {
        const definition = this.getEnemyDefinition(type);
        if (!definition) return 0;
        const reward = Number(definition.experience);
        if (!Number.isFinite(reward)) return 0;
        return Math.max(0, Math.floor(reward));
    }

    static getMissChance(type: EnemyTypeInput): number | null {
        const definition = this.getEnemyDefinition(type);
        if (!definition) return null;
        const value = Number(definition.missChance);
        if (!Number.isFinite(value)) return null;
        return Math.max(0, Math.min(1, value));
    }
}

export { EnemyDefinitions };
