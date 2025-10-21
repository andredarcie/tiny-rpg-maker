/**
 * TileManager handles tile creation, updates, and placement.
 */
class TileManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    generateId() {
        return (window.crypto?.randomUUID?.() || ('id-' + Math.random().toString(36).slice(2, 9)));
    }

    createBlankTile(name = "New Tile") {
        const pixels = Array.from({ length: 8 }, () => Array(8).fill('transparent'));
        return {
            id: this.generateId(),
            name,
            pixels,
            collision: false
        };
    }

    addTile(tile) {
        if (!tile.id) tile.id = this.generateId();
        if (!tile.pixels) tile.pixels = Array.from({ length: 8 }, () => Array(8).fill('transparent'));
        if (typeof tile.collision !== 'boolean') tile.collision = false;
        if (!tile.name) tile.name = 'Tile';

        this.gameState.game.tileset.tiles.push(tile);
        return tile.id;
    }

    updateTile(tileId, data) {
        const tile = this.gameState.game.tileset.tiles.find((t) => t.id === tileId);
        if (!tile) return;
        Object.assign(tile, data);
    }

    removeTile(tileId) {
        const index = this.gameState.game.tileset.tiles.findIndex((t) => t.id === tileId);
        if (index >= 0) {
            this.gameState.game.tileset.tiles.splice(index, 1);
            return true;
        }
        return false;
    }

    getTiles() {
        return this.gameState.game.tileset.tiles;
    }

    getTile(tileId) {
        return this.gameState.game.tileset.tiles.find((t) => t.id === tileId);
    }

    setMapTile(x, y, tileId, layer = null) {
        if (y < 0 || y >= 8 || x < 0 || x >= 8) return;
        const map = this.gameState.game.tileset.map;
        if (!map) return;

        if (tileId === null) {
            if (layer === 'overlay') {
                map.overlay[y][x] = null;
            } else if (layer === 'ground') {
                map.ground[y][x] = null;
            } else {
                map.overlay[y][x] = null;
                map.ground[y][x] = null;
            }
            return;
        }

        const tile = this.getTile(tileId);
        const targetLayer = layer || (tile?.collision ? 'overlay' : 'ground');

        if (targetLayer === 'overlay') {
            map.overlay[y][x] = tileId;
        } else {
            map.ground[y][x] = tileId;
            if (!layer) {
                map.overlay[y][x] = null;
            }
        }
    }

    getTileMap() {
        return this.gameState.game.tileset.map;
    }

    createDefaultTree() {
        const tree = this.createBlankTile('Tree');
        const green = '#2fbf71';
        const brown = '#8b5a2b';
        tree.collision = true;

        // Draw a simple green triangle canopy
        for (let y = 0; y < 6; y++) {
            for (let x = 3 - Math.floor(y / 2); x <= 4 + Math.floor(y / 2); x++) {
                tree.pixels[y][x] = green;
            }
        }

        // Brown trunk
        tree.pixels[6][3] = brown;
        tree.pixels[6][4] = brown;
        tree.pixels[7][3] = brown;
        tree.pixels[7][4] = brown;

        return tree;
    }

    ensureDefaultTiles() {
        if (this.gameState.game.tileset.tiles.length === 0) {
            const ground = this.createBlankTile('Ground');
            const grassColor = '#2f9e44';

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    ground.pixels[y][x] = grassColor;
                }
            }

            const groundId = this.addTile(ground);
            const map = this.gameState.game.tileset.map;

            for (let y = 0; y < map.ground.length; y++) {
                for (let x = 0; x < map.ground[y].length; x++) {
                    map.ground[y][x] = groundId;
                    map.overlay[y][x] = null;
                }
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TileManager;
} else {
    window.TileManager = TileManager;
}
