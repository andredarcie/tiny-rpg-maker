/**
 * Renderer coordena módulos especializados para desenhar a cena.
 */
class Renderer {
    constructor(canvas, gameState, tileManager, npcManager) {
        this.canvas = canvas;
        const tilePixelSize = Math.max(8, Math.floor(this.canvas.width / 8));
        this.hudBarHeight = Math.max(24, Math.round(tilePixelSize * 1.5));
        this.gameplayHeight = tilePixelSize * 8;
        const desiredHeight = this.gameplayHeight + this.hudBarHeight;
        if (this.canvas.height !== desiredHeight) {
            this.canvas.height = desiredHeight;
        }
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.gameplayOffsetY = this.hudBarHeight;
        this.gameplayCanvasBounds = {
            width: this.canvas.width,
            height: this.gameplayHeight
        };

        this.gameState = gameState;
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

        // Compatibilidade com código existente que acessa sprites diretamente.
        this.playerSprite = this.spriteFactory.getPlayerSprite();
        this.npcSprites = this.spriteFactory.getNpcSprites();
        this.enemySprites = this.spriteFactory.getEnemySprites();
        this.enemySprite = this.spriteFactory.getEnemySprite();
        this.objectSprites = this.spriteFactory.getObjectSprites();
        this.edgeFlash = {
            direction: '',
            expiresAt: 0,
            color: 'rgba(255,255,255,0.35)',
            tileX: null,
            tileY: null
        };
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
        ctx.save();
        ctx.translate(0, this.gameplayOffsetY);

        this.tileRenderer.clearCanvas(ctx, gameplayCanvas);
        this.tileRenderer.drawBackground(ctx, gameplayCanvas);
        this.tileRenderer.drawTiles(ctx, gameplayCanvas);
        this.tileRenderer.drawWalls(ctx);
        this.drawEdgeFlash(ctx, gameplayCanvas);

        this.entityRenderer.drawObjects(ctx);
        this.entityRenderer.drawItems(ctx);
        this.entityRenderer.drawNPCs(ctx);
        this.entityRenderer.drawEnemies(ctx);
        this.entityRenderer.drawPlayer(ctx);
        if (this.drawIconIdNextFrame) {
            this.drawTileIconOnPlayer(ctx, this.drawIconIdNextFrame);
        }

        this.dialogRenderer.drawDialog(ctx, gameplayCanvas);
        ctx.restore();

        this.hudRenderer.drawHUD(ctx, {
            width: this.canvas.width,
            height: this.hudBarHeight
        });

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

    flashEdge(direction, options = {}) {
        if (typeof direction !== 'string' || !direction.trim()) return;
        const normalizedDirection = direction.trim().toLowerCase();
        const duration = Number.isFinite(options.duration)
            ? Math.max(32, options.duration)
            : 220;
        const color = typeof options.color === 'string' && options.color.trim()
            ? options.color.trim()
            : 'rgba(255,255,255,0.35)';
        const clampIndex = (value) => {
            if (!Number.isFinite(value)) return null;
            const idx = Math.floor(value);
            return Math.max(0, Math.min(7, idx));
        };
        const tileX = clampIndex(options.tileX);
        const tileY = clampIndex(options.tileY);
        this.edgeFlash = {
            direction: normalizedDirection,
            expiresAt: Date.now() + duration,
            color,
            tileX,
            tileY
        };
    }

    drawEdgeFlash(ctx, bounds) {
        const state = this.edgeFlash;
        if (!state?.direction) return;
        const now = Date.now();
        if (!Number.isFinite(state.expiresAt) || state.expiresAt <= now) {
            this.edgeFlash.direction = '';
            return;
        }

        const tileSize = Math.max(1, this.canvasHelper.getTilePixelSize());
        const thickness = Math.max(2, Math.floor(tileSize / 4));
        const highlightSize = tileSize;
        const clampIndex = (value, fallback = 0) => {
            if (!Number.isFinite(value)) return Math.max(0, Math.min(7, Math.floor(fallback)));
            return Math.max(0, Math.min(7, Math.floor(value)));
        };
        const player = typeof this.gameState?.getPlayer === 'function'
            ? this.gameState.getPlayer()
            : { x: 0, y: 0 };
        const tileX = clampIndex(state.tileX, player?.x ?? 0);
        const tileY = clampIndex(state.tileY, player?.y ?? 0);
        ctx.save();
        ctx.fillStyle = state.color || 'rgba(255,255,255,0.35)';
        switch (state.direction) {
            case 'left':
                ctx.fillRect(0, tileY * highlightSize, thickness, highlightSize);
                break;
            case 'right':
                ctx.fillRect(bounds.width - thickness, tileY * highlightSize, thickness, highlightSize);
                break;
            case 'up':
                ctx.fillRect(tileX * highlightSize, 0, highlightSize, thickness);
                break;
            case 'down':
                ctx.fillRect(tileX * highlightSize, bounds.height - thickness, highlightSize, thickness);
                break;
            default:
                ctx.fillRect(0, 0, bounds.width, thickness);
                break;
        }
        ctx.restore();
    }

    startTileAnimationLoop() {
        if (typeof setInterval !== 'function') {
            return;
        }
        if (this.tileAnimationTimer) {
            clearInterval(this.tileAnimationTimer);
            this.tileAnimationTimer = null;
        }
        const interval = Math.max(60, this.tileAnimationInterval || 0);
        this.tileAnimationTimer = setInterval(() => this.tickTileAnimation(), interval);
    }

    tickTileAnimation() {
        const manager = this.tileManager;
        const totalFrames = typeof manager.getAnimationFrameCount === 'function'
            ? manager.getAnimationFrameCount()
            : 1;
        if (totalFrames <= 1) return;
        const nextIndex = typeof manager.advanceAnimationFrame === 'function'
            ? manager.advanceAnimationFrame()
            : 0;
        this.draw();
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            try {
                window.dispatchEvent(new CustomEvent('tile-animation-frame', {
                    detail: { frameIndex: nextIndex }
                }));
            } catch (err) {
                window.dispatchEvent(new Event('tile-animation-frame'));
            }
        }
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
