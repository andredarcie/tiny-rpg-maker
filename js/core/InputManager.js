/**
 * InputManager wires keyboard and editor pointer interactions.
 */
class InputManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.touchStart = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener("keydown", (ev) => this.handleKeyDown(ev));
        document.addEventListener("touchstart", (ev) => this.handleTouchStart(ev), { passive: false });
        document.addEventListener("touchmove", (ev) => this.handleTouchMove(ev), { passive: false });
        document.addEventListener("touchend", (ev) => this.handleTouchEnd(ev), { passive: false });
    }

    handleKeyDown(ev) {
        if (this.gameEngine.isGameOver?.()) {
            ev.preventDefault();
            this.gameEngine.handleGameOverInteraction?.();
            return;
        }
        if (this.gameEngine.isIntroVisible?.()) {
            ev.preventDefault();
            this.gameEngine.dismissIntroScreen?.();
            return;
        }
        const dialog = this.gameEngine.gameState.getDialog();

        // When a dialog is open, only allow confirmation keys to handle it
        if (dialog.active) {
            switch (ev.key.toLowerCase()) {
                case "z":
                case "enter":
                case " ":
                    ev.preventDefault();
                    if (dialog.page >= dialog.maxPages) {
                        this.gameEngine.closeDialog();
                    } else {
                        this.gameEngine.gameState.setDialogPage(dialog.page + 1);
                        this.gameEngine.renderer.draw();
                    }
                    break;
            }
            return;
        }

        // Player movement via arrows and WASD
        const movementKey = ev.key?.toLowerCase() || "";
        const movementMap = {
            arrowleft: [-1, 0],
            a: [-1, 0],
            arrowright: [1, 0],
            d: [1, 0],
            arrowup: [0, -1],
            w: [0, -1],
            arrowdown: [0, 1],
            s: [0, 1]
        };
        const delta = movementMap[movementKey];
        if (delta) {
            ev.preventDefault();
            this.gameEngine.tryMove(delta[0], delta[1]);
        }
    }

    handleTouchStart(ev) {
        if (this.gameEngine.isGameOver?.()) {
            ev.preventDefault?.();
            this.gameEngine.handleGameOverInteraction?.();
            this.touchStart = null;
            return;
        }
        if (this.gameEngine.isIntroVisible?.()) {
            ev.preventDefault?.();
            this.gameEngine.dismissIntroScreen?.();
            this.touchStart = null;
            return;
        }
        const touch = ev.changedTouches?.[0];
        if (!touch) return;
        this.touchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
            prevented: false
        };
    }

    handleTouchMove(ev) {
        const start = this.touchStart;
        if (!start) return;
        const touch = ev.changedTouches?.[0];
        if (!touch) return;

        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const MOVE_THRESHOLD = 12;

        if (distance >= MOVE_THRESHOLD) {
            ev.preventDefault();
            start.prevented = true;
        } else if (start.prevented) {
            ev.preventDefault();
        }
    }

    handleTouchEnd(ev) {
        if (this.gameEngine.isGameOver?.()) {
            ev.preventDefault?.();
            this.gameEngine.handleGameOverInteraction?.();
            this.touchStart = null;
            return;
        }
        if (this.gameEngine.isIntroVisible?.()) {
            ev.preventDefault?.();
            this.gameEngine.dismissIntroScreen?.();
            this.touchStart = null;
            return;
        }
        const start = this.touchStart;
        if (!start) return;

        const touch = ev.changedTouches?.[0];
        if (!touch) {
            this.touchStart = null;
            return;
        }

        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = Date.now() - start.time;

        this.touchStart = null;

        const MIN_DISTANCE = 24;
        const MAX_DURATION = 600;
        if (distance < MIN_DISTANCE || duration > MAX_DURATION) {
            return;
        }

        ev.preventDefault();

        if (absX > absY) {
            if (dx > 0) {
                this.gameEngine.tryMove(1, 0);
            } else {
                this.gameEngine.tryMove(-1, 0);
            }
        } else {
            if (dy > 0) {
                this.gameEngine.tryMove(0, 1);
            } else {
                this.gameEngine.tryMove(0, -1);
            }
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

if (typeof window !== 'undefined') {
    window.InputManager = InputManager;
}
