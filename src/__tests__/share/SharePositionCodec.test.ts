import { beforeAll, describe, expect, it } from 'vitest';
import { setupShareGlobals, ShareConstants, SharePositionCodec } from './shareTestUtils';

describe('SharePositionCodec', () => {
  beforeAll(() => {
    setupShareGlobals({
      npcDefinitions: [
        { id: 'npc-1', type: 'npc-a', name: 'Npc A' },
        { id: 'npc-2', type: 'npc-b', name: 'Npc B' }
      ],
      enemyDefinitions: [
        { type: 'enemy-a' },
        { type: 'enemy-b' }
      ]
    });
  });

  it('roundtrips position bytes', () => {
    const encoded = SharePositionCodec.positionToByte({ x: 7, y: 7, roomIndex: 8 });
    const decoded = SharePositionCodec.byteToPosition(encoded);

    expect(decoded.x).toBe(7);
    expect(decoded.y).toBe(7);
    expect(decoded.roomIndex).toBe(0);
  });

  it('uses wide encoding when room index exceeds 3', () => {
    const encoded = SharePositionCodec.encodePositions([{ x: 1, y: 2, roomIndex: 4 }]);

    expect(encoded.startsWith(ShareConstants.POSITION_WIDE_PREFIX)).toBe(true);
    expect(SharePositionCodec.decodePositions(encoded)[0]).toEqual({ x: 1, y: 2, roomIndex: 4 });
  });

  it('skips encoding npc indexes when sequential', () => {
    const sprites = [
      { type: 'npc-a' },
      { type: 'npc-b' }
    ];

    expect(SharePositionCodec.encodeNpcTypeIndexes(sprites)).toBe('');
  });

  it('encodes enemy indexes and pads missing values', () => {
    const enemies = [
      { type: 'enemy-b' }
    ];

    const encoded = SharePositionCodec.encodeEnemyTypeIndexes(enemies);
    const decoded = SharePositionCodec.decodeEnemyTypeIndexes(encoded, 3);

    expect(decoded.length).toBe(3);
    expect(decoded[0]).toBe(1);
  });
});
