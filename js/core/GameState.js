const VARIABLE_PRESETS = Object.freeze([
    { id: 'var-1', order: 1, name: '1 - Preto', color: '#000000' },
    { id: 'var-2', order: 2, name: '2 - Azul Escuro', color: '#1D2B53' },
    { id: 'var-3', order: 3, name: '3 - Roxo', color: '#7E2553' },
    { id: 'var-4', order: 4, name: '4 - Verde', color: '#008751' },
    { id: 'var-5', order: 5, name: '5 - Marrom', color: '#AB5236' },
    { id: 'var-6', order: 6, name: '6 - Cinza', color: '#5F574F' }
]);

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
            objects: [],
            variables: [],
            exits: [],
            tileset: {
                tiles: [],
                maps: Array.from({ length: totalRooms }, () => this.createEmptyTileMap(8))
            }
        };
        this.game.tileset.map = this.game.tileset.maps[0];
        this.ensureDefaultVariables();

        this.state = {
            player: { x: 1, y: 1, roomIndex: 0, lives: 3, keys: 0 },
            dialog: { active: false, text: "", page: 1, maxPages: 1, meta: null },
            enemies: [],
            variables: this.cloneVariables(this.game.variables)
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

    setDialog(active, text = "", meta = null) {
        if (!active) {
            this.state.dialog.active = false;
            this.state.dialog.text = "";
            this.state.dialog.page = 1;
            this.state.dialog.maxPages = 1;
            this.state.dialog.meta = null;
            return;
        }
        this.state.dialog.active = true;
        this.state.dialog.text = text;
        this.state.dialog.page = 1;
        this.state.dialog.maxPages = 1;
        this.state.dialog.meta = meta || null;
    }

    setDialogPage(page) {
        const numeric = Number(page);
        if (!Number.isFinite(numeric)) return;
        const maxPages = Math.max(1, this.state.dialog.maxPages || 1);
        const clamped = Math.min(Math.max(1, Math.floor(numeric)), maxPages);
        this.state.dialog.page = clamped;
    }

    resetGame() {
        this.state.player.x = this.clampCoordinate(this.game.start.x);
        this.state.player.y = this.clampCoordinate(this.game.start.y);
        this.state.player.roomIndex = this.clampRoomIndex(this.game.start.roomIndex);
        this.state.player.lives = 3;
        this.state.player.keys = 0;
        this.state.dialog.active = false;
        this.state.dialog.text = "";
        this.state.dialog.page = 1;
        this.state.dialog.maxPages = 1;
        this.state.dialog.meta = null;
        this.state.enemies = this.cloneEnemies(this.game.enemies);
        this.state.variables = this.cloneVariables(this.game.variables);

        // Reset collected items
        this.game.items.forEach((item) => item.collected = false);
        this.game.objects.forEach((object) => {
            if (object.type === 'key') {
                object.collected = false;
            }
            if (object.type === 'door') {
                object.opened = false;
            }
        });
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
            objects: this.game.objects,
            variables: this.game.variables,
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
        const normalizedObjects = this.normalizeObjects(data.objects);
        const normalizedVariables = this.normalizeVariables(data.variables);

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
            objects: normalizedObjects,
            variables: normalizedVariables,
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

        this.ensureDefaultVariables();
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

    normalizeObjects(objects) {
        if (!Array.isArray(objects)) return [];
        const allowedTypes = new Set(['door', 'door-variable', 'key']);
        return objects
            .map((object) => {
                const sourceType = typeof object?.type === 'string' ? object.type : null;
                if (!allowedTypes.has(sourceType)) return null;
                const type = sourceType;
                const roomIndex = this.clampRoomIndex(object?.roomIndex ?? 0);
                const x = this.clampCoordinate(object?.x ?? 0);
                const y = this.clampCoordinate(object?.y ?? 0);
                const id = typeof object?.id === 'string' && object.id.trim()
                    ? object.id.trim()
                    : this.generateObjectId(type, roomIndex);
                const fallbackVariableId = this.game.variables?.[0]?.id ?? VARIABLE_PRESETS[0]?.id ?? null;
                const normalizedVariable = type === 'door-variable'
                    ? (this.normalizeVariableId?.(object?.variableId) ?? fallbackVariableId)
                    : null;

                return {
                    id,
                    type,
                    roomIndex,
                    x,
                    y,
                    collected: type === 'key' ? Boolean(object?.collected) : false,
                    opened: type === 'door' ? Boolean(object?.opened) : false,
                    variableId: normalizedVariable
                };
            })
            .filter(Boolean);
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

    generateObjectId(type, roomIndex) {
        return `${type}-${roomIndex}`;
    }

    getObjects() {
        return this.game.objects;
    }

    getObjectsForRoom(roomIndex) {
        const target = this.clampRoomIndex(roomIndex ?? 0);
        return this.game.objects.filter((object) => object.roomIndex === target);
    }

    getObjectAt(roomIndex, x, y) {
        const targetRoom = this.clampRoomIndex(roomIndex ?? 0);
        const cx = this.clampCoordinate(x ?? 0);
        const cy = this.clampCoordinate(y ?? 0);
        return this.game.objects.find((object) =>
            object.roomIndex === targetRoom &&
            object.x === cx &&
            object.y === cy
        ) || null;
    }

    setObjectPosition(type, roomIndex, x, y) {
        const normalizedType = ['door', 'door-variable', 'key'].includes(type) ? type : null;
        if (!normalizedType) return null;
        const targetRoom = this.clampRoomIndex(roomIndex ?? 0);
        const cx = this.clampCoordinate(x ?? 0);
        const cy = this.clampCoordinate(y ?? 0);
        let entry = this.game.objects.find((object) =>
            object.type === normalizedType && object.roomIndex === targetRoom
        );
        if (!entry) {
            entry = {
                id: this.generateObjectId(normalizedType, targetRoom),
                type: normalizedType,
                roomIndex: targetRoom,
                x: cx,
                y: cy
            };
            this.game.objects.push(entry);
        } else {
            entry.roomIndex = targetRoom;
            entry.x = cx;
            entry.y = cy;
        }
        if (normalizedType === 'key') {
            entry.collected = false;
        }
        if (normalizedType === 'door') {
            entry.opened = false;
        }
        if (normalizedType === 'door-variable') {
            const fallbackVariableId = this.game.variables?.[0]?.id ?? VARIABLE_PRESETS[0]?.id ?? null;
            entry.variableId = this.normalizeVariableId?.(entry.variableId) ?? fallbackVariableId;
        }
        return entry;
    }

    removeObject(type, roomIndex) {
        const normalizedType = ['door', 'door-variable', 'key'].includes(type) ? type : null;
        if (!normalizedType) return;
        const targetRoom = this.clampRoomIndex(roomIndex ?? 0);
        this.game.objects = this.game.objects.filter((object) =>
            !(object.type === normalizedType && object.roomIndex === targetRoom)
        );
    }

    setObjectVariable(type, roomIndex, variableId) {
        if (type !== 'door-variable') return null;
        const targetRoom = this.clampRoomIndex(roomIndex ?? 0);
        const entry = this.game.objects.find((object) =>
            object.type === 'door-variable' &&
            object.roomIndex === targetRoom
        );
        if (!entry) return null;
        const fallbackVariableId = this.game.variables?.[0]?.id ?? VARIABLE_PRESETS[0]?.id ?? null;
        const normalized = this.normalizeVariableId(variableId);
        entry.variableId = normalized ?? fallbackVariableId;
        return entry.variableId;
    }

    addKeys(amount = 1) {
        const numeric = Number(amount);
        if (!Number.isFinite(numeric)) return this.state.player.keys;
        const delta = Math.floor(numeric);
        this.state.player.keys = Math.max(0, this.state.player.keys + delta);
        return this.state.player.keys;
    }

    consumeKey() {
        if (this.state.player.keys <= 0) return false;
        this.state.player.keys -= 1;
        return true;
    }

    getKeys() {
        return this.state.player.keys;
    }

    ensureDefaultVariables() {
        this.game.variables = this.normalizeVariables(this.game.variables);
    }

    cloneVariables(list) {
        return (list || []).map((entry) => ({
            id: entry.id,
            order: entry.order,
            name: entry.name,
            color: entry.color,
            value: Boolean(entry.value)
        }));
    }

    normalizeVariables(source) {
        const incoming = Array.isArray(source) ? source : [];
        const byId = new Map(incoming.map((entry) => [entry?.id, entry]));
        return VARIABLE_PRESETS.map((preset) => {
            const current = byId.get(preset.id) || {};
            return {
                id: preset.id,
                order: preset.order,
                name: typeof current.name === 'string' && current.name.trim() ? current.name.trim() : preset.name,
                color: typeof current.color === 'string' && current.color.trim() ? current.color.trim() : preset.color,
                value: Boolean(current.value)
            };
        });
    }

    getVariableDefinitions() {
        return this.game.variables;
    }

    getVariables() {
        return this.state.variables;
    }

    normalizeVariableId(variableId) {
        if (typeof variableId !== 'string') return null;
        return this.game.variables.some((variable) => variable.id === variableId) ? variableId : null;
    }

    getVariable(variableId) {
        if (!variableId) return null;
        return this.state.variables.find((variable) => variable.id === variableId) || null;
    }

    isVariableOn(variableId) {
        const entry = this.getVariable(variableId);
        return entry ? Boolean(entry.value) : false;
    }

    setVariableValue(variableId, value, persist = false) {
        let updated = false;
        this.state.variables.forEach((variable) => {
            if (variable.id === variableId) {
                const next = Boolean(value);
                if (variable.value !== next) {
                    variable.value = next;
                    updated = true;
                }
            }
        });
        if (persist) {
            this.game.variables.forEach((variable) => {
                if (variable.id === variableId) {
                    const next = Boolean(value);
                    if (variable.value !== next) {
                        variable.value = next;
                        updated = true;
                    }
                }
            });
        }
        return updated;
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
