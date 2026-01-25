import { describe, expect, it } from 'vitest';
import { SpriteMatrixRegistry } from '../../core/sprites/SpriteMatrixRegistry';

describe('SpriteMatrixRegistry', () => {
  it('returns a matrix for a known group and type', () => {
    const matrix = SpriteMatrixRegistry.get('npc', 'default');
    expect(matrix.length).toBe(8);
    expect(matrix[0].length).toBe(8);
  });

  it('throws for unknown groups', () => {
    expect(() => SpriteMatrixRegistry.get('missing')).toThrow(
      'SpriteMatrixRegistry: registry not found for "missing"',
    );
  });

  it('throws for unknown sprites', () => {
    expect(() => SpriteMatrixRegistry.get('npc', 'missing')).toThrow(
      'SpriteMatrixRegistry: sprite "missing" not found for group "npc"',
    );
  });
});
