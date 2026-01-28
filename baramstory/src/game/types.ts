export type ClassType = 'WARRIOR' | 'MAGE' | 'ARCHER' | 'ROGUE';

export interface BaseStats {
    maxHp: number;
    maxMp: number;
    attack: number;
    defense: number;
    speed: number;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    cooldown: number;
    damageMultiplier: number;
    mpCost: number;
    range: number;
    icon: string;
    effectColor: number;
}

export interface CharacterConfig {
    type: ClassType;
    name: string;
    stats: BaseStats;
    weapon: string;
    skills: Skill[];
    color: number; // Main visuals color
}

export const CLASS_CONFIG: Record<ClassType, CharacterConfig> = {
    WARRIOR: {
        type: 'WARRIOR',
        name: '전사',
        stats: { maxHp: 300, maxMp: 50, attack: 25, defense: 20, speed: 140 },
        weapon: '참마도',
        color: 0xaa0000, // Deep Red
        skills: [
            { id: 'bash', name: '건곤대나이', description: '체력을 소모하여 강력한 일격', cooldown: 2000, damageMultiplier: 2.0, mpCost: 0, range: 60, icon: '💥', effectColor: 0xff4444 },
            { id: 'rush', name: '진백호참', description: '전방의 적을 베어버림', cooldown: 5000, damageMultiplier: 1.5, mpCost: 20, range: 80, icon: '⚔️', effectColor: 0xffffff }
        ]
    },
    MAGE: {
        type: 'MAGE',
        name: '마법사',
        stats: { maxHp: 100, maxMp: 400, attack: 30, defense: 5, speed: 130 },
        weapon: '영혼마령봉',
        color: 0x2222aa, // Deep Blue
        skills: [
            { id: 'fireball', name: '헬파이어', description: '강력한 화염 공격', cooldown: 3000, damageMultiplier: 2.5, mpCost: 100, range: 300, icon: '🔥', effectColor: 0xff8800 },
            { id: 'frost', name: '자무주', description: '적을 얼어붙게 함', cooldown: 8000, damageMultiplier: 1.0, mpCost: 50, range: 250, icon: '❄️', effectColor: 0x00ffff }
        ]
    },
    ARCHER: {
        type: 'ARCHER',
        name: '궁수',
        stats: { maxHp: 150, maxMp: 150, attack: 22, defense: 10, speed: 170 },
        weapon: '흑일신궁',
        color: 0x00aa00, // Deep Green
        skills: [
            { id: 'shot', name: '투혈일식', description: '강력한 화살 공격', cooldown: 1000, damageMultiplier: 1.2, mpCost: 20, range: 400, icon: '🏹', effectColor: 0x88ff88 },
            { id: 'arrow_rain', name: '탄시', description: '다수의 화살 발사', cooldown: 5000, damageMultiplier: 0.8, mpCost: 40, range: 350, icon: '🌧️', effectColor: 0xccffcc }
        ]
    },
    ROGUE: {
        type: 'ROGUE',
        name: '도적',
        stats: { maxHp: 180, maxMp: 100, attack: 28, defense: 12, speed: 180 },
        weapon: '야월도',
        color: 0x333333, // Dark Grey/Black
        skills: [
            { id: 'stab', name: '필살검무', description: '치명적인 급소 공격', cooldown: 1500, damageMultiplier: 1.8, mpCost: 30, range: 60, icon: '🗡️', effectColor: 0xff00ff },
            { id: 'stealth', name: '비영승보', description: '적의 뒤로 순간이동', cooldown: 4000, damageMultiplier: 1.2, mpCost: 20, range: 150, icon: '👻', effectColor: 0x880088 }
        ]
    }
};
