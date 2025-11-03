class RendererConstants {
    static get NPC_DEFINITIONS() {
        const hasWindowDefinitions = typeof window !== 'undefined' && window.NPCDefinitions;
        if (!this._npcDefinitions || (hasWindowDefinitions && !this._npcDefinitions.length)) {
            if (hasWindowDefinitions) {
                this._npcDefinitions =
                    window.NPCDefinitions.definitions ||
                    window.NPCDefinitions.NPC_DEFINITIONS ||
                    [];
            } else if (!this._npcDefinitions) {
                this._npcDefinitions = [];
            }
        }
        return this._npcDefinitions || [];
    }

    static get OBJECT_DEFINITIONS() {
        const hasWindowDefinitions = typeof window !== 'undefined' && window.ObjectDefinitions;
        if (!this._objectDefinitions || (hasWindowDefinitions && !this._objectDefinitions.length)) {
            if (hasWindowDefinitions) {
                this._objectDefinitions =
                    window.ObjectDefinitions.definitions ||
                    window.ObjectDefinitions.OBJECT_DEFINITIONS ||
                    [];
            } else if (!this._objectDefinitions) {
                this._objectDefinitions = [];
            }
        }
        return this._objectDefinitions || [];
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

    static get DEFAULT_PALETTE() {
        return [
            "#000000", "#1D2B53", "#7E2553", "#008751",
            "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8",
            "#FF004D", "#FFA300", "#FFFF27", "#00E756",
            "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
        ];
    }
}

if (typeof window !== 'undefined') {
    window.RendererConstants = RendererConstants;
}
