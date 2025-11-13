/**
 * ObjectDefinitions encapsula os objetos interativos disponiveis no editor.
 */
class ObjectDefinitions {
    static OBJECT_DEFINITIONS = [
        {
            type: 'player-start',
            id: 'object-player-start',
            name: 'Inicio do Jogador',
            nameKey: 'objects.label.playerStart',
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
            type: 'player-end',
            id: 'object-player-end',
            name: 'Fim do Jogo',
            nameKey: 'objects.label.playerEnd',
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
            type: 'switch',
            id: 'object-switch',
            name: 'Alavanca',
            nameKey: 'objects.label.switch',
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
            type: 'key',
            id: 'object-key',
            name: 'Chave',
            nameKey: 'objects.label.key',
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
            type: 'door',
            id: 'object-door',
            name: 'Porta',
            nameKey: 'objects.label.door',
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
            type: 'door-variable',
            id: 'object-door-variable',
            name: 'Porta Magica',
            nameKey: 'objects.label.doorVariable',
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
            type: 'life-potion',
            id: 'object-life-potion',
            name: 'Pocao de Vida',
            nameKey: 'objects.label.lifePotion',
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
            type: 'xp-scroll',
            id: 'object-xp-scroll',
            name: 'Pergaminho de XP',
            nameKey: 'objects.label.xpScroll',
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
            type: 'sword',
            id: 'object-sword',
            name: 'Espada',
            nameKey: 'objects.label.sword',
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
        }
    ];

    static get definitions() {
        return this.OBJECT_DEFINITIONS;
    }

    static getObjectDefinition(type) {
        return this.OBJECT_DEFINITIONS.find((entry) => entry.type === type) || null;
    }
}

window.ObjectDefinitions = ObjectDefinitions;
