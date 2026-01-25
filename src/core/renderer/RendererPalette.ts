import { PICO8_COLORS } from '../TileDefinitions';
import { RendererConstants } from './RendererConstants';

type GameStateApi = Record<string, unknown> | null;

class RendererPalette {
    gameState: GameStateApi;

    constructor(gameState: GameStateApi) {
        this.gameState = gameState;
    }

    getPalette(): string[] {
        return this.getPicoPalette();
    }

    getPicoPalette(): string[] {
        return PICO8_COLORS || RendererConstants.DEFAULT_PALETTE;
    }

    getColor(index: number): string {
        const palette = this.getPalette();
        return palette[index] || "#f4f4f8";
    }
}

export { RendererPalette };
