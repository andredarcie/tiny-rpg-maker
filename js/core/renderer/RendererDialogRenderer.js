class RendererDialogRenderer {
    constructor(gameState, paletteManager) {
        this.gameState = gameState;
        this.paletteManager = paletteManager;
    }

    drawDialog(ctx, canvas) {
        const dialog = this.gameState.getDialog();
        if (!dialog.active || !dialog.text) return;
        if (!dialog.page || dialog.page < 1) {
            dialog.page = 1;
        }
        this.drawDialogBox(ctx, canvas, dialog);
    }

    drawDialogBox(ctx, canvas, dialog) {
        const pad = 6;
        const w = canvas.width - pad * 2;
        const h = 40;
        const x = pad;
        const y = canvas.height - h - pad;

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(x, y, w, h);

        const accent = this.paletteManager.getColor(7) || "#FFF1E8";
        ctx.strokeStyle = accent;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = accent;
        ctx.font = "10px monospace";

        const lineHeight = 12;
        const maxWidth = w - 16;

        const pages = this.calculateDialogPages(dialog, ctx, maxWidth, lineHeight, h - 8);
        const totalPages = Math.max(1, pages.length);
        if (dialog.maxPages !== totalPages) {
            dialog.maxPages = totalPages;
        }
        const currentIndex = Math.min(Math.max((dialog.page ?? 1) - 1, 0), totalPages - 1);
        if (dialog.page !== currentIndex + 1) {
            dialog.page = currentIndex + 1;
        }
        const lines = pages[currentIndex] || [];

        let ty = y + 14;
        for (const line of lines) {
            ctx.fillText(line, x + 8, ty);
            ty += lineHeight;
        }
    }

    calculateDialogPages(dialog, ctx, maxWidth, lineHeight, boxHeight) {
        const words = (dialog.text || '').split(/\s+/);
        let line = "";
        const lines = [];

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line.trim());
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());

        const linesPerPage = Math.max(1, Math.floor(boxHeight / lineHeight));
        const pages = [];

        for (let i = 0; i < lines.length; i += linesPerPage) {
            pages.push(lines.slice(i, i + linesPerPage));
        }

        return pages;
    }
}

if (typeof window !== 'undefined') {
    window.RendererDialogRenderer = RendererDialogRenderer;
}

