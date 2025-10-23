(function (global) {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();

    function toBase64Url(bytes) {
        let binary = '';
        bytes.forEach((b) => { binary += String.fromCharCode(b); });
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

    function fromBase64Url(base64Url) {
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    function encodeGameData(data) {
        const json = JSON.stringify(data);
        const bytes = textEncoder.encode(json);
        return toBase64Url(bytes);
    }

    function decodeGameData(code) {
        try {
            const bytes = fromBase64Url(code);
            const json = textDecoder.decode(bytes);
            return JSON.parse(json);
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
        const match = hash.match(/^#game=([A-Za-z0-9_-]+)$/);
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
