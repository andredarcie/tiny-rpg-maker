/**
 * Renderer coordena módulos especializados para desenhar a cena.
 */
class Renderer {
    constructor(canvas, gameState, tileManager, npcManager, gameEngine = null) {
        this.canvas = canvas;
        const tilePixelSize = Math.max(8, Math.floor(this.canvas.width / 8));
        this.hudBarHeight = Math.max(28, Math.round(tilePixelSize * 1.75));
        this.inventoryBarHeight = Math.max(40, Math.round(tilePixelSize * 2));
        this.totalHudHeight = this.hudBarHeight + this.inventoryBarHeight;
        this.gameplayHeight = tilePixelSize * 8;
        const desiredHeight = this.gameplayHeight + this.totalHudHeight;
        if (this.canvas.height !== desiredHeight) {
            this.canvas.height = desiredHeight;
        }
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.gameplayOffsetY = this.hudBarHeight;
        this.inventoryOffsetY = this.hudBarHeight + this.gameplayHeight;
        this.gameplayCanvasBounds = {
            width: this.canvas.width,
            height: this.gameplayHeight
        };

        this.gameState = gameState;
        this.gameEngine = gameEngine;
        this.tileManager = tileManager;
        this.npcManager = npcManager;

        this.paletteManager = new RendererPalette(gameState);
        this.spriteFactory = new RendererSpriteFactory(this.paletteManager);
        this.canvasHelper = new RendererCanvasHelper(canvas, this.ctx, tileManager);
        this.tileRenderer = new RendererTileRenderer(gameState, tileManager, this.paletteManager, this.canvasHelper);
        this.entityRenderer = new RendererEntityRenderer(gameState, tileManager, this.spriteFactory, this.canvasHelper, this.paletteManager);
        this.entityRenderer.setViewportOffset(this.gameplayOffsetY);
        this.dialogRenderer = new RendererDialogRenderer(gameState, this.paletteManager);
        this.hudRenderer = new RendererHudRenderer(gameState, this.entityRenderer, this.paletteManager);
        this.effectsManager = new RendererEffectsManager(this);
        this.transitionManager = new RendererTransitionManager(this);
        this.overlayRenderer = new RendererOverlayRenderer(this);

        // Compatibilidade com código existente que acessa sprites diretamente.
        this.playerSprite = this.spriteFactory.getPlayerSprite();
        this.npcSprites = this.spriteFactory.getNpcSprites();
        this.enemySprites = this.spriteFactory.getEnemySprites();
        this.enemySprite = this.spriteFactory.getEnemySprite();
        this.objectSprites = this.spriteFactory.getObjectSprites();
        this.drawIconIdNextFrame = '';
        this.timeIconOverPlayer = 2000;
        this.tileAnimationInterval = 320;
        this.tileAnimationTimer = null;
        this.startTileAnimationLoop();
    }

    draw() {
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const gameplayCanvas = this.gameplayCanvasBounds;
        const introActive = this.isIntroOverlayActive();
        const pickupOverlayActive = this.gameState.isPickupOverlayActive?.();
        const levelUpOverlayActive = this.gameState.isLevelUpOverlayActive?.();
        ctx.save();
        ctx.translate(0, this.gameplayOffsetY);

        if (this.transitionManager.isActive()) {
            this.transitionManager.drawFrame(ctx, gameplayCanvas);
        } else {
            this.tileRenderer.clearCanvas(ctx, gameplayCanvas);
            this.tileRenderer.drawBackground(ctx, gameplayCanvas);
            this.tileRenderer.drawTiles(ctx, gameplayCanvas);
            this.tileRenderer.drawWalls(ctx);
            this.effectsManager.drawEdgeFlash(ctx, gameplayCanvas);

            if (!introActive && !this.gameState.isGameOver()) {
                this.entityRenderer.drawObjects(ctx);
                this.entityRenderer.drawItems(ctx);
                this.entityRenderer.drawNPCs(ctx);
                this.entityRenderer.drawEnemies(ctx);
                this.entityRenderer.drawPlayer(ctx);
                if (this.drawIconIdNextFrame) {
                    this.drawTileIconOnPlayer(ctx, this.drawIconIdNextFrame);
                }
                if (!pickupOverlayActive && !levelUpOverlayActive) {
                    this.dialogRenderer.drawDialog(ctx, gameplayCanvas);
                }
            }
        }
        if (introActive) {
            this.overlayRenderer.drawIntroOverlay(ctx, gameplayCanvas);
        } else if (pickupOverlayActive) {
            this.overlayRenderer.drawPickupOverlay(ctx, gameplayCanvas);
        }
        ctx.restore();

        const topHudArea = {
            width: this.canvas.width,
            height: this.hudBarHeight
        };
        const bottomHudArea = {
            x: 0,
            y: this.inventoryOffsetY,
            width: this.canvas.width,
            height: this.inventoryBarHeight
        };

        if (introActive) {
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, topHudArea.width, topHudArea.height);
            ctx.fillRect(bottomHudArea.x, bottomHudArea.y, bottomHudArea.width, bottomHudArea.height);
            ctx.restore();
        } else if (!levelUpOverlayActive) {
            this.hudRenderer.drawHUD(ctx, topHudArea);
            this.hudRenderer.drawInventory(ctx, bottomHudArea);
        }

        if (this.gameState.isGameOver()) {
            this.overlayRenderer.drawGameOverScreen();
            return;
        }

        if (levelUpOverlayActive) {
            this.overlayRenderer.drawLevelUpOverlayFull(ctx);
        }
    }

    // Métodos utilitários delegados
    getTilePixelSize() {
        return this.canvasHelper.getTilePixelSize();
    }

    getColor(idx) {
        return this.paletteManager.getColor(idx);
    }

    setIconOverPlayer(tileType) {
        this.drawIconIdNextFrame = tileType;
        setTimeout(() => {
            this.drawIconIdNextFrame = '';
        }, this.timeIconOverPlayer);
    }

    drawCustomTile(tileId, px, py, size) {
        this.canvasHelper.drawCustomTile(tileId, px, py, size);
    }

    drawSprite(ctx, sprite, px, py, step) {
        this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
    }

    drawTileOnCanvas(canvas, tile) {
        this.canvasHelper.drawTileOnCanvas(canvas, tile);
    }

    drawTileIconOnPlayer(ctx, tileId) {
        this.entityRenderer.drawTileIconOnPlayer(ctx, tileId);
    }

    drawTilePreviewAt(tileId, px, py, size, ctx) {
        this.canvasHelper.drawTilePreview(tileId, px, py, size, ctx);
    }

    setIntroData(data = {}) {
        this.overlayRenderer.setIntroData(data);
    }

    isIntroOverlayActive() {
        return Boolean(this.gameEngine?.isIntroVisible?.());
    }

    captureGameplayFrame() {
        if (typeof document === 'undefined' || !this.canvas) {
            return null;
        }
        const width = this.gameplayCanvasBounds.width;
        const height = this.gameplayCanvasBounds.height;
        const buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        const bufferCtx = buffer.getContext('2d');
        if (!bufferCtx) return null;
        bufferCtx.drawImage(
            this.canvas,
            0,
            this.gameplayOffsetY,
            width,
            height,
            0,
            0,
            width,
            height
        );
        return buffer;
    }

    isRoomTransitionActive() {
        return this.transitionManager.isActive();
    }

    startRoomTransition(options = {}) {
        return this.transitionManager.start(options);
    }

    flashEdge(direction, options = {}) {
        this.effectsManager.flashEdge(direction, options);
    }


    startTileAnimationLoop() {
        if (this.tileAnimationTimer) {
            clearInterval(this.tileAnimationTimer);
            this.tileAnimationTimer = null;
        }
        const interval = Math.max(60, this.tileAnimationInterval || 0);
        this.tileAnimationTimer = setInterval(() => this.tickTileAnimation(), interval);
    }

    tickTileAnimation() {
        const manager = this.tileManager;
        const totalFrames = manager.getAnimationFrameCount();
        if (totalFrames <= 1) return;
        const nextIndex = manager.advanceAnimationFrame();
        this.draw();
        try {
            window.dispatchEvent(new CustomEvent('tile-animation-frame', {
                detail: { frameIndex: nextIndex }
            }));
        } catch (err) {
            window.dispatchEvent(new Event('tile-animation-frame'));
        }
    }

    showCombatIndicator(text, options = {}) {
        this.effectsManager.showCombatIndicator(text, options);
    }

    flashScreen(options = {}) {
        this.effectsManager.flashScreen(options);
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
