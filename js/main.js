/**
 * Main entry point that boots the game and the editor.
 */
'use strict';

class TinyRPGApplication {
    static boot() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeApplication();
            this.setupResponsiveCanvas();
        });
    }

    static initializeApplication() {
        this.setupTabs();

        const gameCanvas = document.getElementById('game-canvas');
        if (!gameCanvas) return;

        const gameEngine = new GameEngine(gameCanvas);
        this.loadSharedGameIfAvailable(gameEngine);

        window.TinyRPGMaker = {
            exportGameData: () => gameEngine.exportGameData(),
            importGameData: (data) => gameEngine.importGameData(data),
            getState: () => gameEngine.getState(),
            draw: () => gameEngine.draw(),
            resetGame: () => gameEngine.resetGame(),
            updateTile: (tileId, data) => gameEngine.updateTile(tileId, data),
            setMapTile: (x, y, tileId) => gameEngine.setMapTile(x, y, tileId),
            getTiles: () => gameEngine.getTiles(),
            getTileMap: () => gameEngine.getTileMap(),
            getTilePresetNames: () => gameEngine.getTilePresetNames(),
            getVariables: () => gameEngine.getVariableDefinitions(),
            setVariableDefault: (variableId, value) => gameEngine.setVariableDefault(variableId, value),
            addSprite: (npc) => gameEngine.addSprite(npc),
            getSprites: () => gameEngine.getSprites()
        };

        const editorManager = new EditorManager(gameEngine);
        this.bindResetButton(gameEngine);
        this.bindTouchPad(gameEngine);

        console.log('Tiny RPG Maker engine initialized successfully.');
    }

    static bindResetButton(gameEngine) {
        const resetButton = document.getElementById('btn-reset');
        if (!resetButton) return;

        const getBaseUrl = () => `${window.location.origin}${window.location.pathname}`;

        const openNewGameTab = (url) => {
            const popup = window.open(url, '_blank', 'noopener');
            if (popup) {
                return true;
            }
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.style.position = 'absolute';
            anchor.style.left = '-9999px';
            document.body.appendChild(anchor);
            anchor.click();
            requestAnimationFrame(() => anchor.remove());
            return true;
        };

        const handleClick = (ev) => {
            const isEditorMode = document.body.classList.contains('editor-mode');
            if (isEditorMode) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                const targetUrl = getBaseUrl();
                openNewGameTab(targetUrl);
                return false;
            }
            gameEngine.resetGame();
            return false;
        };

        const updateButtonState = () => {
            const isEditorMode = document.body.classList.contains('editor-mode');
            if (isEditorMode) {
                resetButton.textContent = 'Novo jogo';
                resetButton.setAttribute('aria-label', 'Criar um novo jogo do zero em outra aba');
            } else {
                resetButton.textContent = 'Reiniciar';
                resetButton.setAttribute('aria-label', 'Reiniciar a partida atual');
            }
        };

        resetButton.addEventListener('click', handleClick);
        document.addEventListener('game-tab-activated', updateButtonState);
        document.addEventListener('editor-tab-activated', updateButtonState);
        updateButtonState();
    }

    static bindTouchPad(gameEngine) {
        const touchButtons = document.querySelectorAll('.game-touch-pad .pad-button[data-direction]');
        const toggleButton = document.getElementById('touch-controls-toggle');
        const hideButton = document.getElementById('touch-controls-hide');
        const padContainer = document.getElementById('mobile-touch-pad');

        if (!touchButtons.length || !toggleButton || !padContainer) return;

        const directionMap = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, -1],
            down: [0, 1]
        };

        touchButtons.forEach((btn) => {
            btn.addEventListener('touchstart', (ev) => {
                ev.preventDefault();
                const dir = btn.dataset.direction;
                const delta = directionMap[dir];
                if (delta) {
                    gameEngine.tryMove(delta[0], delta[1]);
                }
            }, { passive: false });
        });

        const updateToggleState = () => {
            const isVisible = document.body.classList.contains('touch-controls-visible');
            toggleButton.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
            toggleButton.setAttribute('aria-pressed', isVisible ? 'true' : 'false');
            padContainer.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
            if (!isVisible) {
                toggleButton.textContent = 'Exibir controles';
            }
            if (hideButton) {
                hideButton.hidden = !isVisible;
            }
        };

        toggleButton.addEventListener('click', () => {
            document.body.classList.add('touch-controls-visible');
            updateToggleState();
        });

        hideButton?.addEventListener('click', () => {
            document.body.classList.remove('touch-controls-visible');
            updateToggleState();
        });

        const hideControls = () => {
            document.body.classList.remove('touch-controls-visible');
            updateToggleState();
        };

        document.addEventListener('editor-tab-activated', hideControls);
        document.addEventListener('game-tab-activated', updateToggleState);

        updateToggleState();
    }

    static setupTabs() {
        const tabs = document.querySelectorAll('.tab-button[data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');

        const applyLayoutMode = (tabName) => {
            const isEditor = tabName === 'editor';
            const isGame = tabName === 'game';
            document.body.classList.toggle('editor-mode', isEditor);
            document.body.classList.toggle('game-mode', isGame);
        };

        tabs.forEach((btn) => {
            btn.addEventListener('click', () => {
                tabs.forEach((other) => {
                    other.classList.remove('active');
                    other.setAttribute('aria-selected', 'false');
                });

                tabContents.forEach((content) => content.classList.remove('active'));

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const targetId = `tab-${btn.dataset.tab}`;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                applyLayoutMode(btn.dataset.tab);

                if (btn.dataset.tab === 'game') {
                    document.dispatchEvent(new CustomEvent('game-tab-activated'));
                }

                if (btn.dataset.tab === 'editor') {
                    document.dispatchEvent(new CustomEvent('editor-tab-activated'));
                }
            });
        });

        const initialTab = document.querySelector('.tab-button.active[data-tab]');
        if (initialTab) {
            applyLayoutMode(initialTab.dataset.tab);
            if (initialTab.dataset.tab === 'game') {
                document.dispatchEvent(new CustomEvent('game-tab-activated', { detail: { initial: true } }));
            }
            if (initialTab.dataset.tab === 'editor') {
                document.dispatchEvent(new CustomEvent('editor-tab-activated', { detail: { initial: true } }));
            }
        }
    }

    static loadSharedGameIfAvailable(gameEngine) {
        const share = window.TinyRPGShare;
        if (!share?.extractGameDataFromLocation) return;
        const data = share.extractGameDataFromLocation(window.location);
        if (data) {
            gameEngine.importGameData(data);
        }
    }

    static setupResponsiveCanvas() {
        const gameCanvas = document.getElementById('game-canvas');
        const gameContainer = document.getElementById('game-container');
        if (!gameCanvas || !gameContainer) {
            return;
        }

        const resizeCanvas = () => {
            const rect = gameContainer.getBoundingClientRect();
            const availableWidth = rect.width || window.innerWidth;
            const availableHeight = rect.height || window.innerHeight;
            const aspectRatio = (gameCanvas.height || 1) / (gameCanvas.width || 1);
            const maxWidth = Math.max(128, availableWidth * 0.9);
            const maxHeight = Math.max(128, availableHeight * 0.9);
            const widthLimitedByHeight = maxHeight / aspectRatio;
            const targetWidth = Math.min(maxWidth, widthLimitedByHeight);
            const targetHeight = targetWidth * aspectRatio;
            gameCanvas.style.width = `${targetWidth}px`;
            gameCanvas.style.height = `${targetHeight}px`;
        };

        const scheduleResize = () => window.requestAnimationFrame(resizeCanvas);

        window.addEventListener('resize', scheduleResize);
        document.addEventListener('game-tab-activated', scheduleResize);

        scheduleResize();
    }
}

TinyRPGApplication.boot();
window.TinyRPGApplication = TinyRPGApplication;
