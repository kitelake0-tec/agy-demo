export interface SkillEffect {
    type: 'damage' | 'heal' | 'buff' | 'debuff';
    value: number;
    duration?: number;
}

export interface SkillData {
    id: string;
    name: string;
    icon: string;
    description: string;
    mpCost: number;
    cooldown: number;
    damage: number;
    range: number;
    type: 'melee' | 'ranged' | 'area' | 'buff';
    requiredLevel: number;
    price: number;
}

export const DEFAULT_SKILLS: SkillData[] = [
    {
        id: 'basic_attack',
        name: '기본 공격',
        icon: '⚔️',
        description: '기본적인 공격입니다.',
        mpCost: 0,
        cooldown: 500,
        damage: 10,
        range: 80,
        type: 'melee',
        requiredLevel: 1,
        price: 0,
    },
];
