class StateObjectManager {
    constructor(game, worldManager, variableManager) {
        this.game = game;
        this.worldManager = worldManager;
        this.variableManager = variableManager;
    }

    setGame(game) {
        this.game = game;
    }

    setWorldManager(worldManager) {
        this.worldManager = worldManager;
    }

    setVariableManager(variableManager) {
        this.variableManager = variableManager;
    }

    normalizeObjects(objects) {
        if (!Array.isArray(objects)) return [];
        const allowedTypes = new Set(['door', 'door-variable', 'key', 'life-potion', 'xp-scroll', 'sword']);
        return objects
            .map((object) => {
                const sourceType = typeof object?.type === 'string' ? object.type : null;
                if (!allowedTypes.has(sourceType)) return null;
                const type = sourceType;
                const roomIndex = this.worldManager.clampRoomIndex(object?.roomIndex ?? 0);
                const x = this.worldManager.clampCoordinate(object?.x ?? 0);
                const y = this.worldManager.clampCoordinate(object?.y ?? 0);
                const id = typeof object?.id === 'string' && object.id.trim()
                    ? object.id.trim()
                    : this.generateObjectId(type, roomIndex);
                const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
                const normalizedVariable = type === 'door-variable'
                    ? (this.variableManager?.normalizeVariableId?.(object?.variableId) ?? fallbackVariableId)
                    : null;

                return {
                    id,
                    type,
                    roomIndex,
                    x,
                    y,
                    collected: (type === 'key' || type === 'life-potion' || type === 'xp-scroll' || type === 'sword') ? Boolean(object?.collected) : false,
                    opened: type === 'door' ? Boolean(object?.opened) : false,
                    variableId: normalizedVariable
                };
            })
            .filter(Boolean);
    }

    resetRuntime() {
        if (!this.game?.objects) return;
        this.game.objects.forEach((object) => {
            if (object.type === 'key' || object.type === 'life-potion' || object.type === 'xp-scroll' || object.type === 'sword') {
                object.collected = false;
            }
            if (object.type === 'door') {
                object.opened = false;
            }
        });
    }

    generateObjectId(type, roomIndex) {
        return `${type}-${roomIndex}`;
    }

    getObjects() {
        return this.game?.objects ?? [];
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
        const normalizedType = ['door', 'door-variable', 'key', 'life-potion', 'xp-scroll', 'sword'].includes(type) ? type : null;
        if (!normalizedType) return null;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        const cx = this.worldManager.clampCoordinate(x ?? 0);
        const cy = this.worldManager.clampCoordinate(y ?? 0);
        let entry = this.getObjects().find((object) =>
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
        if (normalizedType === 'key' || normalizedType === 'life-potion' || normalizedType === 'xp-scroll' || normalizedType === 'sword') {
            entry.collected = false;
        }
        if (normalizedType === 'door') {
            entry.opened = false;
        }
        if (normalizedType === 'door-variable') {
            const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
            entry.variableId = this.variableManager?.normalizeVariableId?.(entry.variableId) ?? fallbackVariableId;
        }
        return entry;
    }

    removeObject(type, roomIndex) {
        const normalizedType = ['door', 'door-variable', 'key', 'life-potion', 'xp-scroll', 'sword'].includes(type) ? type : null;
        if (!normalizedType) return;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        this.game.objects = this.getObjects().filter((object) =>
            !(object.type === normalizedType && object.roomIndex === targetRoom)
        );
    }

    setObjectVariable(type, roomIndex, variableId) {
        if (type !== 'door-variable') return null;
        const targetRoom = this.worldManager.clampRoomIndex(roomIndex ?? 0);
        const entry = this.getObjects().find((object) =>
            object.type === 'door-variable' &&
            object.roomIndex === targetRoom
        );
        if (!entry) return null;
        const fallbackVariableId = this.variableManager?.getFirstVariableId?.() ?? null;
        const normalized = this.variableManager?.normalizeVariableId?.(variableId);
        entry.variableId = normalized ?? fallbackVariableId;
        return entry.variableId;
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
