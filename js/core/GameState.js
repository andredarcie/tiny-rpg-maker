/**
 * GameState stores the persistent game definition and runtime state.
 */
class GameState {
    constructor() {
        const worldRows = 3;
        const worldCols = 3;
        const totalRooms = worldRows * worldCols;
        this.game = {
            title: "My Tiny RPG Game",
            palette: ['#000000', '#1D2B53', '#FFF1E8'],
            roomSize: 8,
            world: {
                rows: worldRows,
                cols: worldCols
            },
            rooms: this.createWorldRooms(worldRows, worldCols, 8),
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            enemies: [],
            items: [],
            exits: [],
            tileset: {
                tiles: [],
                maps: Array.from({ length: totalRooms }, () => this.createEmptyTileMap(8))
            }
        };
        this.game.tileset.map = this.game.tileset.maps[0];

        this.state = {
            player: { x: 1, y: 1, roomIndex: 0, lives: 3 },
            dialog: { active: false, text: "" },
            enemies: []
        };
        this.state.enemies = this.cloneEnemies(this.game.enemies);
    }

    createEmptyRoom(size, index = 0, cols = 1) {
        const col = index % cols;
        const row = Math.floor(index / cols);
        return {
            size: size,
            bg: 0,
            tiles: Array.from({ length: size }, () => Array(size).fill(0)),
            walls: Array.from({ length: size }, () => Array(size).fill(false)),
            worldX: col,
            worldY: row
        };
    }

    createWorldRooms(rows, cols, size) {
        return Array.from({ length: rows * cols }, (_, index) => this.createEmptyRoom(size, index, cols));
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
        const index = this.clampRoomIndex(this.state.player.roomIndex);
        this.state.player.roomIndex = index;
        return this.game.rooms[index];
    }

    getPlayer() {
        return this.state.player;
    }

    getDialog() {
        return this.state.dialog;
    }

    setPlayerPosition(x, y, roomIndex = null) {
        this.state.player.x = this.clampCoordinate(x);
        this.state.player.y = this.clampCoordinate(y);
        if (roomIndex !== null) {
            this.state.player.roomIndex = this.clampRoomIndex(roomIndex);
        }
    }

    setDialog(active, text = "") {
        this.state.dialog.active = active;
        this.state.dialog.text = text;
    }

    resetGame() {
        this.state.player.x = this.clampCoordinate(this.game.start.x);
        this.state.player.y = this.clampCoordinate(this.game.start.y);
        this.state.player.roomIndex = this.clampRoomIndex(this.game.start.roomIndex);
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
            world: this.game.world,
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
        if (!data) return;

        const worldRows = 3;
        const worldCols = 3;
        const totalRooms = worldRows * worldCols;

        const tilesetTiles = Array.isArray(data.tileset?.tiles) ? data.tileset.tiles : this.game.tileset.tiles;
        const normalizedRooms = this.normalizeRooms(data.rooms, totalRooms, worldCols);
        const normalizedMaps = this.normalizeTileMaps(
            data.tileset?.maps ?? data.tileset?.map ?? null,
            totalRooms
        );

        Object.assign(this.game, {
            title: data.title || "My Tiny RPG Game",
            palette: Array.isArray(data.palette) && data.palette.length >= 3 ? data.palette.slice(0, 3) : ['#000000', '#1D2B53', '#FFF1E8'],
            roomSize: 8,
            world: { rows: worldRows, cols: worldCols },
            rooms: normalizedRooms,
            start: data.start || { x: 1, y: 1, roomIndex: 0 },
            sprites: Array.isArray(data.sprites) ? data.sprites : [],
            enemies: Array.isArray(data.enemies) ? data.enemies : [],
            items: Array.isArray(data.items) ? data.items : [],
            exits: Array.isArray(data.exits) ? data.exits : [],
            tileset: {
                tiles: tilesetTiles,
                maps: normalizedMaps
            }
        });
        this.game.tileset.map = this.game.tileset.maps[0];
        this.game.start = {
            x: this.clampCoordinate(data.start?.x ?? 1),
            y: this.clampCoordinate(data.start?.y ?? 1),
            roomIndex: this.clampRoomIndex(data.start?.roomIndex ?? 0)
        };

        this.resetGame();
    }

    normalizeRooms(rooms, totalRooms, cols) {
        const filled = Array.from({ length: totalRooms }, (_, index) => this.createEmptyRoom(8, index, cols));
        if (!Array.isArray(rooms)) return filled;

        rooms.forEach((room, index) => {
            if (index >= filled.length) return;
            const target = filled[index];
            target.bg = typeof room?.bg === "number" ? room.bg : target.bg;
            target.tiles = Array.isArray(room?.tiles)
                ? room.tiles.map((row, y) =>
                    Array.from({ length: 8 }, (_, x) => {
                        const value = row?.[x];
                        return Number.isFinite(value) ? value : target.tiles[y][x];
                    }))
                : target.tiles;
            target.walls = Array.isArray(room?.walls)
                ? room.walls.map((row, y) =>
                    Array.from({ length: 8 }, (_, x) => Boolean(row?.[x])))
                : target.walls;
        });

        return filled;
    }

    normalizeTileMaps(source, totalRooms) {
        const emptyMaps = Array.from({ length: totalRooms }, () => this.createEmptyTileMap(8));
        if (!source) return emptyMaps;

        const assignMap = (target, map) => {
            target.ground = Array.from({ length: 8 }, (_, y) =>
                Array.from({ length: 8 }, (_, x) => map?.ground?.[y]?.[x] ?? null)
            );
            target.overlay = Array.from({ length: 8 }, (_, y) =>
                Array.from({ length: 8 }, (_, x) => map?.overlay?.[y]?.[x] ?? null)
            );
        };

        if (Array.isArray(source)) {
            source.forEach((map, index) => {
                if (index >= emptyMaps.length) return;
                if (map?.ground || map?.overlay) {
                    assignMap(emptyMaps[index], map);
                }
            });
            return emptyMaps;
        }

        if (source?.ground || source?.overlay) {
            assignMap(emptyMaps[0], source);
        }
        return emptyMaps;
    }

    cloneEnemies(enemies) {
        return (enemies || []).map((enemy) => ({
            id: enemy.id,
            type: enemy.type || 'skull',
            roomIndex: this.clampRoomIndex(enemy.roomIndex ?? 0),
            x: this.clampCoordinate(enemy.x ?? 0),
            y: this.clampCoordinate(enemy.y ?? 0),
            lives: enemy.lives ?? 1
        }));
    }

    getEnemies() {
        return this.state.enemies;
    }

    getEnemyDefinitions() {
        return this.game.enemies;
    }

    clampRoomIndex(value) {
        const max = Math.max(0, (this.game.rooms?.length || 1) - 1);
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.min(max, Math.floor(numeric)));
    }

    clampCoordinate(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.min(this.game.roomSize - 1, Math.floor(numeric)));
    }

    getWorldRows() {
        return this.game.world?.rows || 1;
    }

    getWorldCols() {
        return this.game.world?.cols || 1;
    }

    getRoomCoords(index) {
        const cols = this.getWorldCols();
        const row = Math.floor(index / cols);
        const col = index % cols;
        return { row, col };
    }

    getRoomIndex(row, col) {
        const rows = this.getWorldRows();
        const cols = this.getWorldCols();
        if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
        return row * cols + col;
    }

    addEnemy(enemy) {
        const entry = {
            id: enemy.id,
            type: enemy.type || 'skull',
            roomIndex: this.clampRoomIndex(enemy.roomIndex ?? 0),
            x: this.clampCoordinate(enemy.x ?? 0),
            y: this.clampCoordinate(enemy.y ?? 0)
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
            enemy.x = this.clampCoordinate(x);
            enemy.y = this.clampCoordinate(y);
            if (roomIndex !== null && roomIndex !== undefined) {
                enemy.roomIndex = this.clampRoomIndex(roomIndex);
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
