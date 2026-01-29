import { describe, expect, it } from 'vitest';
import { TILE_PRESETS } from '../runtime/domain/definitions/TileDefinitions';
import { TILE_PRESETS_SOURCE } from '../runtime/domain/definitions/tilePresets';

describe('tilePresets source selection', () => {
  it('uses TileDefinitions presets as the source', () => {
    expect(TILE_PRESETS_SOURCE).toEqual(TILE_PRESETS);
  });
});
