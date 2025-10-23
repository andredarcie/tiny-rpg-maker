(function (global) {
    const PICO8_COLORS = [
        "#000000", "#1D2B53", "#7E2553", "#008751",
        "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
        "#FF004D", "#FFA300", "#FFFF27", "#00E756",
        "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
    ];

    const PIXEL_ALPHABET = "0123456789abcdefg"; // 0-15 cores + 'g' para transparente
    const TILE_NULL_CODE = "g";
    const GRID_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"; // 0-63
    const CATEGORY_CODES = [
        "Terreno",
        "Natureza",
        "Agua",
        "Construcoes",
        "Interior",
        "Decoracao",
        "Diversos"
    ];

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    function base64Encode(binary) {
        if (typeof btoa === 'function') {
            return btoa(binary);
        }
        return Buffer.from(binary, 'binary').toString('base64');
    }

    function base64Decode(str) {
        if (typeof atob === 'function') {
            return atob(str);
        }
        return Buffer.from(str, 'base64').toString('binary');
    }

    function toBase64Url(bytes) {
        let binary = '';
        bytes.forEach((b) => { binary += String.fromCharCode(b); });
        return base64Encode(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

    function fromBase64Url(base64Url) {
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const binary = base64Decode(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    function encodePacked(values, bitsPerValue) {
        const totalBits = values.length * bitsPerValue;
        const output = new Uint8Array(Math.ceil(totalBits / 8));
        let bitOffset = 0;
        const mask = (1 << bitsPerValue) - 1;

        for (let i = 0; i < values.length; i++) {
            let value = values[i] & mask;
            for (let bit = 0; bit < bitsPerValue; bit++) {
                const byteIndex = bitOffset >> 3;
                const bitIndex = bitOffset & 7;
                output[byteIndex] |= ((value >> bit) & 1) << bitIndex;
                bitOffset++;
            }
        }
        return toBase64Url(output);
    }

    function decodePacked(str, count, bitsPerValue) {
        const bytes = str ? fromBase64Url(str) : new Uint8Array(0);
        const values = new Array(count).fill(0);
        let bitOffset = 0;
        for (let i = 0; i < count; i++) {
            let value = 0;
            for (let bit = 0; bit < bitsPerValue; bit++) {
                const byteIndex = bitOffset >> 3;
                const bitIndex = bitOffset & 7;
                const bitValue = byteIndex < bytes.length ? (bytes[byteIndex] >> bitIndex) & 1 : 0;
                value |= bitValue << bit;
                bitOffset++;
            }
            values[i] = value;
        }
        return values;
    }

    function encodePixels(pixels) {
        const values = new Uint8Array(64);
        let idx = 0;
        for (let y = 0; y < 8; y++) {
            const row = pixels[y] || [];
            for (let x = 0; x < 8; x++) {
                const value = row[x];
                if (!value || value === 'transparent') {
                    values[idx++] = 16; // transparente
                } else {
                    const paletteIndex = PICO8_COLORS.indexOf(value);
                    values[idx++] = paletteIndex >= 0 ? paletteIndex : 16;
                }
            }
        }
        return encodePacked(values, 5);
    }

    function decodePixels(encoded) {
        const values = decodePacked(encoded, 64, 5);
        const rows = [];
        let idx = 0;
        for (let y = 0; y < 8; y++) {
            const row = [];
            for (let x = 0; x < 8; x++) {
                const value = values[idx++];
                if (value === 16) {
                    row.push('transparent');
                } else {
                    row.push(PICO8_COLORS[value] || 'transparent');
                }
            }
            rows.push(row);
        }
        return rows;
    }

    function encodeTileLayer(layer, size) {
        const values = new Uint8Array(size * size);
        let idx = 0;
        for (let y = 0; y < size; y++) {
            const row = layer?.[y] || [];
            for (let x = 0; x < size; x++) {
                const value = row[x];
                values[idx++] = value === null || value === undefined ? 16 : value & 15;
            }
        }
        return encodePacked(values, 5);
    }

    function decodeTileLayer(encoded, size) {
        const values = encoded
            ? decodePacked(encoded, size * size, 5)
            : new Array(size * size).fill(16);
        const rows = [];
        let idx = 0;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const value = values[idx++];
                row.push(value === 16 ? null : value);
            }
            rows.push(row);
        }
        return rows;
    }

    function encodeNumberGrid(grid, size) {
        const values = new Uint8Array(size * size);
        let idx = 0;
        for (let y = 0; y < size; y++) {
            const row = grid?.[y] || [];
            for (let x = 0; x < size; x++) {
                const value = row[x] ?? 0;
                values[idx++] = value & 63;
            }
        }
        return encodePacked(values, 6);
    }

    function decodeNumberGrid(encoded, size) {
        const values = decodePacked(encoded, size * size, 6);
        const rows = [];
        let idx = 0;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                row.push(values[idx++]);
            }
            rows.push(row);
        }
        return rows;
    }

    function encodeBooleanGrid(grid, size) {
        const values = new Uint8Array(size * size);
        let idx = 0;
        for (let y = 0; y < size; y++) {
            const row = grid?.[y] || [];
            for (let x = 0; x < size; x++) {
                values[idx++] = row[x] ? 1 : 0;
            }
        }
        return encodePacked(values, 1);
    }

    function decodeBooleanGrid(encoded, size) {
        const values = decodePacked(encoded, size * size, 1);
        const rows = [];
        let idx = 0;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                row.push(values[idx++] === 1);
            }
            rows.push(row);
        }
        return rows;
    }

    function encodeCategory(category) {
        const idx = CATEGORY_CODES.indexOf(category);
        return idx >= 0 ? idx : category || "Diversos";
    }

    function decodeCategory(value) {
        if (typeof value === "number") {
            return CATEGORY_CODES[value] || "Diversos";
        }
        return value || "Diversos";
    }

    function packGameData(game) {
        const size = game.roomSize || game.rooms?.[0]?.size || 8;
        const tiles = (game.tileset?.tiles || []).map((tile) => ({
            i: Number(tile.id),
            n: tile.name || '',
            c: encodeCategory(tile.category),
            l: tile.collision ? 1 : 0,
            p: encodePixels(tile.pixels || [])
        }));

        return {
            v: 1,
            t: game.title || '',
            pa: (game.palette || []).join(','),
            st: [
                game.start?.x ?? 1,
                game.start?.y ?? 1,
                game.start?.roomIndex ?? 0
            ],
            sz: size,
            r: (game.rooms || []).map((room) => ({
                b: room.bg ?? 0,
                t: encodeNumberGrid(room.tiles, size),
                w: encodeBooleanGrid(room.walls, size)
            })),
            sp: game.sprites || [],
            it: game.items || [],
            ex: game.exits || [],
            tl: tiles,
            g: encodeTileLayer(game.tileset?.map?.ground, size),
            o: encodeTileLayer(game.tileset?.map?.overlay, size)
        };
    }

    function unpackGameData(payload) {
        const size = payload.sz || payload.size || 8;
        const palette = typeof payload.pa === 'string'
            ? (payload.pa ? payload.pa.split(',') : [])
            : (payload.palette || []);
        const startArr = payload.st || [];
        const start = {
            x: Number(startArr[0] ?? 1),
            y: Number(startArr[1] ?? 1),
            roomIndex: Number(startArr[2] ?? 0)
        };
        return {
            title: payload.t || payload.title || '',
            palette,
            roomSize: size,
            rooms: (payload.r || payload.rooms || []).map((room) => ({
                size,
                bg: room.b ?? 0,
                tiles: decodeNumberGrid(room.t, size),
                walls: decodeBooleanGrid(room.w, size)
            })),
            start,
            sprites: payload.sp || payload.sprites || [],
            items: payload.it || payload.items || [],
            exits: payload.ex || payload.exits || [],
            tileset: {
                tiles: (payload.tl || payload.tiles || []).map((tile) => ({
                    id: tile.i,
                    name: tile.n || '',
                    category: decodeCategory(tile.c),
                    collision: !!tile.l,
                    pixels: decodePixels(tile.p || '')
                })),
                map: {
                    ground: decodeTileLayer(payload.g || payload.ground, size),
                    overlay: decodeTileLayer(payload.o || payload.overlay, size)
                }
            }
        };
    }

    function encodeGameData(data) {
        const packed = packGameData(data);
        const json = JSON.stringify(packed);
        const bytes = encoder.encode(json);
        return toBase64Url(bytes);
    }

    function decodeGameData(code) {
        try {
            const bytes = fromBase64Url(code);
            const json = decoder.decode(bytes);
            const payload = JSON.parse(json);
            return unpackGameData(payload);
        } catch (err) {
            console.error('TinyRPGShare: falha ao decodificar dados', err);
            return null;
        }
    }

    function buildShareUrl(data, baseUrl) {
        const code = encodeGameData(data);
        const base = baseUrl || `${window.location.origin}${window.location.pathname}`;
        return `${base}#game=${code}`;
    }

    function extractGameDataFromLocation(loc) {
        const source = loc || window.location;
        const hash = source.hash || '';
        const match = hash.match(/^#game=([A-Za-z0-9_-]+)/);
        if (!match) return null;
        return decodeGameData(match[1]);
    }

    global.TinyRPGShare = {
        encodeGameData,
        decodeGameData,
        buildShareUrl,
        extractGameDataFromLocation
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = global.TinyRPGShare;
    }
})(typeof window !== 'undefined' ? window : globalThis);

