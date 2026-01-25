
class GameStateDataFacade {
    constructor(gameState, dataManager) {
        this.gameState = gameState;
        this.dataManager = dataManager;
    }

    exportGameData() {
        return this.dataManager.exportGameData();
    }

    importGameData(data) {
        this.dataManager.importGameData(data);
        this.gameState.enemyManager.setGame(this.gameState.game);
        this.gameState.itemManager.setGame(this.gameState.game);
        this.gameState.objectManager.setGame(this.gameState.game);
        this.gameState.variableManager.setGame(this.gameState.game);
        this.gameState.ensureDefaultVariables();
        this.gameState.resetGame();
    }
}

export { GameStateDataFacade };
