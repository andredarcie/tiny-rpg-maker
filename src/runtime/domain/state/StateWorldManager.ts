
class StateWorldManager {
    constructor(game, defaultRoomSize = 8) {
        this.game = game;
        this.defaultRoomSize = defaultRoomSize;
    }

    setGame(game) {
        this.game = game;
    }

    get roomSize() {
        return this.game?.roomSize ?? this.defaultRoomSize;
    }

    static createEmptyRoom(size, index = 0, cols = 1) {
        const col = index % cols;
        const row = Math.floor(index / cols);
        return {
            size,
            bg: 0,
            tiles: Array.from({ length: size }, () => Array(size).fill(0)),
            walls: Array.from({ length: size }, () => Array(size).fill(false)),
            worldX: col,
            worldY: row
        };
    }

    createEmptyRoom(size = this.roomSize, index = 0, cols = 1) {
        return StateWorldManager.createEmptyRoom(size, index, cols);
    }

    static createWorldRooms(rows, cols, size) {
        return Array.from({ length: rows * cols }, (_, index) =>
            StateWorldManager.createEmptyRoom(size, index, cols)
        );
    }

    createWorldRooms(rows, cols, size = this.roomSize) {
        return StateWorldManager.createWorldRooms(rows, cols, size);
    }

    static createEmptyTileMap(size) {
        return {
            ground: Array.from({ length: size }, () => Array(size).fill(null)),
            overlay: Array.from({ length: size }, () => Array(size).fill(null))
        };
    }

    createEmptyTileMap(size = this.roomSize) {
        return StateWorldManager.createEmptyTileMap(size);
    }

    normalizeRooms(rooms, totalRooms, cols) {
        const size = this.roomSize;
        const filled = Array.from({ length: totalRooms }, (_, index) =>
            StateWorldManager.createEmptyRoom(size, index, cols)
        );
        if (!Array.isArray(rooms)) return filled;

        rooms.forEach((room, index) => {
            if (index >= filled.length) return;
            const target = filled[index];
            target.bg = typeof room?.bg === "number" ? room.bg : target.bg;
            target.tiles = Array.isArray(room?.tiles)
                ? room.tiles.map((row, y) =>
                    Array.from({ length: size }, (_, x) => {
                        const value = row?.[x];
                        return Number.isFinite(value) ? value : target.tiles[y][x];
                    }))
                : target.tiles;
            target.walls = Array.isArray(room?.walls)
                ? room.walls.map((row, _y) =>
                    Array.from({ length: size }, (_, x) => Boolean(row?.[x])))
                : target.walls;
        });

        return filled;
    }

    normalizeTileMaps(source, totalRooms) {
        const size = this.roomSize;
        const emptyMaps = Array.from({ length: totalRooms }, () => StateWorldManager.createEmptyTileMap(size));
        if (!source) return emptyMaps;

        const assignMap = (target, map) => {
            target.ground = Array.from({ length: size }, (_, y) =>
                Array.from({ length: size }, (_, x) => map?.ground?.[y]?.[x] ?? null)
            );
            target.overlay = Array.from({ length: size }, (_, y) =>
                Array.from({ length: size }, (_, x) => map?.overlay?.[y]?.[x] ?? null)
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

    clampRoomIndex(value) {
        const rooms = this.game?.rooms ?? [];
        const max = Math.max(0, rooms.length - 1);
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.min(max, Math.floor(numeric)));
    }

    clampCoordinate(value) {
        const size = this.roomSize;
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.min(size - 1, Math.floor(numeric)));
    }

    getWorldRows() {
        return this.game?.world?.rows || 1;
    }

    getWorldCols() {
        return this.game?.world?.cols || 1;
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
}

export { StateWorldManager };
