
import { EnemyDefinitions } from '../EnemyDefinitions';
import { OBJECT_TYPES } from '../ObjectDefinitions';
import { StateObjectManager } from '../state/StateObjectManager';
import { ShareConstants } from './ShareConstants';
import { ShareMath } from './ShareMath';
import { ShareVariableCodec } from './ShareVariableCodec';
class ShareDataNormalizer {
    static get Types() {
        return OBJECT_TYPES;
    }
    static normalizeStart(start) {
        return {
            x: ShareMath.clamp(Number(start?.x), 0, ShareConstants.MATRIX_SIZE - 1, 1),
            y: ShareMath.clamp(Number(start?.y), 0, ShareConstants.MATRIX_SIZE - 1, 1),
            roomIndex: ShareMath.clampRoomIndex(start?.roomIndex)
        };
    }

    static resolveNpcType(npc) {
        if (typeof npc?.type === 'string') {
            return npc.type;
        }
        if (typeof npc?.id === 'string') {
            const matchById = ShareConstants.NPC_DEFINITIONS.find((def) => def.id === npc.id);
            if (matchById) return matchById.type;
        }
        if (typeof npc?.name === 'string') {
            const matchByName = ShareConstants.NPC_DEFINITIONS.find((def) => def.name === npc.name);
            if (matchByName) return matchByName.type;
        }
        return null;
    }

    static normalizeSprites(list) {
        if (!Array.isArray(list)) return [];
        const seen = new Set();
        const normalized = [];
        const defs = ShareConstants.NPC_DEFINITIONS;
        for (const npc of list) {
            const type = ShareDataNormalizer.resolveNpcType(npc);
            if (!type) continue;
            if (seen.has(type)) continue;
            const def = defs.find((entry) => entry.type === type);
            if (!def) continue;
            const placed = npc?.placed !== false;
            if (!placed) continue;
            const x = ShareMath.clamp(Number(npc?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const y = ShareMath.clamp(Number(npc?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            const conditionId = typeof npc?.conditionVariableId === 'string'
                ? npc.conditionVariableId
                : (typeof npc?.conditionalVariableId === 'string' ? npc.conditionalVariableId : null);
            const rewardId = typeof npc?.rewardVariableId === 'string'
                ? npc.rewardVariableId
                : (typeof npc?.activateVariableId === 'string' ? npc.activateVariableId : null);
            const conditionalRewardId = typeof npc?.conditionalRewardVariableId === 'string'
                ? npc.conditionalRewardVariableId
                : (typeof npc?.alternativeRewardVariableId === 'string' ? npc.alternativeRewardVariableId : null);
            normalized.push({
                type,
                id: def.id,
                name: def.name,
                x,
                y,
                roomIndex: ShareMath.clampRoomIndex(npc?.roomIndex),
                text: typeof npc?.text === 'string' ? npc.text : (def.defaultText || ''),
                textKey: typeof npc?.textKey === 'string' && npc.textKey.length
                    ? npc.textKey
                    : (def.defaultTextKey || null),
                conditionVariableId: ShareConstants.VARIABLE_IDS.includes(conditionId) ? conditionId : null,
                conditionText: typeof npc?.conditionText === 'string'
                    ? npc.conditionText
                    : (typeof npc?.conditionalText === 'string' ? npc.conditionalText : ''),
                rewardVariableId: ShareConstants.VARIABLE_IDS.includes(rewardId) ? rewardId : null,
                conditionalRewardVariableId: ShareConstants.VARIABLE_IDS.includes(conditionalRewardId) ? conditionalRewardId : null
            });
            seen.add(type);
        }
        return normalized;
    }

    static normalizeEnemies(list) {
        if (!Array.isArray(list)) return [];
        const defs = ShareConstants.ENEMY_DEFINITIONS;
        const perRoomCounts = new Map();

        return list
            .map((enemy, index) => {
                const type = ShareDataNormalizer.normalizeEnemyType(enemy?.type);
                const typeIndex = Array.isArray(defs) && defs.length
                    ? defs.findIndex((def) => def.type === type)
                    : -1;
                const defeatVariableId = ShareDataNormalizer.normalizeEnemyVariable(enemy?.defeatVariableId);
                return {
                    x: ShareMath.clamp(Number(enemy?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0),
                    y: ShareMath.clamp(Number(enemy?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0),
                    roomIndex: ShareMath.clampRoomIndex(enemy?.roomIndex),
                    type,
                    id: enemy?.id || `enemy-${index + 1}`,
                    typeIndex,
                    defeatVariableId,
                    variableNibble: ShareVariableCodec.variableIdToNibble(defeatVariableId)
                };
            })
            .filter((enemy) => {
                if (!Number.isFinite(enemy.x) || !Number.isFinite(enemy.y)) return false;
                const count = perRoomCounts.get(enemy.roomIndex) || 0;
                if (count >= 9) return false;
                perRoomCounts.set(enemy.roomIndex, count + 1);
                return true;
            });
    }

    static normalizeObjectPositions(list, type) {
        if (!Array.isArray(list)) return [];
        const seenRooms = new Set();
        const result = [];
        for (const entry of list) {
            if (entry?.type !== type) continue;
            const x = ShareMath.clamp(Number(entry?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const y = ShareMath.clamp(Number(entry?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            const roomIndex = ShareMath.clampRoomIndex(entry?.roomIndex);
            const key = roomIndex;
            if (seenRooms.has(key)) continue;
            seenRooms.add(key);
            result.push({ x, y, roomIndex });
        }
        return result.sort((a, b) => {
            if (a.roomIndex !== b.roomIndex) return a.roomIndex - b.roomIndex;
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
        });
    }

    static normalizeVariableDoorObjects(list) {
        if (!Array.isArray(list)) return [];
        const seenRooms = new Set();
        const fallbackNibble = ShareVariableCodec.variableIdToNibble(ShareVariableCodec.getFirstVariableId()) || 1;
        const result = [];
        for (const entry of list) {
            if (entry?.type !== ShareDataNormalizer.Types.DOOR_VARIABLE) continue;
            const x = ShareMath.clamp(Number(entry?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const y = ShareMath.clamp(Number(entry?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            const roomIndex = ShareMath.clampRoomIndex(entry?.roomIndex);
            if (seenRooms.has(roomIndex)) continue;
            seenRooms.add(roomIndex);
            const variableNibble = ShareVariableCodec.variableIdToNibble(typeof entry?.variableId === 'string' ? entry.variableId : null) || fallbackNibble;
            result.push({ x, y, roomIndex, variableNibble });
        }
        return result.sort((a, b) => {
            if (a.roomIndex !== b.roomIndex) return a.roomIndex - b.roomIndex;
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
        });
    }

    static normalizeSwitchObjects(list) {
        if (!Array.isArray(list)) return [];
        const seenRooms = new Set();
        const fallbackNibble = ShareVariableCodec.variableIdToNibble(ShareVariableCodec.getFirstVariableId()) || 1;
        const result = [];
        for (const entry of list) {
            if (entry?.type !== ShareDataNormalizer.Types.SWITCH) continue;
            const x = ShareMath.clamp(Number(entry?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const y = ShareMath.clamp(Number(entry?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            const roomIndex = ShareMath.clampRoomIndex(entry?.roomIndex);
            if (seenRooms.has(roomIndex)) continue;
            seenRooms.add(roomIndex);
            const variableNibble = ShareVariableCodec.variableIdToNibble(typeof entry?.variableId === 'string' ? entry.variableId : null) || fallbackNibble;
            const stateNibble = entry?.on ? 1 : 0;
            result.push({ x, y, roomIndex, variableNibble, stateNibble });
        }
        return result.sort((a, b) => {
            if (a.roomIndex !== b.roomIndex) return a.roomIndex - b.roomIndex;
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
        });
    }

    static buildObjectEntries(positions, type, options = {}) {
        if (!Array.isArray(positions) || !positions.length) return [];
        const variableNibbles = Array.isArray(options.variableNibbles) ? options.variableNibbles : [];
        const endingTexts = Array.isArray(options.endingTexts) ? options.endingTexts : [];
        const fallbackVariableId = ShareVariableCodec.getFirstVariableId();
        return positions.map((pos, index) => {
            const roomIndex = ShareMath.clampRoomIndex(pos?.roomIndex);
            const x = ShareMath.clamp(Number(pos?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const y = ShareMath.clamp(Number(pos?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const entry = {
                id: `${type}-${roomIndex}`,
                type,
                roomIndex,
                x,
                y
            };
            if (type === ShareDataNormalizer.Types.KEY) {
                entry.collected = false;
            }
            if (type === ShareDataNormalizer.Types.LIFE_POTION) {
                entry.collected = false;
            }
            if (type === ShareDataNormalizer.Types.XP_SCROLL) {
                entry.collected = false;
            }
            if (type === ShareDataNormalizer.Types.SWORD || type === ShareDataNormalizer.Types.SWORD_BRONZE || type === ShareDataNormalizer.Types.SWORD_WOOD) {
                entry.collected = false;
            }
            if (type === ShareDataNormalizer.Types.DOOR) {
                entry.opened = false;
            }
            if (type === ShareDataNormalizer.Types.DOOR_VARIABLE) {
                const nibble = variableNibbles[index] ?? ShareVariableCodec.variableIdToNibble(fallbackVariableId);
                const variableId = ShareVariableCodec.nibbleToVariableId(nibble) || fallbackVariableId;
                if (variableId) {
                    entry.variableId = variableId;
                }
            }
            if (type === ShareDataNormalizer.Types.SWITCH) {
                const nibble = variableNibbles[index] ?? ShareVariableCodec.variableIdToNibble(fallbackVariableId);
                const variableId = ShareVariableCodec.nibbleToVariableId(nibble) || fallbackVariableId;
                if (variableId) {
                    entry.variableId = variableId;
                }
                const state = Array.isArray(options.stateBits) ? options.stateBits[index] : null;
                entry.on = Boolean(state);
            }
            if (type === ShareDataNormalizer.Types.PLAYER_END) {
                const endingText = ShareDataNormalizer.normalizeEndingTextValue(endingTexts[index] ?? '');
                if (endingText) {
                    entry.endingText = endingText;
                }
            }
            return entry;
        });
    }

    static getPlayerEndTextLimit() {
        if (typeof StateObjectManager.PLAYER_END_TEXT_LIMIT === 'number') {
            return StateObjectManager.PLAYER_END_TEXT_LIMIT;
        }
        return 40;
    }

    static normalizeEndingTextValue(value) {
        if (typeof value !== 'string') return '';
        const normalized = value.replace(/\r\n/g, '\n');
        const max = ShareDataNormalizer.getPlayerEndTextLimit();
        return normalized.slice(0, max).trim();
    }

    static collectPlayerEndTexts(objects) {
        if (!Array.isArray(objects)) return [];
        const entries = [];
        const seenRooms = new Set();
        for (const object of objects) {
            if (object?.type !== ShareDataNormalizer.Types.PLAYER_END) continue;
            const roomIndex = ShareMath.clampRoomIndex(object?.roomIndex);
            if (seenRooms.has(roomIndex)) continue;
            seenRooms.add(roomIndex);
            const x = ShareMath.clamp(Number(object?.x), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            const y = ShareMath.clamp(Number(object?.y), 0, ShareConstants.MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            entries.push({
                roomIndex,
                x,
                y,
                text: ShareDataNormalizer.normalizeEndingTextValue(object?.endingText ?? '')
            });
        }
        entries.sort((a, b) => {
            if (a.roomIndex !== b.roomIndex) return a.roomIndex - b.roomIndex;
            if (a.y !== b.y) return a.y - b.y;
            return a.x - b.x;
        });
        return entries.map((entry) => entry.text);
    }

    static normalizeEnemyType(type) {
        return EnemyDefinitions.normalizeType(type);
    }

    static normalizeEnemyVariable(variableId) {
        if (typeof variableId !== 'string') return null;
        return ShareConstants.VARIABLE_IDS.includes(variableId) ? variableId : null;
    }
}

export { ShareDataNormalizer };
