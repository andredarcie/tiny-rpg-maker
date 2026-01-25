import { describe, expect, it } from 'vitest';
import { StateWorldManager } from '../../runtime/domain/state/StateWorldManager';

describe('StateWorldManager', () => {
  it('creates world rooms with coordinates', () => {
    const rooms = StateWorldManager.createWorldRooms(2, 2, 8);

    expect(rooms).toHaveLength(4);
    expect(rooms[0].worldX).toBe(0);
    expect(rooms[0].worldY).toBe(0);
    expect(rooms[3].worldX).toBe(1);
    expect(rooms[3].worldY).toBe(1);
  });
});
