class RendererSpriteFactory {
    constructor(paletteManager) {
        this.paletteManager = paletteManager;
        this.playerSprite = null;
        this.enemySprite = null;
        this.npcSprites = null;
        this.objectSprites = null;
    }

    getPlayerSprite() {
        if (!this.playerSprite) {
            this.playerSprite = this.buildPlayerSprite();
        }
        return this.playerSprite;
    }

    getEnemySprite() {
        if (!this.enemySprite) {
            this.enemySprite = this.buildEnemySprite();
        }
        return this.enemySprite;
    }

    getNpcSprites() {
        if (!this.npcSprites) {
            this.npcSprites = this.buildNpcSprites();
        }
        return this.npcSprites;
    }

    getObjectSprites() {
        if (!this.objectSprites) {
            this.objectSprites = this.buildObjectSprites();
        }
        return this.objectSprites;
    }

    buildPlayerSprite() {
        const picoPalette = this.paletteManager.getPicoPalette();
        const pixels = [
            [ null, null, 15, 15, 15, 15, null, null ],
            [  6, null, 15, 12, 15, 12, null, null ],
            [ null,  1, 15, 15, 15, 15, null, null ],
            [  1,  9,  4, 15, 15,  9,  9, null ],
            [ null, 15,  9,  4,  4,  9, 15, null ],
            [ null, null,  9,  9,  9,  4, null, null ],
            [ null, null,  1,  1,  1,  1, null, null ],
            [ null, null,  1, null, null,  1, null, null ]
        ];
        return this.mapPixels(pixels, picoPalette);
    }

    buildNpcSprites() {
        const picoPalette = this.paletteManager.getPicoPalette();
        const sprites = {};
        for (const def of RendererConstants.NPC_DEFINITIONS) {
            sprites[def.type] = this.mapPixels(def.sprite, picoPalette, () => this.buildDefaultNpcSprite(picoPalette));
        }
        sprites.default = this.buildDefaultNpcSprite(picoPalette);
        return sprites;
    }

    buildObjectSprites() {
        const picoPalette = this.paletteManager.getPicoPalette();
        const sprites = {};
        for (const def of RendererConstants.OBJECT_DEFINITIONS) {
            if (!Array.isArray(def.sprite)) continue;
            sprites[def.type] = this.mapPixels(def.sprite, picoPalette);
        }
        return sprites;
    }

    buildDefaultNpcSprite(picoPalette) {
        const pixels = [
            [ null, null, null,  5,  5,  5, null, null ],
            [ null, null,  5,  5,  5,  5,  5, null ],
            [ null, null,  7,  1,  7,  1,  7, null ],
            [  5, null,  7,  7,  7,  7,  7, null ],
            [  5, null,  5,  5,  5,  5,  5, null ],
            [  5,  7,  6,  5,  5,  5,  6, null ],
            [  5, null,  6,  6,  5,  6,  6, null ],
            [  5, null,  6,  6,  6,  6,  6, null ]
        ];
        return this.mapPixels(pixels, picoPalette);
    }

    buildEnemySprite() {
        const picoPalette = this.paletteManager.getPicoPalette();
        const pixels = [
            [ null, null,  6, null, null, null,  6, null ],
            [ null, null,  6,  6,  6,  6,  6, null ],
            [ null, null,  6,  6,  8,  6,  8, null ],
            [ null, null,  6,  6,  6,  6,  6, null ],
            [ null, null,  1,  1,  6,  1,  1, null ],
            [ null, null,  6,  1,  1,  1,  6, null ],
            [ null, null, null,  1,  1,  1, null, null ],
            [ null, null, null,  6, null,  6, null, null ]
        ];
        return this.mapPixels(pixels, picoPalette);
    }

    mapPixels(pixels, palette, fallbackBuilder) {
        if (!Array.isArray(pixels)) {
            return typeof fallbackBuilder === 'function'
                ? fallbackBuilder()
                : null;
        }
        return pixels.map((row) =>
            row.map((value) => {
                if (value === null || value === undefined) return null;
                return palette[value] ?? null;
            })
        );
    }
}

if (typeof window !== 'undefined') {
    window.RendererSpriteFactory = RendererSpriteFactory;
}
