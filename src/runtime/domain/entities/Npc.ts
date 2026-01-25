type SpriteMatrix = (number | null)[][];

type NpcVariant = 'human' | 'elf' | 'dwarf' | 'fixed';

type NpcDefinitionData = {
    type: string;
    id: string;
    name: string;
    nameKey: string;
    previewLabel: string;
    defaultText: string;
    defaultTextKey: string;
    sprite: SpriteMatrix;
    variant: NpcVariant;
};

class Npc {
    type: string;
    id: string;
    name: string;
    nameKey: string;
    previewLabel: string;
    defaultText: string;
    defaultTextKey: string;
    sprite: SpriteMatrix;
    variant: NpcVariant;

    constructor(data: NpcDefinitionData) {
        this.type = data.type;
        this.id = data.id;
        this.name = data.name;
        this.nameKey = data.nameKey;
        this.previewLabel = data.previewLabel;
        this.defaultText = data.defaultText;
        this.defaultTextKey = data.defaultTextKey;
        this.sprite = data.sprite;
        this.variant = data.variant;
    }
}

export type { NpcDefinitionData, NpcVariant, SpriteMatrix };
export { Npc };
