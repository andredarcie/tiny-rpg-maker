/**
 * Defines the fixed set of NPCs available in the editor.
 * Each entry includes metadata, default dialogue, a simple preview label,
 * and an 8x8 sprite expressed using PICO-8 palette indices.
 */
(function (global) {
    const NPC_DEFINITIONS = [
        {
            type: 'old-mage',
            id: 'npc-old-mage',
            name: 'Velho Mago',
            previewLabel: 'Mago',
            defaultText: 'Eu guardo segredos antigos.',
            sprite: [
                [ null, null,  6,  6,  6,  6, null, null ],
                [  6, null, 15, 12, 15, 12, null, null ],
                [  6, null, 15, 15, 15, 15, null, null ],
                [ 15,  5,  5,  6,  6,  6,  5, null ],
                [  6, null,  5,  6,  6,  6, 15, null ],
                [  6, null,  5,  5,  6,  6, null, null ],
                [  6, null,  5,  5,  5,  5, null, null ],
                [  6, null,  5,  5,  5,  5, null, null ]
            ]
        },
        {
            type: 'villager-man',
            id: 'npc-villager-man',
            name: 'Homem comum',
            previewLabel: 'Homem',
            defaultText: 'Bom dia! Posso ajudar?',
            sprite: [
                [ null, null, 15, 15, 15, 15, null, null ],
                [ null, null, 15, 12, 15, 12, null, null ],
                [ null, null, 15, 15, 15, 15, null, null ],
                [ null,  4,  4, 15, 15,  4,  4, null ],
                [ null, 15,  4,  4,  4,  4, 15, null ],
                [ null, null,  4,  4,  4,  4, null, null ],
                [ null, null,  9,  9,  9,  9, null, null ],
                [ null, null,  9, null, null,  9, null, null ]
            ]
        },
        {
            type: 'villager-woman',
            id: 'npc-villager-woman',
            name: 'Mulher comum',
            previewLabel: 'Mulher',
            defaultText: 'Que dia lindo para explorar.',
            sprite: [
                [ null, null,  4,  4,  4,  4, null, null ],
                [ null, null,  4, 12, 15, 12, null, null ],
                [ null, null,  4, 15, 15, 15, null, null ],
                [ null, 14,  4, 15, 15, 14, 14, null ],
                [ null, 15,  4, 14, 14, 14, 15, null ],
                [ null, null, 14, 14, 14, 14, null, null ],
                [ null, null, 14, 14, 14, 14, null, null ],
                [ null, null, 14, 14, 14, 14, null, null ]
            ]
        },
        {
            type: 'child',
            id: 'npc-child',
            name: 'Crianca curiosa',
            previewLabel: 'Crianca',
            defaultText: 'Vamos brincar de aventura!',
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null, null, null, null, null, null, null ],
                [ null, null, 15, 15, 15, 15, null, null ],
                [ null, null, 15, 12, 15, 12, null, null ],
                [ null, null, 15, 15, 15, 15, null, null ],
                [ null,  9,  9,  9,  9,  9,  9, null ],
                [ null, null,  9, null, null,  9, null, null ]
            ]
        },
        {
            type: 'wooden-sign',
            id: 'npc-wooden-sign',
            name: 'Placa de madeira',
            previewLabel: 'Placa',
            defaultText: 'Atenção aos perigos à frente.',
            sprite: [
                [null, null, 6, 6, 6, 6, null, null],
                [null, 6, 14, 14, 14, 14, 6, null],
                [null, 6, 14, 14, 14, 14, 6, null],
                [null, 6, 14, 14, 14, 14, 6, null],
                [null, 6, 14, 14, 14, 14, 6, null],
                [null, 6, 14, 14, 14, 14, 6, null],
                [null, null, 6, 6, 6, 6, null, null],
                [null, null, 6, null, null, 6, null, null]
            ]
        }
    ];

    function getNpcDefinition(type) {
        return NPC_DEFINITIONS.find((entry) => entry.type === type) || null;
    }

    const api = {
        NPC_DEFINITIONS,
        getNpcDefinition
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        global.NPCDefinitions = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);

