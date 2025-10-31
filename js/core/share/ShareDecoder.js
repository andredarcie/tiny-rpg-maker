class ShareDecoder {
    static decodeShareCode(code) {
        if (!code) return null;
        const segments = code.split('.');
        const payload = {};
        for (const segment of segments) {
            if (!segment) continue;
            const key = segment[0];
            const value = segment.slice(1);
            payload[key] = value;
        }

        const version = payload.v ? parseInt(payload.v, 36) : NaN;
        if (!Number.isFinite(version) || !ShareConstants.SUPPORTED_VERSIONS.has(version)) {
            return null;
        }

        const roomCount = version >= ShareConstants.VERSION_3 ? ShareConstants.WORLD_ROOM_COUNT : 1;
        const groundMaps = ShareMatrixCodec.decodeWorldGround(payload.g || '', version, roomCount);
        const overlayMaps = ShareMatrixCodec.decodeWorldOverlay(payload.o || '', version, roomCount);
        const startPosition = SharePositionCodec.decodePositions(payload.s || '')?.[0] ?? ShareDataNormalizer.normalizeStart({});
        const npcPositions = SharePositionCodec.decodePositions(payload.p || '');
        const npcTexts = ShareTextCodec.decodeTextArray(payload.t || '');
        const npcTypeIndexes = SharePositionCodec.decodeNpcTypeIndexes(payload.i || '');
        const npcConditionalTexts = version >= ShareConstants.NPC_VARIABLE_TEXT_VERSION ? ShareTextCodec.decodeTextArray(payload.u || '') : [];
        const npcConditionIndexes = version >= ShareConstants.NPC_VARIABLE_TEXT_VERSION
            ? ShareVariableCodec.decodeVariableNibbleArray(payload.c || '', npcPositions.length)
            : [];
        const npcRewardIndexes = version >= ShareConstants.NPC_VARIABLE_TEXT_VERSION
            ? ShareVariableCodec.decodeVariableNibbleArray(payload.r || '', npcPositions.length)
            : [];
        const npcConditionalRewardIndexes = version >= ShareConstants.NPC_CONDITIONAL_REWARD_VERSION
            ? ShareVariableCodec.decodeVariableNibbleArray(payload.h || '', npcPositions.length)
            : [];
        const enemyPositions = SharePositionCodec.decodePositions(payload.e || '');
        const doorPositions = version >= ShareConstants.OBJECTS_VERSION ? SharePositionCodec.decodePositions(payload.d || '') : [];
        const keyPositions = version >= ShareConstants.OBJECTS_VERSION ? SharePositionCodec.decodePositions(payload.k || '') : [];
        const magicDoorPositions = version >= ShareConstants.MAGIC_DOOR_VERSION ? SharePositionCodec.decodePositions(payload.m || '') : [];
        const magicDoorVariableNibbles = version >= ShareConstants.MAGIC_DOOR_VERSION
            ? ShareVariableCodec.decodeVariableNibbleArray(payload.q || '', magicDoorPositions.length)
            : [];
        const variableStates = version >= ShareConstants.VARIABLES_VERSION ? ShareVariableCodec.decodeVariables(payload.b || '') : [];
        const title = ShareTextCodec.decodeText(payload.n, ShareConstants.DEFAULT_TITLE) || ShareConstants.DEFAULT_TITLE;
        const buildNpcId = (index) => `npc-${index + 1}`;

        const defs = ShareConstants.NPC_DEFINITIONS;
        const canUseDefinitions = defs.length > 0 && (npcTypeIndexes.length > 0 || npcPositions.length <= defs.length);
        const sprites = [];
        if (canUseDefinitions) {
            for (let index = 0; index < npcPositions.length; index++) {
                const typeIndex = npcTypeIndexes[index] ?? index;
                const def = defs[typeIndex];
                if (!def) continue;
                const pos = npcPositions[index];
                const conditionVariableId = ShareVariableCodec.nibbleToVariableId(npcConditionIndexes[index] ?? 0);
                const rewardVariableId = ShareVariableCodec.nibbleToVariableId(npcRewardIndexes[index] ?? 0);
                const conditionalRewardVariableId = ShareVariableCodec.nibbleToVariableId(npcConditionalRewardIndexes[index] ?? 0);
                sprites.push({
                    id: buildNpcId(index),
                    type: def.type,
                    name: def.name,
                    x: pos.x,
                    y: pos.y,
                    roomIndex: pos.roomIndex,
                    text: npcTexts[index] ?? (def.defaultText || ''),
                    placed: true,
                    conditionVariableId,
                    conditionText: npcConditionalTexts[index] ?? '',
                    rewardVariableId,
                    conditionalRewardVariableId
                });
            }
        } else {
            for (let index = 0; index < npcPositions.length; index++) {
                const pos = npcPositions[index];
                const conditionVariableId = ShareVariableCodec.nibbleToVariableId(npcConditionIndexes[index] ?? 0);
                const rewardVariableId = ShareVariableCodec.nibbleToVariableId(npcRewardIndexes[index] ?? 0);
                const conditionalRewardVariableId = ShareVariableCodec.nibbleToVariableId(npcConditionalRewardIndexes[index] ?? 0);
                sprites.push({
                    id: buildNpcId(index),
                    name: `NPC ${index + 1}`,
                    x: pos.x,
                    y: pos.y,
                    roomIndex: pos.roomIndex,
                    text: npcTexts[index] ?? '',
                    placed: true,
                    conditionVariableId,
                    conditionText: npcConditionalTexts[index] ?? '',
                    rewardVariableId,
                    conditionalRewardVariableId
                });
            }
        }

        const enemies = enemyPositions.map((pos, index) => ({
            id: `enemy-${index + 1}`,
            type: 'skull',
            x: pos.x,
            y: pos.y,
            roomIndex: pos.roomIndex
        }));

        const rooms = Array.from({ length: roomCount }, () => ({ bg: 0 }));
        const maps = [];
        for (let index = 0; index < roomCount; index++) {
            const ground = groundMaps[index] ?? ShareMatrixCodec.normalizeGround([]);
            const overlay = overlayMaps[index] ?? ShareMatrixCodec.normalizeOverlay([]);
            maps.push({ ground, overlay });
        }

        const objects = [
            ...ShareDataNormalizer.buildObjectEntries(doorPositions, 'door'),
            ...ShareDataNormalizer.buildObjectEntries(keyPositions, 'key'),
            ...ShareDataNormalizer.buildObjectEntries(magicDoorPositions, 'door-variable', { variableNibbles: magicDoorVariableNibbles })
        ];

        return {
            title,
            start: startPosition,
            sprites,
            enemies,
            world: version >= ShareConstants.VERSION_3
                ? { rows: ShareConstants.WORLD_ROWS, cols: ShareConstants.WORLD_COLS }
                : { rows: 1, cols: 1 },
            rooms,
            objects,
            variables: ShareVariableCodec.buildVariableEntries(variableStates),
            tileset: {
                tiles: [],
                maps,
                map: maps[0] || { ground: ShareMatrixCodec.normalizeGround([]), overlay: ShareMatrixCodec.normalizeOverlay([]) }
            }
        };
    }
}

if (typeof window !== 'undefined') {
    window.ShareDecoder = ShareDecoder;
}

