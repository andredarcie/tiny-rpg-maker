import { describe, expect, it } from 'vitest';
import { EnemyDefinitions } from '../../runtime/domain/definitions/EnemyDefinitions';
import { NPCDefinitions } from '../../runtime/domain/definitions/NPCDefinitions';
import { itemCatalog } from '../../runtime/domain/services/ItemCatalog';
import { PICO8_COLORS, TILE_PRESETS, TileDefinitions } from '../../runtime/domain/definitions/TileDefinitions';
import { SkillDefinitions } from '../../runtime/domain/definitions/SkillDefinitions';

describe('Core definitions', () => {
  it('EnemyDefinitions exposes a default entry', () => {
    expect(EnemyDefinitions.getDefault()).not.toBeNull();
  });

  it('NPCDefinitions exposes definitions', () => {
    expect(NPCDefinitions.definitions.length).toBeGreaterThan(0);
  });

  it('ItemCatalog exposes placeable types', () => {
    expect(itemCatalog.getPlaceableTypes().length).toBeGreaterThan(0);
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
