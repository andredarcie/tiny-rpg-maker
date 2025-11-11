class EditorConstants {
    static get OBJECT_DEFINITIONS() {
        if (!this._objectDefinitions) {
            if (typeof window !== 'undefined' && window.ObjectDefinitions) {
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
        return ['player-start', 'player-end', 'switch', 'door', 'door-variable', 'key', 'life-potion', 'sword', 'xp-scroll'];
    }
}

if (typeof window !== 'undefined') {
    window.EditorConstants = EditorConstants;
}
