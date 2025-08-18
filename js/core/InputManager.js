/**
 * InputManager - Gerencia entrada do usuário
 */
class InputManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener("keydown", (ev) => this.handleKeyDown(ev));
    }

    handleKeyDown(ev) {
        const dialog = this.gameEngine.gameState.getDialog();
        
        // Se há diálogo ativo, apenas Z/Enter/Espaço para fechar
        if (dialog.active) {
            switch (ev.key.toLowerCase()) {
                case "z":
                case "enter":
                case " ":
                    ev.preventDefault();
                    this.gameEngine.gameState.setDialog(false);
                    this.gameEngine.renderer.draw();
                    break;
            }
            return;
        }

        // Movimento do jogador
        switch (ev.key) {
            case "ArrowLeft":
                ev.preventDefault();
                this.gameEngine.tryMove(-1, 0);
                break;
            case "ArrowRight":
                ev.preventDefault();
                this.gameEngine.tryMove(1, 0);
                break;
            case "ArrowUp":
                ev.preventDefault();
                this.gameEngine.tryMove(0, -1);
                break;
            case "ArrowDown":
                ev.preventDefault();
                this.gameEngine.tryMove(0, 1);
                break;
        }
    }

    // Para o editor
    setupEditorInputs(editorCanvas, paintCallback) {
        let painting = false;
        
        editorCanvas.addEventListener('mousedown', (e) => {
            painting = true;
            paintCallback(e);
        });
        
        editorCanvas.addEventListener('mousemove', (e) => {
            if (painting) paintCallback(e);
        });
        
        document.addEventListener('mouseup', () => {
            if (painting) {
                painting = false;
                // Callback para finalizar a pintura (ex: pushHistory)
            }
        });
    }

    // Para o tile editor
    setupTileEditorInputs(tileCanvas, paintCallback) {
        let tilePainting = false;
        
        tileCanvas.addEventListener('mousedown', (e) => {
            tilePainting = true;
            paintCallback(e);
        });
        
        tileCanvas.addEventListener('mousemove', (e) => {
            if (tilePainting) paintCallback(e);
        });
        
        document.addEventListener('mouseup', () => {
            tilePainting = false;
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
} else {
    window.InputManager = InputManager;
}
