class RendererOverlayRenderer extends RendererModuleBase {
    constructor(renderer) {
        super(renderer);
        this.introData = { title: 'Tiny RPG Maker', author: '' };
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
