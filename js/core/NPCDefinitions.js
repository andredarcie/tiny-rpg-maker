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
            defaultText: '',
            defaultTextKey: 'npcs.dialog.oldMage',
            sprite: SpriteMatrixRegistry.get('npc', 'old-mage')
        },
        {
            type: 'villager-man',
            id: 'npc-villager-man',
            name: 'Homem comum',
            nameKey: 'npcs.names.villagerMan',
            previewLabel: 'Homem',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.villagerMan',
            sprite: SpriteMatrixRegistry.get('npc', 'villager-man')
        },
        {
            type: 'villager-woman',
            id: 'npc-villager-woman',
            name: 'Mulher comum',
            nameKey: 'npcs.names.villagerWoman',
            previewLabel: 'Mulher',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.villagerWoman',
            sprite: SpriteMatrixRegistry.get('npc', 'villager-woman')
        },
        {
            type: 'child',
            id: 'npc-child',
            name: 'Crianca curiosa',
            nameKey: 'npcs.names.child',
            previewLabel: 'Crianca',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.child',
            sprite: SpriteMatrixRegistry.get('npc', 'child')
        },
        {
            type: 'king',
            id: 'npc-king',
            name: 'Rei',
            nameKey: 'npcs.names.king',
            previewLabel: 'Rei',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.king',
            sprite: SpriteMatrixRegistry.get('npc', 'king')
        },
        {
            type: 'knight',
            id: 'npc-knight',
            name: 'Cavaleiro',
            nameKey: 'npcs.names.knight',
            previewLabel: 'Cavaleiro',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.knight',
            sprite: SpriteMatrixRegistry.get('npc', 'knight')
        },
        {
            type: 'thief',
            id: 'npc-thief',
            name: 'Ladra',
            nameKey: 'npcs.names.thief',
            previewLabel: 'Ladra',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.thief',
            sprite: SpriteMatrixRegistry.get('npc', 'thief')
        },
        {
            type: 'blacksmith',
            id: 'npc-blacksmith',
            name: 'Ferreira',
            nameKey: 'npcs.names.blacksmith',
            previewLabel: 'Ferreira',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.blacksmith',
            sprite: SpriteMatrixRegistry.get('npc', 'blacksmith')
        },
        {
            type: 'thought-bubble',
            id: 'npc-thought-bubble',
            name: 'Balao',
            nameKey: 'npcs.names.thoughtBubble',
            previewLabel: 'Balao',
            defaultText: '',
            defaultTextKey: 'npcs.dialog.thoughtBubble',
            sprite: SpriteMatrixRegistry.get('npc', 'thought-bubble')
        },
        {
            type: 'wooden-sign',
            id: 'npc-wooden-sign',
            name: 'Placa de madeira',
            nameKey: 'npcs.names.woodenSign',
            previewLabel: 'Placa',
            defaultText: '',
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
