/**
 * ObjectDefinitions encapsula os objetos interativos disponiveis no editor.
 */
class ObjectDefinitions {
    static OBJECT_DEFINITIONS = [
        {
            type: 'key',
            id: 'object-key',
            name: 'Chave',
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
