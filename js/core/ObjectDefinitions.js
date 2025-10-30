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
