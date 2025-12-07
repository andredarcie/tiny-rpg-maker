const getVariableText = (key, fallback = '') => {
    const value = TextResources.get(key, fallback);
    return value || fallback || key || '';
};

const createVariablePreset = (id, order, nameKey, fallbackName, color) =>
    Object.freeze({ id, order, nameKey, fallbackName, color });

const STATE_VARIABLE_PRESETS = Object.freeze([
    createVariablePreset('var-1', 1, 'variables.names.var1', '', '#000000'),
    createVariablePreset('var-2', 2, 'variables.names.var2', '', '#1D2B53'),
    createVariablePreset('var-3', 3, 'variables.names.var3', '', '#7E2553'),
    createVariablePreset('var-4', 4, 'variables.names.var4', '', '#008751'),
    createVariablePreset('var-5', 5, 'variables.names.var5', '', '#AB5236'),
    createVariablePreset('var-6', 6, 'variables.names.var6', '', '#5F574F'),
    createVariablePreset('var-7', 7, 'variables.names.var7', '', '#29ADFF'),
    createVariablePreset('var-8', 8, 'variables.names.var8', '', '#FF77A8'),
    createVariablePreset('var-9', 9, 'variables.names.var9', '', '#FFFF27')
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
                name: typeof current.name === 'string' && current.name.trim()
                    ? current.name.trim()
                    : this.getPresetDefaultName(preset),
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
        // Allow special skill-based conditions (e.g., bard dialogue)
        const allowedSpecials = new Set(['skill:bard']);
        if (allowedSpecials.has(variableId)) return variableId;
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

    getPresetDefaultName(preset) {
        if (!preset) return '';
        const fallback = preset.fallbackName || preset.name || '';
        if (preset.nameKey) {
            return getVariableText(preset.nameKey, fallback);
        }
        return fallback;
    }

    static get PRESETS() {
        return STATE_VARIABLE_PRESETS;
    }
}

if (typeof window !== 'undefined') {
    window.StateVariableManager = StateVariableManager;
}
