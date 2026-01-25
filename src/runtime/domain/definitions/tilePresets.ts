import { TILE_PRESETS } from './TileDefinitions';
import type { TileDefinition } from './tileTypes';

export const TILE_PRESETS_SOURCE: TileDefinition[] = Array.isArray(TILE_PRESETS)
  ? TILE_PRESETS
  : [];
