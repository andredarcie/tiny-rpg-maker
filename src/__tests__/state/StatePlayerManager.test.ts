import { describe, expect, it } from 'vitest';
import { StatePlayerManager } from '../../runtime/domain/state/StatePlayerManager';

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

describe('StatePlayerManager', () => {
  it('clamps keys and respects god mode', () => {
    const state = {
      player: {
        x: 1,
        y: 1,
        lastX: 1,
        roomIndex: 0,
        level: 1,
        maxLives: 3,
        currentLives: 3,
        lives: 3,
        keys: 0,
        experience: 0,
        damageShield: 0,
        damageShieldMax: 0,
        swordType: null,
        lastDamageReduction: 0,
        godMode: false,
      },
    };
    const manager = new StatePlayerManager(state, createWorldManager());

    expect(manager.addKeys(20)).toBe(manager.getMaxKeys());
    expect(manager.consumeKey()).toBe(true);
    expect(manager.getKeys()).toBe(manager.getMaxKeys() - 1);

    manager.setGodMode(true);
    state.player.currentLives = 1;
    manager.damage(5);
    expect(state.player.currentLives).toBe(state.player.maxLives);
  });
});
