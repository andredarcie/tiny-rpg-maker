/**
 * EditorManager keeps the editor UI in sync with the runtime engine.
 */
class EditorManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.selectedTileId = null;
        this.selectedNpcId = null;
        this.placingNpc = false;
        this.mapPainting = false;
        this.history = { stack: [], index: -1 };

        this.handleCanvasResize = this.handleCanvasResize.bind(this);
        this.finishMapPaint = this.finishMapPaint.bind(this);

        this.cacheDom();
        this.bindEvents();
        this.initialize();
    }

    cacheDom() {
        this.editorCanvas = document.getElementById('editor-canvas');
        this.ectx = this.editorCanvas?.getContext('2d') ?? null;
        if (this.ectx) this.ectx.imageSmoothingEnabled = false;

        this.selectedTilePreview = document.getElementById('selected-tile-preview');
        this.tileSummary = document.getElementById('tile-preset-summary');
        this.tileList = document.getElementById('tile-list');

        this.npcsList = document.getElementById('npcs-list');
        this.npcText = document.getElementById('npc-text');

        this.titleInput = document.getElementById('game-title');
        this.jsonArea = document.getElementById('json-area');
        this.fileInput = document.getElementById('file-input');

        this.btnAddNpc = document.getElementById('btn-add-npc');
        this.btnPlaceNpc = document.getElementById('btn-place-npc');
        this.btnNpcDelete = document.getElementById('npc-delete');
        this.btnGenerateUrl = document.getElementById('btn-generate-url');
        this.btnApplyJson = document.getElementById('btn-apply-json');
        this.btnUndo = document.getElementById('btn-undo');
        this.btnRedo = document.getElementById('btn-redo');
    }

    bindEvents() {
        this.btnAddNpc?.addEventListener('click', () => this.addNPC());
        this.btnPlaceNpc?.addEventListener('click', () => this.toggleNpcPlacement());
        this.btnNpcDelete?.addEventListener('click', () => this.removeSelectedNpc());

        this.btnGenerateUrl?.addEventListener('click', () => this.generateShareableUrl());

        this.btnApplyJson?.addEventListener('click', () => this.applyJSON());
        this.btnUndo?.addEventListener('click', () => this.undo());
        this.btnRedo?.addEventListener('click', () => this.redo());

        this.titleInput?.addEventListener('input', () => this.updateGameTitle());
        this.npcText?.addEventListener('input', () => this.updateNpcText());
        this.fileInput?.addEventListener('change', (ev) => this.loadGameFile(ev));

        if (this.editorCanvas) {
            this.editorCanvas.addEventListener('pointerdown', (ev) => this.startMapPaint(ev));
            this.editorCanvas.addEventListener('pointermove', (ev) => this.continueMapPaint(ev));
        }
        window.addEventListener('pointerup', this.finishMapPaint);

        document.addEventListener('keydown', (ev) => this.handleKey(ev));
        window.addEventListener('resize', this.handleCanvasResize);
        document.addEventListener('editor-tab-activated', () => requestAnimationFrame(() => this.handleCanvasResize(true)));
    }

    initialize() {
        this.gameEngine.tileManager.ensureDefaultTiles();
        const tiles = this.gameEngine.getTiles();
        if (tiles.length > 0) {
            this.selectedTileId = tiles[0].id;
        }

        this.syncUI();
        this.renderTileList();
        this.renderNpcs();
        this.renderEditor();
        this.updateSelectedTilePreview();
        this.handleCanvasResize(true);
        this.pushHistory();
    }

    startMapPaint(ev) {
        if (!this.editorCanvas) return;
        ev.preventDefault();
        this.mapPainting = true;
        if (ev.pointerId !== undefined && this.editorCanvas.setPointerCapture) {
            this.editorCanvas.setPointerCapture(ev.pointerId);
        }
        this.applyMapPaint(ev);
    }

    continueMapPaint(ev) {
        if (!this.mapPainting) return;
        this.applyMapPaint(ev);
    }

    finishMapPaint(ev) {
        if (!this.mapPainting) return;
        this.mapPainting = false;
        if (ev?.pointerId !== undefined && this.editorCanvas?.hasPointerCapture?.(ev.pointerId)) {
            this.editorCanvas.releasePointerCapture(ev.pointerId);
        }
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    applyMapPaint(ev) {
        const coord = this.getTileFromEvent(ev);
        if (!coord) return;

        if (this.placingNpc && this.selectedNpcId) {
            const npc = this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
            if (!npc) return;
            npc.x = coord.x;
            npc.y = coord.y;
            npc.roomIndex = 0;
            this.toggleNpcPlacement(true);
            this.renderNpcs();
            this.renderEditor();
            this.gameEngine.draw();
            this.updateJSON();
            this.pushHistory();
            return;
        }

        if (this.selectedTileId === null || this.selectedTileId === undefined) return;
        this.gameEngine.setMapTile(coord.x, coord.y, this.selectedTileId);
        this.renderEditor();
        this.gameEngine.draw();
    }

    getTileFromEvent(ev) {
        if (!this.editorCanvas) return null;
        const rect = this.editorCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const relX = (ev.clientX - rect.left) / rect.width;
        const relY = (ev.clientY - rect.top) / rect.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return null;
        return {
            x: Math.min(7, Math.floor(relX * 8)),
            y: Math.min(7, Math.floor(relY * 8))
        };
    }

    renderEditor() {
        if (!this.ectx || !this.editorCanvas) return;
        const game = this.gameEngine.getGame();
        const state = this.gameEngine.getState();
        const roomIndex = state.player?.roomIndex ?? 0;
        const room = game.rooms?.[roomIndex];
        const tileSize = Math.floor(this.editorCanvas.width / 8);
        const tileMap = this.gameEngine.getTileMap();
        const ground = tileMap?.ground ?? [];
        const overlay = tileMap?.overlay ?? [];

        this.ectx.fillStyle = '#0a0c12';
        this.ectx.fillRect(0, 0, this.editorCanvas.width, this.editorCanvas.height);

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const groundId = ground[y]?.[x];
                if (groundId !== null && groundId !== undefined) {
                    this.gameEngine.renderer.drawTilePreviewAt(groundId, x * tileSize, y * tileSize, tileSize, this.ectx);
                } else if (room) {
                    const colorIndex = room.tiles?.[y]?.[x] ?? 0;
                    this.ectx.fillStyle = game.palette?.[colorIndex] ?? '#1a1d2b';
                    this.ectx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }

                const overlayId = overlay[y]?.[x];
                if (overlayId !== null && overlayId !== undefined) {
                    this.ectx.save();
                    this.ectx.globalAlpha = 0.92;
                    this.gameEngine.renderer.drawTilePreviewAt(overlayId, x * tileSize, y * tileSize, tileSize, this.ectx);
                    this.ectx.restore();
                    this.ectx.strokeStyle = 'rgba(100, 181, 246, 0.45)';
                    this.ectx.strokeRect(x * tileSize + 0.5, y * tileSize + 0.5, tileSize - 1, tileSize - 1);
                }
            }
        }

        const sprites = game.sprites ?? [];
        sprites.forEach((npc) => {
            if (npc.roomIndex !== roomIndex) return;
            const px = npc.x * tileSize;
            const py = npc.y * tileSize;
            this.ectx.fillStyle = '#64b5f6';
            this.ectx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);
            if (npc.id === this.selectedNpcId) {
                this.ectx.strokeStyle = '#ffeb3b';
                this.ectx.lineWidth = 2;
                this.ectx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
            }
        });

        this.ectx.strokeStyle = '#2a2f3f';
        this.ectx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) {
            this.ectx.beginPath();
            this.ectx.moveTo(0, i * tileSize);
            this.ectx.lineTo(8 * tileSize, i * tileSize);
            this.ectx.stroke();
            this.ectx.beginPath();
            this.ectx.moveTo(i * tileSize, 0);
            this.ectx.lineTo(i * tileSize, 8 * tileSize);
            this.ectx.stroke();
        }
    }

    renderTileList() {
        if (!this.tileList) return;
        const tiles = this.gameEngine.getTiles();
        if (this.tileSummary) {
            this.tileSummary.textContent = '';
        }

        const groups = new Map();
        tiles.forEach((tile) => {
            const category = tile.category || 'Diversos';
            if (!groups.has(category)) {
                groups.set(category, []);
            }
            groups.get(category).push(tile);
        });

        const categoryOrder = ['Terreno', 'Natureza', 'Agua', 'Construcoes', 'Interior', 'Decoracao', 'Diversos'];
        const categories = Array.from(groups.keys()).sort((a, b) => {
            const ia = categoryOrder.indexOf(a);
            const ib = categoryOrder.indexOf(b);
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });

        this.tileList.innerHTML = '';

        categories.forEach((category) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'tile-group';

            const heading = document.createElement('h4');
            heading.className = 'tile-group-title';
            heading.textContent = category;
            wrapper.appendChild(heading);

            const grid = document.createElement('div');
            grid.className = 'tile-group-grid';

            const categoryTiles = groups.get(category) || [];
            categoryTiles.forEach((tile) => {
                const card = document.createElement('div');
                card.className = 'tile-card';
                if (tile.id === this.selectedTileId) {
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

                const meta = document.createElement('div');
                meta.className = 'meta';

                const name = document.createElement('div');
                name.className = 'tile-name';
                name.textContent = tile.name || 'Tile';

                const info = document.createElement('div');
                info.className = 'tile-info';
                info.textContent = tile.collision ? 'Bloqueia movimento' : 'Passavel';

                meta.append(name, info);
                card.append(preview, meta);

                card.addEventListener('click', () => {
                    this.selectedTileId = tile.id;
                    this.updateSelectedTilePreview();
                    this.renderTileList();
                });

                grid.appendChild(card);
            });

            wrapper.appendChild(grid);
            this.tileList.appendChild(wrapper);
        });

        this.updateSelectedTilePreview();
    }

    updateSelectedTilePreview() {
        if (!this.selectedTilePreview) return;
        const ctx = this.selectedTilePreview.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, this.selectedTilePreview.width, this.selectedTilePreview.height);

        const tile = this.gameEngine.getTiles().find((t) => t.id === this.selectedTileId);
        if (!tile) return;
        this.gameEngine.renderer.drawTileOnCanvas(this.selectedTilePreview, tile);
    }

    renderNpcs() {
        if (!this.npcsList) return;
        const npcs = this.gameEngine.getSprites();
        this.npcsList.innerHTML = '';
        npcs.forEach((npc) => {
            const card = document.createElement('div');
            card.className = 'npc-card';
            card.dataset.id = npc.id;
            if (npc.id === this.selectedNpcId) card.classList.add('selected');

            const preview = document.createElement('div');
            preview.className = 'npc-preview';
            preview.textContent = '??';

            const meta = document.createElement('div');
            meta.className = 'meta';

            const name = document.createElement('div');
            name.className = 'npc-name';
            name.textContent = npc.name || 'NPC';

            const pos = document.createElement('div');
            pos.className = 'npc-position';
            pos.textContent = `Sala ${npc.roomIndex + 1} - (${npc.x}, ${npc.y})`;

            const dialog = document.createElement('div');
            dialog.className = 'npc-dialog';
            dialog.textContent = npc.text || 'Sem dialogo';

            meta.append(name, pos, dialog);
            card.append(preview, meta);

            card.addEventListener('click', () => {
                this.selectedNpcId = npc.id;
                this.updateNpcSelection();
            });

            this.npcsList.appendChild(card);
        });

        this.updateNpcSelection();
    }

    addNPC() {
        const index = this.gameEngine.getSprites().length;
        const npc = {
            name: `NPC ${index + 1}`,
            x: 1,
            y: 1,
            roomIndex: 0,
            text: 'Ola!'
        };
        const id = this.gameEngine.addSprite(npc);
        this.selectedNpcId = id;
        this.renderNpcs();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    toggleNpcPlacement(skipRender = false) {
        if (this.placingNpc) {
            this.placingNpc = false;
            if (this.btnPlaceNpc) {
                this.btnPlaceNpc.textContent = 'Colocar NPC no mapa';
                this.btnPlaceNpc.classList.remove('placing');
            }
            if (this.editorCanvas) this.editorCanvas.style.cursor = 'default';
        } else if (this.selectedNpcId) {
            this.placingNpc = true;
            if (this.btnPlaceNpc) {
                this.btnPlaceNpc.textContent = 'Cancelar colocacao';
                this.btnPlaceNpc.classList.add('placing');
            }
            if (this.editorCanvas) this.editorCanvas.style.cursor = 'crosshair';
        }
        if (!skipRender) this.renderEditor();
    }

    removeSelectedNpc() {
        if (!this.selectedNpcId) return;
        const sprites = this.gameEngine.getSprites();
        const index = sprites.findIndex((npc) => npc.id === this.selectedNpcId);
        if (index === -1) return;
        sprites.splice(index, 1);
        this.selectedNpcId = null;
        this.placingNpc = false;
        if (this.btnPlaceNpc) {
            this.btnPlaceNpc.textContent = 'Colocar NPC no mapa';
            this.btnPlaceNpc.classList.remove('placing');
            this.btnPlaceNpc.disabled = true;
        }
        this.renderNpcs();
        this.renderEditor();
        this.gameEngine.draw();
        this.updateJSON();
        this.pushHistory();
    }

    updateNpcSelection() {
        if (this.npcsList) {
            this.npcsList.querySelectorAll('.npc-card').forEach((card) => {
                card.classList.toggle('selected', card.dataset.id === this.selectedNpcId);
            });
        }
        const npc = this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (this.npcText) this.npcText.value = npc?.text || '';
        if (this.btnPlaceNpc) this.btnPlaceNpc.disabled = !npc;
        if (!npc) this.placingNpc = false;
    }

    updateNpcText() {
        if (!this.selectedNpcId || !this.npcText) return;
        const npc = this.gameEngine.getSprites().find((s) => s.id === this.selectedNpcId);
        if (!npc) return;
        npc.text = this.npcText.value;
        this.renderNpcs();
        this.updateJSON();
        this.pushHistory();
    }

    handleCanvasResize(force = false) {
        if (!this.editorCanvas) return;
        const rect = this.editorCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = window.devicePixelRatio || 1;
        const size = Math.max(8, Math.ceil(Math.max(rect.width, rect.height) * dpr / 8) * 8);
        if (this.editorCanvas.width !== size || this.editorCanvas.height !== size) {
            this.editorCanvas.width = this.editorCanvas.height = size;
            if (this.ectx) this.ectx.imageSmoothingEnabled = false;
            this.renderEditor();
        } else if (force) {
            this.renderEditor();
        }
    }

    handleKey(ev) {
        const key = ev.key.toLowerCase();
        if ((ev.ctrlKey || ev.metaKey) && key === 'z') {
            ev.preventDefault();
            this.undo();
        } else if ((ev.ctrlKey || ev.metaKey) && key === 'y') {
            ev.preventDefault();
            this.redo();
        } else if (key === 'escape' && this.placingNpc) {
            this.toggleNpcPlacement();
        }
    }

    createNewGame() {
        const emptyLayer = () => Array.from({ length: 8 }, () => Array(8).fill(null));
        const data = {
            title: 'Novo Jogo',
            palette: ['#0e0f13', '#2e3140', '#f4f4f8'],
            roomSize: 8,
            rooms: [{ size: 8, bg: 0, tiles: Array.from({ length: 8 }, () => Array(8).fill(0)), walls: Array.from({ length: 8 }, () => Array(8).fill(false)) }],
            start: { x: 1, y: 1, roomIndex: 0 },
            sprites: [],
            items: [],
            exits: [],
            tileset: {
                tiles: [],
                map: {
                    ground: emptyLayer(),
                    overlay: emptyLayer()
                }
            }
        };
        this.restore(data);
        this.pushHistory();
    }

    async generateShareableUrl() {
        try {
            const share = window.TinyRPGShare;
            if (!share?.buildShareUrl) {
                throw new Error('TinyRPGShare indisponivel');
            }
            const gameData = this.gameEngine.exportGameData();
            const url = share.buildShareUrl(gameData);
            try {
                window.history?.replaceState?.(null, '', url);
            } catch {
                // ignore history update issues
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                alert('URL do jogo copiada para a area de transferencia!');
            } else {
                prompt('Copie a URL do seu jogo:', url);
            }
        } catch (error) {
            console.error(error);
            alert('Nao foi possivel gerar a URL do jogo.');
        }
    }

    saveGame() {
        const blob = new Blob([JSON.stringify(this.gameEngine.exportGameData(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tiny-rpg-maker.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    loadGameFile(ev) {
        const file = ev.target?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                this.restore(data);
                this.pushHistory();
            } catch {
                alert('Nao foi possivel carregar o arquivo.');
            }
        };
        reader.readAsText(file);
        ev.target.value = '';
    }

    applyJSON() {
        if (!this.jsonArea) return;
        try {
            const data = JSON.parse(this.jsonArea.value);
            this.restore(data);
            this.pushHistory();
        } catch {
            alert('JSON invalido.');
        }
    }

    restore(data) {
        this.gameEngine.importGameData(data);
        this.gameEngine.tileManager.ensureDefaultTiles();
        const tiles = this.gameEngine.getTiles();
        if (tiles.length && !tiles.find((t) => t.id === this.selectedTileId)) {
            this.selectedTileId = tiles[0].id;
        }
        const npcs = this.gameEngine.getSprites();
        if (!npcs.find((npc) => npc.id === this.selectedNpcId)) {
            this.selectedNpcId = null;
            this.placingNpc = false;
        }
        this.syncUI();
        this.renderTileList();
        this.renderNpcs();
        this.renderEditor();
        this.updateSelectedTilePreview();
        this.gameEngine.draw();
        this.updateJSON();
    }

    pushHistory() {
        const snapshot = JSON.stringify(this.gameEngine.exportGameData());
        if (this.history.stack[this.history.index] === snapshot) return;
        this.history.stack = this.history.stack.slice(0, this.history.index + 1);
        this.history.stack.push(snapshot);
        this.history.index = this.history.stack.length - 1;
    }

    undo() {
        if (this.history.index <= 0) return;
        this.history.index -= 1;
        this.restore(JSON.parse(this.history.stack[this.history.index]));
    }

    redo() {
        if (this.history.index >= this.history.stack.length - 1) return;
        this.history.index += 1;
        this.restore(JSON.parse(this.history.stack[this.history.index]));
    }

    updateGameTitle() {
        const game = this.gameEngine.getGame();
        game.title = this.titleInput?.value || 'Tiny RPG Maker';
        this.updateJSON();
    }

    updateJSON() {
        if (!this.jsonArea) return;
        this.jsonArea.value = JSON.stringify(this.gameEngine.exportGameData(), null, 2);
    }

    syncUI() {
        const game = this.gameEngine.getGame();
        if (this.titleInput) this.titleInput.value = game.title || '';
        this.updateJSON();
    }

    async exportHTML() {
        try {
            const html = this.buildStandaloneHTML(this.gameEngine.exportGameData());
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const name = (this.gameEngine.getGame().title || 'meu-jogo').trim().replace(/\s+/g, '-').toLowerCase();
            link.href = url;
            link.download = `${name || 'meu-jogo'}.html`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Nao foi possivel exportar o HTML.');
        }
    }

    buildStandaloneHTML(gameData) {
        const safeData = JSON.stringify(gameData, null, 2).replace(/<\/script>/gi, '<\\/script>');
        const engine = "(function(){const DATA=window.__TINY_RPG_GAME_DATA__;if(!DATA)return;const canvas=document.getElementById('game-canvas');const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;const state={player:{...DATA.start},dialog:{active:false,text:''}};function clamp(v,a,b){return Math.max(a,Math.min(b,v));}function currentRoom(){return DATA.rooms[state.player.roomIndex];}function drawTile(id,px,py,size){const tile=DATA.tileset.tiles.find(t=>t.id===id);if(!tile)return;const step=Math.floor(size/8);for(let y=0;y<8;y++){for(let x=0;x<8;x++){const col=tile.pixels[y][x];if(!col||col==='transparent')continue;ctx.fillStyle=col;ctx.fillRect(px+x*step,py+y*step,step,step);}}}function draw(){const room=currentRoom();const size=Math.floor(canvas.width/8);ctx.fillStyle=DATA.palette[room.bg]||'#0e0f13';ctx.fillRect(0,0,canvas.width,canvas.height);for(let y=0;y<8;y++){for(let x=0;x<8;x++){const ground=DATA.tileset.map.ground[y]?.[x];const overlay=DATA.tileset.map.overlay[y]?.[x];if(ground!==null&&ground!==undefined){drawTile(ground,x*size,y*size,size);}else{const idx=room.tiles[y][x];ctx.fillStyle=DATA.palette[idx]||'#1a1d2b';ctx.fillRect(x*size,y*size,size,size);}if(overlay!==null&&overlay!==undefined){drawTile(overlay,x*size,y*size,size);}}}ctx.fillStyle=DATA.palette[2];for(const npc of DATA.sprites){if(npc.roomIndex!==state.player.roomIndex)continue;ctx.fillRect(npc.x*size+2,npc.y*size+2,size-4,size-4);}ctx.strokeStyle=DATA.palette[2];ctx.lineWidth=Math.max(1,Math.floor(size/6));ctx.strokeRect(state.player.x*size+2,state.player.y*size+2,size-4,size-4);}function tryMove(dx,dy){const room=currentRoom();const nx=clamp(state.player.x+dx,0,7);const ny=clamp(state.player.y+dy,0,7);if(room.walls[ny][nx])return;const overlay=DATA.tileset.map.overlay[ny]?.[nx]??null;const ground=DATA.tileset.map.ground[ny]?.[nx]??null;const id=overlay??ground;if(id!==null&&id!==undefined){const tile=DATA.tileset.tiles.find(t=>t.id===id);if(tile?.collision)return;}state.player.x=nx;state.player.y=ny;draw();}document.addEventListener('keydown',ev=>{switch(ev.key){case'ArrowLeft':tryMove(-1,0);break;case'ArrowRight':tryMove(1,0);break;case'ArrowUp':tryMove(0,-1);break;case'ArrowDown':tryMove(0,1);break;case' ':case'Enter':case'z':case'Z':if(state.dialog.active){state.dialog.active=false;draw();}}});document.getElementById('btn-reset').addEventListener('click',()=>{state.player={...DATA.start};state.dialog.active=false;draw();});draw();})();";
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${(gameData.title || 'Meu Jogo').replace(/</g, '&lt;')}</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(1200px 600px at 50% -200px,#182036 0%,#0e0f13 60%);color:#e6e7eb;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Arial;}
.container{background:#0a0c12;border:1px solid #232734;border-radius:12px;padding:20px;box-shadow:0 12px 40px rgba(0,0,0,0.4);text-align:center;}
h1{margin:0 0 16px;font-size:18px;}
canvas{width:256px;height:256px;image-rendering:pixelated;image-rendering:crisp-edges;border-radius:10px;background:#04070f;}
.controls{margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;font-size:14px;color:#9aa0aa;}
button{padding:8px 16px;border-radius:8px;border:1px solid #232734;background:#0f1422;color:#e6e7eb;cursor:pointer;}
button:hover{border-color:#2d3242;}
</style>
</head>
<body>
<div class="container">
<h1>${(gameData.title || 'Meu Jogo').replace(/</g, '&lt;')}</h1>
<canvas id="game-canvas" width="128" height="128"></canvas>
<div class="controls">
<button id="btn-reset">Reiniciar</button>
<span>Setas movem - Z/Enter interagem</span>
</div>
</div>
<script>window.__TINY_RPG_GAME_DATA__=${safeData};</script>
<script>${engine}</script>
</body>
</html>`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditorManager;
} else {
    window.EditorManager = EditorManager;
}


