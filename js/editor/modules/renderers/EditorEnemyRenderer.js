class EditorEnemyRenderer extends EditorRendererBase {
    renderEnemies() {
        const list = this.dom.enemiesList;
        if (!list) return;
        list.innerHTML = '';

        const activeRoom = this.state.activeRoomIndex;
        const enemies = this.gameEngine
            .getActiveEnemies()
            .filter((enemy) => enemy.roomIndex === activeRoom);
        if (!enemies.length) return;

        const definitions = EditorConstants.ENEMY_DEFINITIONS;
        const definitionMap = new Map();
        definitions.forEach((entry) => {
            definitionMap.set(entry.type, entry);
            if (Array.isArray(entry.aliases)) {
                entry.aliases.forEach((alias) => definitionMap.set(alias, entry));
            }
        });

        enemies.forEach((enemy) => {
            const definition = definitionMap.get(enemy.type);
            const item = document.createElement('div');
            item.className = 'enemy-item';

            const label = document.createElement('span');
            const displayName = this.getEnemyDisplayName(definition, enemy.type);
            const damageInfo = Number.isFinite(definition?.damage)
                ? this.tf('enemies.damageInfo', { value: definition.damage })
                : '';
            label.textContent = `${displayName} @ (${enemy.x}, ${enemy.y})${damageInfo}`;

            const variableWrapper = document.createElement('label');
            variableWrapper.className = 'enemy-variable-wrapper';
            variableWrapper.textContent = `${this.t('enemies.variableLabel')} `;

            const variableSelect = document.createElement('select');
            variableSelect.className = 'enemy-variable-select';
            variableSelect.dataset.enemyVariable = enemy.id;
            this.manager.npcService.populateVariableSelect(
                variableSelect,
                enemy.defeatVariableId || ''
            );
            variableWrapper.appendChild(variableSelect);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'enemy-remove';
            removeBtn.dataset.removeEnemy = enemy.id;
            removeBtn.textContent = this.t('buttons.remove');

            const controls = document.createElement('div');
            controls.className = 'enemy-controls';
            controls.append(variableWrapper, removeBtn);

            item.append(label, controls);
            list.appendChild(item);
        });
    }

    renderEnemyCatalog() {
        const container = this.dom.enemyTypes;
        if (!container) return;
        container.innerHTML = '';

        const definitions = EditorConstants.ENEMY_DEFINITIONS;
        if (!definitions.length) return;

        const selectedType = this.manager.selectedEnemyType;

        definitions.forEach((definition) => {
            const card = document.createElement('div');
            card.className = 'enemy-card';
            card.dataset.type = definition.type;
            if (definition.boss) {
                card.classList.add('boss');
            }
            if (definition.type === selectedType) {
                card.classList.add('selected');
            }

            const preview = document.createElement('canvas');
            preview.className = 'enemy-preview';
            preview.width = 48;
            preview.height = 48;
            this.drawEnemyPreview(preview, definition);

            const meta = document.createElement('div');
            meta.className = 'enemy-meta';

            const name = document.createElement('div');
            name.className = 'enemy-name';
            name.textContent = this.getEnemyDisplayName(definition, definition.type);

            const damage = document.createElement('div');
            damage.className = 'enemy-damage';
            const damageValue = Number.isFinite(definition.damage) ? definition.damage : '?';
            damage.textContent = `Dano: ${damageValue}`;

            if (definition.boss) {
                const badge = document.createElement('span');
                badge.className = 'enemy-boss-badge';
                badge.textContent = 'Boss';
                meta.appendChild(badge);
            }

            meta.append(name, damage);
            card.append(preview, meta);
            container.appendChild(card);
        });
    }

    drawEnemyPreview(canvas, definition) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;

        const renderer = this.gameEngine.renderer;
        let sprite = renderer?.enemySprites?.[definition.type] ?? null;
        if (!sprite && renderer?.enemySprite) {
            sprite = renderer.enemySprite;
        }

        if (!sprite && Array.isArray(definition.sprite) && renderer?.spriteFactory?.mapPixels) {
            const palette = renderer.paletteManager?.getPicoPalette?.() || RendererConstants.DEFAULT_PALETTE;
            sprite = renderer.spriteFactory.mapPixels(definition.sprite, palette);
        }

        if (!Array.isArray(sprite)) return;
        const step = canvas.width / 8;
        for (let y = 0; y < sprite.length; y++) {
            const row = sprite[y];
            if (!Array.isArray(row)) continue;
            for (let x = 0; x < row.length; x++) {
                const color = row[x];
                if (!color) continue;
                ctx.fillStyle = color;
                ctx.fillRect(x * step, y * step, step, step);
            }
        }
    }

    getEnemyDisplayName(definition, fallback = '') {
        const defaultName = this.t('enemy.defaultName', 'Inimigo');
        const fallbackName = definition?.name || fallback || defaultName;
        const localized = definition?.nameKey
            ? this.t(definition.nameKey, fallbackName)
            : fallbackName;
        const cleaned = localized
            .replace(/[^\w\s\u00C0-\u024F'()-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return cleaned || fallback || defaultName;
    }
}

if (typeof window !== 'undefined') {
    window.EditorEnemyRenderer = EditorEnemyRenderer;
}
