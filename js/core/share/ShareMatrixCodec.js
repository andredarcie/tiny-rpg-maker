class ShareMatrixCodec {
    static normalizeGround(matrix) {
        const size = ShareConstants.MATRIX_SIZE;
        const rows = [];
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const value = Number.isFinite(matrix?.[y]?.[x]) ? matrix[y][x] : 0;
                row.push(ShareMath.clamp(value, 0, 15, 0));
            }
            rows.push(row);
        }
        return rows;
    }

    static normalizeOverlay(matrix) {
        const size = ShareConstants.MATRIX_SIZE;
        const rows = [];
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const raw = matrix?.[y]?.[x];
                if (raw === null || raw === undefined) {
                    row.push(null);
                } else {
                    row.push(ShareMath.clamp(Number(raw), 0, 15, 0));
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

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
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

        const dense = ShareBase64.toBase64Url(ShareVariableCodec.packNibbles(values));
        if (!nonZeroValues.length) {
            return dense;
        }
        const encodedMask = ShareBase64.toBase64Url(maskBytes);
        const encodedValues = ShareBase64.toBase64Url(ShareVariableCodec.packNibbles(nonZeroValues));
        const sparseLength = 1 + encodedMask.length + encodedValues.length;
        if (sparseLength < dense.length) {
            return `${ShareConstants.GROUND_SPARSE_PREFIX}${encodedMask}${encodedValues}`;
        }
        return dense;
    }

    static decodeGround(text, version) {
        const tileCount = ShareConstants.TILE_COUNT;
        const size = ShareConstants.MATRIX_SIZE;
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
                    row.push(Number.isFinite(value) ? ShareMath.clamp(value, 0, 15, 0) : 0);
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
            const values = ShareVariableCodec.unpackNibbles(valueBytes, nonZeroCount);
            let valueIndex = 0;
            let bitIndex = 0;
            for (let y = 0; y < size; y++) {
                const row = [];
                for (let x = 0; x < size; x++) {
                    const byteIndex = bitIndex >> 3;
                    const bitPosition = bitIndex & 0x07;
                    const hasValue = (maskBytes[byteIndex] & (1 << bitPosition)) !== 0;
                    const tile = hasValue ? (values[valueIndex++] ?? 0) : 0;
                    row.push(ShareMath.clamp(tile, 0, 15, 0));
                    bitIndex++;
                }
                grid.push(row);
            }
            return grid;
        }

        const bytes = ShareBase64.fromBase64Url(text);
        const values = ShareVariableCodec.unpackNibbles(bytes, tileCount);
        let valueIndex = 0;
        for (let y = 0; y < size; y++) {
            const row = [];
            for (let x = 0; x < size; x++) {
                const value = values[valueIndex++] ?? 0;
                row.push(ShareMath.clamp(value, 0, 15, 0));
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
                values.push(value & 0x0f);
            }
        }

        if (!hasData) {
            return { text: '', hasData: false };
        }

        const encodedMask = ShareBase64.toBase64Url(maskBytes);
        const encodedValues = values.length
            ? ShareBase64.toBase64Url(ShareVariableCodec.packNibbles(values))
            : '';
        return {
            text: `${ShareConstants.OVERLAY_BINARY_PREFIX}${encodedMask}${encodedValues}`,
            hasData: true
        };
    }

    static decodeOverlay(text, version) {
        const size = ShareConstants.MATRIX_SIZE;
        const tileCount = ShareConstants.TILE_COUNT;
        const useBinaryEncoding = text?.[0] === ShareConstants.OVERLAY_BINARY_PREFIX &&
            version !== ShareConstants.LEGACY_VERSION;
        const grid = [];

        if (useBinaryEncoding) {
            const maskLength = ShareMatrixCodec.getTileMaskBase64Length(tileCount);
            const maskSlice = text.slice(1, 1 + maskLength);
            const valuesSlice = text.slice(1 + maskLength);
            const maskBytes = ShareBase64.fromBase64Url(maskSlice);
            const nonNullCount = ShareMatrixCodec.countSetBits(maskBytes);
            const valueBytes = valuesSlice ? ShareBase64.fromBase64Url(valuesSlice) : new Uint8Array(0);
            const values = ShareVariableCodec.unpackNibbles(valueBytes, nonNullCount);
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
                        row.push(ShareMath.clamp(value, 0, 15, 0));
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
                    row.push(Number.isFinite(value) ? ShareMath.clamp(value, 0, 15, 0) : null);
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

if (typeof window !== 'undefined') {
    window.ShareMatrixCodec = ShareMatrixCodec;
}

