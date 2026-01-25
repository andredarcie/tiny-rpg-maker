
type EditorRendererServiceApi = {
  manager: any;
  dom: any;
  state: any;
  gameEngine: any;
  t: (key: string, fallback?: string) => string;
  tf: (key: string, params?: Record<string, unknown>, fallback?: string) => string;
};

class EditorRendererBase {
    service: EditorRendererServiceApi;

    constructor(service: EditorRendererServiceApi) {
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

    tf(key: string, params: Record<string, unknown> = {}, fallback = ''): string {
        return this.service.tf(key, params, fallback);
    }
}

export { EditorRendererBase };
