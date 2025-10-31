class ShareVariableCodec {
    static encodeVariables(variables) {
        if (!Array.isArray(variables) || !variables.length) return '';
        const lookup = new Map();
        for (const entry of variables) {
            if (typeof entry?.id !== 'string') continue;
            lookup.set(entry.id, Boolean(entry.value));
        }
        let mask = 0;
        const ids = ShareConstants.VARIABLE_IDS;
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (lookup.get(id)) {
                mask |= (1 << i);
            }
        }
        if (mask === 0) return '';
        return ShareBase64.toBase64Url(Uint8Array.from([mask]));
    }

    static decodeVariables(text) {
        const ids = ShareConstants.VARIABLE_IDS;
        const states = new Array(ids.length).fill(false);
        if (!text) return states;
        const bytes = ShareBase64.fromBase64Url(text);
        const mask = bytes[0] ?? 0;
        for (let i = 0; i < ids.length; i++) {
            states[i] = Boolean(mask & (1 << i));
        }
        return states;
    }

    static variableIdToNibble(variableId) {
        if (typeof variableId !== 'string') return 0;
        const index = ShareConstants.VARIABLE_IDS.indexOf(variableId);
        return index >= 0 ? (index + 1) : 0;
    }

    static nibbleToVariableId(value) {
        if (!Number.isFinite(value) || value <= 0) return null;
        const index = value - 1;
        return ShareConstants.VARIABLE_IDS[index] || null;
    }

    static encodeVariableNibbleArray(values) {
        if (!Array.isArray(values) || !values.length) return '';
        const hasData = values.some((entry) => Number.isFinite(entry) && entry > 0);
        if (!hasData) return '';
        return ShareBase64.toBase64Url(ShareVariableCodec.packNibbles(values.map((entry) => Number(entry) & 0x0f)));
    }

    static decodeVariableNibbleArray(text, expectedCount) {
        const safeCount = Number.isFinite(expectedCount) && expectedCount > 0 ? expectedCount : 0;
        if (!text || !safeCount) return new Array(safeCount).fill(0);
        const bytes = ShareBase64.fromBase64Url(text);
        const values = ShareVariableCodec.unpackNibbles(bytes, safeCount);
        return values.map((value) => (Number.isFinite(value) ? value : 0));
    }

    static buildVariableEntries(states) {
        const ids = ShareConstants.VARIABLE_IDS;
        const names = ShareConstants.VARIABLE_NAMES;
        const colors = ShareConstants.VARIABLE_COLORS;
        const normalized = Array.isArray(states) && states.length === ids.length
            ? states
            : new Array(ids.length).fill(false);
        return ids.map((id, index) => ({
            id,
            order: index + 1,
            name: names[index] || id,
            color: colors[index] || '#000000',
            value: Boolean(normalized[index])
        }));
    }

    static packNibbles(values) {
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

    static unpackNibbles(bytes, expectedCount) {
        const values = new Array(expectedCount);
        for (let i = 0; i < expectedCount; i++) {
            const byte = bytes[i >> 1] || 0;
            values[i] = (i % 2 === 0) ? ((byte >> 4) & 0x0f) : (byte & 0x0f);
        }
        return values;
    }

    static getFirstVariableId() {
        return ShareConstants.VARIABLE_IDS?.[0] ?? null;
    }
}

if (typeof window !== 'undefined') {
    window.ShareVariableCodec = ShareVariableCodec;
}

