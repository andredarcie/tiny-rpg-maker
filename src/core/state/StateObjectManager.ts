
import { ObjectDefinitions, OBJECT_TYPES } from '../ObjectDefinitions';
const PLAYER_END_TEXT_LIMIT = 40;

class StateObjectManager {
    static get TYPES() {
        return OBJECT_TYPES;
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
        return this.getPlaceableTypesArray();
    }

    static get COLLECTIBLE_OBJECT_TYPES() {
        return this.getCollectibleTypeSet();
    }

    static get PLAYER_END_TEXT_LIMIT() {
        return PLAYER_END_TEXT_LIMIT;
    }

    static getPlaceableTypesArray() {
        return ObjectDefinitions.getPlaceableTypes();
    }

    static getPlaceableTypeSet() {
        return new Set(this.getPlaceableTypesArray());
    }

    static getCollectibleTypeSet() {
        if (!this._collectibleSet) {
            this._collectibleSet = new Set(ObjectDefinitions.getCollectibleTypes());
        }
        return this._collectibleSet;
    }

    static isCollectibleType(type) {
        return ObjectDefinitions.isCollectible(type);
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
        const allowedTypes = StateObjectManager.getPlaceableTypeSet();
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
                const needsVariable = ObjectDefinitions.requiresVariable(type);
                const normalizedVariable = needsVariable
                    ? (this.variableManager?.normalizeVariableId?.(object?.variableId) ?? fallbackVariableId)
                    : null;

                const base = {
                    id,
                    type,
                    roomIndex,
                    x,
                    y,
                    collected: StateObjectManager.isCollectibleType(type) ? Boolean(object?.collected) : false,
                    opened: type === OT.DOOR ? Boolean(object?.opened) : false,
                    variableId: normalizedVariable
                };
                if (type === StateObjectManager.SWITCH_TYPE) {
                    base.on = Boolean(object?.on);
                }
                if (type === StateObjectManager.PLAYER_END_TYPE) {
                    base.endingText = this.normalizePlayerEndText(object?.endingText);
                }
                return this.applyObjectBehavior(base);
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
            if (object.isCollectible) {
                object.collected = false;
            }
            const isLockedDoor = Boolean(object.isLockedDoor);
            if (isLockedDoor) {
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
        this.game.objects.forEach((object) => this.applyObjectBehavior(object));
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
        const placeableTypes = StateObjectManager.getPlaceableTypeSet();
        const normalizedType = placeableTypes.has(type) ? type : null;
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
        if (StateObjectManager.isCollectibleType(normalizedType)) {
            entry.collected = false;
        }
        if (ObjectDefinitions.isLockedDoor(normalizedType)) {
            entry.opened = false;
        }
        if (ObjectDefinitions.isVariableDoor(normalizedType)) {
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
        return this.applyObjectBehavior(entry);
    }

    removeObject(type, roomIndex) {
        const placeableTypes = StateObjectManager.getPlaceableTypeSet();
        const normalizedType = placeableTypes.has(type) ? type : null;
        if (!normalizedType || normalizedType === StateObjectManager.PLAYER_START_TYPE) return;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        this.game.objects = this.getObjects().filter((object) =>
            !(object.type === normalizedType && object.roomIndex === targetRoom)
        );
    }

    setObjectVariable(type: string, roomIndex: number, variableId: string | null) {
        const handledByDefinition = ObjectDefinitions.requiresVariable(type);
        if (!handledByDefinition) return null;
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
        return this.applyObjectBehavior(marker);
    }

    getPlayerEndObject(roomIndex: number | null = null) {
        const objects = this.getObjects();
        if (roomIndex === null || roomIndex === undefined) {
            return objects.find((object) => object.type === StateObjectManager.PLAYER_END_TYPE) || null;
        }
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        return objects.find((object) =>
            object.type === StateObjectManager.PLAYER_END_TYPE && object.roomIndex === targetRoom
        ) || null;
    }

    getPlayerEndText(roomIndex: number | null = null) {
        const entry = this.getPlayerEndObject(roomIndex);
        return typeof entry?.endingText === 'string' ? entry.endingText : '';
    }

    setPlayerEndText(roomIndex: number, text: string) {
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

    applyObjectBehavior(entry) {
        if (!entry) return entry;
        const type = entry.type;
        const isCollectible = StateObjectManager.isCollectibleType(type);
        entry.isCollectible = isCollectible;
        entry.hideWhenCollected = ObjectDefinitions.shouldHideWhenCollected(type);
        entry.hiddenInRuntime = ObjectDefinitions.isHiddenInRuntime(type);
        entry.isLockedDoor = ObjectDefinitions.isLockedDoor(type);
        entry.hideWhenOpened = ObjectDefinitions.shouldHideWhenOpened(type);
        entry.isVariableDoor = ObjectDefinitions.isVariableDoor(type);
        entry.hideWhenVariableOpen = ObjectDefinitions.shouldHideWhenVariableOpen(type);
        entry.requiresVariable = ObjectDefinitions.requiresVariable(type);
        entry.swordDurability = ObjectDefinitions.getSwordDurability(type);
        return entry;
    }

    checkOpenedMagicDoor(variableId, value) {
        const OT = this.types;
        for (const object of this.getObjects()) {
            if (value && object.type == OT.DOOR_VARIABLE && object.variableId == variableId) {
                return true;
            }
        }
        return false;
    }
}

export { StateObjectManager };
