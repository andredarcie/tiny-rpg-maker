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
            sprite: SpriteMatrixRegistry.get('npc', 'old-mage')
        },
        {
            type: 'villager-man',
            id: 'npc-villager-man',
            name: 'Homem comum',
            nameKey: 'npcs.names.villagerMan',
            previewLabel: 'Homem',
            defaultText: 'Bom dia! Posso ajudar?',
            defaultTextKey: 'npcs.dialog.villagerMan',
            sprite: SpriteMatrixRegistry.get('npc', 'villager-man')
        },
        {
            type: 'villager-woman',
            id: 'npc-villager-woman',
            name: 'Mulher comum',
            nameKey: 'npcs.names.villagerWoman',
            previewLabel: 'Mulher',
            defaultText: 'Que dia lindo para explorar.',
            defaultTextKey: 'npcs.dialog.villagerWoman',
            sprite: SpriteMatrixRegistry.get('npc', 'villager-woman')
        },
        {
            type: 'child',
            id: 'npc-child',
            name: 'Crianca curiosa',
            nameKey: 'npcs.names.child',
            previewLabel: 'Crianca',
            defaultText: 'Vamos brincar de aventura!',
            defaultTextKey: 'npcs.dialog.child',
            sprite: SpriteMatrixRegistry.get('npc', 'child')
        },
        {
            type: 'wooden-sign',
            id: 'npc-wooden-sign',
            name: 'Placa de madeira',
            nameKey: 'npcs.names.woodenSign',
            previewLabel: 'Placa',
            defaultText: 'Atencao aos perigos a frente.',
            defaultTextKey: 'npcs.dialog.woodenSign',
            sprite: SpriteMatrixRegistry.get('npc', 'wooden-sign')
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
