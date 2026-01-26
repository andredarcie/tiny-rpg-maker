type BufferLike = {
    from(value: ArrayLike<number> | string, encoding?: string): {
        toString(encoding?: string): string;
    };
};

declare const Buffer: BufferLike | undefined;

class ShareBase64 {
    static toBase64Url(bytes: Uint8Array | ArrayLike<number> | null | undefined): string {
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

    static fromBase64Url(text?: string): Uint8Array {
        if (!text) return new Uint8Array(0);
        const cleaned = String(text).replace(/[\s\r\n]+/g, '');
        if (!cleaned) return new Uint8Array(0);
        if (/[^0-9a-zA-Z\-_]/.test(cleaned)) {
            ShareBase64.logInvalidInput(cleaned);
            return new Uint8Array(0);
        }
        const base64 = cleaned.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = (4 - (base64.length % 4)) % 4;
        const padded = base64 + '='.repeat(padLength);
        try {
            if (typeof Buffer !== 'undefined') {
                return Uint8Array.from(Buffer.from(padded, 'base64'));
            }
            const binary = atob(padded);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        } catch (error) {
            ShareBase64.logInvalidInput(cleaned, error);
            return new Uint8Array(0);
        }
    }

    static logInvalidInput(input: string, error?: unknown) {
        console.warn('[TinyRPG] Invalid base64 segment ignored.', { input, error });
    }
}

export { ShareBase64 };
