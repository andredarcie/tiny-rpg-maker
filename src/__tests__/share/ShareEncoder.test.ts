import { beforeAll, describe, expect, it } from 'vitest';
import { setupShareGlobals, ShareConstants, ShareEncoder } from './shareTestUtils';

describe('ShareEncoder', () => {
  beforeAll(() => {
    setupShareGlobals({
      objectTypes: {
        DOOR: 'door',
        KEY: 'key',
        LIFE_POTION: 'life-potion',
        XP_SCROLL: 'xp-scroll',
        SWORD: 'sword',
        SWORD_BRONZE: 'sword-bronze',
        SWORD_WOOD: 'sword-wood',
        PLAYER_END: 'player-end',
        SWITCH: 'switch',
        DOOR_VARIABLE: 'door-variable'
      },
      enemyNormalize: (type) => (typeof type === 'string' && type ? type : 'slime')
    });
  });

  it('builds a share code with version and data segments', () => {
    const size = ShareConstants.MATRIX_SIZE;
    const ground = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    ground[0][0] = 1;
    const overlay = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

    const code = ShareEncoder.buildShareCode({
      title: 'Custom Title',
      author: 'Author',
      start: { x: 2, y: 3, roomIndex: 0 },
      tileset: { map: { ground, overlay }, maps: [] }
    });

    expect(code.startsWith('v')).toBe(true);
    expect(code).toContain('g');
    expect(code).toContain('n');
    expect(code).toContain('y');
  });
});
