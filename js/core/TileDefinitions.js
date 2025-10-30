/**
 * TileDefinitions centraliza a paleta PICO-8 e os tiles padrão.
 */
class TileDefinitions {
    static PICO8_COLORS = Object.freeze([
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

    static createTile(id, name, pixels, collision = false, category = 'Diversos') {
        return { id, name, pixels, collision, category };
    }

    static toPixels(layout) {
        return layout.map((row) =>
            row.map((value) => (value === null ? 'transparent' : (this.PICO8_COLORS[value] ?? 'transparent')))
        );
    }

    static tile(index, name, layout, collision = false, category = 'Diversos') {
        return this.createTile(index, name, this.toPixels(layout), collision, category);
    }

    static TILE_PRESETS = [
        this.tile(0, 'Grama Vibrante', [
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3]
        ], false, 'Terreno'),

        this.tile(1, 'Grama Alta', [
            [ 3,  3,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3, 11,  3,  3,  3,  3],
            [ 3,  3,  3, 11,  3,  3,  3,  3],
            [ 3,  3,  3, 11,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  11,  3,  3],
            [ 3,  11,  3,  3,  3, 11,  3,  3],
            [ 3,  11,  3,  3,  3,  3,  3,  3],
            [ 3,  3,  3,  3,  3,  3,  3,  3]
        ], false, 'Terreno'),

        this.tile(2, 'Trilha de Terra', [
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  4,  9,  4,  4,  4,  4,  4,  4 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  4,  4,  4,  4,  4,  4,  9,  4 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  4,  4,  4,  9,  4,  4,  4,  4 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ]
        ], false, 'Terreno'),

        this.tile(3, 'Chao de Pedra', [
            [  3,  3,  3,  3,  3,  3,  3,  3 ],
            [  3,  5,  5,  3,  3,  3,  3,  3 ],
            [  5,  6,  6,  5,  3,  3,  3,  3 ],
            [  3,  3,  3,  3,  3,  5,  3,  3 ],
            [  3,  3,  3,  3,  5,  6,  5,  3 ],
            [  3,  3,  3,  5,  6,  6,  5,  3 ],
            [  3,  3,  3,  3,  3,  3,  3,  3 ],
            [  3,  3,  3,  3,  3,  3,  3,  3 ]
        ], true, 'Terreno'),

        this.tile(4, 'Areia Macia', [
            [15, 15, 15, 15, 15, 15, 15, 15],
            [15, 15, 10, 15, 15, 10, 15, 15],
            [15, 15, 15, 15, 15, 15, 15, 15],
            [15, 10, 15, 15, 15, 15, 10, 15],
            [15, 15, 15, 15, 15, 15, 15, 15],
            [15, 15, 10, 15, 15, 10, 15, 15],
            [15, 15, 15, 15, 15, 15, 15, 15],
            [15, 10, 15, 15, 15, 15, 10, 15]
        ], false, 'Terreno'),

        this.tile(5, 'Agua Brilhante', [
            [ 12, 12, 12, 12, 12, 12, 12, 12 ],
            [ 12,  7, 12, 12, 12, 12, 12, 12 ],
            [ 12, 12, 12, 12, 12, 12, 12, 12 ],
            [ 12, 12, 12, 12, 12, 12, 12, 12 ],
            [ 12, 12, 12, 12, 12,  7,  7, 12 ],
            [ 12, 12, 12, 12, 12, 12, 12, 12 ],
            [ 12, 12,  7, 12, 12, 12, 12, 12 ],
            [ 12, 12, 12, 12, 12, 12, 12, 12 ]
        ], true, 'Agua'),

        this.tile(6, 'Lava Borbulhante', [
            [ 10, 10,  8,  8,  8,  8,  9,  8 ],
            [  8, 10,  9, 10,  9,  9,  8,  8 ],
            [  9,  9, 10,  9,  9, 10,  9, 10 ],
            [  8,  8,  8,  8,  9, 10, 10,  8 ],
            [  8,  8,  8,  8,  8,  8,  8,  8 ],
            [  8,  9, 10,  8,  8, 10,  9,  8 ],
            [  8, 10,  9, 10,  9, 10,  8,  8 ],
            [ 10,  8,  8,  8,  8,  8,  9,  8 ]
        ], false, 'Perigo'),

        this.tile(7, 'Pedra Grande', [
            [ null, null, null, null, null, null, null, null ],
            [ null, null, null, null,  5, null, null, null ],
            [ null, null, null,  5,  7,  5, null, null ],
            [ null, null,  5, 13,  6,  7,  5, null ],
            [ null,  5, 13,  6,  6,  6,  5, null ],
            [ null,  5, 13,  6,  6,  6,  7,  5 ],
            [ null,  5, 13,  6,  6,  6,  6,  5 ],
            [ null, null, null, null, null, null, null, null ]
        ], true, 'Natureza'),

        this.tile(8, 'Arvore Verde', [
            [ null, null,  1,  1,  1,  1, null, null ],
            [ null,  1, 11, 11, 11, 11,  1, null ],
            [  1, 11,  3, 11, 11, 11, 11,  1 ],
            [  1, 11, 11, 11, 11,  3, 11,  1 ],
            [  1, 11, 11, 11, 11, 11, 11,  1 ],
            [ null,  1,  1,  4,  4,  1,  1, null ],
            [ null, null, null,  4,  4, null, null, null ],
            [ null, null,  4,  4,  4,  4, null, null ]
        ], false, 'Construcoes'),

        this.tile(9, 'Arbusto Denso', [
            [ null, null, null, null, null, null, null, null ],
            [ null, null, null, null, null, null, null, null ],
            [ null, null, null, null, null, null, null, null ],
            [ null, null,  1,  1,  1,  1, null, null ],
            [ null,  1, 11, 11, 11, 11,  1, null ],
            [  1, 11, 11, 11, 11,  3, 11,  1 ],
            [  1, 11,  3, 11, 11, 11, 11,  1 ],
            [  1,  1,  1,  1,  1,  1,  1,  1 ]
        ], true, 'Natureza'),

        this.tile(10, 'Parede de Pedra', [
            [  6,  7,  6,  5, 13,  5, 13,  6 ],
            [  5, 13,  6,  6,  6,  5,  5,  5 ],
            [  5,  5,  6,  7,  6,  5,  5, 13 ],
            [  6,  5,  5,  5, 13,  6,  6,  7 ],
            [  6,  6, 13,  5,  5,  7,  6,  6 ],
            [ 13,  5,  7, 13,  5,  5,  6,  5 ],
            [  5,  6,  6,  6,  7, 13, 13,  5 ],
            [  7,  6,  6, 13,  5,  5,  5,  6 ]
        ], true, 'Construcoes'),

        this.tile(11, 'Parede de Madeira', [
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ]
        ], true, 'Construcoes'),

        this.tile(12, 'Telhado Classico', [
            [  2,  2,  8,  8,  2,  2,  8,  8 ],
            [  8,  8, 14, 14,  8,  8, 14, 14 ],
            [  8,  8,  2,  2,  8,  8,  2,  2 ],
            [ 14, 14,  8,  8, 14, 14,  8,  8 ],
            [  2,  2,  8,  8,  2,  2,  8,  8 ],
            [  8,  8, 14, 14,  8,  8, 14, 14 ],
            [  8,  8,  2,  2,  8,  8,  2,  2 ],
            [ 14, 14,  8,  8, 14, 14,  8,  8 ]
        ], true, 'Construcoes'),

        this.tile(13, 'Porta de Madeira', [
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  4,  9,  9,  9,  9,  9,  9,  4 ],
            [  4,  9,  9,  9,  9,  9,  9,  4 ],
            [  4,  9,  9,  9,  9,  9,  9,  4 ],
            [  4,  9,  9,  9,  9, 10,  9,  4 ],
            [  4,  9,  9,  9,  9,  9,  9,  4 ],
            [  4,  9,  9,  9,  9,  9,  9,  4 ],
            [  4,  9,  9,  9,  9,  9,  9,  4 ]
        ], false, 'Construcoes'),

        this.tile(14, 'Janela Azul', [
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  9,  9,  5,  5,  5,  5,  9,  9 ],
            [  9,  9,  5, 12,  7,  5,  9,  9 ],
            [  9,  9,  5, 12, 12,  5,  9,  9 ],
            [  9,  9,  5,  5,  5,  5,  9,  9 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ],
            [  9,  9,  9,  9,  9,  9,  9,  9 ],
            [  4,  4,  4,  4,  4,  4,  4,  4 ]
        ], true, 'Construcoes'),

        this.tile(15, 'Tocha de Parede', [
            [ null, null, null,  7, null, null, null, null ],
            [ null, null, null, 10,  7, null, null, null ],
            [ null, null, 10, 10, 10, null, null, null ],
            [ null, null, 10,  8, 10, null, null, null ],
            [ null, null, null,  4, null, null, null, null ],
            [ null, null, null,  4, null, null, null, null ],
            [ null, null, null, null, null, null, null, null ],
            [ null, null, null, null, null, null, null, null ]
        ], true, 'Decoracao')
    ];

    static get presets() {
        return this.TILE_PRESETS;
    }
}

window.TileDefinitions = TileDefinitions;
window.PICO8_COLORS = TileDefinitions.PICO8_COLORS;
window.TILE_PRESETS = TileDefinitions.TILE_PRESETS;
