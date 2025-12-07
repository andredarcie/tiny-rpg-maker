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

    get picoPalette() {
        if (typeof TileDefinitions !== 'undefined' && TileDefinitions?.PICO8_COLORS) {
            return TileDefinitions.PICO8_COLORS;
        }
        if (typeof window !== 'undefined' && window.PICO8_COLORS) {
            return window.PICO8_COLORS;
        }
        return [];
    }

    resolvePicoColor(raw) {
        const palette = this.picoPalette;
        if (!palette.length) return raw || '#000000';
        if (Number.isInteger(raw)) {
            return palette[raw] ?? palette[0];
        }
        if (typeof raw !== 'string') return palette[0];
        const normalize = (value) => String(value || '').replace('#', '').trim().toUpperCase();
        const target = normalize(raw);
        const idx = palette.findIndex((color) => normalize(color) === target);
        if (idx !== -1) return palette[idx];
        return palette[0];
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

    renderVariableUsage() {
        const list = this.dom.projectVariableList;
        if (!list) return;
        const container = this.dom.projectVariablesContainer;
        const toggle = this.dom.projectVariablesToggle;
        list.innerHTML = '';

        const variables = this.gameEngine?.getVariableDefinitions?.() ?? [];
        const usedSet = this.collectVariableUsage();
        const usedCount = variables.reduce(
            (count, variable) => count + (usedSet.has(variable.id) ? 1 : 0),
            0
        );
        const usageText = this.tf(
            'project.variables.usage',
            { used: usedCount, total: variables.length },
            `${usedCount}/${variables.length}`
        );

        const collapsed = Boolean(this.state.variablePanelCollapsed);
        if (toggle) {
            const actionText = collapsed
                ? this.t('project.variables.toggle.show', 'Mostrar variáveis')
                : this.t('project.variables.toggle.hide', 'Esconder variáveis');
            toggle.textContent = `${usageText} · ${actionText}`;
        }
        if (container) {
            container.classList.toggle('is-collapsed', collapsed);
        }

        if (!variables.length) {
            const empty = document.createElement('div');
            empty.className = 'project-variable-item';
            const label = document.createElement('span');
            label.className = 'project-variable-name';
            label.textContent = this.t('variables.none', 'Nenhuma');
            empty.appendChild(label);
            list.appendChild(empty);
            return;
        }

        variables.forEach((variable) => {
            const item = document.createElement('div');
            item.className = 'project-variable-item';

            const color = document.createElement('span');
            color.className = 'project-variable-color';
            color.style.background = this.resolvePicoColor(variable.color);

            const name = document.createElement('span');
            name.className = 'project-variable-name';
            name.textContent = variable.name || variable.id;

            const badge = document.createElement('span');
            const inUse = usedSet.has(variable.id);
            badge.className = `project-variable-badge ${inUse ? 'in-use' : 'unused'}`;
            badge.textContent = inUse
                ? this.t('project.variables.used', 'Em uso')
                : this.t('project.variables.unused', 'Sem uso');

            item.append(color, name, badge);
            list.appendChild(item);
        });
    }

    collectVariableUsage() {
        const used = new Set();
        const game = this.gameEngine?.getGame?.() || {};
        const variables = this.gameEngine?.getVariableDefinitions?.() ?? [];
        const validIds = new Set(variables.map((variable) => variable.id));
        const addIfValid = (id) => {
            if (typeof id !== 'string') return;
            const normalized = id.trim();
            if (normalized && validIds.has(normalized)) {
                used.add(normalized);
            }
        };

        const sprites = Array.isArray(game.sprites) ? game.sprites : [];
        sprites.forEach((npc) => {
            [
                npc.conditionVariableId,
                npc.conditionalVariableId,
                npc.rewardVariableId,
                npc.activateVariableId,
                npc.onCompleteVariableId,
                npc.conditionalRewardVariableId,
                npc.alternativeRewardVariableId
            ].forEach(addIfValid);
        });

        const enemies = Array.isArray(game.enemies) ? game.enemies : [];
        enemies.forEach((enemy) => addIfValid(enemy.defeatVariableId));

        const objects = Array.isArray(game.objects) ? game.objects : [];
        objects.forEach((object) => addIfValid(object.variableId));

        return used;
    }
}

if (typeof window !== 'undefined') {
    window.EditorRenderService = EditorRenderService;
}
