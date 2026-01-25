
class EditorRendererBase {
    constructor(service) {
        this.service = service;
    }

    get manager() {
        return this.service.manager;
    }

    get dom() {
        return this.service.dom;
    }

    get state() {
        return this.service.state;
    }

    get gameEngine() {
        return this.service.gameEngine;
    }

    t(key, fallback = '') {
        return this.service.t(key, fallback);
    }

    tf(key, params = {}, fallback = '') {
        return this.service.tf(key, params, fallback);
    }
}

export { EditorRendererBase };
