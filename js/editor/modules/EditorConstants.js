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

    static get OBJECT_TYPE_ORDER() {
        return ['door', 'door-variable', 'key'];
    }
}

if (typeof window !== 'undefined') {
    window.EditorConstants = EditorConstants;
}

