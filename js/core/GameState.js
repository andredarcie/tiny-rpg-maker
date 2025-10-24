/**
 * GameState stores the persistent game definition and runtime state.
 */
class GameState {
    constructor() {
        this.game = {
            title: "My Tiny RPG Game",
            palette: ['#000000', '#1D2B53', '#FFF1E8'],
            roomSize: 8,
            rooms: [this.createEmptyRoom(8)],
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            enemies: [],
            items: [],
            exits: [],
            tileset: {
                tiles: [],
                map: this.createEmptyTileMap(8)
            }
        };

        this.state = {
            player: { x: 1, y: 1, roomIndex: 0, lives: 3 },
            dialog: { active: false, text: "" },
            enemies: []
        };
        this.state.enemies = this.cloneEnemies(this.game.enemies);
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
        this.state.player.lives = 3;
        this.state.dialog.active = false;
        this.state.dialog.text = "";
        this.state.enemies = this.cloneEnemies(this.game.enemies);

        // Reset collected items
        this.game.items.forEach((item) => item.collected = false);
    }

    exportGameData() {
        return {
            title: this.game.title,
            palette: this.game.palette,
            roomSize: this.game.roomSize,
            rooms: this.game.rooms,
            start: this.game.start,
            sprites: this.game.sprites,
            enemies: this.game.enemies,
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
            title: data.title || "My Tiny RPG Game",
            palette: Array.isArray(data.palette) && data.palette.length >= 3 ? data.palette.slice(0, 3) : ['#000000', '#1D2B53', '#FFF1E8'],
            roomSize: 8,
            rooms: data.rooms.map((room) => ({
                size: 8,
                bg: typeof room.bg === "number" ? room.bg : 0,
                tiles: room.tiles || this.createEmptyRoom(8).tiles,
                walls: room.walls || this.createEmptyRoom(8).walls,
            })),
            start: data.start || { x: 1, y: 1, roomIndex: 0 },
            sprites: Array.isArray(data.sprites) ? data.sprites : [],
            enemies: Array.isArray(data.enemies) ? data.enemies : [],
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
            empty.ground = map.map((row) => Array.from({ length: 8 }, (_, idx) => row?.[idx] ?? null));
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

    cloneEnemies(enemies) {
        return (enemies || []).map((enemy) => ({
            id: enemy.id,
            type: enemy.type || 'skull',
            roomIndex: enemy.roomIndex ?? 0,
            x: enemy.x ?? 0,
            y: enemy.y ?? 0,
            lives: enemy.lives ?? 1
        }));
    }

    getEnemies() {
        return this.state.enemies;
    }

    getEnemyDefinitions() {
        return this.game.enemies;
    }

    addEnemy(enemy) {
        const entry = {
            id: enemy.id,
            type: enemy.type || 'skull',
            roomIndex: enemy.roomIndex ?? 0,
            x: enemy.x ?? 0,
            y: enemy.y ?? 0
        };
        this.game.enemies.push(entry);
        this.state.enemies.push({ ...entry });
    }

    removeEnemy(enemyId) {
        this.game.enemies = this.game.enemies.filter((enemy) => enemy.id !== enemyId);
        this.state.enemies = this.state.enemies.filter((enemy) => enemy.id !== enemyId);
    }

    setEnemyPosition(enemyId, x, y, roomIndex = null) {
        const enemy = this.state.enemies.find((e) => e.id === enemyId);
        if (enemy) {
            enemy.x = x;
            enemy.y = y;
            if (roomIndex !== null && roomIndex !== undefined) {
                enemy.roomIndex = roomIndex;
            }
        }
    }

    damagePlayer(amount = 1) {
        this.state.player.lives = Math.max(0, this.state.player.lives - amount);
        return this.state.player.lives;
    }

    getLives() {
        return this.state.player.lives;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
} else {
    window.GameState = GameState;
}
