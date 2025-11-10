/**
 * TileManager supplies a curated medieval fantasy tileset and handles placement.
 */
const tileDefinitions = (typeof window !== 'undefined' && window.TileDefinitions)
    ? window.TileDefinitions
    : null;

const TILE_PRESETS_SOURCE = Array.isArray(tileDefinitions?.TILE_PRESETS)
    ? tileDefinitions.TILE_PRESETS
    : (typeof window !== 'undefined' && Array.isArray(window.TILE_PRESETS) ? window.TILE_PRESETS : []);

class TileManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.presets = this.buildPresetTiles();
        this.animationFrameIndex = 0;
        this.maxAnimationFrames = 1;
    }

    generateTileId() {
        const globalCrypto = (typeof crypto !== 'undefined' ? crypto : (typeof window !== 'undefined' ? window.crypto : null));
        if (globalCrypto?.randomUUID) {
            return globalCrypto.randomUUID();
        }
        return `tile-${Math.random().toString(36).slice(2, 10)}`;
    }

    normalizeFrame(frameSource) {
        return Array.from({ length: 8 }, (_, y) =>
            Array.from({ length: 8 }, (_, x) => {
                const value = frameSource?.[y]?.[x];
                if (typeof value === 'string' && value.trim()) {
                    return value;
                }
                return 'transparent';
            })
        );
    }

    normalizeTile(tile, fallbackIndex = 0) {
        const name = typeof tile.name === 'string' && tile.name.trim()
            ? tile.name.trim()
            : `Tile ${fallbackIndex + 1}`;
        const collision = tile.collision;
        const framesSource = Array.isArray(tile.frames) && tile.frames.length
            ? tile.frames
            : (tile.pixels ? [tile.pixels] : []);
        const frames = (framesSource.length ? framesSource : [this.normalizeFrame(null)])
            .map((frame) => this.normalizeFrame(frame));
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
            pixels: frames[0],
            frames,
            animated: frames.length > 1,
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
        const normalized = this.normalizeTile(tile);
        normalized.frames = normalized.frames.map((frame) => frame.map((row) => row.slice()));
        normalized.pixels = normalized.frames[0];
        return normalized;
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
        this.refreshAnimationMetadata();
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
        if (Array.isArray(data.frames)) {
            const normalized = this.normalizeTile({ ...tile, frames: data.frames });
            tile.frames = normalized.frames;
            tile.pixels = normalized.pixels;
            tile.animated = normalized.animated;
        } else if (Array.isArray(data.pixels)) {
            const normalized = this.normalizeTile({ ...tile, frames: [data.pixels] });
            tile.frames = normalized.frames;
            tile.pixels = normalized.pixels;
            tile.animated = normalized.animated;
        }
        this.refreshAnimationMetadata();
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

    refreshAnimationMetadata() {
        const tiles = this.getTiles() || [];
        let maxFrames = 1;
        for (const tile of tiles) {
            const frameCount = Array.isArray(tile?.frames) && tile.frames.length ? tile.frames.length : 1;
            if (frameCount > maxFrames) {
                maxFrames = frameCount;
            }
        }
        this.maxAnimationFrames = Math.max(1, maxFrames);
    }

    getAnimationFrameCount() {
        return Math.max(1, this.maxAnimationFrames || 1);
    }

    getAnimationFrameIndex() {
        return Math.max(0, this.animationFrameIndex || 0);
    }

    setAnimationFrameIndex(index = 0) {
        if (!Number.isFinite(index)) return this.animationFrameIndex;
        const total = this.getAnimationFrameCount();
        const safe = ((Math.floor(index) % total) + total) % total;
        this.animationFrameIndex = safe;
        return this.animationFrameIndex;
    }

    advanceAnimationFrame() {
        const total = this.getAnimationFrameCount();
        if (total <= 1) return this.animationFrameIndex;
        this.animationFrameIndex = (this.getAnimationFrameIndex() + 1) % total;
        return this.animationFrameIndex;
    }

    getTilePixels(tileOrTileId, frameOverride = null) {
        const tile = (typeof tileOrTileId === 'object' && tileOrTileId !== null)
            ? tileOrTileId
            : this.getTile(tileOrTileId);
        if (!tile) return null;
        const frames = Array.isArray(tile.frames) && tile.frames.length
            ? tile.frames
            : (tile.pixels ? [tile.pixels] : []);
        if (!frames.length) return null;
        const index = Number.isFinite(frameOverride) ? frameOverride : this.getAnimationFrameIndex();
        const safeIndex = ((Math.floor(index) % frames.length) + frames.length) % frames.length;
        return frames[safeIndex];
    }

}

if (typeof window !== 'undefined') {
    window.TileManager = TileManager;
}

