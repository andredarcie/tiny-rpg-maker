
class GameStateWorldFacade {
    constructor(gameState, worldManager) {
        this.gameState = gameState;
        this.worldManager = worldManager;
    }

    createEmptyRoom(size, index = 0, cols = 1) {
        return this.worldManager.createEmptyRoom(size, index, cols);
    }

    createWorldRooms(rows, cols, size) {
        return this.worldManager.createWorldRooms(rows, cols, size);
    }

    createEmptyTileMap(size) {
        return this.worldManager.createEmptyTileMap(size);
    }

    normalizeRooms(rooms, totalRooms, cols) {
        return this.worldManager.normalizeRooms(rooms, totalRooms, cols);
    }

    normalizeTileMaps(source, totalRooms) {
        return this.worldManager.normalizeTileMaps(source, totalRooms);
    }
}

export { GameStateWorldFacade };
