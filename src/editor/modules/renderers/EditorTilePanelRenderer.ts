
import { EditorRendererBase } from './EditorRendererBase';

type TileDefinitionView = {
    id: number | string;
    name?: string;
    category?: string;
};

class EditorTilePanelRenderer extends EditorRendererBase {
    renderTileList(): void {
        const tileList = this.dom.tileList;
        if (!tileList) return;

        const tiles = this.gameEngine.getTiles() as TileDefinitionView[];
        const groups = new Map<string, TileDefinitionView[]>();
        tiles.forEach((tile: TileDefinitionView) => {
            const category = tile.category || 'Diversos';
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category)?.push(tile);
        });

        const categoryOrder = ['Terreno', 'Natureza', 'Agua', 'Construcoes', 'Interior', 'Decoracao', 'Objetos', 'Diversos'];
        const categories = Array.from(groups.keys()).sort((a, b) => {
            const ia = categoryOrder.indexOf(a);
            const ib = categoryOrder.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });

        const orderedTiles: TileDefinitionView[] = [];
        categories.forEach((category: string) => {
            const categoryTiles = groups.get(category) || [];
            categoryTiles.forEach((tile: TileDefinitionView) => orderedTiles.push(tile));
        });

        tileList.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'tile-grid';

        orderedTiles.forEach((tile: TileDefinitionView) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'tile-card';
            card.dataset.tileId = String(tile.id);
            if (tile.id === this.manager.selectedTileId) {
                card.classList.add('selected');
            }

            const preview = document.createElement('canvas');
            preview.width = 64;
            preview.height = 64;
            const ctx = preview.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingEnabled = false;
                this.gameEngine.renderer.drawTileOnCanvas(preview, tile);
            }

            card.appendChild(preview);
            grid.appendChild(card);
        });

        tileList.appendChild(grid);
    }

    updateSelectedTilePreview(): void {
        const preview = this.dom.selectedTilePreview;
        const tile = (this.gameEngine.getTiles() as TileDefinitionView[]).find((entry) => entry.id === this.manager.selectedTileId);
        if (!preview || !tile) return;
        if (preview instanceof HTMLCanvasElement) {
            this.gameEngine.renderer.drawTileOnCanvas(preview, tile);
        }
        if (this.dom.tileSummary) {
            this.dom.tileSummary.textContent = tile.name || this.tf('tiles.summaryFallback', { id: tile.id });
        }
    }
}

export { EditorTilePanelRenderer };
