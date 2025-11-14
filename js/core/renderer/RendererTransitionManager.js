class RendererTransitionManager extends RendererModuleBase {
    constructor(renderer) {
        super(renderer);
        this.transition = { active: false };
    }

    isActive() {
        return Boolean(this.transition?.active);
    }

    start(options = {}) {
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

        if (this.transition?.rafId && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(this.transition.rafId);
        }

        this.removePlayerFromFrame(fromFrame, options.playerPath?.from);
        this.removePlayerFromFrame(toFrame, options.playerPath?.to);

        this.transition = {
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

        this.renderer.draw();
        this.scheduleTick();
        return true;
    }

    scheduleTick() {
        if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
            return;
        }
        const tick = () => {
            if (!this.isActive()) {
                return;
            }
            const progress = this.getProgress();
            if (progress >= 1) {
                this.finish();
                return;
            }
            this.renderer.draw();
            this.transition.rafId = window.requestAnimationFrame(tick);
        };
        this.transition.rafId = window.requestAnimationFrame(tick);
    }

    getProgress() {
        if (!this.transition?.active) {
            return 1;
        }
        const now = (typeof performance !== 'undefined' && typeof performance.now === 'function')
            ? performance.now()
            : Date.now();
        const elapsed = now - this.transition.startTime;
        return Math.max(0, Math.min(1, elapsed / this.transition.duration));
    }

    drawFrame(ctx, gameplayCanvas) {
        const transition = this.transition;
        if (!transition?.active) return;
        const width = gameplayCanvas.width;
        const height = gameplayCanvas.height;
        const progress = this.getProgress();
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
            this.finish();
        }
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

    drawTransitionPlayer(ctx, gameplayCanvas, progress) {
        const transition = this.transition;
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

    finish() {
        if (!this.transition?.active) return;
        if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function' && this.transition.rafId) {
            window.cancelAnimationFrame(this.transition.rafId);
        }
        const callback = this.transition.onComplete;
        this.transition = { active: false };
        if (typeof this.gameState?.resumeGame === 'function') {
            this.gameState.resumeGame('room-transition');
        }
        if (typeof callback === 'function') {
            callback();
        }
    }
}

if (typeof window !== 'undefined') {
    window.RendererTransitionManager = RendererTransitionManager;
}
