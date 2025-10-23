// Tiny RPG Maker standalone engine (simplified)
// High level: grid map, wall collisions, player, NPCs, items, exits, and basic dialogs.

(function () {
    "use strict";

    // ---------- Game state ----------
    const defaultPalette = ["#0e0f13", "#2e3140", "#f4f4f8"]; // background, mid, foreground

    const game = {
        title: "My Tiny RPG Game",
        palette: [...defaultPalette],
        roomSize: 8,
        rooms: [createEmptyRoom(8)],
        start: { x: 1, y: 1, roomIndex: 0 },
        sprites: [], // { id, x, y, roomIndex, text }
        items: [],   // { id, x, y, roomIndex, text, collected }
        exits: [],   // { id, x, y, roomIndex, targetX, targetY, targetRoomIndex }
        tileset: {
            tiles: [], // { id, name, pixels: string[8][8] | 'transparent', collision: boolean }
            map: Array.from({ length: 8 }, () => Array(8).fill(null)), // tile id stored in each map cell
        },
    };

    function createEmptyRoom(size) {
        return {
            size,
            bg: 0,
            tiles: Array.from({ length: size }, () => Array(size).fill(0)),
            walls: Array.from({ length: size }, () => Array(size).fill(false)),
        };
    }

    // ---------- Rendering ----------
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const scale = 4; // 128 canvas -> 32 tiles (16x16 means each tile is 8px with scale 4)

    function getTilePixelSize() {
        const sz = currentRoom().size;
        return Math.floor(canvas.width / sz);
    }

    function currentRoom() {
        return game.rooms[state.player.roomIndex];
    }

    function color(idx) { return game.palette[idx] || defaultPalette[2]; }

    function clearCanvas() {
        ctx.fillStyle = color(currentRoom().bg);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        clearCanvas();
        const room = currentRoom();
        const tileSize = getTilePixelSize();

        // custom tiles (or background color if empty)
        for (let y = 0; y < room.size; y++) {
            for (let x = 0; x < room.size; x++) {
                const tileId = game.tileset.map[y]?.[x];
                if (tileId !== null && tileId !== undefined) {
                    drawCustomTile(tileId, x * tileSize, y * tileSize, tileSize);
                } else {
                    const colIdx = room.tiles[y][x];
                    ctx.fillStyle = color(colIdx);
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }

        // walls
        ctx.fillStyle = color(1);
        for (let y = 0; y < room.size; y++) {
            for (let x = 0; x < room.size; x++) {
                if (room.walls[y][x]) {
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }

        // items
        ctx.fillStyle = color(2);
        for (const item of game.items) {
            if (item.roomIndex !== state.player.roomIndex || item.collected) continue;
            ctx.fillRect(item.x * tileSize + tileSize * 0.25, item.y * tileSize + tileSize * 0.25, tileSize * 0.5, tileSize * 0.5);
        }

        // NPC sprites
        ctx.fillStyle = color(2);
        for (const s of game.sprites) {
            if (s.roomIndex !== state.player.roomIndex) continue;
            ctx.fillRect(s.x * tileSize + 2, s.y * tileSize + 2, tileSize - 4, tileSize - 4);
        }

        // player
        ctx.strokeStyle = color(2);
        ctx.lineWidth = Math.max(1, Math.floor(tileSize / 6));
        ctx.strokeRect(state.player.x * tileSize + 2, state.player.y * tileSize + 2, tileSize - 4, tileSize - 4);

        // dialog overlay
        if (state.dialog.active) {
            drawDialog(state.dialog.text);
        }
    }

    function drawCustomTile(tileId, px, py, size) {
        const tile = game.tileset.tiles.find(t => t.id === tileId);
        if (!tile) return;
        const step = Math.floor(size / 8);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const col = tile.pixels[y][x];
                if (!col || col === 'transparent') continue;
                ctx.fillStyle = col;
                ctx.fillRect(px + x * step, py + y * step, step, step);
            }
        }
    }

    function drawDialog(text) {
        const pad = 6;
        const w = canvas.width - pad * 2;
        const h = 40;
        const x = pad;
        const y = canvas.height - h - pad;

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = color(2);
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = color(2);
        ctx.font = "10px monospace";
        wrapText(text, x + 8, y + 14, w - 16, 12);
    }

    function wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(/\s+/);
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x, y);
    }

    // ---------- Control ----------
    const state = {
        player: { x: game.start.x, y: game.start.y, roomIndex: game.start.roomIndex },
        dialog: { active: false, text: "" }
    };

    function tryMove(dx, dy) {
        if (state.dialog.active) { state.dialog.active = false; draw(); return; }
        const room = currentRoom();
        const limit = room.size - 1;
        const nx = clamp(state.player.x + dx, 0, limit);
        const ny = clamp(state.player.y + dy, 0, limit);
        if (room.walls[ny][nx]) return; // wall collision

        const tileId = game.tileset.map[ny]?.[nx];
        if (tileId !== null && tileId !== undefined) {
            const tile = game.tileset.tiles.find(t => t.id === tileId);
            if (tile?.collision) return; // tile collision
        }

        state.player.x = nx;
        state.player.y = ny;
        checkInteractions();
        draw();
    }

    function checkInteractions() {
        // items
        for (const item of game.items) {
            if (item.roomIndex === state.player.roomIndex && !item.collected && item.x === state.player.x && item.y === state.player.y) {
                item.collected = true;
                showDialog(item.text || "You picked up an item.");
                break;
            }
        }
        // sprites
        for (const s of game.sprites) {
            if (s.roomIndex === state.player.roomIndex && s.x === state.player.x && s.y === state.player.y) {
                showDialog(s.text || "Hello!");
                break;
            }
        }
        // exits
        for (const ex of game.exits) {
            if (ex.roomIndex === state.player.roomIndex && ex.x === state.player.x && ex.y === state.player.y) {
                const targetRoom = game.rooms[ex.targetRoomIndex];
                if (targetRoom) {
                    const limit = targetRoom.size - 1;
                    state.player.roomIndex = ex.targetRoomIndex;
                    state.player.x = clamp(ex.targetX, 0, limit);
                    state.player.y = clamp(ex.targetY, 0, limit);
                }
                break;
            }
        }
    }

    function showDialog(text) {
        state.dialog.active = true;
        state.dialog.text = text;
    }

    function resetGame() {
        state.player.x = game.start.x;
        state.player.y = game.start.y;
        state.player.roomIndex = game.start.roomIndex;
        for (const i of game.items) i.collected = false;
        state.dialog.active = false;
        draw();
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // ---------- Input ----------
    document.addEventListener("keydown", (ev) => {
        switch (ev.key) {
            case "ArrowLeft": tryMove(-1, 0); break;
            case "ArrowRight": tryMove(1, 0); break;
            case "ArrowUp": tryMove(0, -1); break;
            case "ArrowDown": tryMove(0, 1); break;
            case "z":
            case "Z":
            case "Enter":
            case " ":
                if (state.dialog.active) { state.dialog.active = false; draw(); }
                break;
        }
    });

    document.getElementById("btn-reset").addEventListener("click", () => {
        resetGame();
    });

    // ---------- Minimal public API ----------
    function exportGameData() {
        return JSON.parse(JSON.stringify(game));
    }

    function importGameData(data) {
        // basic validation
        if (!data || !Array.isArray(data.rooms)) return;
        Object.assign(game, {
            title: data.title || "My Tiny RPG Game",
            palette: Array.isArray(data.palette) && data.palette.length >= 3 ? data.palette.slice(0, 3) : [...defaultPalette],
            roomSize: 8,
            rooms: data.rooms.map((r) => ({
                size: 8,
                bg: typeof r.bg === "number" ? r.bg : 0,
                tiles: r.tiles || createEmptyRoom(8).tiles,
                walls: r.walls || createEmptyRoom(8).walls,
            })),
            start: data.start || { x: 1, y: 1, roomIndex: 0 },
            sprites: Array.isArray(data.sprites) ? data.sprites : [],
            items: Array.isArray(data.items) ? data.items : [],
            exits: Array.isArray(data.exits) ? data.exits : [],
            tileset: data.tileset || game.tileset,
        });
        resetGame();
        syncDocumentTitle();
    }

    function syncDocumentTitle() {
        document.title = (game.title || "Tiny RPG Maker");
    }

    // ---------- Editor integration ----------
    // ---------- Tileset helpers ----------
    function createBlankTile(name = "New Tile") {
        const pixels = Array.from({ length: 8 }, () => Array(8).fill('transparent'));
        return { id: generateId(), name, pixels, collision: false };
    }

    function generateId() { return (window.crypto?.randomUUID?.() || ('id-' + Math.random().toString(36).slice(2, 9))); }

    function addTile(tile) {
        if (!tile.id) tile.id = generateId();
        if (!tile.pixels) tile.pixels = Array.from({ length: 8 }, () => Array(8).fill('transparent'));
        if (typeof tile.collision !== 'boolean') tile.collision = false;
        if (!tile.name) tile.name = 'Tile';
        game.tileset.tiles.push(tile);
        return tile.id;
    }

    function updateTile(tileId, data) {
        const t = game.tileset.tiles.find(t => t.id === tileId);
        if (!t) return;
        Object.assign(t, data);
    }

    function setMapTile(x, y, tileId) {
        if (y < 0 || y >= 8 || x < 0 || x >= 8) return;
        game.tileset.map[y][x] = tileId;
    }

    function getTiles() { return game.tileset.tiles; }
    function getTileMap() { return game.tileset.map; }

    // create a simple default tree tile
    function ensureDefaultTree() {
        if (game.tileset.tiles.length > 0) return;
        const tree = createBlankTile('Tree');
        // draw a simple green triangle
        const green = '#2fbf71';
        const brown = '#8b5a2b';
        for (let y = 0; y < 6; y++) {
            for (let x = 3 - Math.floor(y/2); x <= 4 + Math.floor(y/2); x++) {
                tree.pixels[y][x] = green;
            }
        }
        tree.pixels[6][3] = brown; tree.pixels[6][4] = brown;
        tree.pixels[7][3] = brown; tree.pixels[7][4] = brown;
        addTile(tree);
    }

    ensureDefaultTree();

    window.TinyRPGMaker = {
        exportGameData,
        importGameData,
        getState: () => ({ game, state }),
        draw,
        resetGame,
        // tileset api
        addTile,
        updateTile,
        createBlankTile,
        setMapTile,
        getTiles,
        getTileMap,
    };

    // start
    syncDocumentTitle();
    draw();
})();
