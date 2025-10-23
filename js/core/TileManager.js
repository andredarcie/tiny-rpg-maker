/**
 * TileManager supplies a curated medieval fantasy tileset and handles placement.
 */
class TileManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.presets = this.buildPresetTiles();
    }

    generateTileId() {
        const globalCrypto = (typeof crypto !== 'undefined' ? crypto : (typeof window !== 'undefined' ? window.crypto : null));
        if (globalCrypto?.randomUUID) {
            return globalCrypto.randomUUID();
        }
        return `tile-${Math.random().toString(36).slice(2, 10)}`;
    }

    normalizeTile(tile, fallbackIndex = 0) {
        const name = typeof tile.name === 'string' && tile.name.trim()
            ? tile.name.trim()
            : `Tile ${fallbackIndex + 1}`;
        const collision = !!tile.collision;
        const pixels = Array.from({ length: 8 }, (_, y) =>
            Array.from({ length: 8 }, (_, x) => {
                const row = Array.isArray(tile.pixels) ? tile.pixels : null;
                const value = row?.[y]?.[x];
                if (typeof value === 'string' && value.trim()) {
                    return value;
                }
                return 'transparent';
            })
        );
        const category = typeof tile.category === 'string' && tile.category.trim()
            ? tile.category.trim()
            : 'Diversos';

        return {
            id: tile.id || this.generateTileId(),
            name,
            collision,
            pixels,
            category
        };
    }

    buildPresetTiles() {
        const pattern = (rows, palette) =>
            rows.map(row => row.split('').map(ch => palette[ch] ?? 'transparent'));

        const tile = (id, name, rows, palette, collision = false, category = 'Diversos') => ({
            id,
            name,
            pixels: pattern(rows, palette),
            collision,
            category
        });

        return [
            tile(
                'grass',
                'Grama da Planicie',
                [
                    'GGgGGgGG',
                    'gGGgGGgG',
                    'GGgGGgGG',
                    'gGGGGgGG',
                    'GGgGGgGG',
                    'gGGgGGgG',
                    'GGgGGgGG',
                    'gGGgGGgG'
                ],
                { G: '#2f9e44', g: '#37b24d' },
                false,
                'Terreno'
            ),
            tile(
                'tall_grass',
                'Grama Alta',
                [
                    'tttttttt',
                    'tTTttTTt',
                    'tttTTttt',
                    'TTttttTT',
                    'tttTTttt',
                    'tTTttTTt',
                    'tttttttt',
                    'TTttTTTT'
                ],
                { t: '#2b8a3e', T: '#40916c' },
                false,
                'Terreno'
            ),
            tile(
                'stone_path',
                'Caminho de Pedra',
                [
                    'SssSssSs',
                    'ssSSssSS',
                    'SssSssSs',
                    'ssSSssSS',
                    'SssSssSs',
                    'ssSSssSS',
                    'SssSssSs',
                    'ssSSssSS'
                ],
                { S: '#adb5bd', s: '#868e96' },
                false,
                'Terreno'
            ),
            tile(
                'water',
                'Agua do Rio',
                [
                    'wW~~wW~~',
                    'W~~wW~~w',
                    'wW~~wW~~',
                    'W~~wW~~w',
                    'wW~~wW~~',
                    'W~~wW~~w',
                    'wW~~wW~~',
                    'W~~wW~~w'
                ],
                { W: '#1c7ed6', w: '#1971c2', '~': '#4dabf7' },
                true,
                'Agua'
            ),
            tile(
                'mountain_rock',
                'Rocha da Montanha',
                [
                    '...MMMM.',
                    '..MMMMMM',
                    '.MMMMMMm',
                    'MMMMmmMM',
                    'MMMmmmmm',
                    'MMmmmmmm',
                    '.mmmmmm.',
                    '..mmmm..'
                ],
                { M: '#5f3d1e', m: '#7f5539', '.': '#b08968' },
                true,
                'Natureza'
            ),
            tile(
                'forest_tree',
                'Arvore da Floresta',
                [
                    '..GGGG..',
                    '.GGGGGG.',
                    'GGGGGGGG',
                    'GGGGGGGG',
                    '.GGGGGG.',
                    '..GGGG..',
                    '..BBBB..',
                    '..BBBB..'
                ],
                { G: '#0ca678', g: '#087f5b', B: '#5b3415', '.': '#06301f' },
                true,
                'Natureza'
            ),
            tile(
                'dead_tree',
                'Arvore Morta',
                [
                    '..bbBb..',
                    '..bBbB..',
                    '.bBbbBb.',
                    '.Bbbbbb.',
                    '..bbbb..',
                    '..bbbb..',
                    '..BBBB..',
                    '..BBBB..'
                ],
                { B: '#6b4f2d', b: '#8d6e53', '.': 'transparent' },
                true,
                'Natureza'
            ),
            tile(
                'castle_wall',
                'Muro do Castelo',
                [
                    'CCCCCCCC',
                    'cCCcCCcC',
                    'CCCCCCCC',
                    'cCCcCCcC',
                    'CCCCCCCC',
                    'cCCcCCcC',
                    'CCCCCCCC',
                    'cCCcCCcC'
                ],
                { C: '#ced4da', c: '#868e96' },
                true,
                'Construcoes'
            ),
            tile(
                'wood_floor',
                'Piso de Madeira',
                [
                    'ffffFFFF',
                    'ffffFFFF',
                    'ffffFFFF',
                    'ffffFFFF',
                    'FFFFffff',
                    'FFFFffff',
                    'FFFFffff',
                    'FFFFffff'
                ],
                { f: '#8d5524', F: '#b07d44' },
                false,
                'Interior'
            ),
            tile(
                'brick_roof',
                'Telhado de Tijolos',
                [
                    'RRrrRRrr',
                    'rrRRrrRR',
                    'RRrrRRrr',
                    'rrRRrrRR',
                    'RRrrRRrr',
                    'rrRRrrRR',
                    'RRrrRRrr',
                    'rrRRrrRR'
                ],
                { R: '#c92a2a', r: '#9d0208' },
                true,
                'Construcoes'
            ),
            tile(
                'magic_rune',
                'Runa Arcana',
                [
                    '........',
                    '..pppp..',
                    '.pPPPPp.',
                    '.pPppPp.',
                    '.pPppPp.',
                    '.pPPPPp.',
                    '..pppp..',
                    '........'
                ],
                { P: '#748ffc', p: '#364fc7', '.': '#15192b' },
                false,
                'Decoracao'
            ),
            tile(
                'sand_dune',
                'Areia do Deserto',
                [
                    'ssssssss',
                    'sSssSsSs',
                    'ssssssss',
                    'SsSsSsSs',
                    'ssssssss',
                    'sSssSsSs',
                    'ssssssss',
                    'SsSsSsSs'
                ],
                { s: '#f2d399', S: '#e0b97e' },
                false,
                'Terreno'
            ),
            tile(
                'snow_field',
                'Campo Nevado',
                [
                    'WWWWWWWW',
                    'WwwWwwWw',
                    'WWWWWWWW',
                    'WwwWwwWw',
                    'WWWWWWWW',
                    'WwwWwwWw',
                    'WWWWWWWW',
                    'WwwWwwWw'
                ],
                { W: '#f8f9fa', w: '#dee2e6' },
                false,
                'Terreno'
            ),
            tile(
                'lava_pool',
                'Poca de Lava',
                [
                    'rrOrrOrr',
                    'rOOrrOOr',
                    'rrOrrOrr',
                    'rOOrrOOr',
                    'rrOrrOrr',
                    'rOOrrOOr',
                    'rrOrrOrr',
                    'rOOrrOOr'
                ],
                { r: '#f03e3e', O: '#ff922b' },
                true,
                'Agua'
            ),
            tile(
                'swamp_mire',
                'Lama de Pantano',
                [
                    'ggmmggmm',
                    'mggmmggm',
                    'ggmmggmm',
                    'mggmmggm',
                    'ggmmggmm',
                    'mggmmggm',
                    'ggmmggmm',
                    'mggmmggm'
                ],
                { g: '#2b8a3e', m: '#495057' },
                true,
                'Natureza'
            ),
            tile(
                'stone_bridge',
                'Ponte de Pedra',
                [
                    'BBBBBBBB',
                    'bBBbBBbB',
                    'BBBBBBBB',
                    'bBBbBBbB',
                    'BBBBBBBB',
                    'bBBbBBbB',
                    'BBBBBBBB',
                    'bBBbBBbB'
                ],
                { B: '#adb5bd', b: '#6c757d' },
                false,
                'Construcoes'
            ),
            tile(
                'cobblestone',
                'Calcamento',
                [
                    'ooOOooOO',
                    'OOooooOO',
                    'ooOOooOO',
                    'OOooooOO',
                    'ooOOooOO',
                    'OOooooOO',
                    'ooOOooOO',
                    'OOooooOO'
                ],
                { O: '#868e96', o: '#adb5bd' },
                false,
                'Terreno'
            ),
            tile(
                'royal_carpet',
                'Tapete Real',
                [
                    'rrrrrrrr',
                    'rrGGGGrr',
                    'rGGYYGGr',
                    'rGYccYGr',
                    'rGYccYGr',
                    'rGGYYGGr',
                    'rrGGGGrr',
                    'rrrrrrrr'
                ],
                { r: '#8b1e3f', G: '#b197fc', Y: '#ffd43b', c: '#343a40' },
                false,
                'Interior'
            ),
            tile(
                'cave_floor',
                'Chao de Caverna',
                [
                    'dddddddd',
                    'dDDddDDd',
                    'dddddddd',
                    'dDDddDDd',
                    'dddddddd',
                    'dDDddDDd',
                    'dddddddd',
                    'dDDddDDd'
                ],
                { d: '#3c3f44', D: '#4f535b' },
                false,
                'Terreno'
            ),
            tile(
                'castle_gate',
                'Portao do Castelo',
                [
                    'HHHHHHHH',
                    'HggHHggH',
                    'HggHHggH',
                    'HHHHHHHH',
                    'HggHHggH',
                    'HggHHggH',
                    'HHHHHHHH',
                    'HggHHggH'
                ],
                { H: '#6c757d', g: '#343a40' },
                true,
                'Construcoes'
            ),
            tile(
                'torch_brazier',
                'Braseiro',
                [
                    '........',
                    '...rr...',
                    '..rYYr..',
                    '.rYYYYr.',
                    '.rYYYYr.',
                    '..rYYr..',
                    '...rr...',
                    '...bb...'
                ],
                { r: '#ff922b', Y: '#ffd43b', b: '#4f4f4f', '.': 'transparent' },
                true,
                'Decoracao'
            ),
            tile(
                'cottage_roof',
                'Telhado de Casa',
                [
                    'RRRRRRRR',
                    'RRrrRRrr',
                    'RRRRRRRR',
                    'RRrrRRrr',
                    'RRRRRRRR',
                    'RRrrRRrr',
                    'RRRRRRRR',
                    'RRRRRRRR'
                ],
                { R: '#b5651d', r: '#8d4b12' },
                true,
                'Construcoes'
            ),
            tile(
                'cottage_wall',
                'Parede de Casa',
                [
                    'wwwwwwww',
                    'wwWWwwWW',
                    'wwwwwwww',
                    'wwWWwwWW',
                    'wwwwwwww',
                    'wwWWwwWW',
                    'wwwwwwww',
                    'wwwwwwww'
                ],
                { w: '#f8f0e3', W: '#d8c3a5' },
                true,
                'Construcoes'
            ),
            tile(
                'cottage_door',
                'Porta de Casa',
                [
                    'wwwwwwww',
                    'wwwwwwww',
                    'wwDDDDww',
                    'wwDDDDww',
                    'wwDDDDww',
                    'wwDDDDww',
                    'wwDDDDww',
                    'wwDDDDww'
                ],
                { w: '#f8f0e3', D: '#5c3902' },
                true,
                'Construcoes'
            ),
            tile(
                'cottage_window',
                'Janela de Casa',
                [
                    'wwwwwwww',
                    'wwBBBBww',
                    'wwBYYBww',
                    'wwBYYBww',
                    'wwBBBBww',
                    'wwwwwwww',
                    'wwwwwwww',
                    'wwwwwwww'
                ],
                { w: '#f8f0e3', B: '#5c3902', Y: '#6ec5ff' },
                true,
                'Construcoes'
            ),
            tile(
                'stone_house_roof',
                'Telhado de Pedra',
                [
                    'MMMMMMMM',
                    'MMmmMMmm',
                    'MMMMMMMM',
                    'MMmmMMmm',
                    'MMMMMMMM',
                    'MMmmMMmm',
                    'MMMMMMMM',
                    'MMMMMMMM'
                ],
                { M: '#6c757d', m: '#495057' },
                true,
                'Construcoes'
            ),
            tile(
                'stone_house_wall',
                'Parede de Pedra',
                [
                    'SSSSSSSS',
                    'SssSSssS',
                    'SSSSSSSS',
                    'SssSSssS',
                    'SSSSSSSS',
                    'SssSSssS',
                    'SSSSSSSS',
                    'SSSSSSSS'
                ],
                { S: '#adb5bd', s: '#6c757d' },
                true,
                'Construcoes'
            ),
            tile(
                'market_stall_top',
                'Tenda do Mercado',
                [
                    'RRRRRRRR',
                    'WWWWWWWW',
                    'RRRRRRRR',
                    'WWWWWWWW',
                    'RRRRRRRR',
                    'WWWWWWWW',
                    'RRRRRRRR',
                    'WWWWWWWW'
                ],
                { R: '#e03131', W: '#f8f9fa' },
                true,
                'Construcoes'
            ),
            tile(
                'market_counter',
                'Balcao do Mercado',
                [
                    'bbbbbbbb',
                    'bBBbBBbB',
                    'bbbbbbbb',
                    'bBBbBBbB',
                    'bbbbbbbb',
                    'BBBBBBBB',
                    'BBBBBBBB',
                    'BBBBBBBB'
                ],
                { b: '#6d4c41', B: '#8d6e63' },
                true,
                'Construcoes'
            ),
            tile(
                'barn_roof',
                'Telhado do Celeiro',
                [
                    'RRRRRRRR',
                    'RRRRRRRR',
                    'RRrrRRrr',
                    'RRRRRRRR',
                    'RRRRRRRR',
                    'RRrrRRrr',
                    'RRRRRRRR',
                    'RRRRRRRR'
                ],
                { R: '#d9480f', r: '#a23e1e' },
                true,
                'Construcoes'
            ),
            tile(
                'barn_wall',
                'Parede do Celeiro',
                [
                    'rrrrrrrr',
                    'rRRrrRRr',
                    'rrrrrrrr',
                    'rRRrrRRr',
                    'rrrrrrrr',
                    'rRRrrRRr',
                    'rrrrrrrr',
                    'rRRrrRRr'
                ],
                { r: '#a4161a', R: '#d9480f' },
                true,
                'Construcoes'
            ),
            tile(
                'barn_door',
                'Porta do Celeiro',
                [
                    'rrrrrrrr',
                    'rrrrrrrr',
                    'rrXXXXrr',
                    'rrXXXXrr',
                    'rrXXXXrr',
                    'rrXXXXrr',
                    'rrrrrrrr',
                    'rrrrrrrr'
                ],
                { r: '#a4161a', X: '#ffd166' },
                true,
                'Construcoes'
            ),
            tile(
                'bakery_roof',
                'Telhado da Padaria',
                [
                    'mmmmmmmm',
                    'mMMmmMMm',
                    'mmmmmmmm',
                    'mMMmmMMm',
                    'mmmmmmmm',
                    'mMMmmMMm',
                    'mmmmmmmm',
                    'mmmmmmmm'
                ],
                { m: '#e59866', M: '#ca7a45' },
                true,
                'Construcoes'
            ),
            tile(
                'bakery_wall',
                'Parede da Padaria',
                [
                    'pppppppp',
                    'pPPppPPp',
                    'pppppppp',
                    'pPPppPPp',
                    'pppppppp',
                    'pPPppPPp',
                    'pppppppp',
                    'pppppppp'
                ],
                { p: '#f3d9b1', P: '#e0b583' },
                true,
                'Construcoes'
            ),
            tile(
                'bakery_window',
                'Janela da Padaria',
                [
                    'pppppppp',
                    'ppWWWWpp',
                    'ppWYYWpp',
                    'ppWyyWpp',
                    'ppWWWWpp',
                    'pppppppp',
                    'pppppppp',
                    'pppppppp'
                ],
                { p: '#f3d9b1', W: '#8d6e63', Y: '#ffee99', y: '#ffd43b' },
                true,
                'Construcoes'
            ),
            tile(
                'fountain_top',
                'Topo da Fonte',
                [
                    '........',
                    '..BBBB..',
                    '.BwwwwB.',
                    '.BwwwwB.',
                    '.BwwwwB.',
                    '.BwwwwB.',
                    '..BBBB..',
                    '........'
                ],
                { B: '#74c0fc', w: '#a5d8ff', '.': 'transparent' },
                true,
                'Decoracao'
            ),
            tile(
                'fountain_base',
                'Base da Fonte',
                [
                    'BBBBBBBB',
                    'BwwwwwwB',
                    'BwwwwwwB',
                    'BwwwwwwB',
                    'BwwwwwwB',
                    'BwwwwwwB',
                    'BBBBBBBB',
                    'BBBBBBBB'
                ],
                { B: '#4dabf7', w: '#99d9ff' },
                true,
                'Decoracao'
            )
        ];
    }

    cloneTile(tile) {
        return {
            id: tile.id,
            name: tile.name,
            collision: !!tile.collision,
            pixels: tile.pixels.map(row => row.slice()),
            category: tile.category || 'Diversos'
        };
    }

    ensureDefaultTiles() {
        const tileset = this.gameState.game.tileset;
        const size = this.gameState.game.roomSize || 8;

        if (!Array.isArray(tileset.tiles) || tileset.tiles.length === 0) {
            tileset.tiles = this.presets.map(tile => this.cloneTile(tile));
        } else {
            tileset.tiles = tileset.tiles.map((tile, index) => this.normalizeTile(tile, index));
        }

        const validIds = new Set(tileset.tiles.map(tile => tile.id));
        const defaultTileId = tileset.tiles[0]?.id ?? null;

        const normalizeLayer = (layer, fallback) => {
            const rows = Array.from({ length: size }, (_, y) =>
                Array.from({ length: size }, (_, x) => {
                    const value = layer?.[y]?.[x] ?? null;
                    if (value === null || value === undefined) {
                        return fallback;
                    }
                    return validIds.has(value) ? value : fallback;
                })
            );
            return rows;
        };

        const map = tileset.map ?? {};
        map.ground = normalizeLayer(map.ground, defaultTileId);
        map.overlay = normalizeLayer(map.overlay, null);
        tileset.map = map;
    }

    getPresetTileNames() {
        return this.presets.map(tile => tile.name);
    }

    getTiles() {
        return this.gameState.game.tileset.tiles;
    }

    getTile(tileId) {
        return this.gameState.game.tileset.tiles.find((t) => t.id === tileId);
    }

    updateTile(tileId, data) {
        const tile = this.getTile(tileId);
        if (!tile) return;
        if (typeof data.collision === 'boolean') {
            tile.collision = data.collision;
        }
        if (typeof data.name === 'string' && data.name.trim()) {
            tile.name = data.name.trim();
        }
        if (typeof data.category === 'string' && data.category.trim()) {
            tile.category = data.category.trim();
        }
        if (Array.isArray(data.pixels)) {
            const normalized = this.normalizeTile({ ...tile, pixels: data.pixels });
            tile.pixels = normalized.pixels;
        }
    }

    setMapTile(x, y, tileId) {
        if (y < 0 || y >= 8 || x < 0 || x >= 8) return;
        const map = this.gameState.game.tileset.map;
        if (!map) return;

        if (tileId === null) {
            map.overlay[y][x] = null;
            map.ground[y][x] = null;
            return;
        }

        const tile = this.getTile(tileId);
        if (!tile) return;
        if (tile.collision) {
            map.overlay[y][x] = tileId;
        } else {
            map.ground[y][x] = tileId;
            map.overlay[y][x] = null;
        }
    }

    getTileMap() {
        return this.gameState.game.tileset.map;
    }

}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TileManager;
} else {
    window.TileManager = TileManager;
}


