export interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'consumable' | 'material' | 'skillbook';
    icon: string;
    description: string;
    price: number;
    sellPrice: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    requiredLevel?: number;
    effect?: {
        hp?: number;
        mp?: number;
        attack?: number;
        defense?: number;
    };
}

export const ITEMS: Record<string, Item> = {
    hp_potion_small: {
        id: 'hp_potion_small',
        name: '동동주',
        type: 'consumable',
        icon: '🍶',
        description: 'HP를 50 회복합니다.',
        price: 50,
        sellPrice: 25,
        rarity: 'common',
        effect: { hp: 50 },
    },
    hp_potion_medium: {
        id: 'hp_potion_medium',
        name: '막걸리',
        type: 'consumable',
        icon: '🍺',
        description: 'HP를 150 회복합니다.',
        price: 150,
        sellPrice: 75,
        rarity: 'uncommon',
        effect: { hp: 150 },
    },
    hp_potion_large: {
        id: 'hp_potion_large',
        name: '청주',
        type: 'consumable',
        icon: '🍾',
        description: 'HP를 400 회복합니다.',
        price: 400,
        sellPrice: 200,
        rarity: 'rare',
        effect: { hp: 400 },
    },
    mp_potion_small: {
        id: 'mp_potion_small',
        name: '마력 부적',
        type: 'consumable',
        icon: '📜',
        description: 'MP를 30 회복합니다.',
        price: 80,
        sellPrice: 40,
        rarity: 'common',
        effect: { mp: 30 },
    },
    mp_potion_medium: {
        id: 'mp_potion_medium',
        name: '영험 부적',
        type: 'consumable',
        icon: '🧧',
        description: 'MP를 80 회복합니다.',
        price: 200,
        sellPrice: 100,
        rarity: 'uncommon',
        effect: { mp: 80 },
    },
    mp_potion_large: {
        id: 'mp_potion_large',
        name: '천년 영약',
        type: 'consumable',
        icon: '⚗️',
        description: 'MP를 200 회복합니다.',
        price: 500,
        sellPrice: 250,
        rarity: 'rare',
        effect: { mp: 200 },
    },
    full_potion: {
        id: 'full_potion',
        name: '만능 영약',
        type: 'consumable',
        icon: '✨',
        description: 'HP와 MP를 완전히 회복합니다.',
        price: 2000,
        sellPrice: 1000,
        rarity: 'epic',
        effect: { hp: 9999, mp: 9999 },
    },
    wooden_sword: {
        id: 'wooden_sword',
        name: '목도',
        type: 'weapon',
        icon: '🗡️',
        description: '나무로 만든 연습용 검.',
        price: 100,
        sellPrice: 50,
        rarity: 'common',
        requiredLevel: 1,
        effect: { attack: 5 },
    },
    iron_sword: {
        id: 'iron_sword',
        name: '철검',
        type: 'weapon',
        icon: '⚔️',
        description: '철로 만든 튼튼한 검.',
        price: 500,
        sellPrice: 250,
        rarity: 'uncommon',
        requiredLevel: 10,
        effect: { attack: 15 },
    },
    samigok: {
        id: 'samigok',
        name: '사미인곡',
        type: 'weapon',
        icon: '🔱',
        description: '전설의 명검 중 하나.',
        price: 5000,
        sellPrice: 2500,
        rarity: 'rare',
        requiredLevel: 30,
        effect: { attack: 40 },
    },
    dragon_slayer: {
        id: 'dragon_slayer',
        name: '용마제구검',
        type: 'weapon',
        icon: '🐉',
        description: '용을 베었다는 전설의 검.',
        price: 50000,
        sellPrice: 25000,
        rarity: 'legendary',
        requiredLevel: 70,
        effect: { attack: 100 },
    },
    cloth_armor: {
        id: 'cloth_armor',
        name: '무명옷',
        type: 'armor',
        icon: '👘',
        description: '천으로 만든 기본 의복.',
        price: 80,
        sellPrice: 40,
        rarity: 'common',
        requiredLevel: 1,
        effect: { defense: 3 },
    },
    leather_armor: {
        id: 'leather_armor',
        name: '가죽 갑옷',
        type: 'armor',
        icon: '🦺',
        description: '가죽으로 만든 갑옷.',
        price: 400,
        sellPrice: 200,
        rarity: 'uncommon',
        requiredLevel: 10,
        effect: { defense: 10 },
    },
    steel_armor: {
        id: 'steel_armor',
        name: '강철 갑옷',
        type: 'armor',
        icon: '🛡️',
        description: '강철로 만든 단단한 갑옷.',
        price: 3000,
        sellPrice: 1500,
        rarity: 'rare',
        requiredLevel: 30,
        effect: { defense: 25 },
    },
    return_scroll: {
        id: 'return_scroll',
        name: '귀환 주문서',
        type: 'consumable',
        icon: '📿',
        description: '마을로 즉시 귀환합니다.',
        price: 100,
        sellPrice: 50,
        rarity: 'common',
    },
    monster_essence: {
        id: 'monster_essence',
        name: '마물의 정수',
        type: 'material',
        icon: '💎',
        description: '몬스터에게서 얻은 정수.',
        price: 10,
        sellPrice: 5,
        rarity: 'common',
    },
};

export function getDropItems(monsterLevel: number): { item: Item; quantity: number }[] {
    const drops: { item: Item; quantity: number }[] = [];
    const dropChance = Math.random();

    if (dropChance < 0.3) {
        if (monsterLevel < 20) {
            drops.push({ item: ITEMS.hp_potion_small, quantity: 1 });
        } else if (monsterLevel < 50) {
            drops.push({ item: ITEMS.hp_potion_medium, quantity: 1 });
        } else {
            drops.push({ item: ITEMS.hp_potion_large, quantity: 1 });
        }
    }

    if (dropChance < 0.1) {
        if (monsterLevel < 20) {
            drops.push({ item: ITEMS.mp_potion_small, quantity: 1 });
        } else if (monsterLevel < 50) {
            drops.push({ item: ITEMS.mp_potion_medium, quantity: 1 });
        } else {
            drops.push({ item: ITEMS.mp_potion_large, quantity: 1 });
        }
    }

    if (dropChance < 0.05) {
        if (monsterLevel >= 70 && Math.random() < 0.01) {
            drops.push({ item: ITEMS.dragon_slayer, quantity: 1 });
        } else if (monsterLevel >= 30 && Math.random() < 0.05) {
            drops.push({ item: ITEMS.samigok, quantity: 1 });
        } else if (monsterLevel >= 10 && Math.random() < 0.1) {
            drops.push({ item: ITEMS.iron_sword, quantity: 1 });
        }
    }

    if (Math.random() < 0.5) {
        drops.push({ item: ITEMS.monster_essence, quantity: Math.floor(Math.random() * 3) + 1 });
    }

    return drops;
}
