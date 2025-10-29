/**
 * Defines the placeable interactive objects (chave e porta) available in the editor.
 * Each entry exposes metadata and an 8x8 sprite using PICO-8 palette indices.
 */
(function (global) {
    const OBJECT_DEFINITIONS = [
        {
            type: 'key',
            id: 'object-key',
            name: 'Chave',
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ 10, 10, 10, null, null, null, null, null ],
                [ 10, null, 10, 10, 10, 10, 10, 10 ],
                [ 10, 10, 10, null, null, 10, null, 10 ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ]
            ]
        },
        {
            type: 'door',
            id: 'object-door',
            name: 'Porta',
            sprite: [
                [ null, 4, 4, 4, 4, 4, 4, null ],
                [ 4, 9, 9, 9, 9, 9, 9, 4 ],
                [ 4, 9, 9, 9, 9, 9, 9, 4 ],
                [ 4, 9, 9, 9, 10, 9, 9, 4 ],
                [ 4, 9, 9, 9, 9, 9, 9, 4 ],
                [ 4, 9, 9, 9, 9, 9, 9, 4 ],
                [ 4, 9, 9, 9, 9, 9, 9, 4 ],
                [ null, 4, 4, 4, 4, 4, 4, null ]
            ]
        }
    ];

    function getObjectDefinition(type) {
        return OBJECT_DEFINITIONS.find((entry) => entry.type === type) || null;
    }

    const api = {
        OBJECT_DEFINITIONS,
        getObjectDefinition
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        global.ObjectDefinitions = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);

