import { EditorRenderService } from '../EditorRenderService';

class EditorRendererBase {
    service: EditorRenderService;

    constructor(service: EditorRenderService) {
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

    t(key: string, fallback = ''): string {
        return this.service.t(key, fallback);
    }

    tf(key: string, params: Record<string, string | number> = {}, fallback = ''): string {
        return this.service.tf(key, params, fallback);
    }
}

export { EditorRendererBase };
