class RendererOverlayRenderer extends RendererModuleBase {
    constructor(renderer) {
        super(renderer);
        this.introData = { title: 'Tiny RPG Maker', author: '' };
        this.pickupFx = { id: null, startTime: 0 };
        this.pickupAnimationHandle = 0;
    }

    setIntroData(data = {}) {
        this.introData = {
            title: data.title || 'Tiny RPG Maker',
            author: data.author || ''
        };
    }

    drawIntroOverlay(ctx, gameplayCanvas) {
        this.entityRenderer.cleanupEnemyLabels();
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

        if (this.renderer?.gameEngine?.canDismissIntroScreen) {
            const blink = ((Date.now() / 500) % 2) > 1 ? 0.3 : 0.95;
            ctx.fillStyle = `rgba(100, 181, 246, ${blink.toFixed(2)})`;
            ctx.font = `${Math.max(9, Math.floor(height / 20))}px monospace`;
            ctx.fillText('Iniciar aventura', centerX, centerY + height * 0.18);
        }

        ctx.restore();
    }

    drawPickupOverlay(ctx, gameplayCanvas) {
        if (!ctx || !gameplayCanvas) return;
        const overlay = this.gameState.getPickupOverlay?.();
        if (!overlay?.active) {
            this.stopPickupAnimationLoop();
            return;
        }
        this.ensurePickupAnimationLoop();

        const width = gameplayCanvas.width;
        const height = gameplayCanvas.height;
        const now = this.getNow();
        const fx = this.ensurePickupFx(overlay, now);
        const elapsed = Math.max(0, (now - fx.startTime) / 1000);
        const minSide = Math.min(width, height);
        const baseSize = Math.floor(minSide * 0.62);
        const popIn = this.easeOutBack(Math.min(1, elapsed / 0.35));
        const wobble = 1 + Math.sin(elapsed * 5.2) * 0.04;
        const size = Math.round(baseSize * (0.78 + popIn * 0.22) * wobble);
        const centerX = width / 2;
        const centerY = height / 2;
        const floatY = Math.sin(elapsed * 2.4) * 6;

        const boxX = Math.round(centerX - size / 2);
        const boxY = Math.round(centerY - size / 2 + floatY);

        ctx.save();
        this.drawPickupFrame(ctx, { x: boxX, y: boxY, size, elapsed });
        ctx.restore();

        const sprite = this.getPickupSprite(overlay);
        if (sprite) {
            const spriteArea = Math.floor(size * 0.48);
            const baseStep = Math.max(2, Math.floor(spriteArea / 8));
            const popScale = 1 + Math.sin(elapsed * 8.2) * 0.1;
            const step = Math.max(2, Math.floor(baseStep * popScale));
            const spriteSize = step * 8;
            const spriteX = Math.round(centerX - spriteSize / 2);
            const spriteY = Math.round(boxY + size / 2 - spriteSize / 2);
            this.canvasHelper.drawSprite(ctx, sprite, spriteX, spriteY, step);
        }

    }

    drawPickupFrame(ctx, { x, y, size, elapsed = 0 }) {
        const accent = this.paletteManager.getColor(2) || '#FFF1E8';
        ctx.save();
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, 'rgba(7, 11, 26, 0.96)');
        gradient.addColorStop(0.55, 'rgba(14, 25, 48, 0.96)');
        gradient.addColorStop(1, 'rgba(9, 14, 32, 0.96)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, size, size);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = Math.max(10, Math.floor(size * 0.08));
        ctx.shadowOffsetY = Math.max(4, Math.floor(size * 0.02));

        const border = Math.max(2, Math.floor(size * 0.025));
        ctx.lineWidth = border;
        ctx.strokeStyle = `rgba(255, 241, 232, ${(0.35 + 0.25 * Math.sin(elapsed * 4)).toFixed(2)})`;
        ctx.strokeRect(x + border / 2, y + border / 2, size - border, size - border);

        const innerPad = Math.max(10, Math.floor(size * 0.08));
        const stripeHeight = Math.max(6, Math.floor(size * 0.05));
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = accent;
        ctx.fillRect(x + innerPad, y + innerPad, size - innerPad * 2, stripeHeight);
        ctx.fillRect(x + innerPad, y + size - innerPad - stripeHeight, size - innerPad * 2, stripeHeight);
        ctx.restore();
    }

    drawPickupRings(ctx, { centerX, centerY, size, elapsed = 0 }) {
        ctx.save();
        const primaryRadius = size * 0.35 + Math.sin(elapsed * 3.2) * size * 0.05;
        const lineWidth = Math.max(2, Math.floor(size * 0.02));
        const alpha = 0.35 + 0.15 * Math.sin(elapsed * 5.4);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(255, 241, 232, ${alpha.toFixed(2)})`;
        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, primaryRadius + i * size * 0.07, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = 'rgba(100, 181, 246, 0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, primaryRadius * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    ensurePickupFx(overlay, now = this.getNow()) {
        const id = `${overlay.spriteGroup || ''}:${overlay.spriteType || ''}:${overlay.name || ''}`;
        if (this.pickupFx.id !== id) {
            this.pickupFx = {
                id,
                startTime: now
            };
        }
        return this.pickupFx;
    }

    ensurePickupAnimationLoop() {
        if (this.pickupAnimationHandle) return;
        const step = () => {
            if (!this.gameState.isPickupOverlayActive?.()) {
                this.stopPickupAnimationLoop();
                return;
            }
            this.pickupAnimationHandle = this.schedulePickupFrame(step);
            this.renderer?.draw?.();
        };
        this.pickupAnimationHandle = this.schedulePickupFrame(step);
    }

    stopPickupAnimationLoop() {
        if (!this.pickupAnimationHandle) return;
        this.cancelPickupFrame(this.pickupAnimationHandle);
        this.pickupAnimationHandle = 0;
    }

    schedulePickupFrame(fn) {
        if (typeof requestAnimationFrame === 'function') {
            return requestAnimationFrame(fn);
        }
        return setTimeout(fn, 1000 / 30);
    }

    cancelPickupFrame(id) {
        if (typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(id);
        } else {
            clearTimeout(id);
        }
    }

    easeOutBack(t = 0) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const clamped = this.clamp(t, 0, 1);
        return 1 + c3 * Math.pow(clamped - 1, 3) + c1 * Math.pow(clamped - 1, 2);
    }

    easeOutQuad(t = 0) {
        const clamped = this.clamp(t, 0, 1);
        return 1 - (1 - clamped) * (1 - clamped);
    }

    clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    getNow() {
        if (typeof performance !== 'undefined' && performance.now) {
            return performance.now();
        }
        return Date.now();
    }

    getPickupSprite(overlay = null) {
        if (!overlay?.spriteGroup) return null;
        const factory = this.spriteFactory;
        if (!factory) return null;
        switch (overlay.spriteGroup) {
            case 'object': {
                const sprites = factory.getObjectSprites();
                return sprites?.[overlay.spriteType] || null;
            }
            default:
                return null;
        }
    }

    drawGameOverScreen() {
        const ctx = this.ctx;
        if (!ctx) return;
        this.entityRenderer.cleanupEnemyLabels();
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const reason = this.gameState.getGameOverReason();
        const isVictory = reason === 'victory';
        const endingText = isVictory
            ? (this.gameState.getActiveEndingText() || '')
            : '';
        const hasEndingText = isVictory && endingText.trim().length > 0;

        const centerX = Math.round(this.canvas.width / 2) + 0.5;
        const centerY = Math.round(this.canvas.height / 2) + 0.5;
        if (hasEndingText) {
            ctx.save();
            const padding = Math.floor(this.canvas.width * 0.08);
            const availableWidth = Math.max(32, this.canvas.width - padding * 2);
            const messageFontSize = Math.max(12, Math.floor(this.canvas.height / 14));
            const lineHeight = Math.round(messageFontSize * 1.4);
            const textFont = `bold ${messageFontSize}px "Press Start 2P", "VT323", monospace`;
            ctx.font = textFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#F8FAFC';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.lineWidth = Math.max(1, Math.floor(messageFontSize / 10));

            const wrapLines = (text) => {
                const sections = text.replace(/\r\n/g, '\n').split(/\n+/).map((section) => section.trim()).filter(Boolean);
                if (!sections.length) return [];
                const lines = [];
                sections.forEach((section, index) => {
                    const words = section.split(/\s+/);
                    let current = '';
                    words.forEach((word) => {
                        const next = current ? `${current} ${word}` : word;
                        if (ctx.measureText(next).width > availableWidth && current) {
                            lines.push(current);
                            current = word;
                        } else {
                            current = next;
                        }
                    });
                    if (current) {
                        lines.push(current);
                    }
                    if (index < sections.length - 1) {
                        lines.push('');
                    }
                });
                return lines.length ? lines : [''];
            };

            const lines = wrapLines(endingText);
            const totalHeight = lines.length * lineHeight;
            const offset = Math.max(lineHeight, Math.floor(messageFontSize * 1.2));
            let startY = Math.max(padding, Math.floor(centerY - totalHeight - offset));
            if (!Number.isFinite(startY)) {
                startY = padding;
            }
            let cursorY = startY;
            lines.forEach((line) => {
                if (line.trim().length) {
                    const alignedY = Math.round(cursorY) + 0.5;
                    ctx.strokeText(line, centerX, alignedY);
                    ctx.fillText(line, centerX, alignedY);
                }
                cursorY += lineHeight;
            });
            ctx.restore();
        }

        ctx.fillStyle = '#FFFFFF';
        let fontSize = Math.max(8, Math.floor(this.canvas.height / 10));
        const endFont = `bold ${fontSize}px "Press Start 2P", monospace`;
        ctx.font = endFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = Math.max(1, Math.floor(fontSize / 12));
        ctx.strokeText(isVictory ? 'The End' : 'Game Over', centerX, centerY);
        ctx.fillText(isVictory ? 'The End' : 'Game Over', centerX, centerY);

        if (!this.gameState.canResetAfterGameOver) {
            ctx.restore();
            return;
        }
        ctx.save();
        const blink = ((Date.now() / 500) % 2) > 1 ? 0.3 : 0.95;
        ctx.fillStyle = `rgba(100, 181, 246, ${blink.toFixed(2)})`;
        fontSize = Math.max(5, Math.floor(this.canvas.height / 15));
        ctx.font = `bold ${fontSize}px "Press Start 2P", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const retryY = Math.round(this.canvas.height / 1.5) + 0.5;
        ctx.strokeText(isVictory ? 'Play Again?' : 'Try Again?', centerX, retryY);
        ctx.fillText(isVictory ? 'Play Again?' : 'Try Again?', centerX, retryY);
        ctx.restore();
        ctx.restore();
    }
}

if (typeof window !== 'undefined') {
    window.RendererOverlayRenderer = RendererOverlayRenderer;
}
