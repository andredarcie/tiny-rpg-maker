class EditorEventBinder extends EditorManagerModule {
    bind() {
        const {
            btnNpcDelete,
            btnGenerateUrl,
            btnUndo,
            btnRedo,
            titleInput,
            authorInput,
            npcText,
            npcConditionalText,
            npcConditionalVariable,
            npcRewardVariable,
            npcConditionalRewardVariable,
            btnToggleNpcConditional,
            fileInput,
            editorCanvas,
            enemyTypes,
            enemiesList,
            objectTypes,
            objectsList,
            tileList,
            npcsList,
            mapNavButtons,
            mobileNavButtons,
            mobilePanels,
            worldGrid
        } = this.dom;

        const manager = this.manager;
        const npcService = manager.npcService;
        const enemyService = manager.enemyService;
        const objectService = manager.objectService;
        const shareService = manager.shareService;
        const tileService = manager.tileService;
        const worldService = manager.worldService;

        btnNpcDelete?.addEventListener('click', () => npcService.removeSelectedNpc());
        btnToggleNpcConditional?.addEventListener('click', () => {
            this.state.conditionalDialogueExpanded = !this.state.conditionalDialogueExpanded;
            this.renderService.updateNpcForm();
        });

        btnGenerateUrl?.addEventListener('click', () => shareService.generateShareableUrl());
        btnUndo?.addEventListener('click', () => manager.undo());
        btnRedo?.addEventListener('click', () => manager.redo());

        titleInput?.addEventListener('input', () => manager.updateGameMetadata());
        authorInput?.addEventListener('input', () => manager.updateGameMetadata());
        npcText?.addEventListener('input', () => npcService.updateNpcText(npcText.value));
        npcConditionalText?.addEventListener('input', () => npcService.updateNpcConditionalText(npcConditionalText.value));
        npcConditionalVariable?.addEventListener('change', (ev) => npcService.handleConditionVariableChange(ev.target.value));
        npcRewardVariable?.addEventListener('change', (ev) => npcService.handleRewardVariableChange(ev.target.value));
        npcConditionalRewardVariable?.addEventListener('change', (ev) => npcService.handleConditionalRewardVariableChange(ev.target.value));

        fileInput?.addEventListener('change', (ev) => shareService.loadGameFile(ev));

        tileList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('[data-tile-id]');
            if (!button) return;
            const tileId = Number(button.dataset.tileId);
            if (!Number.isFinite(tileId)) return;
            if (this.state.placingObjectType) {
                objectService.togglePlacement(this.state.placingObjectType, true);
            }

            manager.desselectAllAndRender();

            manager.selectedTileId = tileId;
            this.renderService.updateSelectedTilePreview();
            this.renderService.renderTileList();
        });

        npcsList?.addEventListener('click', (ev) => {
            const card = ev.target.closest('.npc-card');
            if (!card) return;
            const type = card.dataset.type || null;
            const id = card.dataset.id || null;

            manager.desselectAllAndRender();
            npcService.updateNpcSelection(type, id);
        });

        objectTypes?.addEventListener('click', (ev) => {
            const card = ev.target.closest('.object-type-card');
            if (!card) return;
            const type = card.dataset.type || null;
            if (!type) return;

            manager.desselectAllAndRender();
            objectService.selectObjectType(type);
        });

        objectsList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('.object-remove');
            if (!button) return;
            const card = button.closest('.object-card');
            if (!card) return;
            const type = card.dataset.type;
            const room = Number(card.dataset.roomIndex);
            if (!type || !Number.isFinite(room)) return;
            objectService.removeObject(type, room);
        });

        enemyTypes?.addEventListener('click', (ev) => {
            const card = ev.target.closest('.enemy-card');
            if (!card) return;
            const type = card.dataset.type || null;
            if (!type) return;

            manager.desselectAllAndRender();
            enemyService.selectEnemyType(type);
        });

        enemiesList?.addEventListener('click', (ev) => {
            const button = ev.target.closest('[data-remove-enemy]');
            if (!button) return;
            const enemyId = button.dataset.removeEnemy;
            if (!enemyId) return;
            enemyService.removeEnemy(enemyId);
        });

        enemiesList?.addEventListener('change', (ev) => {
            const target = ev.target;
            if (!target || target.tagName !== 'SELECT') return;
            const enemyId = target.dataset.enemyVariable;
            if (!enemyId) return;
            const value = target.value || '';
            enemyService.handleEnemyVariableChange(enemyId, value);
        });

        worldGrid?.addEventListener('click', (ev) => {
            const cell = ev.target.closest('[data-room-index]');
            if (!cell) return;
            const index = Number(cell.dataset.roomIndex);
            worldService.setActiveRoom(index);
        });

        if (Array.isArray(mapNavButtons)) {
            mapNavButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const direction = button.dataset.direction;
                    if (!direction) return;
                    worldService.moveActiveRoom(direction);
                });
            });
        }

        if (editorCanvas) {
            editorCanvas.addEventListener('pointerdown', (ev) => tileService.startPaint(ev));
            editorCanvas.addEventListener('pointermove', (ev) => tileService.continuePaint(ev));
        }

        if (Array.isArray(mobileNavButtons)) {
            mobileNavButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const target = button.dataset.mobileTarget;
                    if (!target) return;
                    manager.setActiveMobilePanel(target);
                });
            });
        }

        window.addEventListener('pointerup', (ev) => tileService.finishPaint(ev));

        document.addEventListener('keydown', (ev) => manager.handleKey(ev));
        window.addEventListener('resize', (ev) => {
            manager.handleCanvasResize(ev);
            manager.updateMobilePanels();
        });
        document.addEventListener('editor-tab-activated', () =>
            requestAnimationFrame(() => {
                manager.handleCanvasResize(true);
                manager.updateMobilePanels();
            })
        );

        window.addEventListener('pointerup', (ev) => tileService.finishPaint(ev));
    }
}

if (typeof window !== 'undefined') {
    window.EditorEventBinder = EditorEventBinder;
}
