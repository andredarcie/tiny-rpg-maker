import { describe, expect, it, vi } from 'vitest';
import { Renderer } from '../../core/Renderer';

vi.mock('../../core/renderer/RendererPalette', () => ({
  RendererPalette: class {
    getColor() {
      return '#000';
    }
  },
}));

vi.mock('../../core/renderer/RendererSpriteFactory', () => ({
  RendererSpriteFactory: class {
    getPlayerSprite() {
      return [[null]];
    }
    getNpcSprites() {
      return {};
    }
    getEnemySprites() {
      return {};
    }
    getEnemySprite() {
      return [[null]];
    }
    getObjectSprites() {
      return {};
    }
  },
}));

vi.mock('../../core/renderer/RendererCanvasHelper', () => ({
  RendererCanvasHelper: class {
    getTilePixelSize() {
      return 8;
    }
    drawCustomTile() {}
    drawSprite() {}
    drawTileOnCanvas() {}
    drawTilePreview() {}
  },
}));

vi.mock('../../core/renderer/RendererTileRenderer', () => ({
  RendererTileRenderer: class {
    clearCanvas() {}
    drawBackground() {}
    drawTiles() {}
    drawWalls() {}
  },
}));

vi.mock('../../core/renderer/RendererEntityRenderer', () => ({
  RendererEntityRenderer: class {
    setViewportOffset() {}
    drawObjects() {}
    drawItems() {}
    drawNPCs() {}
    drawEnemies() {}
    drawPlayer() {}
    drawTileIconOnPlayer() {}
  },
}));

vi.mock('../../core/renderer/RendererDialogRenderer', () => ({
  RendererDialogRenderer: class {
    drawDialog() {}
  },
}));

vi.mock('../../core/renderer/RendererHudRenderer', () => ({
  RendererHudRenderer: class {
    drawHUD() {}
    drawInventory() {}
  },
}));

vi.mock('../../core/renderer/RendererEffectsManager', () => ({
  RendererEffectsManager: class {
    drawEdgeFlash() {}
    flashEdge() {}
    showCombatIndicator() {}
    flashScreen() {}
  },
}));

vi.mock('../../core/renderer/RendererTransitionManager', () => ({
  RendererTransitionManager: class {
    isActive() {
      return false;
    }
    start() {
      return true;
    }
    drawFrame() {}
  },
}));

vi.mock('../../core/renderer/RendererOverlayRenderer', () => ({
  RendererOverlayRenderer: class {
    setIntroData() {}
    drawIntroOverlay() {}
    drawLevelUpCelebrationOverlay() {}
    drawPickupOverlay() {}
    drawGameOverScreen() {}
    drawLevelUpOverlayFull() {}
  },
}));

describe('Renderer', () => {
  it('advances tile animations and dispatches events', () => {
    vi.useFakeTimers();

    const ctx = {
      imageSmoothingEnabled: true,
      clearRect: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
      fillRect: vi.fn(),
      restore: vi.fn(),
      fillText: vi.fn(),
      strokeRect: vi.fn(),
    } as CanvasRenderingContext2D;

    const canvas = {
      width: 64,
      height: 64,
      getContext: () => ctx,
    } as HTMLCanvasElement;

    const tileManager = {
      getAnimationFrameCount: vi.fn(() => 2),
      advanceAnimationFrame: vi.fn(() => 1),
    };

    const gameState = {
      isGameOver: () => false,
      isEditorModeActive: () => false,
    };

    const dispatchEvent = vi.fn();
    const originalDispatchEvent = globalThis.dispatchEvent;
    const originalCustomEvent = globalThis.CustomEvent;
    const originalEvent = globalThis.Event;

    globalThis.dispatchEvent = dispatchEvent;
    globalThis.Event = class Event {
      type: string;
      constructor(type: string) {
        this.type = type;
      }
    } as typeof Event;
    globalThis.CustomEvent = class CustomEvent extends globalThis.Event {
      detail: Record<string, any>;
      constructor(type: string, params?: { detail?: Record<string, any> }) {
        super(type);
        this.detail = params?.detail ?? {};
      }
    } as typeof CustomEvent;

    const startLoopSpy = vi.spyOn(Renderer.prototype, 'startTileAnimationLoop').mockImplementation(() => {});

    try {
      const renderer = new Renderer(canvas, gameState, tileManager, {});
      renderer.draw = vi.fn();

      renderer.tickTileAnimation();

      expect(tileManager.advanceAnimationFrame).toHaveBeenCalledTimes(1);
      expect(renderer.draw).toHaveBeenCalledTimes(1);
      expect(dispatchEvent).toHaveBeenCalledTimes(1);
    } finally {
      startLoopSpy.mockRestore();
      globalThis.dispatchEvent = originalDispatchEvent;
      globalThis.CustomEvent = originalCustomEvent;
      globalThis.Event = originalEvent;
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
