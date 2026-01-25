
import { ShareBase64 } from './ShareBase64';
import { ShareConstants } from './ShareConstants';
import { ShareMath } from './ShareMath';
class ShareMatrixCodec {
    static normalizeGround(matrix) {
        const size = ShareConstants.MATRIX_SIZE;
        const rows = [];
        const maxTileValue = ShareConstants.TILE_VALUE_MAX;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const value = ShareMatrixCodec.coerceTileValue(matrix?.[y]?.[x], 0);
                row.push(ShareMath.clamp(value, 0, maxTileValue, 0));
            }
            rows.push(row);
        }
        return rows;
    }

    static normalizeOverlay(matrix) {
        const size = ShareConstants.MATRIX_SIZE;
        const rows = [];
        const maxTileValue = ShareConstants.TILE_VALUE_MAX;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const raw = matrix?.[y]?.[x];
                if (raw === null || raw === undefined) {
                    row.push(null);
                } else {
                    const value = ShareMatrixCodec.coerceTileValue(raw, 0);
                    row.push(ShareMath.clamp(value, 0, maxTileValue, 0));
                }
            }
            rows.push(row);
        }
        return rows;
    }

    static collectGroundMatrices(gameData, roomCount) {
        const maps = Array.isArray(gameData?.tileset?.maps) ? gameData.tileset.maps : [];
        const fallbackGround = gameData?.tileset?.map?.ground ?? null;
        const matrices = [];
        for (let index = 0; index < roomCount; index++) {
            const source = maps[index]?.ground ?? (index === 0 ? fallbackGround : null);
            matrices.push(source ?? []);
        }
        return matrices;
    }

    static collectOverlayMatrices(gameData, roomCount) {
        const maps = Array.isArray(gameData?.tileset?.maps) ? gameData.tileset.maps : [];
        const fallbackOverlay = gameData?.tileset?.map?.overlay ?? null;
        const matrices = [];
        for (let index = 0; index < roomCount; index++) {
            const source = maps[index]?.overlay ?? (index === 0 ? fallbackOverlay : null);
            matrices.push(source ?? []);
        }
        return matrices;
    }

    static encodeGround(matrix) {
        const normalized = ShareMatrixCodec.normalizeGround(matrix);
        const values = [];
        const nonZeroValues = [];
        const tileCount = ShareConstants.TILE_COUNT;
        const maskBytes = new Uint8Array(Math.ceil(tileCount / 8));
        let hasNonZero = false;
        let bitIndex = 0;
        const size = ShareConstants.MATRIX_SIZE;
        const useExtendedTiles = ShareMatrixCodec.shouldUseExtendedTileEncoding(normalized);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const value = normalized[y][x] & 0xff;
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

        const dense = ShareBase64.toBase64Url(ShareMatrixCodec.packTileValues(values, useExtendedTiles));
        if (!nonZeroValues.length) {
            return dense;
        }
        const encodedMask = ShareBase64.toBase64Url(maskBytes);
        const encodedValues = ShareBase64.toBase64Url(ShareMatrixCodec.packTileValues(nonZeroValues, useExtendedTiles));
        const sparseLength = 1 + encodedMask.length + encodedValues.length;
        if (sparseLength < dense.length) {
            return `${ShareConstants.GROUND_SPARSE_PREFIX}${encodedMask}${encodedValues}`;
        }
        return dense;
    }

    static decodeGround(text, version) {
        const tileCount = ShareConstants.TILE_COUNT;
        const size = ShareConstants.MATRIX_SIZE;
        const maxTileValue = ShareConstants.TILE_VALUE_MAX;
        const useExtendedTiles = version >= ShareConstants.TILE_EXTENDED_VERSION;
        const useLegacy = version === ShareConstants.LEGACY_VERSION ||
            (text?.length === tileCount && /^[0-9a-f]+$/i.test(text));
        const grid = [];

        if (useLegacy) {
            let index = 0;
            for (let y = 0; y < size; y++) {
                const row = [];
                for (let x = 0; x < size; x++) {
                    const char = text?.[index++] ?? '0';
                    const value = parseInt(char, 16);
                    row.push(Number.isFinite(value) ? ShareMath.clamp(value, 0, ShareConstants.TILE_LEGACY_MAX, 0) : 0);
                }
                grid.push(row);
            }
            return grid;
        }

        const useSparseEncoding = text?.[0] === ShareConstants.GROUND_SPARSE_PREFIX &&
            version !== ShareConstants.LEGACY_VERSION;
        if (useSparseEncoding) {
            const maskLength = ShareMatrixCodec.getTileMaskBase64Length(tileCount);
            const maskSlice = text.slice(1, 1 + maskLength);
            const valuesSlice = text.slice(1 + maskLength);
            const maskBytes = ShareBase64.fromBase64Url(maskSlice);
            const nonZeroCount = ShareMatrixCodec.countSetBits(maskBytes);
            const valueBytes = valuesSlice ? ShareBase64.fromBase64Url(valuesSlice) : new Uint8Array(0);
            const values = ShareMatrixCodec.unpackTileValues(valueBytes, nonZeroCount, useExtendedTiles);
            let valueIndex = 0;
            let bitIndex = 0;
            for (let y = 0; y < size; y++) {
                const row = [];
                for (let x = 0; x < size; x++) {
                    const byteIndex = bitIndex >> 3;
                    const bitPosition = bitIndex & 0x07;
                    const hasValue = (maskBytes[byteIndex] & (1 << bitPosition)) !== 0;
                    const tile = hasValue ? (values[valueIndex++] ?? 0) : 0;
                    row.push(ShareMath.clamp(tile, 0, maxTileValue, 0));
                    bitIndex++;
                }
                grid.push(row);
            }
            return grid;
        }

        const bytes = ShareBase64.fromBase64Url(text);
        const values = ShareMatrixCodec.unpackTileValues(bytes, tileCount, useExtendedTiles);
        let valueIndex = 0;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const value = values[valueIndex++] ?? 0;
                row.push(ShareMath.clamp(value, 0, maxTileValue, 0));
            }
            grid.push(row);
        }
        return grid;
    }

    static encodeOverlay(matrix) {
        const normalized = ShareMatrixCodec.normalizeOverlay(matrix);
        const tileCount = ShareConstants.TILE_COUNT;
        const maskBytes = new Uint8Array(Math.ceil(tileCount / 8));
        const values = [];
        let hasData = false;
        let bitIndex = 0;
        const size = ShareConstants.MATRIX_SIZE;
        const useExtendedTiles = ShareMatrixCodec.shouldUseExtendedTileEncoding(normalized);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const value = normalized[y][x];
                const currentIndex = bitIndex++;
                if (value === null || value === undefined) {
                    continue;
                }
                hasData = true;
                const byteIndex = currentIndex >> 3;
                const bitPosition = currentIndex & 0x07;
                maskBytes[byteIndex] |= (1 << bitPosition);
                values.push(value & 0xff);
            }
        }

        if (!hasData) {
            return { text: '', hasData: false };
        }

        const encodedMask = ShareBase64.toBase64Url(maskBytes);
        const encodedValues = values.length
            ? ShareBase64.toBase64Url(ShareMatrixCodec.packTileValues(values, useExtendedTiles))
            : '';
        return {
            text: `${ShareConstants.OVERLAY_BINARY_PREFIX}${encodedMask}${encodedValues}`,
            hasData: true
        };
    }

    static decodeOverlay(text, version) {
        const size = ShareConstants.MATRIX_SIZE;
        const tileCount = ShareConstants.TILE_COUNT;
        const maxTileValue = ShareConstants.TILE_VALUE_MAX;
        const useBinaryEncoding = text?.[0] === ShareConstants.OVERLAY_BINARY_PREFIX &&
            version !== ShareConstants.LEGACY_VERSION;
        const useExtendedTiles = version >= ShareConstants.TILE_EXTENDED_VERSION;
        const grid = [];

        if (useBinaryEncoding) {
            const maskLength = ShareMatrixCodec.getTileMaskBase64Length(tileCount);
            const maskSlice = text.slice(1, 1 + maskLength);
            const valuesSlice = text.slice(1 + maskLength);
            const maskBytes = ShareBase64.fromBase64Url(maskSlice);
            const nonNullCount = ShareMatrixCodec.countSetBits(maskBytes);
            const valueBytes = valuesSlice ? ShareBase64.fromBase64Url(valuesSlice) : new Uint8Array(0);
            const values = ShareMatrixCodec.unpackTileValues(valueBytes, nonNullCount, useExtendedTiles);
            let bitIndex = 0;
            let valueIndex = 0;

            for (let y = 0; y < size; y++) {
                const row = [];
                for (let x = 0; x < size; x++) {
                    const byteIndex = bitIndex >> 3;
                    const bitPosition = bitIndex & 0x07;
                    const hasTile = (maskBytes[byteIndex] & (1 << bitPosition)) !== 0;
                    if (hasTile) {
                        const value = values[valueIndex++] ?? 0;
                        row.push(ShareMath.clamp(value, 0, maxTileValue, 0));
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
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const char = text?.[index++] ?? ShareConstants.NULL_CHAR;
                if (char === ShareConstants.NULL_CHAR) {
                    row.push(null);
                } else {
                    const value = parseInt(char, 16);
                    row.push(Number.isFinite(value) ? ShareMath.clamp(value, 0, ShareConstants.TILE_LEGACY_MAX, 0) : null);
                }
            }
            grid.push(row);
        }
        return grid;
    }

    static decodeWorldGround(text, version, roomCount) {
        if (version >= ShareConstants.WORLD_MULTIMAP_VERSION) {
            const segments = text ? text.split(',') : [];
            const matrices = [];
            for (let index = 0; index < roomCount; index++) {
                const segment = segments[index] ?? '';
                matrices.push(ShareMatrixCodec.decodeGround(segment, version));
            }
            return matrices;
        }
        return [ShareMatrixCodec.decodeGround(text, version)];
    }

    static decodeWorldOverlay(text, version, roomCount) {
        if (version >= ShareConstants.WORLD_MULTIMAP_VERSION) {
            const segments = text ? text.split(',') : [];
            const matrices = [];
            for (let index = 0; index < roomCount; index++) {
                const segment = segments[index] ?? '';
                matrices.push(ShareMatrixCodec.decodeOverlay(segment, version));
            }
            return matrices;
        }
        return [ShareMatrixCodec.decodeOverlay(text || '', version)];
    }

    static coerceTileValue(value, fallback = 0) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
        return fallback;
    }

    static shouldUseExtendedTileEncoding(matrix) {
        if (ShareConstants.VERSION < ShareConstants.TILE_EXTENDED_VERSION) {
            return ShareMatrixCodec.matrixHasExtendedTiles(matrix);
        }
        return true;
    }

    static matrixHasExtendedTiles(matrix) {
        const legacyMax = ShareConstants.TILE_LEGACY_MAX;
        const size = ShareConstants.MATRIX_SIZE;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const value = matrix?.[y]?.[x];
                if (value === null || value === undefined) continue;
                if (Number.isFinite(value) && value > legacyMax) {
                    return true;
                }
            }
        }
        return false;
    }

    static packTileValues(values, useExtended) {
        if (useExtended) {
            const bytes = new Uint8Array(values.length);
            for (let i = 0; i < values.length; i++) {
                const value = Number.isFinite(values[i]) ? values[i] : 0;
                bytes[i] = value & 0xff;
            }
            return bytes;
        }
        return ShareVariableCodec.packNibbles(values.map((entry) => Number(entry) & 0x0f));
    }

    static unpackTileValues(bytes, expectedCount, useExtended) {
        if (useExtended) {
            const values = new Array(expectedCount);
            for (let i = 0; i < expectedCount; i++) {
                values[i] = bytes[i] ?? 0;
            }
            return values;
        }
        return ShareVariableCodec.unpackNibbles(bytes, expectedCount);
    }

    static countSetBits(bytes) {
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

    static getTileMaskBase64Length(tileCount) {
        if (!ShareMatrixCodec._tileMaskLengthCache) {
            ShareMatrixCodec._tileMaskLengthCache = new Map();
        }
        if (!ShareMatrixCodec._tileMaskLengthCache.has(tileCount)) {
            const maskBytes = new Uint8Array(Math.ceil(tileCount / 8));
            ShareMatrixCodec._tileMaskLengthCache.set(
                tileCount,
                ShareBase64.toBase64Url(maskBytes).length
            );
        }
        return ShareMatrixCodec._tileMaskLengthCache.get(tileCount);
    }
}

export { ShareMatrixCodec };
