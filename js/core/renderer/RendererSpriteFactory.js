class RendererSpriteFactory {
    constructor(paletteManager, gameState = null) {
        this.paletteManager = paletteManager;
        this.gameState = gameState;
        this.playerSprite = null;
        this.enemySprite = null;
        this.enemySprites = null;
        this.npcSprites = null;
        this.objectSprites = null;
    }

    getPlayerSprite() {
        if (!this.playerSprite) {
            this.playerSprite = this.buildPlayerSprite();
        }
        return this.playerSprite;
    }

    getEnemySprite(type = null) {
        if (!this.enemySprites) {
            this.enemySprites = this.buildEnemySprites();
        }
        const sprites = this.enemySprites;
        if (type && sprites[type]) {
            return sprites[type];
        }
        if (type) {
            const normalized = EnemyDefinitions.normalizeType(type);
            if (sprites[normalized]) {
                return sprites[normalized];
            }
        }
        if (!this.enemySprite) {
            this.enemySprite = sprites.default || this.buildEnemySprite();
        }
        return this.enemySprite;
    }

    getEnemySprites() {
        if (!this.enemySprites) {
            this.enemySprites = this.buildEnemySprites();
        }
        return this.enemySprites;
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
        const pixels = SpriteMatrixRegistry.get('player');
        return this.mapPixels(pixels, picoPalette);
    }

    buildNpcSprites() {
        const picoPalette = this.paletteManager.getPicoPalette();
        const sprites = {};
        for (const def of RendererConstants.NPC_DEFINITIONS) {
            const matrix = def.sprite;
            sprites[def.type] = this.mapPixels(matrix, picoPalette, () => this.buildDefaultNpcSprite(picoPalette));
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
            if (Array.isArray(def.spriteOn)) {
                sprites[`${def.type}--on`] = this.mapPixels(def.spriteOn, picoPalette);
            }
        }
        return sprites;
    }

    buildEnemySprites() {
        const picoPalette = this.paletteManager.getPicoPalette();
        const defaultSprite = this.buildDefaultEnemySprite(picoPalette);
        const sprites = { default: defaultSprite };
        const definitions = RendererConstants.ENEMY_DEFINITIONS;
        if (Array.isArray(definitions)) {
            for (const def of definitions) {
                if (!Array.isArray(def.sprite)) continue;
                const sprite = this.mapPixels(def.sprite, picoPalette, () => defaultSprite);
                sprites[def.type] = sprite;
                if (Array.isArray(def.aliases)) {
                    for (const alias of def.aliases) {
                        sprites[alias] = sprite;
                    }
                }
            }
        }
        return sprites;
    }

    buildDefaultNpcSprite(picoPalette) {
        const pixels = SpriteMatrixRegistry.get('npc');
        return this.mapPixels(pixels, picoPalette);
    }

    buildEnemySprite() {
        const sprites = this.buildEnemySprites();
        this.enemySprites = sprites;
        this.enemySprite = sprites.default;
        return this.enemySprite;
    }

    buildDefaultEnemySprite(palette) {
        const picoPalette = palette || this.paletteManager.getPicoPalette();
        const pixels = SpriteMatrixRegistry.get('enemy');
        return this.mapPixels(pixels, picoPalette);
    }

    mapPixels(pixels, palette, fallbackBuilder) {
        if (!Array.isArray(pixels)) {
            return fallbackBuilder
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

    turnSpriteHorizontally(sprite) {
        if (!sprite) return;
        return sprite.map(line => [...line].reverse());
    }

}

if (typeof window !== 'undefined') {
    window.RendererSpriteFactory = RendererSpriteFactory;
}
