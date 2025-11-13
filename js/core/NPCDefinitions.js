/**
 * NPCDefinitions centraliza os NPCs fixos disponiveis no editor.
 */
class NPCDefinitions {
    static NPC_DEFINITIONS = [
        {
            type: 'old-mage',
            id: 'npc-old-mage',
            name: 'Velho Mago',
            nameKey: 'npcs.names.oldMage',
            previewLabel: 'Mago',
            defaultText: 'Eu guardo segredos antigos.',
            defaultTextKey: 'npcs.dialog.oldMage',
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
            nameKey: 'npcs.names.villagerMan',
            previewLabel: 'Homem',
            defaultText: 'Bom dia! Posso ajudar?',
            defaultTextKey: 'npcs.dialog.villagerMan',
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
            nameKey: 'npcs.names.villagerWoman',
            previewLabel: 'Mulher',
            defaultText: 'Que dia lindo para explorar.',
            defaultTextKey: 'npcs.dialog.villagerWoman',
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
            nameKey: 'npcs.names.child',
            previewLabel: 'Crianca',
            defaultText: 'Vamos brincar de aventura!',
            defaultTextKey: 'npcs.dialog.child',
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
            nameKey: 'npcs.names.woodenSign',
            previewLabel: 'Placa',
            defaultText: 'Atencao aos perigos a frente.',
            defaultTextKey: 'npcs.dialog.woodenSign',
            sprite: [
                [ null, null, null, null, null, null, null, null ],
                [ null,  4,  4,  4,  4,  4,  4, null ],
                [ null,  4,  5,  5,  5,  5,  4, null ],
                [ null,  4,  4,  4,  4,  4,  4, null ],
                [ null,  4,  5,  5,  5,  4,  4, null ],
                [ null,  4,  4,  4,  4,  4,  4, null ],
                [ null,  4, null, null, null, null,  4, null ],
                [ null,  4, null, null, null, null,  4, null ]
            ]
        }
    ];

    static get definitions() {
        return this.NPC_DEFINITIONS;
    }

    static getNpcDefinition(type) {
        return this.NPC_DEFINITIONS.find((entry) => entry.type === type) || null;
    }
}

window.NPCDefinitions = NPCDefinitions;
