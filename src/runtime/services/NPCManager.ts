
import { NPCDefinitions } from '../domain/definitions/NPCDefinitions';
import { TextResources } from '../adapters/TextResources';

/**
 * NPCManager creates and mutates the fixed NPC roster.
 */
const NPC_MANAGER_DEFINITIONS = NPCDefinitions.definitions || [];
const getNpcDefinition = (type) => NPCDefinitions.getNpcDefinition(type);
const NPC_ID_PREFIX = 'npc-';
const TYPE_TO_INDEX = new Map();
for (let i = 0; i < NPC_MANAGER_DEFINITIONS.length; i++) {
    TYPE_TO_INDEX.set(NPC_MANAGER_DEFINITIONS[i].type, i + 1);
}
let nextNpcId = NPC_MANAGER_DEFINITIONS.length + 1;

const getNpcLocaleText = (key, fallback = '') => {
    const value = TextResources.get(key, fallback);
    return value || fallback || key || '';
};

const resolveDefinitionName = (def) => {
    if (!def) return getNpcLocaleText('npc.defaultName', 'NPC');
    if (def.nameKey) {
        return getNpcLocaleText(def.nameKey, def.name || 'NPC');
    }
    return def.name || getNpcLocaleText('npc.defaultName', 'NPC');
};

const resolveDefinitionText = (def) => {
    if (!def) return '';
    if (def.defaultTextKey) {
        return getNpcLocaleText(def.defaultTextKey, def.defaultText || '');
    }
    return def.defaultText || '';
};

/**
 * normalizeNpcText decides which text should be shown for an NPC.
 * It prioritizes the explicit textKey, falls back to the definition's default textKey,
 * and finally uses the custom text or the base definition text.
 */
const normalizeNpcText = (npc, def) => {
    const defaultText = resolveDefinitionText(def);
    const defaultTextKey = def && def.defaultTextKey ? def.defaultTextKey : null;

    const hasCustomText = Object.prototype.hasOwnProperty.call(npc, 'text');
    const customText = hasCustomText
        ? (typeof npc.text === 'string' ? npc.text : String(npc.text || ''))
        : '';

    const storedTextKey = typeof npc.textKey === 'string' && npc.textKey.trim()
        ? npc.textKey.trim()
        : null;

    // If the NPC already has a textKey, just reuse it.
    if (storedTextKey) {
        const fallback = customText || defaultText;
        return {
            textKey: storedTextKey,
            text: getNpcLocaleText(storedTextKey, fallback)
        };
    }

    // If there is no custom text and the definition has a default text key, reuse it.
    if (!hasCustomText && defaultTextKey) {
        return {
            textKey: defaultTextKey,
            text: getNpcLocaleText(defaultTextKey, defaultText)
        };
    }

    // Fallback: use the custom text (even empty string) or the default definition text.
    return {
        textKey: null,
        text: hasCustomText ? customText : defaultText
    };
};

function clamp(value, min, max, fallback) {
    if (!Number.isFinite(value)) return fallback;
    return Math.max(min, Math.min(max, value));
}

function parseSequentialId(id) {
    if (typeof id !== 'string') return null;
    if (!id.startsWith(NPC_ID_PREFIX)) return null;
    const value = Number(id.slice(NPC_ID_PREFIX.length));
    return Number.isFinite(value) && value > 0 ? value : null;
}

function ensureCounterAbove(value) {
    if (Number.isFinite(value) && value >= nextNpcId) {
        nextNpcId = value + 1;
    }
}

function sequentialIdForType(type) {
    if (!TYPE_TO_INDEX.has(type)) return null;
    const index = TYPE_TO_INDEX.get(type);
    ensureCounterAbove(index);
    return `${NPC_ID_PREFIX}${index}`;
}

function allocateSequentialId() {
    const id = `${NPC_ID_PREFIX}${nextNpcId}`;
    nextNpcId += 1;
    return id;
}

class NPCManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    generateId() {
        return allocateSequentialId();
    }

    getDefinitions() {
        return NPC_MANAGER_DEFINITIONS.slice();
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
        const allowedTypes = new Set(NPC_MANAGER_DEFINITIONS.map((def) => def.type));
        const normalized = [];
        const seen = new Set();

        for (const npc of this.gameState.game.sprites || []) {
            if (!allowedTypes.has(npc.type)) continue;
            if (seen.has(npc.type)) continue;
            normalized.push(this.normalizeNPC(npc));
            seen.add(npc.type);
        }

        for (const def of NPC_MANAGER_DEFINITIONS) {
            if (seen.has(def.type)) continue;
            normalized.push(this.createFromDefinition(def));
        }

        this.gameState.game.sprites = normalized;
        return this.gameState.game.sprites;
    }

    normalizeNPC(npc) {
        const def = getNpcDefinition(npc.type);
        const sequentialId = def ? sequentialIdForType(def.type) : null;
        const existingId = typeof npc?.id === 'string' ? npc.id.trim() : '';
        const parsed = parseSequentialId(existingId);
        if (parsed) {
            ensureCounterAbove(parsed);
        }
        const id = sequentialId || existingId || this.generateId();
        const baseName = def ? resolveDefinitionName(def) : null;
        const name = npc.name || baseName || getNpcLocaleText('npc.defaultName', 'NPC');
        const { text, textKey } = normalizeNpcText(npc, def);
        const maxRoomIndex = Math.max(0, (this.gameState?.game?.rooms?.length ?? 1) - 1);
        const roomIndex = clamp(Number(npc.roomIndex), 0, maxRoomIndex, 0);
        const x = clamp(Number(npc.x), 0, 7, 1);
        const y = clamp(Number(npc.y), 0, 7, 1);
        const initialX = npc.initialX !== undefined ? npc.initialX : x;
        const initialY = npc.initialY !== undefined ? npc.initialY : y;
        const initialRoomIndex = npc.initialRoomIndex !== undefined ? npc.initialRoomIndex : roomIndex;
        const placed = npc.placed !== undefined ? Boolean(npc.placed) : true;
        const rawConditionId = npc.conditionVariableId ?? npc.conditionalVariableId ?? null;
        const rawConditionText = npc.conditionText ?? npc.conditionalText ?? '';
        const rawRewardId = npc.rewardVariableId ?? npc.activateVariableId ?? npc.onCompleteVariableId ?? null;
        const rawConditionalRewardId = npc.conditionalRewardVariableId ?? npc.alternativeRewardVariableId ?? null;
        const conditionVariableId = this.gameState.normalizeVariableId?.(rawConditionId) ?? null;
        const conditionText = typeof rawConditionText === 'string' ? rawConditionText : '';
        const rewardVariableId = this.gameState.normalizeVariableId?.(rawRewardId) ?? null;
        const conditionalRewardVariableId = this.gameState.normalizeVariableId?.(rawConditionalRewardId) ?? null;

        return {
            id,
            type: def?.type || npc.type || id,
            name,
            text,
            textKey,
            roomIndex,
            x,
            y,
            initialX,
            initialY,
            initialRoomIndex,
            placed,
            conditionVariableId,
            conditionText,
            rewardVariableId,
            conditionalRewardVariableId
        };
    }

    createFromDefinition(def) {
        const textKey = def?.defaultTextKey || null;
        return {
            id: sequentialIdForType(def.type) || this.generateId(),
            type: def.type,
            name: resolveDefinitionName(def),
            text: resolveDefinitionText(def),
            textKey,
            roomIndex: 0,
            x: 1,
            y: 1,
            placed: false,
            conditionVariableId: null,
            conditionText: '',
            rewardVariableId: null,
            conditionalRewardVariableId: null
        };
    }

    resetNPCs() {
        const npcs = this.getNPCs();
        for (const npc of npcs) {
            if (npc.initialX !== undefined) {
                npc.x = npc.initialX;
            }
            if (npc.initialY !== undefined) {
                npc.y = npc.initialY;
            }
            if (npc.initialRoomIndex !== undefined) npc.roomIndex = npc.initialRoomIndex;
        }
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
            name: resolveDefinitionName(def),
            text: data?.text ?? resolveDefinitionText(def),
            textKey: data?.text ? null : (def.defaultTextKey || null),
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
        npc.initialX = npc.x;
        npc.initialY = npc.y;
        if (roomIndex !== null && roomIndex !== undefined) {
            const maxRoomIndex = Math.max(0, (this.gameState?.game?.rooms?.length ?? 1) - 1);
            npc.roomIndex = clamp(Number(roomIndex), 0, maxRoomIndex, npc.roomIndex);
            npc.initialRoomIndex = npc.roomIndex;
        }
        npc.placed = true;
        return true;
    }

    updateNPCDialog(npcId, text) {
        if (typeof text === 'object' && text !== null) {
            this.updateNPC(npcId, text);
            return;
        }
        this.updateNPC(npcId, { text });
    }
}

export { NPCManager };
