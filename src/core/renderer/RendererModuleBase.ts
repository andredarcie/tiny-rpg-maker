type RendererLike = {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    gameState: Record<string, unknown>;
    gameEngine?: Record<string, unknown>;
    tileManager: Record<string, unknown>;
    paletteManager: Record<string, unknown>;
    spriteFactory: Record<string, unknown>;
    canvasHelper: Record<string, unknown>;
    entityRenderer: Record<string, unknown>;
};

class RendererModuleBase {
    renderer: RendererLike;

    constructor(renderer: RendererLike) {
        this.renderer = renderer;
    }

    get canvas() {
        return this.renderer.canvas;
    }

    get ctx() {
        return this.renderer.ctx;
    }

    get gameState() {
        return this.renderer.gameState;
    }

    get gameEngine() {
        return this.renderer.gameEngine;
    }

    get tileManager() {
        return this.renderer.tileManager;
    }

    get paletteManager() {
        return this.renderer.paletteManager;
    }

    get spriteFactory() {
        return this.renderer.spriteFactory;
    }

    get canvasHelper() {
        return this.renderer.canvasHelper;
    }

    get entityRenderer() {
        return this.renderer.entityRenderer;
    }
}

export { RendererModuleBase };
