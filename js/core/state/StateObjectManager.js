const PLAYER_END_TEXT_LIMIT = 40;

class StateObjectManager {
    static get TYPES() {
        return typeof ObjectTypes !== 'undefined' ? ObjectTypes : {};
    }

    get types() {
        return StateObjectManager.TYPES;
    }

    static get PLAYER_START_TYPE() {
        return this.TYPES.PLAYER_START;
    }

    static get PLAYER_END_TYPE() {
        return this.TYPES.PLAYER_END;
    }

    static get SWITCH_TYPE() {
        return this.TYPES.SWITCH;
    }

    static get PLACEABLE_OBJECT_TYPES() {
        const OT = this.TYPES;
        return [
            OT.DOOR,
            OT.DOOR_VARIABLE,
            OT.KEY,
            OT.LIFE_POTION,
            OT.XP_SCROLL,
            OT.SWORD,
            OT.SWORD_BRONZE,
            OT.SWORD_WOOD,
            OT.PLAYER_START,
            OT.PLAYER_END,
            OT.SWITCH
        ].filter(Boolean);
    }

    static get COLLECTIBLE_OBJECT_TYPES() {
        const OT = this.TYPES;
        return new Set(
            [OT.KEY, OT.LIFE_POTION, OT.XP_SCROLL, OT.SWORD, OT.SWORD_BRONZE, OT.SWORD_WOOD].filter(Boolean)
        );
    }

    static get PLAYER_END_TEXT_LIMIT() {
        return PLAYER_END_TEXT_LIMIT;
    }

    get types() {
        return ObjectTypes;
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
        const OT = this.types;
        const allowedTypes = new Set(StateObjectManager.PLACEABLE_OBJECT_TYPES);
        let playerStartIncluded = false;
        const playerEndRooms = new Set();
        return objects
            .map((object) => {
                const sourceType = typeof object?.type === 'string' ? object.type : null;
                if (!allowedTypes.has(sourceType)) return null;
                const type = sourceType;
                const roomIndex = this.worldManager.clampRoomIndex(object?.roomIndex ?? 0);
                if (type === StateObjectManager.PLAYER_START_TYPE) {
                    if (playerStartIncluded) return null;
                    playerStartIncluded = true;
                }
                if (type === StateObjectManager.PLAYER_END_TYPE) {
                    if (playerEndRooms.has(roomIndex)) return null;
                    playerEndRooms.add(roomIndex);
                }
                const x = this.worldManager.clampCoordinate(object?.x ?? 0);
                const y = this.worldManager.clampCoordinate(object?.y ?? 0);
                const id = typeof object?.id === 'string' && object.id.trim()
                    ? object.id.trim()
                    : this.generateObjectId(type, roomIndex);
                const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
                const needsVariable = type === OT.DOOR_VARIABLE || type === StateObjectManager.SWITCH_TYPE;
                const normalizedVariable = needsVariable
                    ? (this.variableManager?.normalizeVariableId?.(object?.variableId) ?? fallbackVariableId)
                    : null;

                const base = {
                    id,
                    type,
                    roomIndex,
                    x,
                    y,
                    collected: StateObjectManager.COLLECTIBLE_OBJECT_TYPES.has(type) ? Boolean(object?.collected) : false,
                    opened: type === OT.DOOR ? Boolean(object?.opened) : false,
                    variableId: normalizedVariable
                };
                if (type === StateObjectManager.SWITCH_TYPE) {
                    base.on = Boolean(object?.on);
                }
                if (type === StateObjectManager.PLAYER_END_TYPE) {
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
        const OT = this.types;
        const objects = this.getObjects();
        objects.forEach((object) => {
            if (StateObjectManager.COLLECTIBLE_OBJECT_TYPES.has(object.type)) {
                object.collected = false;
            }
            if (object.type === OT.DOOR) {
                object.opened = false;
            }
            if (object.type === StateObjectManager.SWITCH_TYPE) {
                object.on = false;
            }
        });
        this.ensurePlayerStartObject();
    }

    generateObjectId(type, roomIndex) {
        if (type === StateObjectManager.PLAYER_START_TYPE) {
            return StateObjectManager.PLAYER_START_TYPE;
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
        const OT = this.types;
        const placeableTypes = StateObjectManager.PLACEABLE_OBJECT_TYPES;
        const normalizedType = placeableTypes.includes(type) ? type : null;
        if (!normalizedType) return null;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        const cx = this.worldManager.clampCoordinate(x ?? 0);
        const cy = this.worldManager.clampCoordinate(y ?? 0);
        const objects = this.getObjects();
        let entry = null;
        if (normalizedType === StateObjectManager.PLAYER_START_TYPE) {
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
            if (normalizedType === StateObjectManager.SWITCH_TYPE) {
                entry.on = false;
            }
            if (normalizedType === StateObjectManager.PLAYER_END_TYPE) {
                entry.endingText = '';
            }
            objects.push(entry);
        } else {
            entry.roomIndex = targetRoom;
            entry.x = cx;
            entry.y = cy;
        }
        if (StateObjectManager.COLLECTIBLE_OBJECT_TYPES.has(normalizedType)) {
            entry.collected = false;
        }
        if (normalizedType === OT.DOOR) {
            entry.opened = false;
        }
        if (normalizedType === OT.DOOR_VARIABLE) {
            const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
            entry.variableId = this.variableManager?.normalizeVariableId?.(entry.variableId) ?? fallbackVariableId;
        }
        if (normalizedType === StateObjectManager.PLAYER_START_TYPE) {
            this.syncPlayerStart(entry);
        }
        if (normalizedType === StateObjectManager.SWITCH_TYPE) {
            const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
            entry.variableId = this.variableManager?.normalizeVariableId?.(entry.variableId) ?? fallbackVariableId;
            entry.on = Boolean(entry.on);
        }
        if (normalizedType === StateObjectManager.PLAYER_END_TYPE) {
            entry.endingText = this.normalizePlayerEndText(entry.endingText ?? '');
        }
        return entry;
    }

    removeObject(type, roomIndex) {
        const placeableTypes = StateObjectManager.PLACEABLE_OBJECT_TYPES;
        const normalizedType = StateObjectManager.PLACEABLE_OBJECT_TYPES.includes(type) ? type : null;
        if (!normalizedType || normalizedType === StateObjectManager.PLAYER_START_TYPE) return;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        this.game.objects = this.getObjects().filter((object) =>
            !(object.type === normalizedType && object.roomIndex === targetRoom)
        );
    }

    setObjectVariable(type, roomIndex, variableId) {
        const OT = this.types;
        if (type !== OT.DOOR_VARIABLE && type !== StateObjectManager.SWITCH_TYPE) return null;
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
            if (object.type === StateObjectManager.SWITCH_TYPE && object.variableId === normalized) {
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
        let marker = objects.find((object) => object.type === StateObjectManager.PLAYER_START_TYPE);
        if (!marker) {
            marker = {
                id: StateObjectManager.PLAYER_START_TYPE,
                type: StateObjectManager.PLAYER_START_TYPE,
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
            return objects.find((object) => object.type === StateObjectManager.PLAYER_END_TYPE) || null;
        }
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        return objects.find((object) =>
            object.type === StateObjectManager.PLAYER_END_TYPE && object.roomIndex === targetRoom
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
            if (value && object.type == OT.DOOR_VARIABLE && object.variableId == variableId) {
                return true;
            }
        }
        return false;
    }
}

if (typeof window !== 'undefined') {
    window.StateObjectManager = StateObjectManager;
}
