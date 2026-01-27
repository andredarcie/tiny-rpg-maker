
import { ShareBase64 } from './ShareBase64';
class ShareTextCodec {
    static encodeUtf8(value: string): Uint8Array {
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

    static decodeUtf8(bytes: Uint8Array | ArrayLike<number>): string {
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder().decode(bytes as Uint8Array);
        }
        let binary = '';
        const length = 'length' in bytes ? bytes.length : 0;
        for (let i = 0; i < length; i++) {
            binary += String.fromCharCode((bytes as ArrayLike<number>)[i] ?? 0);
        }
        return decodeURIComponent(escape(binary));
    }

    static encodeText(value: string): string {
        if (!value) return '';
        return ShareBase64.toBase64Url(ShareTextCodec.encodeUtf8(value));
    }

    static decodeText(text: string | null | undefined, fallback = ''): string {
        if (!text) return fallback;
        try {
            return ShareTextCodec.decodeUtf8(ShareBase64.fromBase64Url(text));
        } catch (error) {
            console.warn('Failed to decode text payload', error);
            return fallback;
        }
    }

    static encodeTextArray(values: string[]): string {
        if (!values.length) return '';
        const json = JSON.stringify(values);
        return ShareBase64.toBase64Url(ShareTextCodec.encodeUtf8(json));
    }

    static decodeTextArray(text: string | null | undefined): string[] {
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

export { ShareTextCodec };
