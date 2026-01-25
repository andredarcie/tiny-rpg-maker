
import { ShareDecoder } from './ShareDecoder';
import { ShareEncoder } from './ShareEncoder';
class ShareUrlHelper {
    static getBaseUrl() {
        if (globalThis.location) {
            return `${globalThis.location.origin}${globalThis.location.pathname}`;
        }
        return '';
    }

    static buildShareUrl(gameData) {
        const code = ShareEncoder.buildShareCode(gameData);
        const base = ShareUrlHelper.getBaseUrl();
        if (!code) return base;
        return `${base}#${code}`;
    }

    static extractGameDataFromLocation(location) {
        if (!location) return null;
        const hash = location.hash || '';
        if (!hash || hash.length <= 1) return null;
        const code = hash.startsWith('#') ? hash.substring(1) : hash;
        try {
            return ShareDecoder.decodeShareCode(code);
        } catch (error) {
            console.warn('[TinyRPG] Unable to decode shared game data.', error);
            return null;
        }
    }
}

export { ShareUrlHelper };
