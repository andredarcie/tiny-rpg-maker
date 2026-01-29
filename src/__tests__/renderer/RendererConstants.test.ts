import { describe, expect, it, vi } from 'vitest';

describe('RendererConstants', () => {
  it('returns definitions from module sources', async () => {
    vi.resetModules();
    vi.doMock('../../runtime/domain/definitions/NPCDefinitions', () => ({
      NPCDefinitions: { definitions: [{ type: 'npc-a' }] },
    }));
    vi.doMock('../../runtime/domain/definitions/ItemDefinitions', () => ({
      ItemDefinitions: { definitions: [{ type: 'obj-a' }] },
    }));
    vi.doMock('../../runtime/domain/definitions/EnemyDefinitions', () => ({
      EnemyDefinitions: { definitions: [{ type: 'enemy-a' }] },
    }));

    const { RendererConstants } = await import('../../runtime/adapters/renderer/RendererConstants');

    expect(RendererConstants.NPC_DEFINITIONS[0].type).toBe('npc-a');
    expect(RendererConstants.OBJECT_DEFINITIONS[0].type).toBe('obj-a');
    expect(RendererConstants.ENEMY_DEFINITIONS[0].type).toBe('enemy-a');
  });

  it('returns a default palette', async () => {
    vi.resetModules();
    const { RendererConstants } = await import('../../runtime/adapters/renderer/RendererConstants');

    expect(RendererConstants.DEFAULT_PALETTE.length).toBeGreaterThan(0);
  });
});
