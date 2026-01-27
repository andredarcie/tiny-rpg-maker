import type { EditorManager } from '../EditorManager';

class EditorManagerModule {
    manager: EditorManager;

    constructor(manager: EditorManager) {
        this.manager = manager;
    }

    get gameEngine() {
        return this.manager.gameEngine;
    }

    get state() {
        return this.manager.state;
    }

    get dom() {
        return this.manager.dom;
    }

    get renderService() {
        return this.manager.renderService;
    }
}

export { EditorManagerModule };
