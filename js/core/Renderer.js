/**
 * Renderer coordena módulos especializados para desenhar a cena.
 */
class Renderer {
    constructor(canvas, gameState, tileManager, npcManager, gameEngine = null) {
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
        this.introData = { title: 'Tiny RPG Maker', author: '' };
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
        this.roomTransition = { active: false };
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
        ctx.save();
        ctx.translate(0, this.gameplayOffsetY);

        if (this.isRoomTransitionActive()) {
            this.drawRoomTransitionFrame(ctx, gameplayCanvas);
        } else {
            this.tileRenderer.clearCanvas(ctx, gameplayCanvas);
            this.tileRenderer.drawBackground(ctx, gameplayCanvas);
            this.tileRenderer.drawTiles(ctx, gameplayCanvas);
            this.tileRenderer.drawWalls(ctx);
            this.drawEdgeFlash(ctx, gameplayCanvas);

            if (!introActive) {
                this.entityRenderer.drawObjects(ctx);
                this.entityRenderer.drawItems(ctx);
                this.entityRenderer.drawNPCs(ctx);
                this.entityRenderer.drawEnemies(ctx);
                this.entityRenderer.drawPlayer(ctx);
                if (this.drawIconIdNextFrame) {
                    this.drawTileIconOnPlayer(ctx, this.drawIconIdNextFrame);
                }
                this.dialogRenderer.drawDialog(ctx, gameplayCanvas);
            }
        }
        if (introActive) {
            this.drawIntroOverlay(ctx, gameplayCanvas);
        }
        ctx.restore();

        if (introActive) {
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, this.canvas.width, this.hudBarHeight);
            ctx.restore();
        } else {
            this.hudRenderer.drawHUD(ctx, {
                width: this.canvas.width,
                height: this.hudBarHeight
            });
        }

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

    setIntroData(data = {}) {
        this.introData = {
            title: data.title || 'Tiny RPG Maker',
            author: data.author || ''
        };
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
        return Boolean(this.roomTransition?.active);
    }

    startRoomTransition(options = {}) {
        const fromFrame = options.fromFrame;
        const toFrame = options.toFrame;
        if (!fromFrame || !toFrame) {
            if (typeof options.onComplete === 'function') {
                options.onComplete();
            }
            return false;
        }
        const direction = options.direction || 'right';
        const duration = Number.isFinite(options.duration)
            ? Math.max(120, options.duration)
            : 320;
        const now = (typeof performance !== 'undefined' && typeof performance.now === 'function')
            ? performance.now()
            : Date.now();

        if (this.roomTransition?.rafId && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(this.roomTransition.rafId);
        }

        this.removePlayerFromFrame(fromFrame, options.playerPath?.from);
        this.removePlayerFromFrame(toFrame, options.playerPath?.to);

        this.roomTransition = {
            active: true,
            direction,
            fromFrame,
            toFrame,
            duration,
            startTime: now,
            playerPath: options.playerPath || null,
            onComplete: typeof options.onComplete === 'function' ? options.onComplete : null,
            rafId: null
        };

        if (typeof this.gameState?.pauseGame === 'function') {
            this.gameState.pauseGame('room-transition');
        }

        this.draw();
        this.scheduleRoomTransitionTick();
        return true;
    }

    removePlayerFromFrame(frameCanvas, coords) {
        if (!frameCanvas || !coords) return;
        const ctx = frameCanvas.getContext('2d');
        if (!ctx) return;
        const tileSize = Math.max(1, Math.floor(frameCanvas.width / 8));
        const tileX = Math.max(0, Math.min(7, Math.floor(coords.x ?? 0)));
        const tileY = Math.max(0, Math.min(7, Math.floor(coords.y ?? 0)));
        const roomIndex = Number.isFinite(coords.roomIndex)
            ? coords.roomIndex
            : (this.gameState.getPlayer()?.roomIndex ?? 0);
        const room = this.gameState.getGame().rooms?.[roomIndex];
        ctx.fillStyle = this.paletteManager.getColor(room?.bg ?? 0);
        ctx.fillRect(tileX * tileSize, tileY * tileSize, tileSize, tileSize);
        this.drawTileStackOnContext(ctx, roomIndex, tileX, tileY, tileSize);
    }

    scheduleRoomTransitionTick() {
        if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
            return;
        }
        const tick = () => {
            if (!this.isRoomTransitionActive()) {
                return;
            }
            const progress = this.getRoomTransitionProgress();
            if (progress >= 1) {
                this.finishRoomTransition();
                return;
            }
            this.draw();
            this.roomTransition.rafId = window.requestAnimationFrame(tick);
        };
        this.roomTransition.rafId = window.requestAnimationFrame(tick);
    }

    getRoomTransitionProgress() {
        if (!this.roomTransition?.active) {
            return 1;
        }
        const now = (typeof performance !== 'undefined' && typeof performance.now === 'function')
            ? performance.now()
            : Date.now();
        const elapsed = now - this.roomTransition.startTime;
        return Math.max(0, Math.min(1, elapsed / this.roomTransition.duration));
    }

    drawRoomTransitionFrame(ctx, gameplayCanvas) {
        const transition = this.roomTransition;
        if (!transition?.active) return;
        const width = gameplayCanvas.width;
        const height = gameplayCanvas.height;
        const progress = this.getRoomTransitionProgress();
        const deltaX = progress * width;
        const deltaY = progress * height;
        let fromX = 0;
        let fromY = 0;
        let toX = 0;
        let toY = 0;
        switch (transition.direction) {
            case 'left':
                fromX = deltaX;
                toX = deltaX - width;
                break;
            case 'right':
                fromX = -deltaX;
                toX = width - deltaX;
                break;
            case 'up':
                fromY = deltaY;
                toY = deltaY - height;
                break;
            case 'down':
                fromY = -deltaY;
                toY = height - deltaY;
                break;
            default:
                fromX = -deltaX;
                toX = width - deltaX;
                break;
        }
        ctx.save();
        ctx.fillStyle = this.paletteManager.getColor(this.gameState.getCurrentRoom()?.bg ?? 0);
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(transition.fromFrame, Math.round(fromX), Math.round(fromY));
        ctx.drawImage(transition.toFrame, Math.round(toX), Math.round(toY));
        this.drawTransitionPlayer(ctx, gameplayCanvas, progress);
        ctx.restore();
        if (progress >= 1) {
            this.finishRoomTransition();
        }
    }

    drawTransitionPlayer(ctx, gameplayCanvas, progress) {
        const transition = this.roomTransition;
        const path = transition?.playerPath;
        if (!path?.from || !path?.to) return;
        const tileSize = Math.max(1, Math.floor(gameplayCanvas.width / 8));
        const step = tileSize / 8;
        const x = path.from.x + (path.to.x - path.from.x) * progress;
        const y = path.from.y + (path.to.y - path.from.y) * progress;
        let sprite = this.spriteFactory.getPlayerSprite();
        let facingLeft = path.facingLeft;
        if (facingLeft === undefined) {
            facingLeft = path.to.x < path.from.x;
        }
        if (facingLeft) {
            sprite = this.spriteFactory.turnSpriteHorizontally(sprite);
        }
        this.canvasHelper.drawSprite(ctx, sprite, x * tileSize, y * tileSize, step);
    }

    drawTileStackOnContext(ctx, roomIndex, tileX, tileY, tileSize) {
        const tileMap = this.tileManager.getTileMap(roomIndex);
        if (!tileMap) return;
        const px = tileX * tileSize;
        const py = tileY * tileSize;
        const groundId = tileMap.ground?.[tileY]?.[tileX] ?? null;
        if (groundId !== null && groundId !== undefined) {
            this.drawTilePixelsOnContext(ctx, groundId, px, py, tileSize);
        }
        const overlayId = tileMap.overlay?.[tileY]?.[tileX] ?? null;
        if (overlayId !== null && overlayId !== undefined) {
            this.drawTilePixelsOnContext(ctx, overlayId, px, py, tileSize);
        }
    }

    drawTilePixelsOnContext(ctx, tileId, px, py, size) {
        const pixels = this.tileManager.getTilePixels(tileId);
        if (!pixels) return;
        const step = Math.max(1, Math.floor(size / 8));
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = pixels[y]?.[x];
                if (!col || col === 'transparent') continue;
                ctx.fillStyle = col;
                ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    finishRoomTransition() {
        if (!this.roomTransition?.active) return;
        if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function' && this.roomTransition.rafId) {
            window.cancelAnimationFrame(this.roomTransition.rafId);
        }
        const callback = this.roomTransition.onComplete;
        this.roomTransition = { active: false };
        if (typeof this.gameState?.resumeGame === 'function') {
            this.gameState.resumeGame('room-transition');
        }
        if (typeof callback === 'function') {
            callback();
        }
    }

    drawIntroOverlay(ctx, gameplayCanvas) {
        const title = this.introData?.title || 'Tiny RPG Maker';
        const author = (this.introData?.author || '').trim();
        const width = gameplayCanvas.width;
        const height = gameplayCanvas.height;
        ctx.save();
        ctx.fillStyle = 'rgba(4, 6, 14, 0.78)';
        ctx.fillRect(0, 0, width, height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = width / 2;
        const centerY = height / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.max(12, Math.floor(height / 12))}px monospace`;
        ctx.fillText(title, centerX, centerY - height * 0.12);
        if (author) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.font = `${Math.max(10, Math.floor(height / 18))}px monospace`;
            ctx.fillText(`por ${author}`, centerX, centerY);
        }
        const blink = ((Date.now() / 500) % 2) > 1 ? 0.3 : 0.95;
        ctx.fillStyle = `rgba(100, 181, 246, ${blink.toFixed(2)})`;
        ctx.font = `${Math.max(9, Math.floor(height / 20))}px monospace`;
        ctx.fillText('Iniciar aventura', centerX, centerY + height * 0.18);
        ctx.restore();
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
