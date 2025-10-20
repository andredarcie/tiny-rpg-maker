/**
 * TileManager - Gerencia tiles e operações relacionadas
 */
class TileManager {
    constructor(gameState) {
        this.gameState = gameState;
    }

    generateId() {
        return (window.crypto?.randomUUID?.() || ('id-' + Math.random().toString(36).slice(2, 9)));
    }

    createBlankTile(name = "Novo Tile") {
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
        const tile = this.gameState.game.tileset.tiles.find(t => t.id === tileId);
        if (!tile) return;
        Object.assign(tile, data);
    }

    removeTile(tileId) {
        const index = this.gameState.game.tileset.tiles.findIndex(t => t.id === tileId);
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
        return this.gameState.game.tileset.tiles.find(t => t.id === tileId);
    }

    setMapTile(x, y, tileId) {
        if (y < 0 || y >= 8 || x < 0 || x >= 8) return;
        this.gameState.game.tileset.map[y][x] = tileId;
    }

    getTileMap() {
        return this.gameState.game.tileset.map;
    }

    createDefaultTree() {
        const tree = this.createBlankTile('Árvore');
        const green = '#2fbf71';
        const brown = '#8b5a2b';
        
        // Desenha um triângulo verde simples
        for (let y = 0; y < 6; y++) {
            for (let x = 3 - Math.floor(y/2); x <= 4 + Math.floor(y/2); x++) {
                tree.pixels[y][x] = green;
            }
        }
        
        // Tronco marrom
        tree.pixels[6][3] = brown; 
        tree.pixels[6][4] = brown;
        tree.pixels[7][3] = brown; 
        tree.pixels[7][4] = brown;
        
        return tree;
    }

    ensureDefaultTiles() {
        if (this.gameState.game.tileset.tiles.length === 0) {
            const ground = this.createBlankTile('Chao');
            const grassColor = '#2f9e44';

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    ground.pixels[y][x] = grassColor;
                }
            }

            const groundId = this.addTile(ground);
            const map = this.gameState.game.tileset.map;

            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    map[y][x] = groundId;
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

