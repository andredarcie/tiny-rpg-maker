import { beforeAll, describe, expect, it } from 'vitest';
import { setupShareGlobals, ShareConstants, ShareMath } from './shareTestUtils';

describe('ShareMath', () => {
  beforeAll(() => {
    setupShareGlobals();
  });

  it('clamps numeric values and returns fallback for invalid values', () => {
    expect(ShareMath.clamp(5, 0, 10, 1)).toBe(5);
    expect(ShareMath.clamp(Number.NaN, 0, 10, 7)).toBe(7);
  });

  it('clamps room indexes to valid range', () => {
    expect(ShareMath.clampRoomIndex(-5)).toBe(0);
    expect(ShareMath.clampRoomIndex(999)).toBe(ShareConstants.MAX_ROOM_INDEX);
  });
});
