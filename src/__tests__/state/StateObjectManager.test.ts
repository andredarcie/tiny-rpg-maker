import { describe, expect, it } from 'vitest';
import { StateObjectManager } from '../../core/state/StateObjectManager';
import { OBJECT_TYPES } from '../../core/ObjectDefinitions';

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

const createVariableManager = () => ({
  getFirstVariableId: () => 'var-1',
  normalizeVariableId: (value: string | null | undefined) => (value === 'var-1' ? value : null),
});

describe('StateObjectManager', () => {
  it('ensures a player start marker exists and normalizes end text', () => {
    const game = {
      start: { x: 2, y: 3, roomIndex: 1 },
      objects: [],
      variables: [],
    };
    const worldManager = createWorldManager();
    const variableManager = createVariableManager();

    const manager = new StateObjectManager(game, worldManager, variableManager);

    expect(game.objects[0].type).toBe(OBJECT_TYPES.PLAYER_START);
    expect(game.objects[0].roomIndex).toBe(1);

    manager.setObjectPosition(OBJECT_TYPES.PLAYER_END, 0, 1, 1);
    const longText = 'a'.repeat(StateObjectManager.PLAYER_END_TEXT_LIMIT + 5);
    const normalized = manager.setPlayerEndText(0, longText);
    expect(normalized.length).toBe(StateObjectManager.PLAYER_END_TEXT_LIMIT);
  });
});
