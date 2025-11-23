/**
 * EnemyDefinitions concentra os inimigos disponiveis para o editor.
 */
class EnemyDefinitions {
    static ENEMY_DEFINITIONS = [
        {
            type: 'giant-rat',
            id: 'enemy-giant-rat',
            name: '🐀 Rato Gigante',
            nameKey: 'enemies.names.giantRat',
            description: 'o primeiro inimigo fraco.',
            damage: 1,
            missChance: 0.35,
            experience: 10,
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
            experience: 18,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'bandit')
        },
        {
            type: 'dark-knight',
            id: 'enemy-dark-knight',
            name: '⚔️ Cavaleiro Negro',
            nameKey: 'enemies.names.darkKnight',
            description: 'o guerreiro corrompido.',
            damage: 3,
            missChance: 0.18,
            experience: 34,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'dark-knight')
        },
        {
            type: 'necromancer',
            id: 'enemy-necromancer',
            name: '🧙‍♂️ Necro',
            nameKey: 'enemies.names.necromancer',
            description: 'o mago das trevas.',
            damage: 4,
            missChance: 0.12,
            experience: 55,
            hasEyes: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'necromancer')
        },
        {
            type: 'dragon',
            id: 'enemy-dragon',
            name: '🐉 Dragão',
            nameKey: 'enemies.names.dragon',
            description: 'o monstro lendário.',
            damage: 5,
            missChance: 0.08,
            defeatActivationMessage: 'Selo do Dragão ativado!',
            defeatActivationMessageKey: 'enemies.defeat.dragon',
            experience: 90,
            hasEyes: true,
            boss: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'dragon')
        },
        {
            type: 'skeleton',
            id: 'enemy-skeleton',
            name: '💀 Esqueleto',
            nameKey: 'enemies.names.skeleton',
            description: 'o morto-vivo clássico.',
            damage: 2,
            missChance: 0.25,
            experience: 20,
            aliases: ['skull'],
            hasEyes: false,
            sprite: SpriteMatrixRegistry.get('enemy', 'skeleton')
        },
        {
            type: 'fallen-king',
            id: 'enemy-fallen-king',
            name: '👑 Rei Caído',
            nameKey: 'enemies.names.fallenKing',
            description: 'o chefe trágico corrompido pelo poder.',
            damage: 5,
            missChance: 0.08,
            defeatActivationMessage: 'Selo Real despertou!',
            defeatActivationMessageKey: 'enemies.defeat.fallenKing',
            experience: 110,
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
            damage: 6,
            missChance: 0.05,
            defeatActivationMessage: 'Selo Demoníaco ativo!',
            defeatActivationMessageKey: 'enemies.defeat.ancientDemon',
            aliases: ['boss'],
            experience: 150,
            hasEyes: false,
            boss: true,
            sprite: SpriteMatrixRegistry.get('enemy', 'ancient-demon')
        }
    ];

    static get definitions() {
        return this.ENEMY_DEFINITIONS;
    }

    static getDefault() {
        return this.ENEMY_DEFINITIONS[0] || null;
    }

    static getEnemyDefinition(type) {
        if (typeof type !== 'string' || !type) return null;
        const direct = this.ENEMY_DEFINITIONS.find((entry) => entry.type === type);
        if (direct) return direct;
        return this.ENEMY_DEFINITIONS.find((entry) =>
            Array.isArray(entry.aliases) && entry.aliases.includes(type)
        ) || null;
    }

    static normalizeType(type) {
        const definition = this.getEnemyDefinition(type);
        if (definition) return definition.type;
        return this.getDefault()?.type || 'giant-rat';
    }

    static getExperienceReward(type) {
        const definition = this.getEnemyDefinition(type);
        if (!definition) return 0;
        const reward = Number(definition.experience);
        if (!Number.isFinite(reward)) return 0;
        return Math.max(0, Math.floor(reward));
    }

    static getMissChance(type) {
        const definition = this.getEnemyDefinition(type);
        if (!definition) return null;
        const value = Number(definition.missChance);
        if (!Number.isFinite(value)) return null;
        return Math.max(0, Math.min(1, value));
    }
}

if (typeof window !== 'undefined') {
    window.EnemyDefinitions = EnemyDefinitions;
}
