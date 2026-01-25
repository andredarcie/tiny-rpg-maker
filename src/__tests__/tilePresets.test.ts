import { describe, expect, it } from 'vitest';
import { TILE_PRESETS } from '../core/TileDefinitions';
import { TILE_PRESETS_SOURCE } from '../core/tilePresets';

describe('tilePresets source selection', () => {
  it('uses TileDefinitions presets as the source', () => {
    expect(TILE_PRESETS_SOURCE).toEqual(TILE_PRESETS);
  });
});
