type TileFrame = string[][];

type TileDefinitionData = {
    id: string | number;
    name: string;
    pixels: TileFrame;
    frames: TileFrame[];
    collision: boolean;
    category: string;
};

class Tile {
    id: string | number;
    name: string;
    pixels: TileFrame;
    frames: TileFrame[];
    animated: boolean;
    collision: boolean;
    category: string;

    constructor(data: TileDefinitionData) {
        this.id = data.id;
        this.name = data.name;
        this.pixels = data.pixels;
        this.frames = data.frames;
        this.animated = data.frames.length > 1;
        this.collision = data.collision;
        this.category = data.category;
    }
}

export type { TileDefinitionData, TileFrame };
export { Tile };
