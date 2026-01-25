type SkillDefinitionData = {
    id: string;
    nameKey: string;
    descriptionKey: string;
    icon: string;
};

class Skill {
    id: string;
    nameKey: string;
    descriptionKey: string;
    icon: string;

    constructor(data: SkillDefinitionData) {
        this.id = data.id;
        this.nameKey = data.nameKey;
        this.descriptionKey = data.descriptionKey;
        this.icon = data.icon;
    }
}

export type { SkillDefinitionData };
export { Skill };
