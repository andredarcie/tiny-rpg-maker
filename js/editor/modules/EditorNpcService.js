class EditorNpcService {
    constructor(editorManager) {
        this.manager = editorManager;
    }

    get gameEngine() {
        return this.manager.gameEngine;
    }

    get dom() {
        return this.manager.domCache;
    }

    get state() {
        return this.manager.state;
    }

    addNpc() {
        this.gameEngine.npcManager?.ensureDefaultNPCs?.();
        const sprites = this.gameEngine.getSprites();
        const definitions = this.gameEngine.npcManager?.getDefinitions?.() ?? [];
        const available = definitions
            .map((def) => ({
                def,
                npc: sprites.find((entry) => entry.type === def.type) || null
            }))
            .find((entry) => !entry.npc?.placed);

        if (!available) {
            alert('Todos os NPCs ja estao no mapa.');
            return;
        }

        const npc = available.npc;
        if (!npc) {
            const created = this.gameEngine.npcManager?.createNPC?.(available.def.type);
            if (!created) {
                alert('Nao foi possivel criar o NPC.');
                return;
            }
            this.state.selectedNpcId = created.id;
            this.state.selectedNpcType = created.type;
        } else {
            this.state.selectedNpcId = npc.id;
            this.state.selectedNpcType = npc.type;
        }

        this.activatePlacement();
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    activatePlacement() {
        if (!this.state.selectedNpcId) {
            alert('Selecione um NPC para colocar.');
            return;
        }
        if (this.state.placingNpc) return;

        this.manager.enemyService?.deactivatePlacement();
        if (this.state.placingObjectType) {
            this.manager.objectService?.togglePlacement?.(this.state.placingObjectType, true);
        }

        this.state.placingNpc = true;
        this.state.placingEnemy = false;
        this.state.placingObjectType = null;

        if (this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = 'crosshair';
        }
    }

    deactivatePlacement() {
        if (!this.state.placingNpc) return;
        this.state.placingNpc = false;
        if (!this.state.placingEnemy && !this.state.placingObjectType && this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = 'default';
        }
    }

    clearSelection({ render = true } = {}) {
        const hadSelection = Boolean(this.state.selectedNpcId || this.state.selectedNpcType);
        this.state.selectedNpcId = null;
        this.state.selectedNpcType = null;
        this.state.conditionalDialogueExpanded = false;
        this.deactivatePlacement();
        if (render && hadSelection) {
            this.manager.renderService.renderNpcs();
        }
    }

    removeSelectedNpc() {
        if (!this.state.selectedNpcId) return;
        const removed = this.gameEngine.npcManager?.removeNPC?.(this.state.selectedNpcId);
        if (!removed) return;

        this.clearSelection({ render: false });
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    updateNpcSelection(type, id) {
        if (!id) {
            this.clearSelection();
            return;
        }
        this.state.selectedNpcType = type;
        this.state.selectedNpcId = id;
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === id) || null;
        const hasConditionalData = Boolean(
            npc?.conditionText ||
            npc?.conditionVariableId ||
            npc?.conditionalRewardVariableId
        );
        this.state.conditionalDialogueExpanded = hasConditionalData;
        this.manager.renderService.renderNpcs();
        this.activatePlacement();
    }

    placeNpcAt(coord) {
        if (!this.state.selectedNpcId) {
            alert('Selecione um NPC para colocar.');
            this.deactivatePlacement();
            return;
        }
        const roomIndex = this.state.activeRoomIndex;
        const updated = this.gameEngine.npcManager?.setNPCPosition?.(
            this.state.selectedNpcId,
            coord.x,
            coord.y,
            roomIndex
        );
        if (!updated) {
            alert('Nao foi possivel posicionar o NPC.');
            return;
        }
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    populateVariableSelect(selectElement, selectedId = '') {
        if (!selectElement) return;
        const variables = this.gameEngine.getVariableDefinitions();
        selectElement.innerHTML = '';

        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Nenhuma';
        selectElement.appendChild(emptyOption);

        variables.forEach((variable) => {
            const option = document.createElement('option');
            option.value = variable.id;
            option.textContent = variable.name || variable.id;
            selectElement.appendChild(option);
        });

        selectElement.value = selectedId || '';
    }

    updateNpcText(text) {
        if (!this.state.selectedNpcId) return;
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.state.selectedNpcId);
        if (!npc) return;

        npc.text = text;
        this.manager.renderService.renderNpcs();
        this.manager.updateJSON();
        this.scheduleNpcTextUpdate();
    }

    updateNpcConditionalText(text) {
        if (!this.state.selectedNpcId) return;
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.state.selectedNpcId);
        if (!npc) return;
        npc.conditionText = text;
        this.manager.renderService.renderNpcs();
        this.manager.updateJSON();
        this.scheduleNpcTextUpdate();
    }

    scheduleNpcTextUpdate() {
        if (this.state.npcTextUpdateTimer) {
            clearTimeout(this.state.npcTextUpdateTimer);
        }
        this.state.npcTextUpdateTimer = setTimeout(() => {
            this.manager.history.pushCurrentState();
        }, 400);
    }

    handleConditionVariableChange(variableId) {
        if (!this.state.selectedNpcId) return;
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.state.selectedNpcId);
        if (!npc) return;
        npc.conditionVariableId = variableId || null;
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    handleRewardVariableChange(variableId) {
        if (!this.state.selectedNpcId) return;
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.state.selectedNpcId);
        if (!npc) return;
        npc.rewardVariableId = variableId || null;
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    handleConditionalRewardVariableChange(variableId) {
        if (!this.state.selectedNpcId) return;
        const npc = this.gameEngine.getSprites().find((entry) => entry.id === this.state.selectedNpcId);
        if (!npc) return;
        npc.conditionalRewardVariableId = variableId || null;
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }
}

if (typeof window !== 'undefined') {
    window.EditorNpcService = EditorNpcService;
}
