/**
 * TileManager supplies a curated medieval fantasy tileset and handles placement.
 */
const tileDefinitions = (() => {
    if (typeof module !== 'undefined' && module.exports) {
        try {
            return require('./TileDefinitions');
        } catch (error) {
            return null;
        }
    }
    if (typeof window !== 'undefined') {
        return {
            PICO8_COLORS: window.PICO8_COLORS,
            TILE_PRESETS: window.TILE_PRESETS
        };
    }
    return null;
})();

const TILE_PRESETS_SOURCE = Array.isArray(tileDefinitions?.TILE_PRESETS)
    ? tileDefinitions.TILE_PRESETS
    : [];

class TileManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.presets = this.buildPresetTiles();
    }

    generateTileId() {
        const globalCrypto = (typeof crypto !== 'undefined' ? crypto : (typeof window !== 'undefined' ? window.crypto : null));
        if (globalCrypto?.randomUUID) {
            return globalCrypto.randomUUID();
        }
        return `tile-${Math.random().toString(36).slice(2, 10)}`;
    }

    normalizeTile(tile, fallbackIndex = 0) {
        const name = typeof tile.name === 'string' && tile.name.trim()
            ? tile.name.trim()
            : `Tile ${fallbackIndex + 1}`;
        const collision = !!tile.collision;
        const pixels = Array.from({ length: 8 }, (_, y) =>
            Array.from({ length: 8 }, (_, x) => {
                const row = Array.isArray(tile.pixels) ? tile.pixels : null;
                const value = row?.[y]?.[x];
                if (typeof value === 'string' && value.trim()) {
                    return value;
                }
                return 'transparent';
            })
        );
        const category = typeof tile.category === 'string' && tile.category.trim()
            ? tile.category.trim()
            : 'Diversos';

        return {
            id: tile.id || this.generateTileId(),
            name,
            collision,
            pixels,
            category
        };
    }

    buildPresetTiles() {
        if (!Array.isArray(TILE_PRESETS_SOURCE)) {
            return [];
        }
        return TILE_PRESETS_SOURCE.map((tile) => this.cloneTile(tile));
    }

    cloneTile(tile) {
        return {
            id: tile.id,
            name: tile.name,
            collision: !!tile.collision,
            pixels: tile.pixels.map(row => row.slice()),
            category: tile.category || 'Diversos'
        };
    }

    ensureDefaultTiles() {
        const tileset = this.gameState.game.tileset;
        const size = this.gameState.game.roomSize || 8;

        if (!Array.isArray(tileset.tiles) || tileset.tiles.length === 0) {
            tileset.tiles = this.presets.map(tile => this.cloneTile(tile));
        } else {
            tileset.tiles = tileset.tiles.map((tile, index) => this.normalizeTile(tile, index));
        }

        const validIds = new Set(tileset.tiles.map(tile => tile.id));
        const defaultTileId = tileset.tiles[0]?.id ?? null;

        const normalizeLayer = (layer, fallback) => {
            const rows = Array.from({ length: size }, (_, y) =>
                Array.from({ length: size }, (_, x) => {
                    const value = layer?.[y]?.[x] ?? null;
                    if (value === null || value === undefined) {
                        return fallback;
                    }
                    return validIds.has(value) ? value : fallback;
                })
            );
            return rows;
        };

        const map = tileset.map ?? {};
        map.ground = normalizeLayer(map.ground, defaultTileId);
        map.overlay = normalizeLayer(map.overlay, null);
        tileset.map = map;
    }

    getPresetTileNames() {
        return this.presets.map(tile => tile.name);
    }

    getTiles() {
        return this.gameState.game.tileset.tiles;
    }

    getTile(tileId) {
        return this.gameState.game.tileset.tiles.find((t) => t.id === tileId);
    }

    updateTile(tileId, data) {
        const tile = this.getTile(tileId);
        if (!tile) return;
        if (typeof data.collision === 'boolean') {
            tile.collision = data.collision;
        }
        if (typeof data.name === 'string' && data.name.trim()) {
            tile.name = data.name.trim();
        }
        if (typeof data.category === 'string' && data.category.trim()) {
            tile.category = data.category.trim();
        }
        if (Array.isArray(data.pixels)) {
            const normalized = this.normalizeTile({ ...tile, pixels: data.pixels });
            tile.pixels = normalized.pixels;
        }
    }

    setMapTile(x, y, tileId) {
        if (y < 0 || y >= 8 || x < 0 || x >= 8) return;
        const map = this.gameState.game.tileset.map;
        if (!map) return;

        if (tileId === null) {
            map.overlay[y][x] = null;
            map.ground[y][x] = null;
            return;
        }

        const tile = this.getTile(tileId);
        if (!tile) return;
        if (tile.collision) {
            map.overlay[y][x] = tileId;
        } else {
            map.ground[y][x] = tileId;
            map.overlay[y][x] = null;
        }
    }

    getTileMap() {
        return this.gameState.game.tileset.map;
    }

}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TileManager;
} else {
    window.TileManager = TileManager;
}


