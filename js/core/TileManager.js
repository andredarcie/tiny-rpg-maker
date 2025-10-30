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
        const collision = tile.collision;
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

        const existingId = (typeof tile.id === 'string' && /^\d+$/.test(tile.id))
            ? Number(tile.id)
            : tile.id;
        const stableId = existingId !== undefined && existingId !== null ? existingId : this.generateTileId();

        return {
            id: stableId,
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
        return TILE_PRESETS_SOURCE
            .map((tile) => this.cloneTile(tile))
            .sort((a, b) => {
                if (typeof a.id === 'number' && typeof b.id === 'number') {
                    return a.id - b.id;
                }
                return String(a.id).localeCompare(String(b.id));
            });
    }

    cloneTile(tile) {
        return {
            id: tile.id,
            name: tile.name,
            collision: tile.collision,
            pixels: tile.pixels.map(row => row.slice()),
            category: tile.category || 'Diversos'
        };
    }

    ensureDefaultTiles() {
        const tileset = this.gameState.game.tileset;
        const size = this.gameState.game.roomSize || 8;
        const totalRooms = (this.gameState.game.world?.rows || 1) * (this.gameState.game.world?.cols || 1);

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

        const maps = Array.isArray(tileset.maps) ? tileset.maps : [];
        tileset.maps = Array.from({ length: totalRooms }, (_, index) => {
            const map = maps[index] ?? {};
            return {
                ground: normalizeLayer(map.ground, defaultTileId),
                overlay: normalizeLayer(map.overlay, null)
            };
        });
        tileset.map = tileset.maps[0];
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

    setMapTile(x, y, tileId, roomIndex = 0) {
        if (y < 0 || y >= 8 || x < 0 || x >= 8) return;
        const maps = this.gameState.game.tileset.maps;
        const map = Array.isArray(maps) ? maps[roomIndex] : null;
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

    getTileMap(roomIndex = 0) {
        const maps = this.gameState.game.tileset.maps;
        if (Array.isArray(maps) && maps[roomIndex]) {
            return maps[roomIndex];
        }
        return this.gameState.game.tileset.map;
    }

}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TileManager;
} else {
    window.TileManager = TileManager;
}


