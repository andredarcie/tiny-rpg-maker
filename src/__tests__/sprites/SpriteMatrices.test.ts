import { describe, expect, it } from 'vitest';
import { ObjectSpriteMatrices } from '../../runtime/domain/sprites/ObjectSprites';
import { NpcSpriteMatrices } from '../../runtime/domain/sprites/NpcSprites';
import { EnemySpriteMatrices } from '../../runtime/domain/sprites/EnemySprites';
import { PlayerSpriteMatrices } from '../../runtime/domain/sprites/PlayerSprites';

const assertMatrix = (matrix: (number | null)[][]) => {
  expect(Array.isArray(matrix)).toBe(true);
  expect(matrix.length).toBe(8);
  matrix.forEach((row) => {
    expect(row.length).toBe(8);
  });
};

describe('Sprite matrices', () => {
  it('exports object sprite matrices', () => {
    expect(Object.keys(ObjectSpriteMatrices).length).toBeGreaterThan(0);
    assertMatrix(ObjectSpriteMatrices['player-start']);
  });

  it('exports npc sprite matrices', () => {
    expect(Object.keys(NpcSpriteMatrices).length).toBeGreaterThan(0);
    assertMatrix(NpcSpriteMatrices.default);
  });

  it('exports enemy sprite matrices', () => {
    expect(Object.keys(EnemySpriteMatrices).length).toBeGreaterThan(0);
    assertMatrix(EnemySpriteMatrices.default);
  });

  it('exports player sprite matrices', () => {
    expect(Object.keys(PlayerSpriteMatrices).length).toBeGreaterThan(0);
    assertMatrix(PlayerSpriteMatrices.default);
  });
});
