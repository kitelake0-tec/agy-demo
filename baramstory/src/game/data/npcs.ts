import { Item, ITEMS } from './items';

export interface Skill {
    id: string;
    name: string;
    icon: string;
    damage: number;
    mpCost: number;
    cooldown: number;
    currentCooldown: number;
    requiredLevel: number;
    description: string;
    price: number;
    type: 'melee' | 'ranged' | 'area' | 'buff';
}

export interface NPCData {
    id: string;
    name: string;
    role: string;
    dialogue: string;
    icon: string;
    shopItems?: Item[];
    skills?: Skill[];
}

export const SKILLS: Skill[] = [
    {
        id: 'slash',
        name: '연참',
        icon: '⚔️',
        damage: 25,
        mpCost: 5,
        cooldown: 1000,
        currentCooldown: 0,
        requiredLevel: 1,
        description: '빠른 3연속 베기 공격',
        price: 0,
        type: 'melee',
    },
    {
        id: 'power_strike',
        name: '강타',
        icon: '💥',
        damage: 50,
        mpCost: 10,
        cooldown: 2000,
        currentCooldown: 0,
        requiredLevel: 5,
        description: '강력한 일격을 가합니다',
        price: 500,
        type: 'melee',
    },
    {
        id: 'wind_blade',
        name: '풍인검',
        icon: '🌀',
        damage: 40,
        mpCost: 15,
        cooldown: 2500,
        currentCooldown: 0,
        requiredLevel: 10,
        description: '바람을 담은 검기를 날립니다',
        price: 1500,
        type: 'ranged',
    },
    {
        id: 'flame_sword',
        name: '화염검',
        icon: '🔥',
        damage: 70,
        mpCost: 20,
        cooldown: 3000,
        currentCooldown: 0,
        requiredLevel: 15,
        description: '불꽃을 두른 검으로 베기',
        price: 3000,
        type: 'melee',
    },
    {
        id: 'ice_wave',
        name: '빙결파',
        icon: '❄️',
        damage: 60,
        mpCost: 25,
        cooldown: 3500,
        currentCooldown: 0,
        requiredLevel: 20,
        description: '얼음 파동으로 범위 공격',
        price: 5000,
        type: 'area',
    },
    {
        id: 'thunder_strike',
        name: '뇌전격',
        icon: '⚡',
        damage: 100,
        mpCost: 35,
        cooldown: 4000,
        currentCooldown: 0,
        requiredLevel: 30,
        description: '번개를 소환하여 공격',
        price: 10000,
        type: 'area',
    },
    {
        id: 'dragon_breath',
        name: '용의 숨결',
        icon: '🐲',
        damage: 150,
        mpCost: 50,
        cooldown: 5000,
        currentCooldown: 0,
        requiredLevel: 50,
        description: '용의 화염을 뿜어냅니다',
        price: 30000,
        type: 'ranged',
    },
    {
        id: 'divine_judgment',
        name: '천벌',
        icon: '☀️',
        damage: 250,
        mpCost: 80,
        cooldown: 8000,
        currentCooldown: 0,
        requiredLevel: 70,
        description: '신성한 빛으로 심판합니다',
        price: 80000,
        type: 'area',
    },
    {
        id: 'war_cry',
        name: '전투함성',
        icon: '📢',
        damage: 0,
        mpCost: 30,
        cooldown: 30000,
        currentCooldown: 0,
        requiredLevel: 25,
        description: '30초간 공격력 30% 증가',
        price: 8000,
        type: 'buff',
    },
];

export const NPC_DATA: Record<string, NPCData> = {
    blacksmith: {
        id: 'blacksmith',
        name: '대장장이 철수',
        role: '무기 상점',
        icon: '⚒️',
        dialogue: '어서 오시게! 좋은 무기와 방어구가 많다네.',
        shopItems: [
            ITEMS.wooden_sword,
            ITEMS.iron_sword,
            ITEMS.samigok,
            ITEMS.dragon_slayer,
            ITEMS.cloth_armor,
            ITEMS.leather_armor,
            ITEMS.steel_armor,
        ],
    },
    innkeeper: {
        id: 'innkeeper',
        name: '주모 할머니',
        role: 'HP 회복',
        icon: '🍶',
        dialogue: '피곤하시면 술 한잔 하고 가시게나~',
        shopItems: [
            ITEMS.hp_potion_small,
            ITEMS.hp_potion_medium,
            ITEMS.hp_potion_large,
            ITEMS.full_potion,
        ],
    },
    alchemist: {
        id: 'alchemist',
        name: '연금술사 현자',
        role: 'MP 회복',
        icon: '⚗️',
        dialogue: '마력이 부족하신가? 물약을 가져가시게.',
        shopItems: [
            ITEMS.mp_potion_small,
            ITEMS.mp_potion_medium,
            ITEMS.mp_potion_large,
            ITEMS.full_potion,
        ],
    },
    sage: {
        id: 'sage',
        name: '도사 무현',
        role: '스킬 상점',
        icon: '📖',
        dialogue: '무예를 갈고닦을 준비가 되었는가?',
        skills: SKILLS.filter(s => s.price > 0),
    },
    merchant: {
        id: 'merchant',
        name: '잡화상 복동',
        role: '잡화 상점',
        icon: '🎒',
        dialogue: '이것저것 다 팔아요! 귀한 물건 많답니다~',
        shopItems: [
            ITEMS.return_scroll,
            ITEMS.hp_potion_small,
            ITEMS.mp_potion_small,
        ],
    },
    banker: {
        id: 'banker',
        name: '은행원 김금고',
        role: '은행',
        icon: '🏦',
        dialogue: '안녕하세요. 금화 보관 서비스를 이용하시겠습니까?',
        shopItems: [],
    },
    gambler: {
        id: 'gambler',
        name: '도박사 럭키',
        role: '도박장',
        icon: '🎰',
        dialogue: '헤헤, 오늘 운을 시험해볼 텐가?',
        shopItems: [],
    },
    healer: {
        id: 'healer',
        name: '치료사 천사',
        role: '무료 치료',
        icon: '💖',
        dialogue: '다친 곳을 치료해드릴게요.',
        shopItems: [],
    },
    guard: {
        id: 'guard',
        name: '경비대장 강철',
        role: '정보',
        icon: '🛡️',
        dialogue: '마을 밖은 위험하니 조심하시오!',
        shopItems: [],
    },
};
