
import { EnemyDefinitions } from '../definitions/EnemyDefinitions';
import type { GameDefinition, RuntimeState, EnemyDefinition, VariableDefinition } from '../../../types/gameState';
import type { StateWorldManager } from './StateWorldManager';
class StateEnemyManager {
    game: GameDefinition | null;
    state: RuntimeState | null;
    worldManager: StateWorldManager;

    constructor(game: GameDefinition, state: RuntimeState, worldManager: StateWorldManager) {
        this.game = game;
        this.state = state;
        this.worldManager = worldManager;
    }

    setGame(game: GameDefinition) {
        this.game = game;
    }

    setState(state: RuntimeState) {
        this.state = state;
    }

    setWorldManager(worldManager: StateWorldManager) {
        this.worldManager = worldManager;
    }

    cloneEnemies(enemies: EnemyDefinition[] | null | undefined): EnemyDefinition[] {
        const list: EnemyDefinition[] = [];
        (enemies || []).forEach((enemy) => {
            const normalizedType = this.normalizeEnemyType(enemy.type);
            if (this.isBossType(normalizedType)) {
                const idx = list.findIndex((entry) => entry.type === normalizedType);
                if (idx !== -1) {
                    list.splice(idx, 1);
                }
            }
            list.push({
                id: enemy.id,
                type: normalizedType,
                roomIndex: this.worldManager.clampRoomIndex(enemy.roomIndex ?? 0),
                x: this.worldManager.clampCoordinate(enemy.x ?? 0),
                y: this.worldManager.clampCoordinate(enemy.y ?? 0),
                lastX: this.worldManager.clampCoordinate(enemy.x ?? 0),
                lives: enemy.lives ?? 1,
                defeatVariableId: this.normalizeEnemyVariableId(enemy.defeatVariableId),
                playerInVision: Boolean(enemy.playerInVision),
                alertUntil: typeof enemy.alertUntil === 'number' ? enemy.alertUntil : null,
                alertStart: typeof enemy.alertStart === 'number' ? enemy.alertStart : null
            });
        });
        return list;
    }

    resetRuntime(): EnemyDefinition[] {
        if (!this.state) return [];
        this.state.enemies = this.cloneEnemies(this.game?.enemies);
        return this.state.enemies;
    }

    getEnemies(): EnemyDefinition[] {
        return this.state?.enemies ?? [];
    }

    getEnemyDefinitions(): EnemyDefinition[] {
        return this.game?.enemies ?? [];
    }

    addEnemy(enemy: EnemyDefinition): string | null {
        if (!this.game || !this.state) return null;
        const normalizedType = this.normalizeEnemyType(enemy.type);
        if (this.isBossType(normalizedType)) {
            this.game.enemies = (this.game.enemies || []).filter((entry) => this.normalizeEnemyType(entry.type) !== normalizedType);
            this.state.enemies = (this.state.enemies || []).filter((entry) => this.normalizeEnemyType(entry.type) !== normalizedType);
        }

        const targetRoom = this.worldManager.clampRoomIndex(enemy.roomIndex ?? 0);
        const maxEnemiesPerRoom = 6;
        const currentRoomCount = (this.game?.enemies || []).reduce((count, entry) => {
            const room = this.worldManager.clampRoomIndex(entry.roomIndex ?? 0);
            return room === targetRoom ? count + 1 : count;
        }, 0);
        if (currentRoomCount >= maxEnemiesPerRoom) {
            return null;
        }

        const entry = {
            id: enemy.id,
            type: normalizedType,
            roomIndex: targetRoom,
            x: this.worldManager.clampCoordinate(enemy.x ?? 0),
            y: this.worldManager.clampCoordinate(enemy.y ?? 0),
            lastX: this.worldManager.clampCoordinate(enemy.x ?? 0),
            defeatVariableId: this.normalizeEnemyVariableId(enemy.defeatVariableId)
        };
        const runtimeEntry = {
            ...entry,
            playerInVision: false,
            alertUntil: null,
            alertStart: null
        };
        this.game.enemies.push(entry);
        this.state.enemies.push(runtimeEntry);
        return entry.id;
    }

    removeEnemy(enemyId: string) {
        if (!this.game || !this.state) return;
        this.game.enemies = this.game.enemies.filter((enemy) => enemy.id !== enemyId);
        this.state.enemies = this.state.enemies.filter((enemy) => enemy.id !== enemyId);
    }

    setEnemyPosition(enemyId: string | number, x: number, y: number, roomIndex: number | null = null) {
        const enemy = this.getEnemies().find((entry) => entry.id === enemyId);
        if (!enemy) return;
        enemy.lastX = enemy.x;
        enemy.x = this.worldManager.clampCoordinate(x);
        enemy.y = this.worldManager.clampCoordinate(y);
        if (roomIndex !== null && roomIndex !== undefined) {
            enemy.roomIndex = this.worldManager.clampRoomIndex(roomIndex);
        }
    }

    setEnemyVariable(enemyId: string | number, variableId: string | null = null): boolean {
        const normalized = this.normalizeEnemyVariableId(variableId);
        let changed = false;

        if (Array.isArray(this.game?.enemies)) {
            const entry = this.game.enemies.find((enemy) => enemy.id === enemyId);
            if (entry && entry.defeatVariableId !== normalized) {
                entry.defeatVariableId = normalized;
                changed = true;
            }
        }

        if (Array.isArray(this.state?.enemies)) {
            const runtime = this.state.enemies.find((enemy) => enemy.id === enemyId);
            if (runtime && runtime.defeatVariableId !== normalized) {
                runtime.defeatVariableId = normalized;
                changed = true;
            }
        }
        return changed;
    }

    normalizeEnemyType(type: string | null | undefined): string {
        return EnemyDefinitions.normalizeType(type);
    }

    isBossType(type: string): boolean {
        const definition = EnemyDefinitions.getEnemyDefinition(type);
        return Boolean(definition?.boss);
    }

    normalizeEnemyVariableId(variableId: string | null | undefined): string | null {
        if (typeof variableId !== 'string') return null;
        const definitions: VariableDefinition[] = Array.isArray(this.game?.variables) ? this.game.variables : [];
        return definitions.some((variable) => variable.id === variableId) ? variableId : null;
    }
}

export { StateEnemyManager };
