export interface MonsterData {
    name: string;
    texture: string;
    hp: number;
    damage: number;
    exp: number;
    gold: number;
    isBoss: boolean;
}

const MONSTER_TYPES = [
    { name: '슬라임', texture: 'monster_slime', baseHp: 20, baseDamage: 3 },
    { name: '쥐', texture: 'monster_bat', baseHp: 25, baseDamage: 4 },
    { name: '박쥐', texture: 'monster_bat', baseHp: 30, baseDamage: 5 },
    { name: '늑대', texture: 'monster_wolf', baseHp: 50, baseDamage: 8 },
    { name: '유령', texture: 'monster_ghost', baseHp: 40, baseDamage: 10 },
    { name: '고블린', texture: 'monster_goblin', baseHp: 60, baseDamage: 12 },
    { name: '오크', texture: 'monster_orc', baseHp: 100, baseDamage: 18 },
    { name: '해골', texture: 'monster_skeleton', baseHp: 80, baseDamage: 15 },
    { name: '악마', texture: 'monster_demon', baseHp: 150, baseDamage: 25 },
    { name: '드래곤', texture: 'monster_dragon', baseHp: 300, baseDamage: 40 },
];

export function getMonsterForLevel(dungeonLevel: number): MonsterData {
    const typeIndex = Math.min(Math.floor(dungeonLevel / 15), MONSTER_TYPES.length - 1);
    const baseMonster = MONSTER_TYPES[typeIndex];
    const levelMultiplier = 1 + (dungeonLevel * 0.15);
    const expMultiplier = 1 + (dungeonLevel * 0.2);
    const isBoss = Math.random() < 0.05;
    const bossMultiplier = isBoss ? 5 : 1;

    return {
        name: isBoss ? `강화된 ${baseMonster.name}` : baseMonster.name,
        texture: isBoss ? 'monster_boss' : baseMonster.texture,
        hp: Math.floor(baseMonster.baseHp * levelMultiplier * bossMultiplier),
        damage: Math.floor(baseMonster.baseDamage * levelMultiplier * bossMultiplier * 0.5),
        exp: Math.floor((10 + dungeonLevel * 5) * expMultiplier * bossMultiplier),
        gold: Math.floor((5 + dungeonLevel * 3) * bossMultiplier),
        isBoss,
    };
}

export const DUNGEONS = [
    { id: 1, name: '초보자 사냥터', levelRange: '1-5', minLevel: 1 },
    { id: 2, name: '쥐굴', levelRange: '6-10', minLevel: 5 },
    { id: 3, name: '으스스한 동굴', levelRange: '11-15', minLevel: 10 },
    { id: 4, name: '늑대 소굴', levelRange: '16-20', minLevel: 15 },
    { id: 5, name: '유령의 숲', levelRange: '21-25', minLevel: 20 },
    { id: 6, name: '고블린 마을', levelRange: '26-30', minLevel: 25 },
    { id: 7, name: '오크 요새', levelRange: '31-40', minLevel: 30 },
    { id: 8, name: '해골 던전', levelRange: '41-50', minLevel: 40 },
    { id: 9, name: '악마의 신전', levelRange: '51-70', minLevel: 50 },
    { id: 10, name: '용의 둥지', levelRange: '71-100', minLevel: 70 },
    { id: 11, name: '마왕성 1층', levelRange: '101-130', minLevel: 100 },
    { id: 12, name: '마왕성 2층', levelRange: '131-160', minLevel: 130 },
    { id: 13, name: '마왕성 3층', levelRange: '161-200', minLevel: 160 },
    { id: 14, name: '지옥 1단계', levelRange: '201-230', minLevel: 200 },
    { id: 15, name: '지옥 2단계', levelRange: '231-260', minLevel: 230 },
    { id: 16, name: '지옥 3단계', levelRange: '261-300', minLevel: 260 },
];
