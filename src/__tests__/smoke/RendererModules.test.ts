import { describe, expect, it } from 'vitest';
import { RendererModuleBase } from '../../core/renderer/RendererModuleBase';
import { RendererCanvasHelper } from '../../core/renderer/RendererCanvasHelper';
import { RendererMinimapRenderer } from '../../core/renderer/RendererMinimapRenderer';
import { RendererTileRenderer } from '../../core/renderer/RendererTileRenderer';
import { RendererEntityRenderer } from '../../core/renderer/RendererEntityRenderer';
import { RendererHudRenderer } from '../../core/renderer/RendererHudRenderer';
import { RendererOverlayRenderer } from '../../core/renderer/RendererOverlayRenderer';
import { RendererTransitionManager } from '../../core/renderer/RendererTransitionManager';

describe('Renderer modules', () => {
  it('RendererModuleBase exposes renderer properties', () => {
    const renderer = {
      canvas: { width: 80 } as HTMLCanvasElement,
      ctx: null,
      gameState: {},
      tileManager: {},
      paletteManager: {},
      spriteFactory: {},
      canvasHelper: {},
      entityRenderer: {},
    };
    const moduleBase = new RendererModuleBase(renderer);
    expect(moduleBase.canvas).toBe(renderer.canvas);
  });

  it('RendererCanvasHelper calculates tile size', () => {
    const canvas = { width: 80 } as HTMLCanvasElement;
    const ctx = { fillRect: () => {} } as CanvasRenderingContext2D;
    const helper = new RendererCanvasHelper(canvas, ctx, null);
    expect(helper.getTilePixelSize()).toBe(10);
  });

  it('RendererTransitionManager starts inactive', () => {
    const renderer = {
      canvas: { width: 80 } as HTMLCanvasElement,
      ctx: null,
      gameState: { pauseGame: () => {} },
      tileManager: {},
      paletteManager: {},
      spriteFactory: {},
      canvasHelper: {},
      entityRenderer: {},
      draw: () => {},
    };
    const manager = new RendererTransitionManager(renderer);
    expect(manager.isActive()).toBe(false);
  });

  it('RendererTileRenderer exports a class', () => {
    expect(typeof RendererTileRenderer).toBe('function');
  });

  it('RendererEntityRenderer exports a class', () => {
    expect(typeof RendererEntityRenderer).toBe('function');
  });

  it('RendererHudRenderer exports a class', () => {
    expect(typeof RendererHudRenderer).toBe('function');
  });

  it('RendererOverlayRenderer exports a class', () => {
    expect(typeof RendererOverlayRenderer).toBe('function');
  });

  it('RendererMinimapRenderer exports a class', () => {
    expect(typeof RendererMinimapRenderer).toBe('function');
  });
});
