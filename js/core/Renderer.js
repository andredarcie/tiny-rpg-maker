/**
 * Renderer coordena módulos especializados para desenhar a cena.
 */
class Renderer {
    constructor(canvas, gameState, tileManager, npcManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.gameState = gameState;
        this.tileManager = tileManager;
        this.npcManager = npcManager;

        this.paletteManager = new RendererPalette(gameState);
        this.spriteFactory = new RendererSpriteFactory(this.paletteManager);
        this.canvasHelper = new RendererCanvasHelper(canvas, this.ctx);
        this.tileRenderer = new RendererTileRenderer(gameState, tileManager, this.paletteManager, this.canvasHelper);
        this.entityRenderer = new RendererEntityRenderer(gameState, tileManager, this.spriteFactory, this.canvasHelper, this.paletteManager);
        this.dialogRenderer = new RendererDialogRenderer(gameState, this.paletteManager);
        this.hudRenderer = new RendererHudRenderer(gameState);
        this.minimapRenderer = new RendererMinimapRenderer(gameState);

        // Compatibilidade com código existente que acessa sprites diretamente.
        this.playerSprite = this.spriteFactory.getPlayerSprite();
        this.npcSprites = this.spriteFactory.getNpcSprites();
        this.enemySprites = this.spriteFactory.getEnemySprites();
        this.enemySprite = this.spriteFactory.getEnemySprite();
        this.objectSprites = this.spriteFactory.getObjectSprites();
        this.combatIndicatorElement = typeof document !== 'undefined'
            ? document.getElementById('combat-indicator')
            : null;
        this.combatIndicatorTimeout = null;
        this.screenFlashElement = typeof document !== 'undefined'
            ? document.getElementById('screen-flash')
            : null;
        this.screenFlashTimeout = null;
        if (this.combatIndicatorElement) {
            this.combatIndicatorElement.classList.remove('visible');
            this.combatIndicatorElement.setAttribute('data-visible', 'false');
        }
        if (this.screenFlashElement) {
            this.screenFlashElement.classList.remove('visible');
        }
    }

    draw() {
        this.tileRenderer.clearCanvas(this.ctx, this.canvas);
        this.tileRenderer.drawBackground(this.ctx, this.canvas);
        this.tileRenderer.drawTiles(this.ctx, this.canvas);
        this.tileRenderer.drawWalls(this.ctx);

        this.entityRenderer.drawObjects(this.ctx);
        this.entityRenderer.drawItems(this.ctx);
        this.entityRenderer.drawNPCs(this.ctx);
        this.entityRenderer.drawEnemies(this.ctx);
        this.entityRenderer.drawPlayer(this.ctx);

        this.dialogRenderer.drawDialog(this.ctx, this.canvas);
        this.hudRenderer.drawHUD();
        this.minimapRenderer.drawMinimap();

        if (typeof this.gameState.isGameOver === 'function' && this.gameState.isGameOver()) {
            this.drawGameOverScreen();
        }
    }

    // Métodos utilitários delegados
    getTilePixelSize() {
        return this.canvasHelper.getTilePixelSize();
    }

    getColor(idx) {
        return this.paletteManager.getColor(idx);
    }

    drawCustomTile(tileId, px, py, size) {
        this.canvasHelper.drawCustomTile(this.tileManager, tileId, px, py, size);
    }

    drawSprite(ctx, sprite, px, py, step) {
        this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
    }

    drawTileOnCanvas(canvas, tile) {
        this.canvasHelper.drawTileOnCanvas(canvas, tile);
    }

    drawTilePreviewAt(tileId, px, py, size, ctx) {
        this.canvasHelper.drawTilePreview(this.tileManager, tileId, px, py, size, ctx);
    }

    drawGameOverScreen() {
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#FFFFFF';
        const fontSize = Math.max(8, Math.floor(this.canvas.height / 10));
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
        ctx.restore();
    }

    showCombatIndicator(text, options = {}) {
        const element = this.combatIndicatorElement;
        if (!element) return;
        const duration = Number.isFinite(options.duration)
            ? Math.max(0, options.duration)
            : 600;

        if (this.combatIndicatorTimeout) {
            clearTimeout(this.combatIndicatorTimeout);
            this.combatIndicatorTimeout = null;
        }

        element.classList.remove('visible');
        element.setAttribute('data-visible', 'false');
        element.textContent = '';
        // Force layout so the transition can replay on subsequent calls.
        void element.offsetWidth;

        element.textContent = text ?? '';
        element.classList.add('visible');
        element.setAttribute('data-visible', 'true');

        this.combatIndicatorTimeout = setTimeout(() => {
            element.classList.remove('visible');
            element.setAttribute('data-visible', 'false');
            element.textContent = '';
            this.combatIndicatorTimeout = null;
        }, duration);
    }

    flashScreen(options = {}) {
        const element = this.screenFlashElement;
        if (!element) return;
        const duration = Number.isFinite(options.duration)
            ? Math.max(16, options.duration)
            : 140;
        if (typeof options.intensity === 'number' && Number.isFinite(options.intensity)) {
            const clamped = Math.max(0, Math.min(1, options.intensity));
            element.style.setProperty('--screen-flash-opacity', clamped.toString());
        }
        if (typeof options.color === 'string' && options.color.trim()) {
            element.style.setProperty('--screen-flash-color', options.color.trim());
        }
        if (this.screenFlashTimeout) {
            clearTimeout(this.screenFlashTimeout);
            this.screenFlashTimeout = null;
        }
        element.classList.remove('visible');
        void element.offsetWidth;
        element.classList.add('visible');
        this.screenFlashTimeout = setTimeout(() => {
            element.classList.remove('visible');
            this.screenFlashTimeout = null;
        }, duration);
    }

    drawObjectSprite(ctx, type, px, py, stepOverride) {
        const objectSprites = this.spriteFactory.getObjectSprites();
        const sprite = objectSprites?.[type];
        if (!sprite) return;
        const step = stepOverride || (this.canvasHelper.getTilePixelSize() / 8);
        this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
    }

    // Métodos preservados para compatibilidade.
    buildPlayerSprite() {
        this.playerSprite = this.spriteFactory.getPlayerSprite();
        return this.playerSprite;
    }

    buildNpcSprites() {
        this.npcSprites = this.spriteFactory.getNpcSprites();
        return this.npcSprites;
    }

    buildEnemySprite() {
        this.enemySprites = this.spriteFactory.getEnemySprites();
        this.enemySprite = this.spriteFactory.getEnemySprite();
        return this.enemySprite;
    }

    buildObjectSprites() {
        this.objectSprites = this.spriteFactory.getObjectSprites();
        return this.objectSprites;
    }
}

if (typeof window !== 'undefined') {
    window.Renderer = Renderer;
}
