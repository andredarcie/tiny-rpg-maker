
class StateDataManager {
    constructor({ game, worldManager, objectManager, variableManager }) {
        this.game = game;
        this.worldManager = worldManager;
        this.objectManager = objectManager;
        this.variableManager = variableManager;
    }

    setGame(game) {
        this.game = game;
    }

    setWorldManager(worldManager) {
        this.worldManager = worldManager;
    }

    setObjectManager(objectManager) {
        this.objectManager = objectManager;
    }

    setVariableManager(variableManager) {
        this.variableManager = variableManager;
    }

    exportGameData() {
        return {
            title: this.game.title,
            author: this.game.author,
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
        if (!data) return null;

        const worldRows = 3;
        const worldCols = 3;
        const totalRooms = worldRows * worldCols;

        const tilesetTiles = Array.isArray(data.tileset?.tiles) ? data.tileset.tiles : (this.game.tileset?.tiles ?? []);
        const normalizedRooms = this.worldManager.normalizeRooms(data.rooms, totalRooms, worldCols);
        const normalizedMaps = this.worldManager.normalizeTileMaps(
            data.tileset?.maps ?? data.tileset?.map ?? null,
            totalRooms
        );
        const normalizedObjects = this.objectManager.normalizeObjects(data.objects);
        const normalizedVariables = this.variableManager.normalizeVariables(data.variables);

        Object.assign(this.game, {
            title: typeof data.title === 'string' ? data.title.slice(0, 18) : "My Tiny RPG Game",
            author: typeof data.author === 'string' ? data.author.slice(0, 18) : "",
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

        const start = {
            x: this.worldManager.clampCoordinate(data.start?.x ?? 1),
            y: this.worldManager.clampCoordinate(data.start?.y ?? 1),
            roomIndex: this.worldManager.clampRoomIndex(data.start?.roomIndex ?? 0)
        };
        this.game.start = start;

        this.worldManager.setGame(this.game);
        this.objectManager.setGame(this.game);
        this.variableManager.setGame(this.game);

        return start;
    }
}

export { StateDataManager };
