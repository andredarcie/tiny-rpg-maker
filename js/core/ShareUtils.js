/**
 * ShareUtils serializes a minimal game definition into a compact URL and restores it.
 */
(function (global) {
    'use strict';

    const VERSION = 1;
    const MATRIX_SIZE = 8;
    const NULL_CHAR = 'z';
    const HEX_DIGITS = '0123456789abcdef';
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

    function normalizeSprites(list) {
        if (!Array.isArray(list)) return [];
        return list
            .map((npc, index) => ({
                x: clamp(Number(npc?.x), 0, MATRIX_SIZE - 1, 0),
                y: clamp(Number(npc?.y), 0, MATRIX_SIZE - 1, 0),
                roomIndex: clamp(Number(npc?.roomIndex), 0, 3, 0),
                text: typeof npc?.text === 'string' ? npc.text : '',
                id: npc?.id || `npc-${index + 1}`,
                name: npc?.name || `NPC ${index + 1}`
            }))
            .filter((npc) => Number.isFinite(npc.x) && Number.isFinite(npc.y));
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

    function encodeGround(matrix) {
        const normalized = normalizeGround(matrix);
        let output = '';
        for (let y = 0; y < MATRIX_SIZE; y++) {
            for (let x = 0; x < MATRIX_SIZE; x++) {
                output += HEX_DIGITS[normalized[y][x] & 0x0f];
            }
        }
        return output;
    }

    function decodeGround(text) {
        const grid = [];
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

    function encodeOverlay(matrix) {
        const normalized = normalizeOverlay(matrix);
        let output = '';
        let hasData = false;
        for (let y = 0; y < MATRIX_SIZE; y++) {
            for (let x = 0; x < MATRIX_SIZE; x++) {
                const value = normalized[y][x];
                if (value === null || value === undefined) {
                    output += NULL_CHAR;
                } else {
                    hasData = true;
                    output += HEX_DIGITS[value & 0x0f];
                }
            }
        }
        return { text: output, hasData };
    }

    function decodeOverlay(text) {
        const grid = [];
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

    function decodePositions(text) {
        if (!text) return [];
        const bytes = fromBase64Url(text);
        return Array.from(bytes, (byte) => byteToPosition(byte));
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
        parts.push('g' + ground);
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
            parts.push('p' + encodePositions(sprites));
            parts.push('t' + encodeTextArray(sprites.map((npc) => npc.text || '')));
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

        if (!payload.v || parseInt(payload.v, 36) !== VERSION) {
            return null;
        }

        const ground = decodeGround(payload.g || '');
        const overlay = payload.o ? decodeOverlay(payload.o) : normalizeOverlay([]);
        const startPosition = decodePositions(payload.s || '')?.[0] ?? normalizeStart({});
        const npcPositions = decodePositions(payload.p || '');
        const npcTexts = decodeTextArray(payload.t || '');
        const enemyPositions = decodePositions(payload.e || '');
        const title = decodeText(payload.n, DEFAULT_TITLE) || DEFAULT_TITLE;

        const sprites = npcPositions.map((pos, index) => ({
            id: `npc-${index + 1}`,
            name: `NPC ${index + 1}`,
            x: pos.x,
            y: pos.y,
            roomIndex: pos.roomIndex,
            text: npcTexts[index] ?? ''
        }));

        const enemies = enemyPositions.map((pos, index) => ({
            id: `enemy-${index + 1}`,
            type: 'skull',
            x: pos.x,
            y: pos.y,
            roomIndex: pos.roomIndex
        }));

        return {
            title,
            palette: DEFAULT_PALETTE.slice(),
            roomSize: MATRIX_SIZE,
            rooms: [{
                size: MATRIX_SIZE,
                bg: 0,
                tiles: Array.from({ length: MATRIX_SIZE }, () => Array(MATRIX_SIZE).fill(0)),
                walls: Array.from({ length: MATRIX_SIZE }, () => Array(MATRIX_SIZE).fill(false))
            }],
            start: startPosition,
            sprites,
            enemies,
            items: [],
            exits: [],
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
