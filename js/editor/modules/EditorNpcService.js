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

        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    togglePlacement(forceOff = false) {
        const btn = this.dom.btnPlaceNpc;
        const canvas = this.dom.editorCanvas;
        if (forceOff || this.state.placingNpc) {
            this.state.placingNpc = false;
            if (btn) {
                btn.textContent = 'Colocar NPC no mapa';
                btn.classList.remove('placing');
                btn.disabled = !this.state.selectedNpcId;
            }
            if (!this.state.placingEnemy && canvas) {
                canvas.style.cursor = 'default';
            }
            return;
        }

        if (!this.state.selectedNpcId) {
            alert('Selecione um NPC para colocar.');
            return;
        }

        this.state.placingNpc = true;
        this.state.placingEnemy = false;
        this.state.placingObjectType = null;

        if (btn) {
            btn.textContent = 'Cancelar colocacao';
            btn.classList.add('placing');
        }

        const enemyButton = this.dom.btnPlaceEnemy;
        if (enemyButton) {
            enemyButton.textContent = 'Colocar caveira';
            enemyButton.classList.remove('placing');
        }

        if (canvas) {
            canvas.style.cursor = 'crosshair';
        }
        this.manager.objectService?.updatePlacementButtons();
    }

    removeSelectedNpc() {
        if (!this.state.selectedNpcId) return;
        const removed = this.gameEngine.npcManager?.removeNPC?.(this.state.selectedNpcId);
        if (!removed) return;

        this.state.placingNpc = false;
        const btn = this.dom.btnPlaceNpc;
        if (btn) {
            btn.textContent = 'Colocar NPC no mapa';
            btn.classList.remove('placing');
            btn.disabled = true;
        }
        if (!this.state.placingEnemy && this.dom.editorCanvas) {
            this.dom.editorCanvas.style.cursor = 'default';
        }
        this.manager.renderService.renderNpcs();
        this.manager.renderService.renderWorldGrid();
        this.manager.renderService.renderEditor();
        this.manager.gameEngine.draw();
        this.manager.updateJSON();
        this.manager.history.pushCurrentState();
    }

    updateNpcSelection(type, id) {
        this.state.selectedNpcType = type;
        this.state.selectedNpcId = id;
        this.manager.renderService.renderNpcs();
        this.togglePlacement(true);
        const btn = this.dom.btnPlaceNpc;
        if (btn) {
            btn.disabled = !id;
        }
    }

    placeNpcAt(coord) {
        if (!this.state.selectedNpcId) {
            alert('Selecione um NPC para colocar.');
            this.togglePlacement(true);
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
        this.togglePlacement(true);
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
