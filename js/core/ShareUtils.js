/**
 * ShareUtils serializes a minimal game definition into a compact URL and restores it.
 */
(function (global) {
    'use strict';

    const definitionsSource = (typeof module !== 'undefined' && module.exports)
        ? require('./NPCDefinitions')
        : (global.NPCDefinitions || {});

    const NPC_DEFINITIONS = definitionsSource.NPC_DEFINITIONS || [];

    const LEGACY_VERSION = 1;
    const VERSION = 2;
    const MATRIX_SIZE = 8;
    const TILE_COUNT = MATRIX_SIZE * MATRIX_SIZE;
    const NULL_CHAR = 'z';
    const OVERLAY_BINARY_PREFIX = 'y'; // Marks new overlay bitmask encoding to avoid legacy clashes.
    const DEFAULT_TITLE = 'Tiny RPG Adventure';
    const DEFAULT_PALETTE = [
        '#000000', '#1D2B53', '#7E2553', '#008751',
        '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
        '#FF004D', '#FFA300', '#FFFF27', '#00E756',
        '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
    ];

    function clamp(value, min, max, fallback) {
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, value));
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

    function normalizeStart(start) {
        return {
            x: clamp(Number(start?.x), 0, MATRIX_SIZE - 1, 1),
            y: clamp(Number(start?.y), 0, MATRIX_SIZE - 1, 1),
            roomIndex: clamp(Number(start?.roomIndex), 0, 3, 0)
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
            normalized.push({
                type,
                id: def.id,
                name: def.name,
                x,
                y,
                roomIndex: clamp(Number(npc?.roomIndex), 0, 3, 0),
                text: typeof npc?.text === 'string' ? npc.text : (def.defaultText || '')
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
                roomIndex: clamp(Number(enemy?.roomIndex), 0, 3, 0),
                type: enemy?.type || 'skull',
                id: enemy?.id || `enemy-${index + 1}`
            }))
            .filter((enemy) => Number.isFinite(enemy.x) && Number.isFinite(enemy.y));
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

    let cachedOverlayMaskBase64Length = null;
    function getOverlayMaskBase64Length() {
        if (cachedOverlayMaskBase64Length === null) {
            const maskBytes = new Uint8Array(Math.ceil(TILE_COUNT / 8));
            cachedOverlayMaskBase64Length = toBase64Url(maskBytes).length;
        }
        return cachedOverlayMaskBase64Length;
    }

    function encodeGround(matrix) {
        const normalized = normalizeGround(matrix);
        const values = [];
        let hasNonZero = false;
        for (let y = 0; y < MATRIX_SIZE; y++) {
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const value = normalized[y][x] & 0x0f;
                if (!hasNonZero && value !== 0) {
                    hasNonZero = true;
                }
                values.push(value);
            }
        }
        if (!hasNonZero) {
            return '';
        }
        return toBase64Url(packNibbles(values));
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
            const maskLength = getOverlayMaskBase64Length();
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

    function positionToByte(entry) {
        const room = clamp(Number(entry?.roomIndex), 0, 3, 0) & 0x03;
        const y = clamp(Number(entry?.y), 0, MATRIX_SIZE - 1, 0) & 0x07;
        const x = clamp(Number(entry?.x), 0, MATRIX_SIZE - 1, 0) & 0x07;
        return (room << 6) | (y << 3) | x;
    }

    function byteToPosition(byte) {
        return {
            x: byte & 0x07,
            y: (byte >> 3) & 0x07,
            roomIndex: (byte >> 6) & 0x03
        };
    }

    function encodePositions(entries) {
        if (!entries.length) return '';
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
        const ground = encodeGround(gameData?.tileset?.map?.ground ?? []);
        const { text: overlayText, hasData: hasOverlay } = encodeOverlay(gameData?.tileset?.map?.overlay ?? []);
        const start = normalizeStart(gameData?.start ?? {});
        const sprites = normalizeSprites(gameData?.sprites);
        const enemies = normalizeEnemies(gameData?.enemies);

        const parts = [];
        parts.push('v' + VERSION.toString(36));
        if (ground) {
            parts.push('g' + ground);
        }
        if (hasOverlay) {
            parts.push('o' + overlayText);
        }

        const defaultStart = normalizeStart({});
        const needsStart = start.x !== defaultStart.x || start.y !== defaultStart.y || start.roomIndex !== defaultStart.roomIndex;
        if (needsStart) {
            const startCode = encodePositions([start]);
            parts.push('s' + startCode);
        }

        if (sprites.length) {
            const positions = encodePositions(sprites);
            const typeIndexes = encodeNpcTypeIndexes(sprites);
            const spriteTexts = sprites.map((npc) => (typeof npc.text === 'string' ? npc.text : ''));
            const needsNpcTexts = sprites.some((sprite, index) => {
                const def = NPC_DEFINITIONS.find((entry) => entry.type === sprite.type);
                const fallback = def ? (def.defaultText || '') : '';
                return spriteTexts[index] !== fallback;
            });
            const texts = needsNpcTexts ? encodeTextArray(spriteTexts) : '';
            if (positions) parts.push('p' + positions);
            if (typeIndexes) parts.push('i' + typeIndexes);
            if (texts) parts.push('t' + texts);
        }

        if (enemies.length) {
            parts.push('e' + encodePositions(enemies));
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
        if (!Number.isFinite(version) || (version !== VERSION && version !== LEGACY_VERSION)) {
            return null;
        }

        const ground = decodeGround(payload.g || '', version);
        const overlay = payload.o ? decodeOverlay(payload.o, version) : normalizeOverlay([]);
        const startPosition = decodePositions(payload.s || '')?.[0] ?? normalizeStart({});
        const npcPositions = decodePositions(payload.p || '');
        const npcTexts = decodeTextArray(payload.t || '');
        const npcTypeIndexes = decodeNpcTypeIndexes(payload.i || '');
        const enemyPositions = decodePositions(payload.e || '');
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
                sprites.push({
                    id: buildNpcId(index),
                    type: def.type,
                    name: def.name,
                    x: pos.x,
                    y: pos.y,
                    roomIndex: pos.roomIndex,
                    text: npcTexts[index] ?? (def.defaultText || ''),
                    placed: true
                });
            }
        } else {
            for (let index = 0; index < npcPositions.length; index++) {
                const pos = npcPositions[index];
                sprites.push({
                    id: buildNpcId(index),
                    name: `NPC ${index + 1}`,
                    x: pos.x,
                    y: pos.y,
                    roomIndex: pos.roomIndex,
                    text: npcTexts[index] ?? ''
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

        return {
            title,
            start: startPosition,
            sprites,
            enemies,
            rooms: [{ bg: 0 }],
            tileset: {
                tiles: [],
                map: {
                    ground,
                    overlay
                }
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
