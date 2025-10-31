class StateItemManager {
    constructor(game) {
        this.game = game;
    }

    setGame(game) {
        this.game = game;
    }

    resetItems() {
        if (!Array.isArray(this.game?.items)) return;
        this.game.items.forEach((item) => {
            item.collected = false;
        });
    }
}

if (typeof window !== 'undefined') {
    window.StateItemManager = StateItemManager;
}

