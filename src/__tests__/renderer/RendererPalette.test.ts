import { describe, expect, it } from 'vitest';
import { PICO8_COLORS } from '../../core/TileDefinitions';
import { RendererPalette } from '../../core/renderer/RendererPalette';

describe('RendererPalette', () => {
  it('uses the PICO8 palette from TileDefinitions', () => {
    const palette = new RendererPalette({});
    expect(palette.getPalette()).toEqual(PICO8_COLORS);
  });

  it('falls back to default palette entries', () => {
    const palette = new RendererPalette({});
    expect(palette.getColor(0)).toBe('#000000');
  });
});
