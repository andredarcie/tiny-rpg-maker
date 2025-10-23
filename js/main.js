/**
 * Main entry point that boots the game and the editor.
 */
(function() {
    "use strict";

    document.addEventListener('DOMContentLoaded', () => {
        initializeApplication();
    });

    function initializeApplication() {
        // Configure tab behavior
        setupTabs();

        // Initialize the core game engine
        const gameCanvas = document.getElementById('game-canvas');
        const gameEngine = new GameEngine(gameCanvas);
        loadSharedGameIfAvailable(gameEngine);

        // Expose the public runtime API
        window.TinyRPGMaker = {
            exportGameData: () => gameEngine.exportGameData(),
            importGameData: (data) => gameEngine.importGameData(data),
            getState: () => gameEngine.getState(),
            draw: () => gameEngine.draw(),
            resetGame: () => gameEngine.resetGame(),

            // Tile API
            updateTile: (tileId, data) => gameEngine.updateTile(tileId, data),
            setMapTile: (x, y, tileId) => gameEngine.setMapTile(x, y, tileId),
            getTiles: () => gameEngine.getTiles(),
            getTileMap: () => gameEngine.getTileMap(),
            getTilePresetNames: () => gameEngine.getTilePresetNames(),

            // NPC API
            addSprite: (npc) => gameEngine.addSprite(npc),
            getSprites: () => gameEngine.getSprites()
        };

        // Initialize the editor controller
        const editorManager = new EditorManager(gameEngine);

        // Wire the reset button
        const resetButton = document.getElementById('btn-reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => gameEngine.resetGame());
        }

        console.log('Tiny RPG Maker engine initialized successfully.');
    }

    function setupTabs() {
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
                // Clear the active state from every tab button
                tabs.forEach((other) => {
                    other.classList.remove('active');
                    other.setAttribute('aria-selected', 'false');
                });

                // Hide every tab content panel
                tabContents.forEach((content) => content.classList.remove('active'));

                // Activate the selected tab and panel
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const targetId = 'tab-' + btn.dataset.tab;
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

    function loadSharedGameIfAvailable(gameEngine) {
        const share = window.TinyRPGShare;
        if (!share?.extractGameDataFromLocation) return;
        const data = share.extractGameDataFromLocation(window.location);
        if (data) {
            gameEngine.importGameData(data);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const gameCanvas = document.getElementById('game-canvas');
        const gameContainer = document.getElementById('game-container');

        if (!gameCanvas || !gameContainer) {
            return;
        }

        // Keep the canvas centered and responsive
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
    });
})();
