import { describe, expect, it, vi } from 'vitest';
import { RendererDialogRenderer } from '../../runtime/adapters/renderer/RendererDialogRenderer';

describe('RendererDialogRenderer', () => {
  it('splits dialog into pages and normalizes the page index', () => {
    const dialog = {
      active: true,
      text: 'Hello world this is a dialog message that should wrap across lines.',
      page: 0,
      maxPages: 1,
    };
    const gameState = {
      getDialog: () => dialog,
    };
    const paletteManager = {
      getColor: () => '#fff',
    };

    const renderer = new RendererDialogRenderer(gameState, paletteManager);
    const lines: string[] = [];
    const ctx = {
      fillStyle: '',
      strokeStyle: '',
      font: '',
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn((text: string) => lines.push(text)),
      measureText: (text: string) => ({ width: text.length * 6 }),
    } as CanvasRenderingContext2D;

    renderer.drawDialog(ctx, { width: 96, height: 72 });

    expect(dialog.page).toBe(1);
    expect(dialog.maxPages).toBeGreaterThan(0);
    expect(lines.length).toBeGreaterThan(0);
  });
});
