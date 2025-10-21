/**
 * GameState - Gerencia o estado do jogo e dados
 */
class GameState {
    constructor() {
        this.game = {
            title: "Meu Jogo Bitsy",
            palette: ['#0e0f13', '#2e3140', '#f4f4f8'],
            roomSize: 8,
            rooms: [this.createEmptyRoom(8)],
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            items: [],
            exits: [],
            tileset: {
                tiles: [],
                map: this.createEmptyTileMap(8)
            }
        };

        this.state = {
            player: { x: 1, y: 1, roomIndex: 0 },
            dialog: { active: false, text: "" }
        };
    }

    createEmptyRoom(size) {
        return {
            size: size,
            bg: 0,
            tiles: Array.from({ length: size }, () => Array(size).fill(0)),
            walls: Array.from({ length: size }, () => Array(size).fill(false))
        };
    }

    createEmptyTileMap(size) {
        return {
            ground: Array.from({ length: size }, () => Array(size).fill(null)),
            overlay: Array.from({ length: size }, () => Array(size).fill(null))
        };
    }

    getGame() {
        return this.game;
    }

    getState() {
        return this.state;
    }

    getCurrentRoom() {
        return this.game.rooms[this.state.player.roomIndex];
    }

    getPlayer() {
        return this.state.player;
    }

    getDialog() {
        return this.state.dialog;
    }

    setPlayerPosition(x, y, roomIndex = null) {
        this.state.player.x = x;
        this.state.player.y = y;
        if (roomIndex !== null) {
            this.state.player.roomIndex = roomIndex;
        }
    }

    setDialog(active, text = "") {
        this.state.dialog.active = active;
        this.state.dialog.text = text;
    }

    resetGame() {
        this.state.player.x = this.game.start.x;
        this.state.player.y = this.game.start.y;
        this.state.player.roomIndex = this.game.start.roomIndex;
        this.state.dialog.active = false;
        
        // Reset collected items
        this.game.items.forEach(item => item.collected = false);
    }

    exportGameData() {
        return {
            title: this.game.title,
            palette: this.game.palette,
            roomSize: this.game.roomSize,
            rooms: this.game.rooms,
            start: this.game.start,
            sprites: this.game.sprites,
            items: this.game.items,
            exits: this.game.exits,
            tileset: this.game.tileset
        };
    }

    importGameData(data) {
        if (!data || !Array.isArray(data.rooms)) return;

        const tileset = {
            tiles: Array.isArray(data.tileset?.tiles) ? data.tileset.tiles : this.game.tileset.tiles,
            map: this.normalizeTileMap(data.tileset?.map)
        };

        Object.assign(this.game, {
            title: data.title || "Meu Jogo Bitsy",
            palette: Array.isArray(data.palette) && data.palette.length >= 3 ? data.palette.slice(0, 3) : ['#0e0f13', '#2e3140', '#f4f4f8'],
            roomSize: 8,
            rooms: data.rooms.map((r) => ({
                size: 8,
                bg: typeof r.bg === "number" ? r.bg : 0,
                tiles: r.tiles || this.createEmptyRoom(8).tiles,
                walls: r.walls || this.createEmptyRoom(8).walls,
            })),
            start: data.start || { x: 1, y: 1, roomIndex: 0 },
            sprites: Array.isArray(data.sprites) ? data.sprites : [],
            items: Array.isArray(data.items) ? data.items : [],
            exits: Array.isArray(data.exits) ? data.exits : [],
            tileset,
        });

        this.resetGame();
    }

    normalizeTileMap(map) {
        const empty = this.createEmptyTileMap(8);
        if (!map) return empty;
        
        if (Array.isArray(map)) {
            empty.ground = map.map(row => Array.from({ length: 8 }, (_, idx) => row?.[idx] ?? null));
            return empty;
        }
        
        const ground = Array.from({ length: 8 }, (_, y) =>
            Array.from({ length: 8 }, (_, x) => map.ground?.[y]?.[x] ?? null)
        );
        const overlay = Array.from({ length: 8 }, (_, y) =>
            Array.from({ length: 8 }, (_, x) => map.overlay?.[y]?.[x] ?? null)
        );
        
        return { ground, overlay };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
} else {
    window.GameState = GameState;
}
