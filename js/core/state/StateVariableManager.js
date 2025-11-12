const STATE_VARIABLE_PRESETS = Object.freeze([
    { id: 'var-1', order: 1, name: '1 - Preto', color: '#000000' },
    { id: 'var-2', order: 2, name: '2 - Azul Escuro', color: '#1D2B53' },
    { id: 'var-3', order: 3, name: '3 - Roxo', color: '#7E2553' },
    { id: 'var-4', order: 4, name: '4 - Verde', color: '#008751' },
    { id: 'var-5', order: 5, name: '5 - Marrom', color: '#AB5236' },
    { id: 'var-6', order: 6, name: '6 - Cinza', color: '#5F574F' },
    { id: 'var-7', order: 7, name: '7 - Azul Claro', color: '#C2C3C7' },
    { id: 'var-8', order: 8, name: '8 - Rosa Choque', color: '#FF77A8' },
    { id: 'var-9', order: 9, name: '9 - Amarelo', color: '#FFCCAA' }
]);

class StateVariableManager {
    constructor(game, state, presets = STATE_VARIABLE_PRESETS) {
        this.game = game;
        this.state = state;
        this.presets = presets;
    }

    setGame(game) {
        this.game = game;
    }

    setState(state) {
        this.state = state;
    }

    ensureDefaultVariables() {
        if (!this.game) return [];
        this.game.variables = this.normalizeVariables(this.game.variables);
        return this.game.variables;
    }

    resetRuntime() {
        if (!this.state) return [];
        this.state.variables = this.cloneVariables(this.game?.variables);
        return this.state.variables;
    }

    cloneVariables(list) {
        return (list || []).map((entry) => ({
            id: entry.id,
            order: entry.order,
            name: entry.name,
            color: entry.color,
            value: Boolean(entry.value)
        }));
    }

    normalizeVariables(source) {
        const incoming = Array.isArray(source) ? source : [];
        const byId = new Map(incoming.map((entry) => [entry?.id, entry]));
        return this.presets.map((preset) => {
            const current = byId.get(preset.id) || {};
            return {
                id: preset.id,
                order: preset.order,
                name: typeof current.name === 'string' && current.name.trim() ? current.name.trim() : preset.name,
                color: typeof current.color === 'string' && current.color.trim() ? current.color.trim() : preset.color,
                value: Boolean(current.value)
            };
        });
    }

    getVariableDefinitions() {
        return this.game?.variables ?? [];
    }

    getVariables() {
        return this.state?.variables ?? [];
    }

    normalizeVariableId(variableId) {
        if (typeof variableId !== 'string') return null;
        return this.getVariableDefinitions().some((variable) => variable.id === variableId) ? variableId : null;
    }

    getVariable(variableId) {
        if (!variableId) return null;
        return this.getVariables().find((variable) => variable.id === variableId) || null;
    }

    isVariableOn(variableId) {
        const entry = this.getVariable(variableId);
        return entry ? Boolean(entry.value) : false;
    }

    setVariableValue(variableId, value, persist = false) {
        let updated = false;
        this.getVariables().forEach((variable) => {
            if (variable.id === variableId) {
                const next = Boolean(value);
                if (variable.value !== next) {
                    variable.value = next;
                    updated = true;
                }
            }
        });
        if (persist) {
            this.getVariableDefinitions().forEach((variable) => {
                if (variable.id === variableId) {
                    const next = Boolean(value);
                    if (variable.value !== next) {
                        variable.value = next;
                        updated = true;
                    }
                }
            });
        }
        return updated;
    }

    getFirstVariableId() {
        return this.getVariableDefinitions()?.[0]?.id ?? this.presets?.[0]?.id ?? null;
    }

    static get PRESETS() {
        return STATE_VARIABLE_PRESETS;
    }
}

if (typeof window !== 'undefined') {
    window.StateVariableManager = StateVariableManager;
}
