/**
 * ShareUtils serializes a minimal game definition into a compact URL and restores it.
 */
(function (global) {
    'use strict';

    const definitionsSource = (typeof module !== 'undefined' && module.exports)
        ? require('./NPCDefinitions')
        : (global.NPCDefinitions || {});

    const NPC_DEFINITIONS = definitionsSource.NPC_DEFINITIONS || [];

    const VERSION_1 = 1;
    const VERSION_2 = 2;
    const VERSION_3 = 3;
    const VERSION_4 = 4;
    const VERSION_5 = 5;
    const VERSION = 6;
    const LEGACY_VERSION = VERSION_1;
    const OBJECTS_VERSION = VERSION_4;
    const VARIABLES_VERSION = VERSION_5;
    const MATRIX_SIZE = 8;
    const TILE_COUNT = MATRIX_SIZE * MATRIX_SIZE;
    const WORLD_ROWS = 3;
    const WORLD_COLS = 3;
    const WORLD_ROOM_COUNT = WORLD_ROWS * WORLD_COLS;
    const MAX_ROOM_INDEX = WORLD_ROOM_COUNT - 1;
    const NULL_CHAR = 'z';
    const GROUND_SPARSE_PREFIX = 'x'; // Marks sparse ground encoding to avoid legacy clashes.
    const OVERLAY_BINARY_PREFIX = 'y'; // Marks new overlay bitmask encoding to avoid legacy clashes.
    const POSITION_WIDE_PREFIX = '~'; // Marks extended position encoding that supports more rooms.
    const DEFAULT_TITLE = 'My Tiny RPG Game';
    const DEFAULT_PALETTE = [
        '#000000', '#1D2B53', '#7E2553', '#008751',
        '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
        '#FF004D', '#FFA300', '#FFFF27', '#00E756',
        '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
    ];
    const VARIABLE_IDS = ['var-1', 'var-2', 'var-3', 'var-4', 'var-5', 'var-6'];
    const VARIABLE_NAMES = ['1 - Preto', '2 - Azul Escuro', '3 - Roxo', '4 - Verde', '5 - Marrom', '6 - Cinza'];
    const VARIABLE_COLORS = ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F'];
    const SUPPORTED_VERSIONS = new Set([VERSION_1, VERSION_2, VERSION_3, VERSION_4, VERSION_5, VERSION]);

    function clamp(value, min, max, fallback) {
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, value));
    }

    function clampRoomIndex(value) {
        return clamp(Number(value), 0, MAX_ROOM_INDEX, 0);
    }

    function normalizeGround(matrix) {
        const rows = [];
        for (let y = 0; y < MATRIX_SIZE; y++) {
            const row = [];
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const value = Number.isFinite(matrix?.[y]?.[x]) ? matrix[y][x] : 0;
                row.push(clamp(value, 0, 15, 0));
            }
            rows.push(row);
        }
        return rows;
    }

    function normalizeOverlay(matrix) {
        const rows = [];
        for (let y = 0; y < MATRIX_SIZE; y++) {
            const row = [];
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const raw = matrix?.[y]?.[x];
                if (raw === null || raw === undefined) {
                    row.push(null);
                } else {
                    row.push(clamp(Number(raw), 0, 15, 0));
                }
            }
            rows.push(row);
        }
        return rows;
    }

    function collectGroundMatrices(gameData, roomCount) {
        const maps = Array.isArray(gameData?.tileset?.maps) ? gameData.tileset.maps : [];
        const fallbackGround = gameData?.tileset?.map?.ground ?? null;
        const matrices = [];
        for (let index = 0; index < roomCount; index++) {
            const source = maps[index]?.ground ?? (index === 0 ? fallbackGround : null);
            matrices.push(source ?? []);
        }
        return matrices;
    }

    function collectOverlayMatrices(gameData, roomCount) {
        const maps = Array.isArray(gameData?.tileset?.maps) ? gameData.tileset.maps : [];
        const fallbackOverlay = gameData?.tileset?.map?.overlay ?? null;
        const matrices = [];
        for (let index = 0; index < roomCount; index++) {
            const source = maps[index]?.overlay ?? (index === 0 ? fallbackOverlay : null);
            matrices.push(source ?? []);
        }
        return matrices;
    }

    function normalizeStart(start) {
        return {
            x: clamp(Number(start?.x), 0, MATRIX_SIZE - 1, 1),
            y: clamp(Number(start?.y), 0, MATRIX_SIZE - 1, 1),
            roomIndex: clampRoomIndex(start?.roomIndex)
        };
    }

    function resolveNpcType(npc) {
        if (typeof npc?.type === 'string') {
            return npc.type;
        }
        if (typeof npc?.id === 'string') {
            const matchById = NPC_DEFINITIONS.find((def) => def.id === npc.id);
            if (matchById) return matchById.type;
        }
        if (typeof npc?.name === 'string') {
            const matchByName = NPC_DEFINITIONS.find((def) => def.name === npc.name);
            if (matchByName) return matchByName.type;
        }
        return null;
    }

    function normalizeSprites(list) {
        if (!Array.isArray(list)) return [];
        const seen = new Set();
        const normalized = [];
        for (const npc of list) {
            const type = resolveNpcType(npc);
            if (!type) continue;
            if (seen.has(type)) continue;
            const def = NPC_DEFINITIONS.find((entry) => entry.type === type);
            if (!def) continue;
            const placed = npc?.placed !== false;
            if (!placed) continue;
            const x = clamp(Number(npc?.x), 0, MATRIX_SIZE - 1, 0);
            const y = clamp(Number(npc?.y), 0, MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            const conditionId = typeof npc?.conditionVariableId === 'string'
                ? npc.conditionVariableId
                : (typeof npc?.conditionalVariableId === 'string' ? npc.conditionalVariableId : null);
            const rewardId = typeof npc?.rewardVariableId === 'string'
                ? npc.rewardVariableId
                : (typeof npc?.activateVariableId === 'string' ? npc.activateVariableId : null);
            normalized.push({
                type,
                id: def.id,
                name: def.name,
                x,
                y,
                roomIndex: clampRoomIndex(npc?.roomIndex),
                text: typeof npc?.text === 'string' ? npc.text : (def.defaultText || ''),
                conditionVariableId: VARIABLE_IDS.includes(conditionId) ? conditionId : null,
                conditionText: typeof npc?.conditionText === 'string'
                    ? npc.conditionText
                    : (typeof npc?.conditionalText === 'string' ? npc.conditionalText : ''),
                rewardVariableId: VARIABLE_IDS.includes(rewardId) ? rewardId : null
            });
            seen.add(type);
        }
        return normalized;
    }

    function normalizeEnemies(list) {
        if (!Array.isArray(list)) return [];
        return list
            .map((enemy, index) => ({
                x: clamp(Number(enemy?.x), 0, MATRIX_SIZE - 1, 0),
                y: clamp(Number(enemy?.y), 0, MATRIX_SIZE - 1, 0),
                roomIndex: clampRoomIndex(enemy?.roomIndex),
                type: enemy?.type || 'skull',
                id: enemy?.id || `enemy-${index + 1}`
            }))
            .filter((enemy) => Number.isFinite(enemy.x) && Number.isFinite(enemy.y));
    }

    function normalizeObjectPositions(list, type) {
        if (!Array.isArray(list)) return [];
        if (!Array.isArray(list)) return [];
        const seenRooms = new Set();
        const result = [];
        for (const entry of list) {
            if (entry?.type !== type) continue;
            const x = clamp(Number(entry?.x), 0, MATRIX_SIZE - 1, 0);
            const y = clamp(Number(entry?.y), 0, MATRIX_SIZE - 1, 0);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            const roomIndex = clampRoomIndex(entry?.roomIndex);
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

    function buildObjectEntries(positions, type) {
        if (!Array.isArray(positions) || !positions.length) return [];
        return positions.map((pos) => {
            const roomIndex = clampRoomIndex(pos?.roomIndex);
            const x = clamp(Number(pos?.x), 0, MATRIX_SIZE - 1, 0);
            const y = clamp(Number(pos?.y), 0, MATRIX_SIZE - 1, 0);
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
            if (type === 'door') {
                entry.opened = false;
            }
            return entry;
        });
    }

    function encodeVariables(variables) {
        if (!Array.isArray(variables) || !variables.length) return '';
        const lookup = new Map();
        for (const entry of variables) {
            if (typeof entry?.id !== 'string') continue;
            lookup.set(entry.id, Boolean(entry.value));
        }
        let mask = 0;
        for (let i = 0; i < VARIABLE_IDS.length; i++) {
            const id = VARIABLE_IDS[i];
            if (lookup.get(id)) {
                mask |= (1 << i);
            }
        }
        if (mask === 0) return '';
        return toBase64Url(Uint8Array.from([mask]));
    }

    function decodeVariables(text) {
        const states = new Array(VARIABLE_IDS.length).fill(false);
        if (!text) return states;
        const bytes = fromBase64Url(text);
        const mask = bytes[0] ?? 0;
        for (let i = 0; i < VARIABLE_IDS.length; i++) {
            states[i] = Boolean(mask & (1 << i));
        }
        return states;
    }

    function variableIdToNibble(variableId) {
        if (typeof variableId !== 'string') return 0;
        const index = VARIABLE_IDS.indexOf(variableId);
        return index >= 0 ? (index + 1) : 0;
    }

    function nibbleToVariableId(value) {
        if (!Number.isFinite(value) || value <= 0) return null;
        const index = value - 1;
        return VARIABLE_IDS[index] || null;
    }

    function encodeVariableNibbleArray(values) {
        if (!Array.isArray(values) || !values.length) return '';
        const hasData = values.some((entry) => Number.isFinite(entry) && entry > 0);
        if (!hasData) return '';
        return toBase64Url(packNibbles(values.map((entry) => Number(entry) & 0x0f)));
    }

    function decodeVariableNibbleArray(text, expectedCount) {
        const safeCount = Number.isFinite(expectedCount) && expectedCount > 0 ? expectedCount : 0;
        if (!text || !safeCount) return new Array(safeCount).fill(0);
        const bytes = fromBase64Url(text);
        const values = unpackNibbles(bytes, safeCount);
        return values.map((value) => (Number.isFinite(value) ? value : 0));
    }

    function buildVariableEntries(states) {
        const normalized = Array.isArray(states) && states.length === VARIABLE_IDS.length
            ? states
            : new Array(VARIABLE_IDS.length).fill(false);
        return VARIABLE_IDS.map((id, index) => ({
            id,
            order: index + 1,
            name: VARIABLE_NAMES[index] || id,
            color: VARIABLE_COLORS[index] || '#000000',
            value: Boolean(normalized[index])
        }));
    }

    function packNibbles(values) {
        const byteLength = Math.ceil(values.length / 2);
        const bytes = new Uint8Array(byteLength);
        for (let i = 0; i < values.length; i += 2) {
            const high = values[i] & 0x0f;
            const low = values[i + 1] !== undefined ? (values[i + 1] & 0x0f) : 0;
            const index = i >> 1;
            bytes[index] = (high << 4) | low;
        }
        return bytes;
    }

    function unpackNibbles(bytes, expectedCount) {
        const values = new Array(expectedCount);
        for (let i = 0; i < expectedCount; i++) {
            const byte = bytes[i >> 1] || 0;
            values[i] = (i % 2 === 0) ? ((byte >> 4) & 0x0f) : (byte & 0x0f);
        }
        return values;
    }

    function countSetBits(bytes) {
        let total = 0;
        for (let i = 0; i < bytes.length; i++) {
            let value = bytes[i] || 0;
            while (value) {
                value &= value - 1;
                total++;
            }
        }
        return total;
    }

    const tileMaskLengthCache = new Map();
    function getTileMaskBase64Length(tileCount) {
        if (!tileMaskLengthCache.has(tileCount)) {
            const maskBytes = new Uint8Array(Math.ceil(tileCount / 8));
            tileMaskLengthCache.set(tileCount, toBase64Url(maskBytes).length);
        }
        return tileMaskLengthCache.get(tileCount);
    }

    function encodeGround(matrix) {
        const normalized = normalizeGround(matrix);
        const values = [];
        const nonZeroValues = [];
        const maskBytes = new Uint8Array(Math.ceil(TILE_COUNT / 8));
        let hasNonZero = false;
        let bitIndex = 0;
        for (let y = 0; y < MATRIX_SIZE; y++) {
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const value = normalized[y][x] & 0x0f;
                if (!hasNonZero && value !== 0) {
                    hasNonZero = true;
                }
                if (value !== 0) {
                    const byteIndex = bitIndex >> 3;
                    const bitPosition = bitIndex & 0x07;
                    maskBytes[byteIndex] |= (1 << bitPosition);
                    nonZeroValues.push(value);
                }
                values.push(value);
                bitIndex++;
            }
        }
        if (!hasNonZero) {
            return '';
        }
        const dense = toBase64Url(packNibbles(values));
        if (!nonZeroValues.length) {
            return dense;
        }
        const encodedMask = toBase64Url(maskBytes);
        const encodedValues = toBase64Url(packNibbles(nonZeroValues));
        const sparseLength = 1 + encodedMask.length + encodedValues.length;
        if (sparseLength < dense.length) {
            return `${GROUND_SPARSE_PREFIX}${encodedMask}${encodedValues}`;
        }
        return dense;
    }

    function decodeGround(text, version) {
        const useLegacy = version === LEGACY_VERSION ||
            (text?.length === TILE_COUNT && /^[0-9a-f]+$/i.test(text));
        const grid = [];
        if (useLegacy) {
            let index = 0;
            for (let y = 0; y < MATRIX_SIZE; y++) {
                const row = [];
                for (let x = 0; x < MATRIX_SIZE; x++) {
                    const char = text?.[index++] ?? '0';
                    const value = parseInt(char, 16);
                    row.push(Number.isFinite(value) ? clamp(value, 0, 15, 0) : 0);
                }
                grid.push(row);
            }
            return grid;
        }

        const useSparseEncoding = text?.[0] === GROUND_SPARSE_PREFIX && version !== LEGACY_VERSION;
        if (useSparseEncoding) {
            const maskLength = getTileMaskBase64Length(TILE_COUNT);
            const maskSlice = text.slice(1, 1 + maskLength);
            const valuesSlice = text.slice(1 + maskLength);
            const maskBytes = fromBase64Url(maskSlice);
            const nonZeroCount = countSetBits(maskBytes);
            const valueBytes = valuesSlice ? fromBase64Url(valuesSlice) : new Uint8Array(0);
            const values = unpackNibbles(valueBytes, nonZeroCount);
            let valueIndex = 0;
            let bitIndex = 0;
            for (let y = 0; y < MATRIX_SIZE; y++) {
                const row = [];
                for (let x = 0; x < MATRIX_SIZE; x++) {
                    const byteIndex = bitIndex >> 3;
                    const bitPosition = bitIndex & 0x07;
                    const hasValue = (maskBytes[byteIndex] & (1 << bitPosition)) !== 0;
                    const tile = hasValue ? (values[valueIndex++] ?? 0) : 0;
                    row.push(clamp(tile, 0, 15, 0));
                    bitIndex++;
                }
                grid.push(row);
            }
            return grid;
        }

        const bytes = fromBase64Url(text);
        const values = unpackNibbles(bytes, TILE_COUNT);
        let valueIndex = 0;
        for (let y = 0; y < MATRIX_SIZE; y++) {
            const row = [];
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const value = values[valueIndex++] ?? 0;
                row.push(clamp(value, 0, 15, 0));
            }
            grid.push(row);
        }
        return grid;
    }

    function encodeOverlay(matrix) {
        const normalized = normalizeOverlay(matrix);
        const maskBytes = new Uint8Array(Math.ceil(TILE_COUNT / 8));
        const values = [];
        let hasData = false;
        let bitIndex = 0;

        for (let y = 0; y < MATRIX_SIZE; y++) {
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const value = normalized[y][x];
                const currentIndex = bitIndex++;
                if (value === null || value === undefined) {
                    continue;
                }
                hasData = true;
                const byteIndex = currentIndex >> 3;
                const bitPosition = currentIndex & 0x07;
                maskBytes[byteIndex] |= (1 << bitPosition);
                values.push(value & 0x0f);
            }
        }

        if (!hasData) {
            return { text: '', hasData: false };
        }

        const encodedMask = toBase64Url(maskBytes);
        const encodedValues = values.length ? toBase64Url(packNibbles(values)) : '';
        return {
            text: `${OVERLAY_BINARY_PREFIX}${encodedMask}${encodedValues}`,
            hasData: true
        };
    }

    function decodeOverlay(text, version) {
        const useBinaryEncoding = text?.[0] === OVERLAY_BINARY_PREFIX && version !== LEGACY_VERSION;
        const grid = [];

        if (useBinaryEncoding) {
            const maskLength = getTileMaskBase64Length(TILE_COUNT);
            const maskSlice = text.slice(1, 1 + maskLength);
            const valuesSlice = text.slice(1 + maskLength);
            const maskBytes = fromBase64Url(maskSlice);
            const nonNullCount = countSetBits(maskBytes);
            const valueBytes = valuesSlice ? fromBase64Url(valuesSlice) : new Uint8Array(0);
            const values = unpackNibbles(valueBytes, nonNullCount);
            let bitIndex = 0;
            let valueIndex = 0;

            for (let y = 0; y < MATRIX_SIZE; y++) {
                const row = [];
                for (let x = 0; x < MATRIX_SIZE; x++) {
                    const byteIndex = bitIndex >> 3;
                    const bitPosition = bitIndex & 0x07;
                    const hasTile = (maskBytes[byteIndex] & (1 << bitPosition)) !== 0;
                    if (hasTile) {
                        const value = values[valueIndex++] ?? 0;
                        row.push(clamp(value, 0, 15, 0));
                    } else {
                        row.push(null);
                    }
                    bitIndex++;
                }
                grid.push(row);
            }
            return grid;
        }

        let index = 0;
        for (let y = 0; y < MATRIX_SIZE; y++) {
            const row = [];
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const char = text?.[index++] ?? NULL_CHAR;
                if (char === NULL_CHAR) {
                    row.push(null);
                } else {
                    const value = parseInt(char, 16);
                    row.push(Number.isFinite(value) ? clamp(value, 0, 15, 0) : null);
                }
            }
            grid.push(row);
        }
        return grid;
    }

    function decodeWorldGround(text, version, roomCount) {
        if (version >= VERSION) {
            const segments = text ? text.split(',') : [];
            const matrices = [];
            for (let index = 0; index < roomCount; index++) {
                const segment = segments[index] ?? '';
                matrices.push(decodeGround(segment, version));
            }
            return matrices;
        }
        return [decodeGround(text, version)];
    }

    function decodeWorldOverlay(text, version, roomCount) {
        if (version >= VERSION) {
            const segments = text ? text.split(',') : [];
            const matrices = [];
            for (let index = 0; index < roomCount; index++) {
                const segment = segments[index] ?? '';
                matrices.push(decodeOverlay(segment, version));
            }
            return matrices;
        }
        return [decodeOverlay(text || '', version)];
    }

    function positionToByte(entry) {
        const room = clampRoomIndex(entry?.roomIndex) & 0x0f;
        const y = clamp(Number(entry?.y), 0, MATRIX_SIZE - 1, 0) & 0x07;
        const x = clamp(Number(entry?.x), 0, MATRIX_SIZE - 1, 0) & 0x07;
        return ((room & 0x03) << 6) | (y << 3) | x;
    }

    function byteToPosition(byte) {
        return {
            x: byte & 0x07,
            y: (byte >> 3) & 0x07,
            roomIndex: clampRoomIndex((byte >> 6) & 0x03)
        };
    }

    function encodePositions(entries) {
        if (!entries.length) return '';
        const maxRoomIndex = entries.reduce((max, entry) => Math.max(max, clampRoomIndex(entry?.roomIndex)), 0);
        const useWide = maxRoomIndex > 3;
        if (useWide) {
            const bytes = new Uint8Array(entries.length * 2);
            for (let i = 0; i < entries.length; i++) {
                const room = clampRoomIndex(entries[i]?.roomIndex) & 0x0f;
                const y = clamp(Number(entries[i]?.y), 0, MATRIX_SIZE - 1, 0) & 0x07;
                const x = clamp(Number(entries[i]?.x), 0, MATRIX_SIZE - 1, 0) & 0x07;
                const offset = i * 2;
                bytes[offset] = ((room & 0x03) << 6) | (y << 3) | x;
                bytes[offset + 1] = (room >> 2) & 0x0f;
            }
            return POSITION_WIDE_PREFIX + toBase64Url(bytes);
        }

        const bytes = new Uint8Array(entries.length);
        for (let i = 0; i < entries.length; i++) {
            bytes[i] = positionToByte(entries[i]);
        }
        return toBase64Url(bytes);
    }

    function encodeNpcTypeIndexes(sprites) {
        if (!sprites.length) return '';
        const bytes = new Uint8Array(sprites.length);
        let hasNonSequential = false;
        for (let i = 0; i < sprites.length; i++) {
            const sprite = sprites[i];
            const index = NPC_DEFINITIONS.findIndex((def) => def.type === sprite.type);
            bytes[i] = index >= 0 ? index : 255;
            if (!hasNonSequential && bytes[i] !== i) {
                hasNonSequential = true;
            }
        }
        if (!hasNonSequential) return '';
        return toBase64Url(bytes);
    }

    function decodePositions(text) {
        if (!text) return [];
        if (text[0] === POSITION_WIDE_PREFIX) {
            const bytes = fromBase64Url(text.slice(1));
            const positions = [];
            for (let i = 0; i < bytes.length; i += 2) {
                const low = bytes[i] ?? 0;
                const high = bytes[i + 1] ?? 0;
                const x = low & 0x07;
                const y = (low >> 3) & 0x07;
                const roomLower = (low >> 6) & 0x03;
                const roomUpper = high & 0x0f;
                const roomIndex = clampRoomIndex((roomUpper << 2) | roomLower);
                positions.push({ x, y, roomIndex });
            }
            return positions;
        }
        const bytes = fromBase64Url(text);
        return Array.from(bytes, (byte) => byteToPosition(byte));
    }

    function decodeNpcTypeIndexes(text) {
        if (!text) return [];
        return Array.from(fromBase64Url(text), (byte) => byte);
    }

    function encodeText(value) {
        if (!value) return '';
        return toBase64Url(encodeUtf8(value));
    }

    function decodeText(text, fallback = '') {
        if (!text) return fallback;
        try {
            return decodeUtf8(fromBase64Url(text));
        } catch (error) {
            console.warn('Failed to decode text payload', error);
            return fallback;
        }
    }

    function encodeTextArray(values) {
        if (!values.length) return '';
        const json = JSON.stringify(values);
        return toBase64Url(encodeUtf8(json));
    }

    function decodeTextArray(text) {
        if (!text) return [];
        try {
            const json = decodeUtf8(fromBase64Url(text));
            const list = JSON.parse(json);
            if (!Array.isArray(list)) return [];
            return list.map((entry) => (typeof entry === 'string' ? entry : ''));
        } catch (error) {
            console.warn('Failed to decode text array payload', error);
            return [];
        }
    }

    function encodeUtf8(value) {
        if (typeof TextEncoder !== 'undefined') {
            return new TextEncoder().encode(value);
        }
        const encoded = unescape(encodeURIComponent(value));
        const bytes = new Uint8Array(encoded.length);
        for (let i = 0; i < encoded.length; i++) {
            bytes[i] = encoded.charCodeAt(i);
        }
        return bytes;
    }

    function decodeUtf8(bytes) {
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder().decode(bytes);
        }
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return decodeURIComponent(escape(binary));
    }

    function toBase64Url(bytes) {
        if (!bytes || !bytes.length) return '';
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(bytes)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/g, '');
        }
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }

    function fromBase64Url(text) {
        if (!text) return new Uint8Array(0);
        const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = (4 - (base64.length % 4)) % 4;
        const padded = base64 + '='.repeat(padLength);
        if (typeof Buffer !== 'undefined') {
            return Uint8Array.from(Buffer.from(padded, 'base64'));
        }
        const binary = atob(padded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    function buildShareCode(gameData) {
        const roomCount = WORLD_ROOM_COUNT;
        const groundMatrices = collectGroundMatrices(gameData, roomCount);
        const overlayMatrices = collectOverlayMatrices(gameData, roomCount);
        const start = normalizeStart(gameData?.start ?? {});
        const sprites = normalizeSprites(gameData?.sprites);
        const enemies = normalizeEnemies(gameData?.enemies);
        const objects = Array.isArray(gameData?.objects) ? gameData.objects : [];
        const doorPositions = normalizeObjectPositions(objects, 'door');
        const keyPositions = normalizeObjectPositions(objects, 'key');
        const variables = Array.isArray(gameData?.variables) ? gameData.variables : [];
        const variableCode = encodeVariables(variables);

        const groundSegments = groundMatrices.map((matrix) => encodeGround(matrix));
        const hasGround = groundSegments.some((segment) => Boolean(segment));

        const overlaySegments = [];
        let hasOverlay = false;
        for (let index = 0; index < roomCount; index++) {
            const { text, hasData } = encodeOverlay(overlayMatrices[index] ?? []);
            overlaySegments.push(text);
            if (hasData) hasOverlay = true;
        }

        const parts = [];
        parts.push('v' + VERSION.toString(36));
        if (hasGround) {
            parts.push('g' + groundSegments.join(','));
        }
        if (hasOverlay) {
            parts.push('o' + overlaySegments.join(','));
        }

        const defaultStart = normalizeStart({});
        const needsStart = start.x !== defaultStart.x || start.y !== defaultStart.y || start.roomIndex !== defaultStart.roomIndex;
        if (needsStart) {
            const startCode = encodePositions([start]);
            if (startCode) {
                parts.push('s' + startCode);
            }
        }

        if (sprites.length) {
            const positions = encodePositions(sprites);
            const typeIndexes = encodeNpcTypeIndexes(sprites);
            const spriteTexts = sprites.map((npc) => (typeof npc.text === 'string' ? npc.text : ''));
            const conditionalTexts = sprites.map((npc) => (typeof npc.conditionText === 'string' ? npc.conditionText : ''));
            const conditionIndexes = sprites.map((npc) => variableIdToNibble(npc.conditionVariableId));
            const rewardIndexes = sprites.map((npc) => variableIdToNibble(npc.rewardVariableId));
            const needsNpcTexts = sprites.some((sprite, index) => {
                const def = NPC_DEFINITIONS.find((entry) => entry.type === sprite.type);
                const fallback = def ? (def.defaultText || '') : '';
                return spriteTexts[index] !== fallback;
            });
            const hasConditionalTexts = conditionalTexts.some((text) => typeof text === 'string' && text.trim().length);
            const texts = needsNpcTexts ? encodeTextArray(spriteTexts) : '';
            const conditionalTextCode = hasConditionalTexts ? encodeTextArray(conditionalTexts) : '';
            const conditionCode = encodeVariableNibbleArray(conditionIndexes);
            const rewardCode = encodeVariableNibbleArray(rewardIndexes);
            if (positions) parts.push('p' + positions);
            if (typeIndexes) parts.push('i' + typeIndexes);
            if (texts) parts.push('t' + texts);
            if (conditionalTextCode) parts.push('u' + conditionalTextCode);
            if (conditionCode) parts.push('c' + conditionCode);
            if (rewardCode) parts.push('r' + rewardCode);
        }

        if (enemies.length) {
            const enemyPositions = encodePositions(enemies);
            if (enemyPositions) {
                parts.push('e' + enemyPositions);
            }
        }

        if (doorPositions.length) {
            const doorCode = encodePositions(doorPositions);
            if (doorCode) {
                parts.push('d' + doorCode);
            }
        }

        if (keyPositions.length) {
            const keyCode = encodePositions(keyPositions);
            if (keyCode) {
                parts.push('k' + keyCode);
            }
        }

        if (variableCode) {
            parts.push('b' + variableCode);
        }

        const title = typeof gameData?.title === 'string' ? gameData.title.trim() : '';
        if (title && title !== DEFAULT_TITLE) {
            parts.push('n' + encodeText(title.slice(0, 80)));
        }

        return parts.join('.');
    }

    function decodeShareCode(code) {
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
        if (!Number.isFinite(version) || !SUPPORTED_VERSIONS.has(version)) {
            return null;
        }

        const roomCount = version >= VERSION_3 ? WORLD_ROOM_COUNT : 1;
        const groundMaps = decodeWorldGround(payload.g || '', version, roomCount);
        const overlayMaps = decodeWorldOverlay(payload.o || '', version, roomCount);
        const startPosition = decodePositions(payload.s || '')?.[0] ?? normalizeStart({});
        const npcPositions = decodePositions(payload.p || '');
        const npcTexts = decodeTextArray(payload.t || '');
        const npcTypeIndexes = decodeNpcTypeIndexes(payload.i || '');
        const npcConditionalTexts = version >= VERSION ? decodeTextArray(payload.u || '') : [];
        const npcConditionIndexes = version >= VERSION ? decodeVariableNibbleArray(payload.c || '', npcPositions.length) : [];
        const npcRewardIndexes = version >= VERSION ? decodeVariableNibbleArray(payload.r || '', npcPositions.length) : [];
        const enemyPositions = decodePositions(payload.e || '');
        const doorPositions = version >= OBJECTS_VERSION ? decodePositions(payload.d || '') : [];
        const keyPositions = version >= OBJECTS_VERSION ? decodePositions(payload.k || '') : [];
        const variableStates = version >= VARIABLES_VERSION ? decodeVariables(payload.b || '') : [];
        const title = decodeText(payload.n, DEFAULT_TITLE) || DEFAULT_TITLE;
        const buildNpcId = (index) => `npc-${index + 1}`;

        const canUseDefinitions = NPC_DEFINITIONS.length > 0 && (npcTypeIndexes.length > 0 || npcPositions.length <= NPC_DEFINITIONS.length);
        const sprites = [];
        if (canUseDefinitions) {
            for (let index = 0; index < npcPositions.length; index++) {
                const typeIndex = npcTypeIndexes[index] ?? index;
                const def = NPC_DEFINITIONS[typeIndex];
                if (!def) continue;
                const pos = npcPositions[index];
                const conditionVariableId = nibbleToVariableId(npcConditionIndexes[index] ?? 0);
                const rewardVariableId = nibbleToVariableId(npcRewardIndexes[index] ?? 0);
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
                    rewardVariableId
                });
            }
        } else {
            for (let index = 0; index < npcPositions.length; index++) {
                const pos = npcPositions[index];
                const conditionVariableId = nibbleToVariableId(npcConditionIndexes[index] ?? 0);
                const rewardVariableId = nibbleToVariableId(npcRewardIndexes[index] ?? 0);
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
                    rewardVariableId
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
            const ground = groundMaps[index] ?? normalizeGround([]);
            const overlay = overlayMaps[index] ?? normalizeOverlay([]);
            maps.push({ ground, overlay });
        }

        const objects = [
            ...buildObjectEntries(doorPositions, 'door'),
            ...buildObjectEntries(keyPositions, 'key')
        ];

        return {
            title,
            start: startPosition,
            sprites,
            enemies,
            world: version >= VERSION_3 ? { rows: WORLD_ROWS, cols: WORLD_COLS } : { rows: 1, cols: 1 },
            rooms,
            objects,
            variables: buildVariableEntries(variableStates),
            tileset: {
                tiles: [],
                maps,
                map: maps[0] || { ground: normalizeGround([]), overlay: normalizeOverlay([]) }
            }
        };
    }

    function getBaseUrl() {
        if (typeof window !== 'undefined' && window.location) {
            return `${window.location.origin}${window.location.pathname}`;
        }
        return '';
    }

    function buildShareUrl(gameData) {
        const code = buildShareCode(gameData);
        const base = getBaseUrl();
        if (!code) return base;
        return `${base}#${code}`;
    }

    function extractGameDataFromLocation(location) {
        if (!location) return null;
        const hash = location.hash || '';
        if (!hash || hash.length <= 1) return null;
        const code = hash.startsWith('#') ? hash.substring(1) : hash;
        return decodeShareCode(code);
    }

    const api = {
        buildShareUrl,
        extractGameDataFromLocation,
        _encode: buildShareCode,
        _decode: decodeShareCode
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        global.TinyRPGShare = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
