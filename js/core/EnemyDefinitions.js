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
            experience: 8,
            sprite: [
                [ null, null, null, 15, 15, null, 15, 15 ],
                [ 15, null, null, 15, 15, null, 15, 15 ],
                [ 15, null, null, 13, 13, 13, 13, 13 ],
                [ 15, null,  1, 13,  8, 13,  8, 13 ],
                [ null,  1,  1,  1, 13, 13, 13, null ],
                [ null,  1,  1,  1,  1, 15, null, null ],
                [ null,  1,  1,  1,  1, null, null, null ],
                [ null, 15, null, null, 15, null, null, null ]
            ]
        },
        {
            type: 'bandit',
            id: 'enemy-bandit',
            name: '🧔 Bandido',
            nameKey: 'enemies.names.bandit',
            description: 'inimigo humano comum.',
            damage: 2,
            missChance: 0.25,
            experience: 14,
            sprite: [
                [ null, 15, 15, 15, 15, null,  6, null ],
                [ null, 15,  8, 15,  8, null,  7, null ],
                [ null,  1,  1,  1,  1, null,  7, null ],
                [  5,  5,  1,  1,  1,  5,  6, null ],
                [  5,  5,  5,  1,  5, 13, 13, 13 ],
                [  1,  5,  5,  5,  5, null,  1, null ],
                [ null, 13, 13, 13, 13, null, null, null ],
                [ null, 13, null, null, 13, null, null, null ]
            ]
        },
        {
            type: 'dark-knight',
            id: 'enemy-dark-knight',
            name: '⚔️ Cavaleiro Negro',
            nameKey: 'enemies.names.darkKnight',
            description: 'o guerreiro corrompido.',
            damage: 3,
            missChance: 0.18,
            experience: 28,
            sprite: [
                [ null,  6,  5,  5,  5, null,  2, null ],
                [ null,  5,  8,  5,  8, null,  2, null ],
                [ null,  5,  5,  5,  5, null,  2, null ],
                [  5,  5, 13,  5, 13,  5,  2, null ],
                [ 13, 13,  5, 13,  5, 14, 14, 14 ],
                [  5,  5, 13,  5, 13, null,  5, null ],
                [ null,  5,  5,  5,  5, null, null, null ],
                [ null,  5, null, null,  5, null, null, null ]
            ]
        },
        {
            type: 'necromancer',
            id: 'enemy-necromancer',
            name: '🧙‍♂️ Necro',
            nameKey: 'enemies.names.necromancer',
            description: 'o mago das trevas.',
            damage: 4,
            missChance: 0.12,
            experience: 45,
            sprite: [
                [ null, null, 15, 15, 15, 15, null,  8 ],
                [ null, null, 15,  8, 15,  8, null,  4 ],
                [ null, null, 15, 15, 15, 15, null,  4 ],
                [ null, null,  2,  2,  2,  2,  2,  2 ],
                [ null, null,  2,  2,  2,  2,  2,  4 ],
                [ null, null,  2,  2,  2,  2, null,  4 ],
                [ null,  2,  2,  2,  2,  2,  2,  4 ],
                [  2,  2,  2,  2,  2,  2,  2,  2 ]
            ]
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
            experience: 70,
            sprite: [
                [ null, null,  3, 11, 11, 11, 11, 11 ],
                [ null,  3, 11, 11, 11,  8, 11,  8 ],
                [ null,  3,  3, 11, 11, 11, 11, 11 ],
                [ null, null,  3,  3,  3,  7, null,  7 ],
                [ 11, null, null,  3, 11, null, null, null ],
                [ 11, null, 11, 11, 11,  3, null, null ],
                [ 11,  3,  3,  3, null,  3, null, null ],
                [ 11, 11, null, 11, null, null, null, null ]
            ]
        },
        {
            type: 'skeleton',
            id: 'enemy-skeleton',
            name: '💀 Esqueleto',
            nameKey: 'enemies.names.skeleton',
            description: 'o morto-vivo clássico.',
            damage: 2,
            missChance: 0.25,
            experience: 16,
            aliases: ['skull'],
            sprite: [
                [ null, null,  7,  7,  7,  7, null, null ],
                [ null, null,  7,  8,  7,  8, null, null ],
                [ null, null,  7,  7,  7,  7, null, null ],
                [ null,  7, null,  7,  7, null,  7, null ],
                [ null,  7,  7,  7,  7,  7,  7, null ],
                [ null,  7, null,  7, null, null,  7, null ],
                [ null, null,  7,  7,  7,  7, null, null ],
                [ null, null,  7, null, null,  7, null, null ]
            ]
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
            experience: 90,
            sprite: [
                [ null, 10, null, 10, null, 10, null, null ],
                [ null,  9,  9,  9,  9,  9, null, 10 ],
                [ null,  5, 15,  8, 15,  8, null,  9 ],
                [ null,  5,  5, 15, 15,  5, null,  9 ],
                [ null,  2,  7,  5,  5,  7, null,  9 ],
                [ null,  2,  2,  7,  2,  2,  2, 15 ],
                [  2,  2,  2,  7,  2,  2, null,  9 ],
                [  7,  7,  7,  7,  7,  7, null,  9 ]
            ]
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
            experience: 125,
            sprite: [
                [ null, null,  8, null, null,  8, null, null ],
                [ null, null,  8,  8,  8,  8, null, null ],
                [ null, null,  8,  0,  8,  0, null, null ],
                [ null,  8,  8,  8,  8,  8,  8, null ],
                [  8,  8,  8,  8,  8,  8,  8,  8 ],
                [  8, null,  8,  8,  8,  8, null,  8 ],
                [ null, null,  8,  8,  8,  8, null, null ],
                [ null, null,  8, null, null,  8, null, null ]
            ]
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
