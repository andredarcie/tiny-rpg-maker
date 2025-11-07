class RendererPalette {
    constructor(gameState) {
        this.gameState = gameState;
    }

    getPalette() {
        return this.getPicoPalette();
    }

    getPicoPalette() {
        if (typeof window !== 'undefined' && window.PICO8_COLORS) {
            return window.PICO8_COLORS;
        }
        return RendererConstants.DEFAULT_PALETTE;
    }

    getColor(index) {
        const palette = this.getPalette();
        return palette[index] || "#f4f4f8";
    }
}

if (typeof window !== 'undefined') {
    window.RendererPalette = RendererPalette;
}
