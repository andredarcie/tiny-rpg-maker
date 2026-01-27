import type { GameState } from '../GameState';
import type { StateWorldManager } from './StateWorldManager';
import type { RoomDefinition } from '../../../types/gameState';
import type { TileMap } from '../definitions/tileTypes';

class GameStateWorldFacade {
    gameState: GameState;
    worldManager: StateWorldManager;

    constructor(gameState: GameState, worldManager: StateWorldManager) {
        this.gameState = gameState;
        this.worldManager = worldManager;
    }

    createEmptyRoom(size: number, index = 0, cols = 1): RoomDefinition {
        return this.worldManager.createEmptyRoom(size, index, cols);
    }

    createWorldRooms(rows: number, cols: number, size: number): RoomDefinition[] {
        return this.worldManager.createWorldRooms(rows, cols, size);
    }

    createEmptyTileMap(size: number): TileMap {
        return this.worldManager.createEmptyTileMap(size);
    }

    normalizeRooms(rooms: unknown, totalRooms: number, cols: number): RoomDefinition[] {
        return this.worldManager.normalizeRooms(rooms, totalRooms, cols);
    }

    normalizeTileMaps(source: unknown, totalRooms: number): TileMap[] {
        return this.worldManager.normalizeTileMaps(source, totalRooms);
    }
}

export { GameStateWorldFacade };
