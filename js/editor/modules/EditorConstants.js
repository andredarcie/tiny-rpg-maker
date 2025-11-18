class EditorConstants {
    static get OBJECT_DEFINITIONS() {
        if (!this._objectDefinitions) {
            if (typeof window !== 'undefined' && window.ObjectDefinitions) {
                if (!window.ObjectTypes && window.ObjectDefinitions.TYPES) {
                    window.ObjectTypes = window.ObjectDefinitions.TYPES;
                }
                this._objectDefinitions =
                    window.ObjectDefinitions.definitions ||
                    window.ObjectDefinitions.OBJECT_DEFINITIONS ||
                    [];
            } else {
                this._objectDefinitions = [];
            }
        }
        return this._objectDefinitions;
    }

    static get ENEMY_DEFINITIONS() {
        const hasWindowDefinitions = typeof window !== 'undefined' && window.EnemyDefinitions;
        if (!this._enemyDefinitions || (hasWindowDefinitions && !this._enemyDefinitions.length)) {
            if (hasWindowDefinitions) {
                this._enemyDefinitions =
                    window.EnemyDefinitions.definitions ||
                    window.EnemyDefinitions.ENEMY_DEFINITIONS ||
                    [];
            } else if (!this._enemyDefinitions) {
                this._enemyDefinitions = [];
            }
        }
        return this._enemyDefinitions || [];
    }

    static get OBJECT_TYPE_ORDER() {
        const OT = window.ObjectTypes;
        return [
            OT.PLAYER_START,
            OT.PLAYER_END,
            OT.SWITCH,
            OT.DOOR,
            OT.DOOR_VARIABLE,
            OT.KEY,
            OT.LIFE_POTION,
            OT.SWORD,
            OT.SWORD_BRONZE,
            OT.SWORD_WOOD,
            OT.XP_SCROLL
        ].filter(Boolean);
    }
}

if (typeof window !== 'undefined') {
    window.EditorConstants = EditorConstants;
}
