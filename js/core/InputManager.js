/**
 * InputManager wires keyboard and editor pointer interactions.
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

        // When a dialog is open, only allow confirmation keys to close it
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

        // Player movement
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

    // Map editor canvas interactions
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
                // Hook to finalize painting (for example, push to history)
            }
        });
    }

    // Tile editor canvas interactions
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
