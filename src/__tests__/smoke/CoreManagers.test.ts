import { describe, expect, it } from 'vitest';
import { NPCManager } from '../../runtime/services/NPCManager';
import { FirebaseShareTracker } from '../../runtime/infra/share/FirebaseShareTracker';
import { ShareCoverPreview } from '../../showcase/ShareCoverPreview';

describe('Core managers', () => {
  it('NPCManager reads NPCs from game state', () => {
    const gameState = {
      game: {
        sprites: [],
        rooms: [{}, {}],
        variables: [],
      },
      normalizeVariableId: () => null,
    } as never;
    const manager = new NPCManager(gameState);
    expect(manager.getNPCs()).toEqual([]);
  });

  it('FirebaseShareTracker builds payloads', () => {
    const tracker = new FirebaseShareTracker(null);
    const payload = tracker.buildPayload('https://example.com');
    expect(payload.url).toBe('https://example.com');
  });

  it('ShareCoverPreview extracts share codes', () => {
    expect(ShareCoverPreview.extractShareCode('#abc')).toBe('abc');
  });
});
