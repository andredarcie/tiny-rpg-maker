/**
 * TileDefinitions centralizes default tile colors and preset pixel matrices.
 */
const PICO8_COLORS = Object.freeze([
    "#000000",
    "#1D2B53",
    "#7E2553",
    "#008751",
    "#AB5236",
    "#5F574F",
    "#C2C3C7",
    "#FFF1E8",
    "#FF004D",
    "#FFA300",
    "#FFFF27",
    "#00E756",
    "#29ADFF",
    "#83769C",
    "#FF77A8",
    "#FFCCAA"
]);

function createTile(id, name, pixels, collision = false, category = 'Diversos') {
    return { id, name, pixels, collision, category };
}

function toPixels(layout) {
    return layout.map((row) =>
        row.map((value) => (value === null ? 'transparent' : PICO8_COLORS[value] ?? 'transparent'))
    );
}

function tile(id, name, layout, collision = false, category = 'Diversos') {
    return createTile(id, name, toPixels(layout), collision, category);
}

const TILE_PRESETS = [
    tile('grass', 'Grama Vibrante', [
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3]
    ], false, 'Terreno'),

    tile('tall_grass', 'Grama Alta', [
        [ 3,  3,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3, 11,  3,  3,  3,  3],
        [ 3,  3,  3, 11,  3,  3,  3,  3],
        [ 3,  3,  3, 11,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  11,  3,  3],
        [ 3,  11,  3,  3,  3, 11,  3,  3],
        [ 3,  11,  3,  3,  3,  3,  3,  3],
        [ 3,  3,  3,  3,  3,  3,  3,  3]
    ], false, 'Terreno'),

    tile('dirt_path', 'Trilha de Terra', [
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  4,  9,  4,  4,  4,  9,  4],
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  4,  4,  4,  4,  9,  4,  4],
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  4,  9,  4,  4,  4,  9,  4],
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  4,  4,  4,  4,  4,  9,  4]
    ], false, 'Terreno'),

    tile('stone_floor', 'Chao de Pedra', [
        [  3,  3,  3,  3,  3,  3,  3,  3 ],
        [  3,  3,  3,  3,  3,  3,  3,  3 ],
        [  3,  3,  3,  3,  3,  3,  3,  3 ],
        [  3,  3,  1,  1,  1,  1,  1,  3 ],
        [  3,  1,  1,  6,  6,  6,  1,  3 ],
        [  3,  1,  6,  6,  6,  6,  1,  3 ],
        [  3,  3,  3,  3,  3,  3,  3,  3 ],
        [  3,  3,  3,  3,  3,  3,  3,  3 ]
    ], false, 'Terreno'),

    tile('sand', 'Areia Macia', [
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 15, 10, 15, 15, 10, 15, 15],
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 10, 15, 15, 15, 15, 10, 15],
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 15, 10, 15, 15, 10, 15, 15],
        [15, 15, 15, 15, 15, 15, 15, 15],
        [15, 10, 15, 15, 15, 15, 10, 15]
    ], false, 'Terreno'),

    tile('water', 'Agua Brilhante', [
        [ 1,  1,  1,  1,  1,  1,  1,  1],
        [ 1,  1, 12,  7,  7, 12,  1,  1],
        [ 1, 12,  7,  7, 12, 12,  1,  1],
        [12, 12,  1,  1,  1,  1, 12, 12],
        [ 1, 12,  7,  7, 12, 12,  1,  1],
        [ 1,  1, 12,  7,  7, 12,  1,  1],
        [ 1,  1,  1,  1,  1,  1,  1,  1],
        [12, 12,  1,  1,  1,  1, 12, 12]
    ], true, 'Agua'),

    tile('lava', 'Lava Borbulhante', [
        [ 8,  8,  8,  8,  8,  8,  8,  8],
        [ 8,  8,  9, 10,  9,  8,  8,  8],
        [ 8,  9, 10,  9,  9, 10,  9,  8],
        [ 8,  8,  9, 10,  9,  8,  8,  8],
        [ 8,  8,  8,  8,  8,  8,  8,  8],
        [ 8,  9, 10,  9,  9, 10,  9,  8],
        [ 8,  8,  9, 10,  9,  8,  8,  8],
        [ 8,  8,  8,  8,  8,  8,  8,  8]
    ], true, 'Perigo'),

    tile('rock', 'Pedra Grande', [
        [null, null, null, null, null, null, null, null],
        [null, null,  5,  6,  6,  5, null, null],
        [null,  5,  6,  6,  6,  6,  5, null],
        [null,  5,  6,  6,  6,  6,  5, null],
        [null,  5,  6,  6,  6,  6,  5, null],
        [null,  5,  6,  6,  6,  6,  5, null],
        [null, null,  5,  6,  6,  5, null, null],
        [null, null, null, null, null, null, null, null]
    ], true, 'Natureza'),

    tile('tree', 'Arvore Verde', [
        [ 3,  1,  1,  1,  1,  1,  1,  3],
        [ 1,  1, 11, 11, 11, 11,  1,  1],
        [ 1, 11,  3, 11, 11, 11, 11,  1],
        [ 1, 11, 11, 11, 11,  3, 11,  1],
        [ 1,  1, 11, 11, 11, 11,  1,  1],
        [ 3,  1,  1,  4,  4,  1,  1,  3],
        [ 3,  3,  3,  4,  4,  3,  3,  3],
        [ 3,  3,  4,  4,  4,  4,  3,  3]
    ], true, 'Natureza'),

    tile('bush', 'Arbusto Denso', [
        [null,  1,  1,  1,  1,  1, null, null],
        [ 1, 11, 11, 11, 11, 11,  1, null],
        [ 1, 11, 11, 11, 11, 11,  1, null],
        [ 1, 11, 11, 11, 11, 11,  1, null],
        [null,  1, 11, 11, 11,  1, null, null],
        [null, null,  1,  1,  1, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ], true, 'Natureza'),

    tile('stone_wall', 'Parede de Pedra', [
        [ 6,  6,  6,  6,  6,  6,  6,  6],
        [ 5,  6,  6,  6,  6,  6,  6,  5],
        [ 6,  6,  6,  6,  6,  6,  6,  6],
        [ 6,  6,  5,  6,  6,  5,  6,  6],
        [ 6,  6,  6,  6,  6,  6,  6,  6],
        [ 5,  6,  6,  6,  6,  6,  6,  5],
        [ 6,  6,  6,  6,  6,  6,  6,  6],
        [ 6,  6,  5,  6,  6,  5,  6,  6]
    ], true, 'Construcoes'),

    tile('wood_wall', 'Parede de Madeira', [
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  9,  9,  9,  9,  9,  4,  9],
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  9,  9,  9,  9,  9,  4,  9],
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  9,  9,  9,  9,  9,  4,  9],
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  9,  9,  9,  9,  9,  4,  9]
    ], true, 'Construcoes'),

    tile('roof', 'Telhado Classico', [
        [ 2,  2,  2,  2,  2,  2,  2,  2],
        [ 2,  2, 14, 14, 14, 14,  2,  2],
        [ 2, 14, 14, 14, 14, 14, 14,  2],
        [ 2, 14, 14, 14, 14, 14, 14,  2],
        [ 2, 14, 14, 14, 14, 14, 14,  2],
        [ 2, 14, 14, 14, 14, 14, 14,  2],
        [ 2,  2, 14, 14, 14, 14,  2,  2],
        [ 2,  2,  2,  2,  2,  2,  2,  2]
    ], true, 'Construcoes'),

    tile('door', 'Porta de Madeira', [
        [ 4,  4,  4,  4,  4,  4,  4,  4],
        [ 4,  9,  9,  9,  9,  9,  9,  4],
        [ 4,  9,  9,  9,  9,  9,  9,  4],
        [ 4,  9,  9,  9, 10,  9,  9,  4],
        [ 4,  9,  9,  9,  9,  9,  9,  4],
        [ 4,  9,  9,  9,  9,  9,  9,  4],
        [ 4,  9,  9,  9,  9,  9,  9,  4],
        [ 4,  4,  4,  4,  4,  4,  4,  4]
    ], false, 'Construcoes'),

    tile('window', 'Janela Azul', [
        [ 7,  7,  7,  7,  7,  7,  7,  7],
        [ 7,  1,  1,  1,  1,  1,  1,  7],
        [ 7,  1, 12,  1, 12,  1,  1,  7],
        [ 7,  1, 12,  1, 12,  1,  1,  7],
        [ 7,  1, 12,  1, 12,  1,  1,  7],
        [ 7,  1, 12,  1, 12,  1,  1,  7],
        [ 7,  1,  1,  1,  1,  1,  1,  7],
        [ 7,  7,  7,  7,  7,  7,  7,  7]
    ], true, 'Construcoes'),

    tile('torch', 'Tocha de Parede', [
        [null, null, null, 10, null, null, null, null],
        [null, null, 10,  9, 10, null, null, null],
        [null, 10,  8,  8, 10, null, null, null],
        [null, null, 10,  9, 10, null, null, null],
        [null, null, null, 10, null, null, null, null],
        [null, null, null,  4, null, null, null, null],
        [null, null,  5,  5,  5, null, null, null],
        [null, null,  5,  5,  5, null, null, null]
    ], false, 'Decoracao')
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PICO8_COLORS, TILE_PRESETS, createTile };
} else {
    window.PICO8_COLORS = PICO8_COLORS;
    window.TILE_PRESETS = TILE_PRESETS;
}
