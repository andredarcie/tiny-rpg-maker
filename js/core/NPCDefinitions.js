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
                [null, null, null, 13, 13, null, null, null],
                [null, null, 13, 13, 13, 13, null, null],
                [null, 1, 13, 7, 7, 13, 1, null],
                [null, 1, 7, 7, 7, 7, 1, null],
                [null, 1, 6, 7, 7, 6, 1, null],
                [null, 1, 6, 6, 6, 6, 1, null],
                [null, 13, 13, 1, 1, 13, 13, null],
                [null, null, 1, null, null, 1, null, null]
            ]
        },
        {
            type: 'villager-man',
            id: 'npc-villager-man',
            name: 'Homem comum',
            previewLabel: 'Homem',
            defaultText: 'Bom dia! Posso ajudar?',
            sprite: [
                [null, null, null, 15, 15, null, null, null],
                [null, null, 6, 15, 15, 6, null, null],
                [null, 6, 15, 15, 15, 15, 6, null],
                [null, 6, 15, 8, 8, 15, 6, null],
                [null, 6, 6, 8, 8, 6, 6, null],
                [null, 11, 11, 6, 6, 11, 11, null],
                [null, 6, 11, 6, 6, 11, 6, null],
                [null, 6, null, 6, 6, null, 6, null]
            ]
        },
        {
            type: 'villager-woman',
            id: 'npc-villager-woman',
            name: 'Mulher comum',
            previewLabel: 'Mulher',
            defaultText: 'Que dia lindo para explorar.',
            sprite: [
                [null, null, null, 15, 15, null, null, null],
                [null, null, 8, 15, 15, 8, null, null],
                [null, 8, 15, 15, 15, 15, 8, null],
                [null, 8, 15, 6, 6, 15, 8, null],
                [null, 8, 8, 6, 6, 8, 8, null],
                [null, 2, 2, 8, 8, 2, 2, null],
                [null, 8, 2, 8, 8, 2, 8, null],
                [null, 8, null, 8, 8, null, 8, null]
            ]
        },
        {
            type: 'child',
            id: 'npc-child',
            name: 'Crianca curiosa',
            previewLabel: 'Crianca',
            defaultText: 'Vamos brincar de aventura!',
            sprite: [
                [null, null, null, 10, 10, null, null, null],
                [null, null, 10, 15, 15, 10, null, null],
                [null, 10, 15, 15, 15, 15, 10, null],
                [null, 10, 15, 6, 6, 15, 10, null],
                [null, 10, 10, 6, 6, 10, 10, null],
                [null, null, 10, 10, 10, 10, null, null],
                [null, null, 10, 15, 15, 10, null, null],
                [null, null, 4, null, null, 4, null, null]
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

