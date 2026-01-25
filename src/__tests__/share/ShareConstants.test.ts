import { describe, expect, it } from 'vitest';
import { ShareConstants } from '../../core/share/ShareConstants';

describe('ShareConstants', () => {
  it('exposes current version and world metadata', () => {
    expect(ShareConstants.VERSION).toBeGreaterThan(0);
    expect(ShareConstants.WORLD_ROOM_COUNT).toBe(9);
    expect(ShareConstants.MATRIX_SIZE).toBe(8);
  });
});
