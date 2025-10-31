/**
 * Renderer coordena módulos especializados para desenhar a cena.
 */
class Renderer {
    constructor(canvas, gameState, tileManager, npcManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.gameState = gameState;
        this.tileManager = tileManager;
        this.npcManager = npcManager;

        this.paletteManager = new RendererPalette(gameState);
        this.spriteFactory = new RendererSpriteFactory(this.paletteManager);
        this.canvasHelper = new RendererCanvasHelper(canvas, this.ctx);
        this.tileRenderer = new RendererTileRenderer(gameState, tileManager, this.paletteManager, this.canvasHelper);
        this.entityRenderer = new RendererEntityRenderer(gameState, tileManager, this.spriteFactory, this.canvasHelper, this.paletteManager);
        this.dialogRenderer = new RendererDialogRenderer(gameState, this.paletteManager);
        this.hudRenderer = new RendererHudRenderer(gameState);
        this.minimapRenderer = new RendererMinimapRenderer(gameState);

        // Compatibilidade com código existente que acessa sprites diretamente.
        this.playerSprite = this.spriteFactory.getPlayerSprite();
        this.npcSprites = this.spriteFactory.getNpcSprites();
        this.enemySprite = this.spriteFactory.getEnemySprite();
        this.objectSprites = this.spriteFactory.getObjectSprites();
    }

    draw() {
        this.tileRenderer.clearCanvas(this.ctx, this.canvas);
        this.tileRenderer.drawBackground(this.ctx, this.canvas);
        this.tileRenderer.drawTiles(this.ctx, this.canvas);
        this.tileRenderer.drawWalls(this.ctx);

        this.entityRenderer.drawObjects(this.ctx);
        this.entityRenderer.drawItems(this.ctx);
        this.entityRenderer.drawNPCs(this.ctx);
        this.entityRenderer.drawEnemies(this.ctx);
        this.entityRenderer.drawPlayer(this.ctx);

        this.dialogRenderer.drawDialog(this.ctx, this.canvas);
        this.hudRenderer.drawHUD();
        this.minimapRenderer.drawMinimap();
    }

    // Métodos utilitários delegados
    getTilePixelSize() {
        return this.canvasHelper.getTilePixelSize();
    }

    getColor(idx) {
        return this.paletteManager.getColor(idx);
    }

    drawCustomTile(tileId, px, py, size) {
        this.canvasHelper.drawCustomTile(this.tileManager, tileId, px, py, size);
    }

    drawSprite(ctx, sprite, px, py, step) {
        this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
    }

    drawTileOnCanvas(canvas, tile) {
        this.canvasHelper.drawTileOnCanvas(canvas, tile);
    }

    drawTilePreviewAt(tileId, px, py, size, ctx) {
        this.canvasHelper.drawTilePreview(this.tileManager, tileId, px, py, size, ctx);
    }

    drawObjectSprite(ctx, type, px, py, stepOverride) {
        const objectSprites = this.spriteFactory.getObjectSprites();
        const sprite = objectSprites?.[type];
        if (!sprite) return;
        const step = stepOverride || (this.canvasHelper.getTilePixelSize() / 8);
        this.canvasHelper.drawSprite(ctx, sprite, px, py, step);
    }

    // Métodos preservados para compatibilidade.
    buildPlayerSprite() {
        this.playerSprite = this.spriteFactory.getPlayerSprite();
        return this.playerSprite;
    }

    buildNpcSprites() {
        this.npcSprites = this.spriteFactory.getNpcSprites();
        return this.npcSprites;
    }

    buildEnemySprite() {
        this.enemySprite = this.spriteFactory.getEnemySprite();
        return this.enemySprite;
    }

    buildObjectSprites() {
        this.objectSprites = this.spriteFactory.getObjectSprites();
        return this.objectSprites;
    }
}

if (typeof window !== 'undefined') {
    window.Renderer = Renderer;
}
