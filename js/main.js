/**
 * Main - Arquivo principal que inicializa o jogo e o editor
 */
(function() {
    "use strict";

    // Aguardar o DOM estar pronto
    document.addEventListener('DOMContentLoaded', function() {
        initializeApplication();
    });

    function initializeApplication() {
        // Configurar tabs
        setupTabs();
        
        // Inicializar motor do jogo
        const gameCanvas = document.getElementById('game-canvas');
        const gameEngine = new GameEngine(gameCanvas);
        
        // Expor para compatibilidade com código existente
        window.BitsyMini = {
            exportGameData: () => gameEngine.exportGameData(),
            importGameData: (data) => gameEngine.importGameData(data),
            getState: () => gameEngine.getState(),
            draw: () => gameEngine.draw(),
            resetGame: () => gameEngine.resetGame(),
            
            // API de tiles
            addTile: (tile) => gameEngine.addTile(tile),
            updateTile: (tileId, data) => gameEngine.updateTile(tileId, data),
            createBlankTile: (name) => gameEngine.createBlankTile(name),
            setMapTile: (x, y, tileId) => gameEngine.setMapTile(x, y, tileId),
            getTiles: () => gameEngine.getTiles(),
            getTileMap: () => gameEngine.getTileMap(),
            
            // API de sprites/NPCs
            addSprite: (npc) => gameEngine.addSprite(npc),
            getSprites: () => gameEngine.getSprites()
        };
        
        // Inicializar editor
        const editorManager = new EditorManager(gameEngine);
        
        // Configurar botão de reset
        const resetButton = document.getElementById('btn-reset');
        if (resetButton) {
            resetButton.addEventListener('click', () => gameEngine.resetGame());
        }
        
        console.log('Bitsy Mini Engine inicializado com sucesso!');
    }

    function setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        const applyLayoutMode = (tabName) => {
            document.body.classList.toggle('editor-mode', tabName === 'editor');
        };
        
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover classe ativa de todas as tabs
                tabs.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                
                // Remover classe ativa de todos os conteúdos
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Adicionar classe ativa na tab clicada
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                
                // Mostrar conteúdo correspondente
                const targetId = 'tab-' + btn.dataset.tab;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                applyLayoutMode(btn.dataset.tab);
                
                if (btn.dataset.tab === 'editor') {
                    document.dispatchEvent(new CustomEvent('editor-tab-activated'));
                }
            });
        });

        const initialTab = document.querySelector('.tab-button.active');
        if (initialTab) {
            applyLayoutMode(initialTab.dataset.tab);
            if (initialTab.dataset.tab === 'editor') {
                document.dispatchEvent(new CustomEvent('editor-tab-activated', { detail: { initial: true }}));
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const gameCanvas = document.getElementById('game-canvas');
        const gameContainer = document.getElementById('game-container');

        // Ajustar tamanho do canvas para centralizar e ser responsivo
        const resizeCanvas = () => {
            const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
            gameCanvas.style.width = `${size}px`;
            gameCanvas.style.height = `${size}px`;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    });
})();
