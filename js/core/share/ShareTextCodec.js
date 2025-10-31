class ShareTextCodec {
    static encodeUtf8(value) {
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

    static decodeUtf8(bytes) {
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder().decode(bytes);
        }
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return decodeURIComponent(escape(binary));
    }

    static encodeText(value) {
        if (!value) return '';
        return ShareBase64.toBase64Url(ShareTextCodec.encodeUtf8(value));
    }

    static decodeText(text, fallback = '') {
        if (!text) return fallback;
        try {
            return ShareTextCodec.decodeUtf8(ShareBase64.fromBase64Url(text));
        } catch (error) {
            console.warn('Failed to decode text payload', error);
            return fallback;
        }
    }

    static encodeTextArray(values) {
        if (!values.length) return '';
        const json = JSON.stringify(values);
        return ShareBase64.toBase64Url(ShareTextCodec.encodeUtf8(json));
    }

    static decodeTextArray(text) {
        if (!text) return [];
        try {
            const json = ShareTextCodec.decodeUtf8(ShareBase64.fromBase64Url(text));
            const list = JSON.parse(json);
            if (!Array.isArray(list)) return [];
            return list.map((entry) => (typeof entry === 'string' ? entry : ''));
        } catch (error) {
            console.warn('Failed to decode text array payload', error);
            return [];
        }
    }
}

if (typeof window !== 'undefined') {
    window.ShareTextCodec = ShareTextCodec;
}

