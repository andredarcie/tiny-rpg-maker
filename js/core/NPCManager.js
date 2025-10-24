/**
 * NPCManager creates and mutates the fixed NPC roster.
 */
(function (global) {
    const definitionsSource = (typeof module !== 'undefined' && module.exports)
        ? require('./NPCDefinitions')
        : (global.NPCDefinitions || {});

    const NPC_DEFINITIONS = definitionsSource.NPC_DEFINITIONS || [];
    const getNpcDefinition = definitionsSource.getNpcDefinition || (() => null);

    function clamp(value, min, max, fallback) {
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, value));
    }

    class NPCManager {
        constructor(gameState) {
            this.gameState = gameState;
        }

        generateId() {
            const cryptoObj = (typeof window !== 'undefined' ? window.crypto : (typeof crypto !== 'undefined' ? crypto : null));
            if (cryptoObj?.randomUUID) {
                return cryptoObj.randomUUID();
            }
            return 'id-' + Math.random().toString(36).slice(2, 9);
        }

        getDefinitions() {
            return NPC_DEFINITIONS.slice();
        }

        getNPCs() {
            return this.gameState.game.sprites;
        }

        getNPC(npcId) {
            return this.gameState.game.sprites.find((s) => s.id === npcId) || null;
        }

        getNPCByType(type) {
            return this.gameState.game.sprites.find((s) => s.type === type) || null;
        }

        ensureDefaultNPCs() {
            const allowedTypes = new Set(NPC_DEFINITIONS.map((def) => def.type));
            const normalized = [];
            const seen = new Set();

            for (const npc of this.gameState.game.sprites || []) {
                if (!allowedTypes.has(npc.type)) continue;
                if (seen.has(npc.type)) continue;
                normalized.push(this.normalizeNPC(npc));
                seen.add(npc.type);
            }

            for (const def of NPC_DEFINITIONS) {
                if (seen.has(def.type)) continue;
                normalized.push(this.createFromDefinition(def));
            }

            this.gameState.game.sprites = normalized;
            return this.gameState.game.sprites;
        }

        normalizeNPC(npc) {
            const def = getNpcDefinition(npc.type);
            const id = def?.id || npc.id || this.generateId();
            const name = def?.name || npc.name || 'NPC';
            const text = typeof npc.text === 'string' ? npc.text : (def?.defaultText || '');
            const roomIndex = clamp(Number(npc.roomIndex), 0, 3, 0);
            const x = clamp(Number(npc.x), 0, 7, 1);
            const y = clamp(Number(npc.y), 0, 7, 1);
            const placed = npc.placed !== undefined ? Boolean(npc.placed) : true;

            return {
                id,
                type: def?.type || npc.type || id,
                name,
                text,
                roomIndex,
                x,
                y,
                placed
            };
        }

        createFromDefinition(def) {
            return {
                id: def.id,
                type: def.type,
                name: def.name,
                text: def.defaultText || '',
                roomIndex: 0,
                x: 1,
                y: 1,
                placed: false
            };
        }

        addNPC(data) {
            const def = data?.type ? getNpcDefinition(data.type) : null;
            if (!def) {
                return null;
            }

            const existing = this.getNPCByType(def.type);
            if (existing) {
                Object.assign(existing, this.normalizeNPC({ ...existing, ...data, id: existing.id, type: def.type }));
                return existing.id;
            }

            const npc = this.normalizeNPC({
                id: def.id,
                type: def.type,
                name: def.name,
                text: data?.text ?? def.defaultText ?? '',
                x: data?.x ?? 1,
                y: data?.y ?? 1,
                roomIndex: data?.roomIndex ?? 0,
                placed: Boolean(data?.placed)
            });

            this.gameState.game.sprites.push(npc);
            return npc.id;
        }

        updateNPC(npcId, data) {
            const npc = this.getNPC(npcId);
            if (!npc) return;
            const updated = this.normalizeNPC({ ...npc, ...data, id: npc.id, type: npc.type });
            Object.assign(npc, updated);
        }

        removeNPC(npcId) {
            const npc = this.getNPC(npcId);
            if (!npc) return false;
            npc.placed = false;
            npc.x = 1;
            npc.y = 1;
            npc.roomIndex = 0;
            return true;
        }

        setNPCPosition(npcId, x, y, roomIndex = null) {
            const npc = this.getNPC(npcId);
            if (!npc) return;

            npc.x = clamp(Number(x), 0, 7, npc.x);
            npc.y = clamp(Number(y), 0, 7, npc.y);
            if (roomIndex !== null && roomIndex !== undefined) {
                npc.roomIndex = clamp(Number(roomIndex), 0, 3, npc.roomIndex);
            }
            npc.placed = true;
        }

        updateNPCDialog(npcId, text) {
            const npc = this.getNPC(npcId);
            if (!npc) return;
            npc.text = typeof text === 'string' ? text : npc.text;
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = NPCManager;
    } else {
        global.NPCManager = NPCManager;
    }
})(typeof window !== 'undefined' ? window : globalThis);
