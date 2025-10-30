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
        resetButton.addEventListener('click', () => gameEngine.resetGame());
    }

    static bindTouchPad(gameEngine) {
        const touchPad = document.querySelectorAll('.game-touch-pad .pad-button[data-direction]');
        const directionMap = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, -1],
            down: [0, 1]
        };
        touchPad.forEach((btn) => {
            btn.addEventListener('touchstart', (ev) => {
                ev.preventDefault();
                const dir = btn.dataset.direction;
                if (!dir) return;
                const delta = directionMap[dir];
                if (delta) {
                    gameEngine.tryMove(delta[0], delta[1]);
                }
            }, { passive: false });
        });
    }

    static setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
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

        const initialTab = document.querySelector('.tab-button.active');
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
            const baseSize = Math.min(availableWidth, availableHeight);
            const size = Math.max(128, baseSize * 0.9);
            gameCanvas.style.width = `${size}px`;
            gameCanvas.style.height = `${size}px`;
        };

        const scheduleResize = () => window.requestAnimationFrame(resizeCanvas);

        window.addEventListener('resize', scheduleResize);
        document.addEventListener('game-tab-activated', scheduleResize);

        scheduleResize();
    }
}

TinyRPGApplication.boot();
window.TinyRPGApplication = TinyRPGApplication;
