
import { EnemyDefinitions } from '../../runtime/domain/definitions/EnemyDefinitions';
import { ItemDefinitions } from '../../runtime/domain/definitions/ItemDefinitions';

class EditorConstants {
    static get OBJECT_DEFINITIONS() {
        if (!this._objectDefinitions) {
            this._objectDefinitions = ItemDefinitions.definitions || [];
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
        return ItemDefinitions.getEditorTypeOrder();
    }
}

export { EditorConstants };
