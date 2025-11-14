class EditorRenderService {
    constructor(editorManager) {
        this.manager = editorManager;
        this.canvasRenderer = new EditorCanvasRenderer(this);
        this.tilePanelRenderer = new EditorTilePanelRenderer(this);
        this.npcRenderer = new EditorNpcRenderer(this);
        this.enemyRenderer = new EditorEnemyRenderer(this);
        this.worldRenderer = new EditorWorldRenderer(this);
        this.objectRenderer = new EditorObjectRenderer(this);
        this.handleTileAnimationFrame = () => {
            this.renderEditor();
            this.updateSelectedTilePreview();
        };
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('tile-animation-frame', this.handleTileAnimationFrame);
        }
    }

    get textResources() {
        return typeof TextResources !== 'undefined' ? TextResources : null;
    }

    t(key, fallback = '') {
        const resource = this.textResources;
        const value = resource?.get?.(key, fallback);
        if (value) return value;
        if (fallback) return fallback;
        return key || '';
    }

    tf(key, params = {}, fallback = '') {
        const resource = this.textResources;
        if (resource?.format) {
            return resource.format(key, params, fallback);
        }
        const template = this.t(key, fallback);
        if (!template) return '';
        return template.replace(/\{(\w+)\}/g, (_, token) => (params[token] ?? ''));
    }

    get dom() {
        return this.manager.domCache;
    }

    get gameEngine() {
        return this.manager.gameEngine;
    }

    get state() {
        return this.manager.state;
    }

    renderEditor() {
        this.canvasRenderer.renderEditor();
        this.worldRenderer.renderMapNavigation();
    }

    renderTileList() {
        this.tilePanelRenderer.renderTileList();
    }

    renderNpcs() {
        this.npcRenderer.renderNpcs();
    }

    updateNpcForm() {
        this.npcRenderer.updateNpcForm();
    }

    renderEnemies() {
        this.enemyRenderer.renderEnemies();
    }

    renderEnemyCatalog() {
        this.enemyRenderer.renderEnemyCatalog();
    }

    renderObjectCatalog() {
        this.objectRenderer.renderObjectCatalog();
    }

    renderObjects() {
        this.objectRenderer.renderObjects();
    }

    renderWorldGrid() {
        this.worldRenderer.renderWorldGrid();
    }

    renderMapNavigation() {
        this.worldRenderer.renderMapNavigation();
    }

    updateMapPosition(col, row) {
        this.worldRenderer.updateMapPosition(col, row);
    }

    updateSelectedTilePreview() {
        this.tilePanelRenderer.updateSelectedTilePreview();
    }
}

if (typeof window !== 'undefined') {
    window.EditorRenderService = EditorRenderService;
}
