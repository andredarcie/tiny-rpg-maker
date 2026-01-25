import { describe, expect, it } from 'vitest';
import { EnemyDefinitions } from '../../core/EnemyDefinitions';
import { NPCDefinitions } from '../../core/NPCDefinitions';
import { ObjectDefinitions } from '../../core/ObjectDefinitions';
import { PICO8_COLORS, TILE_PRESETS, TileDefinitions } from '../../core/TileDefinitions';
import { SkillDefinitions } from '../../core/SkillDefinitions';

describe('Core definitions', () => {
  it('EnemyDefinitions exposes a default entry', () => {
    expect(EnemyDefinitions.getDefault()).not.toBeNull();
  });

  it('NPCDefinitions exposes definitions', () => {
    expect(NPCDefinitions.definitions.length).toBeGreaterThan(0);
  });

  it('ObjectDefinitions exposes placeable types', () => {
    expect(ObjectDefinitions.getPlaceableTypes().length).toBeGreaterThan(0);
  });

  it('TileDefinitions exposes presets and colors', () => {
    expect(PICO8_COLORS.length).toBeGreaterThan(0);
    expect(TILE_PRESETS.length).toBeGreaterThan(0);
    expect(TileDefinitions.createEmptyLayout().length).toBe(8);
  });

  it('SkillDefinitions exposes skills', () => {
    expect(SkillDefinitions.getAll().length).toBeGreaterThan(0);
  });
});
