import { beforeAll, describe, expect, it } from 'vitest';
import { setupShareGlobals, ShareConstants, ShareMatrixCodec } from './shareTestUtils';

describe('ShareMatrixCodec', () => {
  beforeAll(() => {
    setupShareGlobals();
  });

  it('normalizes ground to the matrix size and clamps values', () => {
    const matrix = [[999]];
    const normalized = ShareMatrixCodec.normalizeGround(matrix);

    expect(normalized.length).toBe(ShareConstants.MATRIX_SIZE);
    expect(normalized[0][0]).toBe(ShareConstants.TILE_VALUE_MAX);
  });

  it('encodes and decodes ground matrices', () => {
    const size = ShareConstants.MATRIX_SIZE;
    const matrix = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => (x === 1 && y === 2 ? 5 : 0))
    );

    const encoded = ShareMatrixCodec.encodeGround(matrix);
    const decoded = ShareMatrixCodec.decodeGround(encoded, ShareConstants.VERSION);

    expect(decoded[2][1]).toBe(5);
  });

  it('encodes and decodes overlay matrices with nulls', () => {
    const size = ShareConstants.MATRIX_SIZE;
    const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
    matrix[0][0] = 7;

    const { text } = ShareMatrixCodec.encodeOverlay(matrix);
    const decoded = ShareMatrixCodec.decodeOverlay(text, ShareConstants.VERSION);

    expect(decoded[0][0]).toBe(7);
    expect(decoded[0][1]).toBeNull();
  });

  it('collects matrices with a fallback for the first room', () => {
    const ground = [[1]];
    const overlay = [[null]];
    const gameData = { tileset: { maps: [], map: { ground, overlay } } };
    const matrices = ShareMatrixCodec.collectGroundMatrices(gameData, 2);

    expect(matrices[0]).toEqual(ground);
    expect(matrices[1]).toEqual([]);
  });
});
