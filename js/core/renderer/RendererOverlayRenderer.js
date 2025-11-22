const getOverlayText = (key, fallback = '') => {
    const value = TextResources.get(key, fallback);
    return value || fallback || '';
};

const formatOverlayText = (key, params = {}, fallback = '') => {
    const value = TextResources.format(key, params, fallback);
    return value || fallback || '';
};

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

    drawLevelUpOverlay(ctx, gameplayCanvas) {
        if (!ctx || !gameplayCanvas) return;
        const overlay = this.gameState.getLevelUpOverlay?.();
        if (!overlay?.active) return;
        this.entityRenderer.cleanupEnemyLabels();
        const choices = Array.isArray(overlay.choices) ? overlay.choices : [];
        const width = gameplayCanvas.width;
        const height = gameplayCanvas.height;
        const centerX = width / 2;
        const title = getOverlayText('skills.levelUpTitle', 'Level Up!');
        const pending = Math.max(0, this.gameState.getPendingLevelUpChoices?.() || 0);
        const accent = this.paletteManager.getColor(7) || '#FFF1E8';
        const accentStrong = this.paletteManager.getColor(13) || accent;

        ctx.save();
        ctx.fillStyle = 'rgba(5, 7, 12, 0.88)';
        ctx.fillRect(0, 0, width, height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = accent;
        const titleFont = Math.max(8, Math.floor(height / 34));
        const topPadding = Math.floor(height * 0.05);
        ctx.font = `${titleFont}px "Press Start 2P", "VT323", monospace`;
        const titleY = topPadding;
        ctx.fillText(title, centerX, titleY);

        let nextY = titleY + titleFont + Math.floor(height * 0.02);
        if (pending > 0) {
            const pendingText = formatOverlayText('skills.pendingLabel', { value: pending }, '');
            if (pendingText) {
                const pendingFont = Math.max(6, Math.floor(height / 58));
                ctx.font = `${pendingFont}px monospace`;
                ctx.fillStyle = accentStrong;
                ctx.fillText(pendingText, centerX, nextY);
                nextY += pendingFont + Math.floor(height * 0.02);
            }
        }
        nextY += Math.floor(height * 0.06);

        const cardCount = Math.max(1, choices.length || 1);
        const perRow = cardCount === 2 ? 1 : cardCount;
        const rows = Math.max(1, Math.ceil(cardCount / perRow));
        const marginX = Math.max(4, Math.floor(width * 0.025));
        const gapX = Math.max(5, Math.floor(width * 0.02));
        const gapY = Math.max(6, Math.floor(height * 0.018));
        const usableWidth = Math.max(70, width - marginX * 2);
        const cardWidth = Math.max(105, Math.min(Math.floor(usableWidth / perRow), Math.floor(width * 0.9)));
        const totalCardsWidth = cardWidth * perRow + gapX * Math.max(0, perRow - 1);
        const startX = Math.round((width - totalCardsWidth) / 2);
        const cardYStart = Math.round(Math.max(nextY + Math.floor(height * 0.01), height * 0.18));
        const maxCardHeight = Math.max(100, Math.floor((height - cardYStart - gapY * (rows - 1)) / rows));
        const cardHeight = Math.min(Math.max(100, maxCardHeight), Math.floor(height * 0.36));

        if (!choices.length) {
            const allText = getOverlayText('skills.allUnlocked', '');
            if (allText) {
                ctx.font = `${Math.max(12, Math.floor(height / 16))}px monospace`;
                ctx.fillStyle = accentStrong;
                ctx.fillText(allText, centerX, cardYStart + cardHeight / 2);
            }
            ctx.restore();
            return;
        }

        choices.forEach((choice, index) => {
            const row = Math.floor(index / perRow);
            const col = index % perRow;
            const px = Math.round(startX + col * (cardWidth + gapX));
            const py = Math.round(cardYStart + row * (cardHeight + gapY));
            this.drawLevelUpCard(ctx, {
                x: px,
                y: py,
                width: cardWidth,
                height: cardHeight,
                active: overlay.cursor === index,
                data: choice
            });
        });

        ctx.restore();
    }

    drawLevelUpCard(ctx, { x, y, width, height, active = false, data = null }) {
        ctx.save();
        const accent = active ? (this.paletteManager.getColor(13) || '#64b5f6') : (this.paletteManager.getColor(6) || '#C2C3C7');
        ctx.fillStyle = active ? 'rgba(100, 181, 246, 0.16)' : 'rgba(0, 0, 0, 0.55)';
        ctx.strokeStyle = accent;
        ctx.lineWidth = Math.max(2, Math.floor(width * 0.015));
        ctx.shadowColor = active ? 'rgba(100, 181, 246, 0.4)' : 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = active ? Math.max(8, Math.floor(width * 0.05)) : Math.max(4, Math.floor(width * 0.02));
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

        const padding = Math.max(6, Math.floor(width * 0.05));
        const name = data?.nameKey
            ? getOverlayText(data.nameKey, data.id || '')
            : (data?.id || '');
        const description = data?.descriptionKey
            ? getOverlayText(data.descriptionKey, '')
            : '';

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const nameFont = Math.max(9, Math.floor(height / 12));
        ctx.font = `${nameFont}px "Press Start 2P", "VT323", monospace`;
        ctx.fillText(name, x + padding, y + padding);

        if (data?.icon) {
            ctx.font = `${Math.max(9, Math.floor(height / 11))}px monospace`;
            ctx.textAlign = 'right';
            ctx.fillText(data.icon, x + width - padding, y + padding + Math.max(0, Math.floor(height * 0.02)));
            ctx.textAlign = 'left';
        }

        ctx.font = `${Math.max(8, Math.floor(height / 18))}px monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        const descTopGap = Math.max(6, Math.floor(height * 0.08));
        const textY = y + padding + nameFont + descTopGap;
        const lineHeight = Math.max(9, Math.floor(height / 16));
        this.drawWrappedText(ctx, description, x + padding, textY, width - padding * 2, lineHeight, 2);

        ctx.restore();
    }

    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = null) {
        if (!ctx || !text) return;
        const words = text.split(/\s+/).filter(Boolean);
        let line = '';
        let offsetY = y;
        let linesDrawn = 0;
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const candidate = line ? `${line} ${word}` : word;
            const metrics = ctx.measureText(candidate);
            const wouldOverflow = metrics.width > maxWidth && line;
            const hitMaxLines = maxLines && linesDrawn >= maxLines - 1;
            if (wouldOverflow || hitMaxLines) {
                ctx.fillText(line, x, offsetY);
                line = word;
                offsetY += lineHeight;
                linesDrawn += 1;
                if (maxLines && linesDrawn >= maxLines) {
                    const remaining = words.slice(i).join(' ');
                    const truncated = `${remaining}`.slice(0, 32).trim();
                    const suffix = truncated ? `${truncated}...` : '...';
                    ctx.fillText(suffix, x, offsetY);
                    return;
                }
            } else {
                line = candidate;
            }
        }
        if (line) {
            ctx.fillText(line, x, offsetY);
        }
    }

    drawLevelUpOverlayFull(ctx) {
        if (!ctx?.canvas) return;
        this.drawLevelUpOverlay(ctx, { width: ctx.canvas.width, height: ctx.canvas.height });
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

    drawLevelUpOverlayFull(ctx) {
        if (!ctx?.canvas) return;
        this.drawLevelUpOverlay(ctx, { width: ctx.canvas.width, height: ctx.canvas.height });
    }
}

if (typeof window !== 'undefined') {
    window.RendererOverlayRenderer = RendererOverlayRenderer;
}
