class ShareDataNormalizer {
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
            .filter((enemy) => Number.isFinite(enemy.x) && Number.isFinite(enemy.y));
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
            if (entry?.type !== 'door-variable') continue;
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
            if (entry?.type !== 'switch') continue;
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
            if (type === 'key') {
                entry.collected = false;
            }
            if (type === 'life-potion') {
                entry.collected = false;
            }
            if (type === 'xp-scroll') {
                entry.collected = false;
            }
            if (type === 'door') {
                entry.opened = false;
            }
            if (type === 'door-variable') {
                const nibble = variableNibbles[index] ?? ShareVariableCodec.variableIdToNibble(fallbackVariableId);
                const variableId = ShareVariableCodec.nibbleToVariableId(nibble) || fallbackVariableId;
                if (variableId) {
                    entry.variableId = variableId;
                }
            }
            if (type === 'switch') {
                const nibble = variableNibbles[index] ?? ShareVariableCodec.variableIdToNibble(fallbackVariableId);
                const variableId = ShareVariableCodec.nibbleToVariableId(nibble) || fallbackVariableId;
                if (variableId) {
                    entry.variableId = variableId;
                }
                const state = Array.isArray(options.stateBits) ? options.stateBits[index] : null;
                entry.on = Boolean(state);
            }
            return entry;
        });
    }

    static normalizeEnemyType(type) {
        if (typeof EnemyDefinitions?.normalizeType === 'function') {
            return EnemyDefinitions.normalizeType(type);
        }
        if (typeof type === 'string' && type) {
            return type;
        }
        return 'giant-rat';
    }

    static normalizeEnemyVariable(variableId) {
        if (typeof variableId !== 'string') return null;
        return ShareConstants.VARIABLE_IDS.includes(variableId) ? variableId : null;
    }
}

if (typeof window !== 'undefined') {
    window.ShareDataNormalizer = ShareDataNormalizer;
}
