
import { EnemyDefinitions } from '../../core/EnemyDefinitions';
import { ObjectDefinitions } from '../../core/ObjectDefinitions';

class EditorConstants {
    static get OBJECT_DEFINITIONS() {
        if (!this._objectDefinitions) {
            this._objectDefinitions = ObjectDefinitions.definitions || [];
        }
        return this._objectDefinitions;
    }

    static get ENEMY_DEFINITIONS() {
        if (!this._enemyDefinitions || !this._enemyDefinitions.length) {
            this._enemyDefinitions = EnemyDefinitions.definitions || [];
        }
        return this._enemyDefinitions || [];
    }

    static get OBJECT_TYPE_ORDER() {
        return ObjectDefinitions.getEditorTypeOrder();
    }
}

export { EditorConstants };
