/**
 * NPCManager - Gerencia NPCs e operações relacionadas
 */
class NPCManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    generateId() {
        return (window.crypto?.randomUUID?.() || ('id-' + Math.random().toString(36).slice(2, 9)));
    }

    createNPC(name = null, x = 1, y = 1, roomIndex = 0, text = 'Olá!') {
        return {
            id: this.generateId(),
            name: name || `NPC ${this.gameState.game.sprites.length + 1}`,
            x: x,
            y: y,
            roomIndex: roomIndex,
            text: text
        };
    }

    addNPC(npc) {
        if (!npc.id) npc.id = this.generateId();
        if (!npc.name) npc.name = `NPC ${this.gameState.game.sprites.length + 1}`;
        if (typeof npc.x !== 'number') npc.x = 1;
        if (typeof npc.y !== 'number') npc.y = 1;
        if (typeof npc.roomIndex !== 'number') npc.roomIndex = 0;
        if (!npc.text) npc.text = 'Olá!';
        
        this.gameState.game.sprites.push(npc);
        return npc.id;
    }

    updateNPC(npcId, data) {
        const npc = this.gameState.game.sprites.find(s => s.id === npcId);
        if (!npc) return;
        Object.assign(npc, data);
    }

    removeNPC(npcId) {
        const index = this.gameState.game.sprites.findIndex(s => s.id === npcId);
        if (index >= 0) {
            this.gameState.game.sprites.splice(index, 1);
            return true;
        }
        return false;
    }

    getNPCs() {
        return this.gameState.game.sprites;
    }

    getNPC(npcId) {
        return this.gameState.game.sprites.find(s => s.id === npcId);
    }

    getNPCsInRoom(roomIndex) {
        return this.gameState.game.sprites.filter(s => s.roomIndex === roomIndex);
    }

    setNPCPosition(npcId, x, y, roomIndex = null) {
        const npc = this.getNPC(npcId);
        if (!npc) return;
        
        npc.x = x;
        npc.y = y;
        if (roomIndex !== null) {
            npc.roomIndex = roomIndex;
        }
    }

    updateNPCDialog(npcId, text) {
        const npc = this.getNPC(npcId);
        if (!npc) return;
        npc.text = text;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NPCManager;
} else {
    window.NPCManager = NPCManager;
}
