class EditorManagerModule {
    constructor(manager) {
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

if (typeof window !== 'undefined') {
    window.EditorManagerModule = EditorManagerModule;
}
