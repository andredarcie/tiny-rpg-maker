
import { ShareConstants } from './ShareConstants';
class ShareMath {
    static clamp(value, min, max, fallback) {
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, value));
    }

    static clampRoomIndex(value) {
        return ShareMath.clamp(Number(value), 0, ShareConstants.MAX_ROOM_INDEX, 0);
    }
}

export { ShareMath };
