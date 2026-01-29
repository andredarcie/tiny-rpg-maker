
import { ShareConstants } from './ShareConstants';

class ShareMath {
    static clamp(value: number, min: number, max: number, fallback: number): number {
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, value));
    }

    static clampRoomIndex(value: number | string | null | undefined): number {
        return ShareMath.clamp(Number(value), 0, ShareConstants.MAX_ROOM_INDEX, 0);
    }
}

export { ShareMath };
