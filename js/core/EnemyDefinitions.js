/**
 * EnemyDefinitions concentra os inimigos disponiveis para o editor.
 */
class EnemyDefinitions {
    static ENEMY_DEFINITIONS = [
        {
            type: 'giant-rat',
            id: 'enemy-giant-rat',
            name: '🐀 Rato Gigante',
            description: 'o primeiro inimigo fraco.',
            damage: 1,
            sprite: [
                [ null, null, 5, 5, 5, 5, null, null ],
                [ null, 4, 5, 6, 6, 5, 4, null ],
                [ 4, 5, 6, 6, 6, 6, 5, 4 ],
                [ 4, 6, 6, 8, 8, 6, 6, 4 ],
                [ 4, 6, 6, 6, 6, 6, 6, 4 ],
                [ null, 4, 6, 6, 6, 6, 4, null ],
                [ null, null, 4, 4, 4, 4, null, null ],
                [ null, null, 4, null, null, 4, null, null ]
            ]
        },
        {
            type: 'bandit',
            id: 'enemy-bandit',
            name: '🧔 Bandido',
            description: 'inimigo humano comum.',
            damage: 2,
            sprite: [
                [ null, null, 1, 1, 1, 1, null, null ],
                [ null, 1, 7, 7, 7, 7, 1, null ],
                [ null, 1, 15, 12, 15, 12, 1, null ],
                [ null, 4, 4, 1, 1, 4, 4, null ],
                [ 4, 4, 4, 4, 4, 4, 4, 4 ],
                [ 4, null, 4, 4, 4, 4, null, 4 ],
                [ 4, null, 4, null, null, 4, null, 4 ],
                [ 4, null, 4, null, null, 4, null, 4 ]
            ]
        },
        {
            type: 'dark-knight',
            id: 'enemy-dark-knight',
            name: '⚔️ Cavaleiro Negro',
            description: 'o guerreiro corrompido.',
            damage: 3,
            sprite: [
                [ null, null, 1, 1, 1, 1, null, null ],
                [ null, 1, 8, 8, 8, 8, 1, null ],
                [ null, 1, 12, 1, 1, 12, 1, null ],
                [ 1, 12, 1, 1, 1, 1, 12, 1 ],
                [ 1, 12, 12, 1, 1, 12, 12, 1 ],
                [ null, 1, 12, 12, 12, 12, 1, null ],
                [ null, 1, 12, null, null, 12, 1, null ],
                [ null, 1, 12, null, null, 12, 1, null ]
            ]
        },
        {
            type: 'necromancer',
            id: 'enemy-necromancer',
            name: '🧙‍♂️ Necromante',
            description: 'o mago das trevas.',
            damage: 4,
            sprite: [
                [ null, null, 13, 13, 13, 13, null, null ],
                [ null, 13, 7, 7, 7, 7, 13, null ],
                [ null, 13, 14, 7, 7, 14, 13, null ],
                [ 13, 14, 14, 13, 13, 14, 14, 13 ],
                [ 13, 14, 13, 13, 13, 13, 14, 13 ],
                [ null, 13, 13, 14, 14, 13, 13, null ],
                [ null, 13, 13, 14, 14, 13, 13, null ],
                [ null, 13, 13, null, null, 13, 13, null ]
            ]
        },
        {
            type: 'dragon',
            id: 'enemy-dragon',
            name: '🐉 Dragão',
            description: 'o monstro lendário.',
            damage: 5,
            sprite: [
                [ null, 3, 3, 3, 3, 3, 3, null ],
                [ 3, 11, 11, 3, 3, 11, 11, 3 ],
                [ 3, 11, 8, 3, 3, 8, 11, 3 ],
                [ null, 3, 3, 11, 11, 3, 3, null ],
                [ null, null, 3, 11, 11, 3, null, null ],
                [ null, null, 3, 3, 3, 3, null, null ],
                [ null, 3, 3, null, null, 3, 3, null ],
                [ null, 3, null, null, null, null, 3, null ]
            ]
        },
        {
            type: 'skeleton',
            id: 'enemy-skeleton',
            name: '💀 Esqueleto',
            description: 'o morto-vivo clássico.',
            damage: 2,
            aliases: ['skull'],
            sprite: [
                [ null, null, 7, 7, 7, 7, null, null ],
                [ null, 7, 6, 7, 7, 6, 7, null ],
                [ null, 7, 7, 7, 7, 7, 7, null ],
                [ null, 7, 6, 6, 6, 6, 7, null ],
                [ null, 7, 7, 7, 7, 7, 7, null ],
                [ null, 7, 6, 7, 7, 6, 7, null ],
                [ null, null, 7, 7, 7, 7, null, null ],
                [ null, null, 6, null, null, 6, null, null ]
            ]
        },
        {
            type: 'fallen-king',
            id: 'enemy-fallen-king',
            name: '👑 Rei Caído',
            description: 'o chefe trágico corrompido pelo poder.',
            damage: 5,
            sprite: [
                [ null, null, 10, 10, 10, 10, null, null ],
                [ null, 10, 9, 10, 10, 9, 10, null ],
                [ null, 4, 15, 12, 12, 15, 4, null ],
                [ 4, 4, 4, 4, 4, 4, 4, 4 ],
                [ 4, null, 4, 4, 4, 4, null, 4 ],
                [ 4, null, 4, 4, 4, 4, null, 4 ],
                [ 4, null, 4, null, null, 4, null, 4 ],
                [ 4, null, 4, null, null, 4, null, 4 ]
            ]
        },
        {
            type: 'ancient-demon',
            id: 'enemy-ancient-demon',
            name: '😈 Demônio Ancião',
            description: 'o mal primordial e final.',
            damage: 6,
            sprite: [
                [ null, null, 8, 8, 8, 8, null, null ],
                [ null, 8, 14, 8, 8, 14, 8, null ],
                [ null, 8, 2, 14, 14, 2, 8, null ],
                [ 8, 14, 8, 2, 2, 8, 14, 8 ],
                [ 8, 14, 14, 8, 8, 14, 14, 8 ],
                [ null, 8, 14, 14, 14, 14, 8, null ],
                [ null, 8, 14, null, null, 14, 8, null ],
                [ null, 8, 14, null, null, 14, 8, null ]
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
}

if (typeof window !== 'undefined') {
    window.EnemyDefinitions = EnemyDefinitions;
}
