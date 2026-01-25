import { describe, expect, it } from 'vitest';
import { StateEnemyManager } from '../../runtime/domain/state/StateEnemyManager';

const createWorldManager = () => ({
  clampRoomIndex: (value: number) => {
    const numeric = Number.isFinite(value) ? Math.floor(value) : 0;
    return Math.max(0, Math.min(8, numeric));
  },
  clampCoordinate: (value: number) => {
    const numeric = Number.isFinite(value) ? Math.floor(value) : 0;
    return Math.max(0, Math.min(7, numeric));
  },
});

describe('StateEnemyManager', () => {
  it('keeps only one boss enemy at a time', () => {
    const game = { enemies: [], variables: [] };
    const state = { enemies: [] };
    const manager = new StateEnemyManager(game, state, createWorldManager());

    manager.addEnemy({ id: 'boss-1', type: 'dragon', roomIndex: 0, x: 1, y: 1 });
    manager.addEnemy({ id: 'boss-2', type: 'dragon', roomIndex: 1, x: 2, y: 2 });

    expect(game.enemies.length).toBe(1);
    expect(state.enemies.length).toBe(1);
    expect(game.enemies[0].id).toBe('boss-2');
  });

  it('limits enemies per room', () => {
    const game = { enemies: [], variables: [] };
    const state = { enemies: [] };
    const manager = new StateEnemyManager(game, state, createWorldManager());

    for (let i = 0; i < 6; i += 1) {
      manager.addEnemy({ id: `enemy-${i}`, type: 'giant-rat', roomIndex: 0, x: i, y: 0 });
    }

    const rejected = manager.addEnemy({ id: 'enemy-7', type: 'giant-rat', roomIndex: 0, x: 7, y: 0 });

    expect(rejected).toBe(null);
    expect(game.enemies.length).toBe(6);
  });
});
