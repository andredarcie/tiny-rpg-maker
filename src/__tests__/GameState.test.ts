import { describe, expect, it, vi } from 'vitest';
import { GameState } from '../runtime/domain/GameState';

describe('GameState', () => {
  it('initializes core defaults and clamps current room', () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      addEventListener: vi.fn(),
    } as unknown as Document;

    try {
      const state = new GameState();
      const game = state.getGame();

      expect(game.title).toBe('My Tiny RPG Game');
      expect(game.rooms.length).toBe(9);
      expect(state.getPlayer()?.x).toBe(1);

      state.getState().player.roomIndex = 999;
      const currentRoom = state.getCurrentRoom();
      expect(currentRoom).toBe(game.rooms[game.rooms.length - 1]);
    } finally {
      globalThis.document = originalDocument as Document;
    }
  });
});
