const PLAYER_START_TYPE = 'player-start';
const PLAYER_END_TYPE = 'player-end';
const SWITCH_TYPE = 'switch';
const PLACEABLE_OBJECT_TYPES = ['door', 'door-variable', 'key', 'life-potion', 'xp-scroll', 'sword', PLAYER_START_TYPE, PLAYER_END_TYPE, SWITCH_TYPE];
const COLLECTIBLE_OBJECT_TYPES = new Set(['key', 'life-potion', 'xp-scroll', 'sword']);
const PLAYER_END_TEXT_LIMIT = 40;

class StateObjectManager {
    static get PLAYER_END_TEXT_LIMIT() {
        return PLAYER_END_TEXT_LIMIT;
    }

    constructor(game, worldManager, variableManager) {
        this.game = game;
        this.worldManager = worldManager;
        this.variableManager = variableManager;
        this.ensurePlayerStartObject();
    }

    setGame(game) {
        this.game = game;
        this.ensurePlayerStartObject();
    }

    setWorldManager(worldManager) {
        this.worldManager = worldManager;
    }

    setVariableManager(variableManager) {
        this.variableManager = variableManager;
    }

    normalizeObjects(objects) {
        if (!Array.isArray(objects)) return [];
        const allowedTypes = new Set(PLACEABLE_OBJECT_TYPES);
        let playerStartIncluded = false;
        const playerEndRooms = new Set();
        return objects
            .map((object) => {
                const sourceType = typeof object?.type === 'string' ? object.type : null;
                if (!allowedTypes.has(sourceType)) return null;
                const type = sourceType;
                const roomIndex = this.worldManager.clampRoomIndex(object?.roomIndex ?? 0);
                if (type === PLAYER_START_TYPE) {
                    if (playerStartIncluded) return null;
                    playerStartIncluded = true;
                }
                if (type === PLAYER_END_TYPE) {
                    if (playerEndRooms.has(roomIndex)) return null;
                    playerEndRooms.add(roomIndex);
                }
                const x = this.worldManager.clampCoordinate(object?.x ?? 0);
                const y = this.worldManager.clampCoordinate(object?.y ?? 0);
                const id = typeof object?.id === 'string' && object.id.trim()
                    ? object.id.trim()
                    : this.generateObjectId(type, roomIndex);
                const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
                const needsVariable = type === 'door-variable' || type === SWITCH_TYPE;
                const normalizedVariable = needsVariable
                    ? (this.variableManager?.normalizeVariableId?.(object?.variableId) ?? fallbackVariableId)
                    : null;

                const base = {
                    id,
                    type,
                    roomIndex,
                    x,
                    y,
                    collected: COLLECTIBLE_OBJECT_TYPES.has(type) ? Boolean(object?.collected) : false,
                    opened: type === 'door' ? Boolean(object?.opened) : false,
                    variableId: normalizedVariable
                };
                if (type === SWITCH_TYPE) {
                    base.on = Boolean(object?.on);
                }
                if (type === PLAYER_END_TYPE) {
                    base.endingText = this.normalizePlayerEndText(object?.endingText);
                }
                return base;
            })
            .filter(Boolean);
    }

    normalizePlayerEndText(value) {
        if (typeof value !== 'string') return '';
        const normalized = value.replace(/\r\n/g, '\n');
        const sliced = normalized.slice(0, PLAYER_END_TEXT_LIMIT);
        return sliced.trim();
    }

    resetRuntime() {
        const objects = this.getObjects();
        objects.forEach((object) => {
            if (COLLECTIBLE_OBJECT_TYPES.has(object.type)) {
                object.collected = false;
            }
            if (object.type === 'door') {
                object.opened = false;
            }
            if (object.type === SWITCH_TYPE) {
                object.on = false;
            }
        });
        this.ensurePlayerStartObject();
    }

    generateObjectId(type, roomIndex) {
        if (type === PLAYER_START_TYPE) {
            return PLAYER_START_TYPE;
        }
        return `${type}-${roomIndex}`;
    }

    getObjects() {
        if (!this.game) return [];
        if (!Array.isArray(this.game.objects)) {
            this.game.objects = [];
        }
        return this.game.objects;
    }

    getObjectsForRoom(roomIndex) {
        const target = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        return this.getObjects().filter((object) => object.roomIndex === target);
    }

    getObjectAt(roomIndex, x, y) {
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        const cx = this.worldManager.clampCoordinate(x ?? 0);
        const cy = this.worldManager.clampCoordinate(y ?? 0);
        return this.getObjects().find((object) =>
            object.roomIndex === targetRoom &&
            object.x === cx &&
            object.y === cy
        ) || null;
    }

    setObjectPosition(type, roomIndex, x, y) {
        const normalizedType = PLACEABLE_OBJECT_TYPES.includes(type) ? type : null;
        if (!normalizedType) return null;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        const cx = this.worldManager.clampCoordinate(x ?? 0);
        const cy = this.worldManager.clampCoordinate(y ?? 0);
        const objects = this.getObjects();
        let entry = null;
        if (normalizedType === PLAYER_START_TYPE) {
            entry = objects.find((object) => object.type === normalizedType) || null;
        } else {
            entry = objects.find((object) =>
                object.type === normalizedType && object.roomIndex === targetRoom
            ) || null;
        }
        if (!entry) {
            entry = {
                id: this.generateObjectId(normalizedType, targetRoom),
                type: normalizedType,
                roomIndex: targetRoom,
                x: cx,
                y: cy
            };
            if (normalizedType === SWITCH_TYPE) {
                entry.on = false;
            }
            if (normalizedType === PLAYER_END_TYPE) {
                entry.endingText = '';
            }
            objects.push(entry);
        } else {
            entry.roomIndex = targetRoom;
            entry.x = cx;
            entry.y = cy;
        }
        if (COLLECTIBLE_OBJECT_TYPES.has(normalizedType)) {
            entry.collected = false;
        }
        if (normalizedType === 'door') {
            entry.opened = false;
        }
        if (normalizedType === 'door-variable') {
            const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
            entry.variableId = this.variableManager?.normalizeVariableId?.(entry.variableId) ?? fallbackVariableId;
        }
        if (normalizedType === PLAYER_START_TYPE) {
            this.syncPlayerStart(entry);
        }
        if (normalizedType === SWITCH_TYPE) {
            const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
            entry.variableId = this.variableManager?.normalizeVariableId?.(entry.variableId) ?? fallbackVariableId;
            entry.on = Boolean(entry.on);
        }
        if (normalizedType === PLAYER_END_TYPE) {
            entry.endingText = this.normalizePlayerEndText(entry.endingText ?? '');
        }
        return entry;
    }

    removeObject(type, roomIndex) {
        const normalizedType = PLACEABLE_OBJECT_TYPES.includes(type) ? type : null;
        if (!normalizedType || normalizedType === PLAYER_START_TYPE) return;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        this.game.objects = this.getObjects().filter((object) =>
            !(object.type === normalizedType && object.roomIndex === targetRoom)
        );
    }

    setObjectVariable(type, roomIndex, variableId) {
        if (type !== 'door-variable' && type !== SWITCH_TYPE) return null;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        const entry = this.getObjects().find((object) =>
            object.type === type &&
            object.roomIndex === targetRoom
        );
        if (!entry) return null;
        const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
        const normalized = this.variableManager?.normalizeVariableId?.(variableId);
        entry.variableId = normalized ?? fallbackVariableId;
        return entry.variableId;
    }

    syncSwitchState(variableId, value) {
        if (!variableId) return false;
        let changed = false;
        const normalized = this.variableManager?.normalizeVariableId?.(variableId) ?? null;
        if (!normalized) return false;
        const desired = Boolean(value);
        this.getObjects().forEach((object) => {
            if (object.type === SWITCH_TYPE && object.variableId === normalized) {
                if (object.on !== desired) {
                    object.on = desired;
                    changed = true;
                }
            }
        });
        return changed;
    }

    ensurePlayerStartObject() {
        if (!this.game || !this.worldManager) return null;
        const objects = this.getObjects();
        const start = this.game.start || { x: 1, y: 1, roomIndex: 0 };
        const roomIndex = this.worldManager.clampRoomIndex(start?.roomIndex ?? 0);
        const x = this.worldManager.clampCoordinate(start?.x ?? 1);
        const y = this.worldManager.clampCoordinate(start?.y ?? 1);
        let marker = objects.find((object) => object.type === PLAYER_START_TYPE);
        if (!marker) {
            marker = {
                id: PLAYER_START_TYPE,
                type: PLAYER_START_TYPE,
                roomIndex,
                x,
                y
            };
            objects.unshift(marker);
        } else {
            marker.roomIndex = roomIndex;
            marker.x = x;
            marker.y = y;
        }
        return marker;
    }

    getPlayerEndObject(roomIndex = null) {
        const objects = this.getObjects();
        if (roomIndex === null || roomIndex === undefined) {
            return objects.find((object) => object.type === PLAYER_END_TYPE) || null;
        }
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        return objects.find((object) =>
            object.type === PLAYER_END_TYPE && object.roomIndex === targetRoom
        ) || null;
    }

    getPlayerEndText(roomIndex = null) {
        const entry = this.getPlayerEndObject(roomIndex);
        return typeof entry?.endingText === 'string' ? entry.endingText : '';
    }

    setPlayerEndText(roomIndex, text) {
        const entry = this.getPlayerEndObject(roomIndex);
        if (!entry) return '';
        const normalized = this.normalizePlayerEndText(text);
        entry.endingText = normalized;
        return normalized;
    }

    syncPlayerStart(entry) {
        if (!entry || !this.worldManager || !this.game) return;
        const x = this.worldManager.clampCoordinate(entry?.x ?? 0);
        const y = this.worldManager.clampCoordinate(entry?.y ?? 0);
        const roomIndex = this.worldManager.clampRoomIndex(entry?.roomIndex ?? 0);
        this.game.start = { x, y, roomIndex };
        entry.x = x;
        entry.y = y;
        entry.roomIndex = roomIndex;
    }

    checkOpenedMagicDoor(variableId, value) {
        for (const object of this.getObjects()) {
            if (value && object.type == 'door-variable' && object.variableId == variableId) {
                return true;
            }
        }
        return false;
    }
}

if (typeof window !== 'undefined') {
    window.StateObjectManager = StateObjectManager;
}
