
import { getTinyRpgApi } from '../../core/TinyRpgApi';
import { ShareUtils } from '../../core/ShareUtils';
import { TextResources } from '../../core/TextResources';
class EditorExportService {
    constructor() {
        this.btn = typeof document !== 'undefined' ? document.getElementById('btn-generate-html') : null;
        if (this.btn) {
            this.btn.addEventListener('click', (_ev) => {
                setTimeout(() => this.exportProjectAsHtml(), 0);
            });
        }
    }

    async exportProjectAsHtml() {
        try {
            const api = getTinyRpgApi();
            const gameData = api?.exportGameData ? api.exportGameData() : null;

            if (!gameData) {
                alert('Unable to read current project data.');
                return;
            }

            const code = ShareUtils?.encode ? ShareUtils.encode(gameData) : '';
            const downloadError = 'Unable to download project assets. Please run Tiny RPG Studio from an HTTP/HTTPS server (not file://) to export HTML.';

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
                } catch {
                    alert(downloadError);
                    return;
                }
            }

            const scripts = {};
            const skippedScripts = [];
            let bundleSource = '';
            const bundleSrc = 'export.bundle.js';
            try {
                const bundleResp = await fetch(bundleSrc);
                if (bundleResp.ok) {
                    bundleSource = await bundleResp.text();
                    scripts[bundleSrc] = bundleSource;
                }
            } catch {
                // fallback handled below
            }
            const locale = TextResources?.getLocale?.() || 'en-US';
            const legacyIndexPath = 'legacy/index.html';
            const fallbackScriptSrcs = [
                'js/core/TextResources.js',
                'js/core/SkillDefinitions.js',
                'js/core/state/StateWorldManager.js',
                'js/core/state/StateSkillManager.js',
                'js/core/state/StatePlayerManager.js',
                'js/core/state/StateDialogManager.js',
                'js/core/state/StateVariableManager.js',
                'js/core/state/StateEnemyManager.js',
                'js/core/state/StateObjectManager.js',
                'js/core/state/StateItemManager.js',
                'js/core/state/GameStateLifecycle.js',
                'js/core/state/GameStateScreenManager.js',
                'js/core/state/GameStateWorldFacade.js',
                'js/core/state/GameStateDataFacade.js',
                'js/core/state/StateDataManager.js',
                'js/core/GameState.js',
                'js/core/sprites/PlayerSprites.js',
                'js/core/sprites/NpcSprites.js',
                'js/core/sprites/EnemySprites.js',
                'js/core/sprites/ObjectSprites.js',
                'js/core/sprites/SpriteMatrixRegistry.js',
                'js/core/renderer/RendererConstants.js',
                'js/core/renderer/RendererPalette.js',
                'js/core/renderer/RendererSpriteFactory.js',
                'js/core/renderer/RendererCanvasHelper.js',
                'js/core/renderer/RendererTileRenderer.js',
                'js/core/renderer/RendererEntityRenderer.js',
                'js/core/renderer/RendererDialogRenderer.js',
                'js/core/renderer/RendererHudRenderer.js',
                'js/core/renderer/RendererMinimapRenderer.js',
                'js/core/renderer/RendererModuleBase.js',
                'js/core/renderer/RendererEffectsManager.js',
                'js/core/renderer/RendererTransitionManager.js',
                'js/core/renderer/RendererOverlayRenderer.js',
                'js/core/share/ShareConstants.js',
                'js/core/share/ShareMath.js',
                'js/core/share/ShareBase64.js',
                'js/core/share/ShareTextCodec.js',
                'js/core/share/ShareVariableCodec.js',
                'js/core/share/ShareMatrixCodec.js',
                'js/core/share/SharePositionCodec.js',
                'js/core/share/ShareDataNormalizer.js',
                'js/core/share/ShareEncoder.js',
                'js/core/share/ShareDecoder.js',
                'js/core/share/ShareUrlHelper.js',
                'js/core/TileDefinitions.js',
                'js/core/NPCDefinitions.js',
                'js/core/EnemyDefinitions.js',
                'js/core/ObjectDefinitions.js',
                'js/editor/modules/EditorConstants.js',
                'js/editor/modules/EditorDomCache.js',
                'js/editor/modules/EditorState.js',
                'js/editor/modules/EditorHistoryManager.js',
                'js/editor/modules/EditorShareService.js',
                'js/editor/manager/EditorManagerModule.js',
                'js/editor/manager/EditorEventBinder.js',
                'js/editor/manager/EditorUIController.js',
                'js/editor/manager/EditorInteractionController.js',
                'js/editor/modules/renderers/EditorRendererBase.js',
                'js/editor/modules/renderers/EditorCanvasRenderer.js',
                'js/editor/modules/renderers/EditorTilePanelRenderer.js',
                'js/editor/modules/renderers/EditorNpcRenderer.js',
                'js/editor/modules/renderers/EditorEnemyRenderer.js',
                'js/editor/modules/renderers/EditorObjectRenderer.js',
                'js/editor/modules/renderers/EditorWorldRenderer.js',
                'js/editor/modules/EditorRenderService.js',
                'js/editor/modules/EditorTileService.js',
                'js/editor/modules/EditorNpcService.js',
                'js/editor/modules/EditorEnemyService.js',
                'js/editor/modules/EditorObjectService.js',
                'js/editor/modules/EditorVariableService.js',
                'js/editor/modules/EditorWorldService.js',
                'js/editor/EditorManager.js',
                'js/core/ShareUtils.js',
                'js/core/TileManager.js',
                'js/core/NPCManager.js',
                'js/core/InputManager.js',
                'js/core/Renderer.js',
                'js/core/engine/DialogManager.js',
                'js/core/engine/InteractionManager.js',
                'js/core/engine/EnemyManager.js',
                'js/core/engine/MovementManager.js',
                'js/core/GameEngine.js',
                'js/main.js',
                'js/editor/modules/EditorExportService.js'
            ];
            const legacyScriptSrcs = [];
            if (!bundleSource) try {
                const legacyResp = await fetch(legacyIndexPath);
                if (legacyResp.ok) {
                    const legacyHtml = await legacyResp.text();
                    const doc = new DOMParser().parseFromString(legacyHtml, 'text/html');
                    legacyScriptSrcs.push(
                        ...Array.from(doc.querySelectorAll('script[src]'))
                            .filter((script) => script.getAttribute('type') !== 'module')
                            .map((s) => s.getAttribute('src'))
                            .filter((src) =>
                                src &&
                                (src.startsWith('js/') || src.startsWith('./js/')) &&
                                !src.includes('/editor/')
                            )
                    );
                }
            } catch {
                // fallback handled below
            }

            const scriptSrcs = (legacyScriptSrcs.length && legacyScriptSrcs.some((src) => src.includes('js/main.js'))
                ? legacyScriptSrcs
                : fallbackScriptSrcs);
            for (const src of scriptSrcs) {
                if (bundleSource) break;
                try {
                    const resp = await fetch(src);
                    if (resp.ok) {
                        const text = await resp.text();
                        const hasModuleSyntax = /^(?:\s*import\s+[\w*{]|\s*export\s+)/m.test(text);
                        if (hasModuleSyntax) {
                            skippedScripts.push(src);
                        } else {
                            scripts[src] = text;
                        }
                    } else {
                        alert(downloadError);
                        return;
                    }
                } catch {
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
                canvas{image-rendering:pixelated;image-rendering:crisp-edges}
                </style>
                <script>
                console.log('[TinyRPG Export] Booting exported build');
                globalThis.__TINY_RPG_EXPORT_MODE = true;
                globalThis.__TINY_RPG_SHARED_CODE = ${JSON.stringify(code)};
                console.log('[TinyRPG Export] Share code ready', { length: (globalThis.__TINY_RPG_SHARED_CODE || '').length });
                if(!location.hash) try{ location.hash = '#' + globalThis.__TINY_RPG_SHARED_CODE; }catch{}
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
            console.log('[TinyRPG Export] Loading scripts', { count: ${Object.keys(scripts).length}, requested: ${scriptSrcs.length}, skipped: ${JSON.stringify(skippedScripts)}, bundle: ${Boolean(bundleSource)} });
                ${allScripts}
                console.log('[TinyRPG Export] Scripts executed');
                </script>
                </body>
            </html>`;

            const rawTitle = typeof gameData?.title === 'string' ? gameData.title : '';
            const safeTitle = rawTitle
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .toLowerCase();
            const versionValue = typeof ShareConstants !== 'undefined' && ShareConstants?.VERSION
                ? ShareConstants.VERSION
                : 1;
            const filename = `${safeTitle || 'tiny-rpg'}-v${versionValue}.html`;
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

export { EditorExportService };
