
import { ShareDecoder } from './share/ShareDecoder';
import { ShareEncoder } from './share/ShareEncoder';
import { ShareUrlHelper } from './share/ShareUrlHelper';
/**
 * ShareUtils delega a serialização/compartilhamento para os codecs especializados.
 */
'use strict';

class ShareUtils {
    static buildShareUrl(gameData) {
        return ShareUrlHelper.buildShareUrl(gameData);
    }

    static extractGameDataFromLocation(location) {
        return ShareUrlHelper.extractGameDataFromLocation(location);
    }

    static encode(gameData) {
        return ShareEncoder.buildShareCode(gameData);
    }

    static decode(code) {
        return ShareDecoder.decodeShareCode(code);
    }
}

export { ShareUtils };
