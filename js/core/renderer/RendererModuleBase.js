class RendererModuleBase {
    constructor(renderer) {
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

if (typeof window !== 'undefined') {
    window.RendererModuleBase = RendererModuleBase;
}
