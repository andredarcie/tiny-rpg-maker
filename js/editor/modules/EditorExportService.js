class EditorExportService {
    constructor() {
        this.btn = typeof document !== 'undefined' ? document.getElementById('btn-generate-html') : null;
        if (this.btn) {
            this.btn.addEventListener('click', (ev) => {
                setTimeout(() => this.exportProjectAsHtml(), 0);
            });
        }
    }

    async exportProjectAsHtml() {
        try {
            const gameData = (typeof window !== 'undefined' && window.TinyRPGMaker && typeof window.TinyRPGMaker.exportGameData === 'function')
                ? window.TinyRPGMaker.exportGameData()
                : null;

            if (!gameData) {
                alert('Unable to read current project data.');
                return;
            }

            const code = (typeof ShareUtils !== 'undefined' && typeof ShareUtils.encode === 'function')
                ? ShareUtils.encode(gameData)
                : '';
            const downloadError = 'Unable to download project assets. Please run Tiny RPG Maker from an HTTP/HTTPS server (not file://) to export HTML.';

            let cssText = '';
            const linkEl = document.querySelector('link[rel="stylesheet"][href]');
            if (linkEl) {
                const href = linkEl.getAttribute('href');
                try {
                    const resp = await fetch(href);
                    if (resp.ok) {
                        cssText = await resp.text();
                    } else {
                        alert(downloadError);
                        return;
                    }
                } catch (e) {
                    alert(downloadError);
                    return;
                }
            }

            const scripts = {};
            const locale = (typeof TextResources !== 'undefined' && typeof TextResources.getLocale === 'function')
                ? (TextResources.getLocale() || 'en-US')
                : 'en-US';
            const scriptSrcs = Array.from(document.querySelectorAll('script[src]'))
                .map((s) => s.getAttribute('src'))
                .filter((src) => src && !src.includes('/editor/'));
            for (const src of scriptSrcs) {
                try {
                    const resp = await fetch(src);
                    if (resp.ok) {
                        scripts[src] = await resp.text();
                    } else {
                        alert(downloadError);
                        return;
                    }
                } catch (e) {
                    alert(downloadError);
                    return;
                }
            }

            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                alert('game-container not found');
                return;
            }
            const containerClone = gameContainer.cloneNode(true);

            const allScripts = Object.values(scripts).join('');

            const html = `<!DOCTYPE html>
                <html lang="${locale}">
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Tiny RPG</title>
                <style>${cssText}
                #game-container{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;background-color:#000;overflow:hidden}
                </style>
                <script>
                window.__TINY_RPG_EXPORT_MODE = true;
                window.__TINY_RPG_SHARED_CODE = ${JSON.stringify(code)};
                if(!location.hash) try{ location.hash = '#' + window.__TINY_RPG_SHARED_CODE; }catch(e){}
                </script>
                </head>
                <body class="game-mode">
                <div class="app">
                <main>
                <div class="tab-content active" id="tab-game">
                ${containerClone.outerHTML}
                </div>
                </main>
                </div>
                <script>
                ${allScripts}
                </script>
                </body>
            </html>`;

            const filename = `index.html`;
            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed', error);
            alert('Export failed. See console for details.');
        }
    }
}

if (typeof window !== 'undefined') {
    window.EditorExportService = EditorExportService;
    document.addEventListener('DOMContentLoaded', () => {
        try { window.__editorExportService = new EditorExportService(); } catch (e) { /* ignore */ }
    });
}
