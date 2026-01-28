import { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/GameConfig';
import { GameEventBus } from './game/GameEventBus';
import HUD from './components/UI/HUD';
import Inventory from './components/UI/Inventory';
import DungeonSelector from './components/UI/DungeonSelector';
import SkillBar from './components/UI/SkillBar';
import QuestPanel from './components/UI/QuestPanel';
import CodeViewer from './components/UI/CodeViewer';
import GameIntro from './components/UI/GameIntro';

interface PlayerStats {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    level: number;
    exp: number;
    expToNext: number;
    gold: number;
    attack: number;
    defense: number;
}

interface InventoryItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'consumable' | 'material' | 'skillbook';
    icon: string;
    quantity: number;
    description: string;
    price: number;
    effect?: {
        hp?: number;
        mp?: number;
        attack?: number;
        defense?: number;
    };
    requiredLevel?: number;
}

interface Skill {
    id: string;
    name: string;
    icon: string;
    damage: number;
    mpCost: number;
    cooldown: number;
    currentCooldown: number;
    requiredLevel: number;
    description: string;
}

interface QuickSlot {
    slot: number;
    item: InventoryItem | null;
}

interface ActiveBuff {
    id: string;
    name: string;
    icon: string;
    duration: number;
    remainingTime: number;
    effect: {
        attack?: number;
        defense?: number;
        speed?: number;
    };
}

interface Quest {
    id: string;
    title: string;
    description: string;
    type: 'daily' | 'main' | 'side';
    objectives: {
        type: string;
        target: string;
        current: number;
        required: number;
    }[];
    rewards: {
        exp?: number;
        gold?: number;
        items?: { id: string; quantity: number }[];
    };
    completed: boolean;
    claimed: boolean;
}

interface CombatStats {
    totalDamage: number;
    killCount: number;
    critCount: number;
    hitCount: number;
    startTime: number;
    dps: number;
}

interface MinimapData {
    playerX: number;
    playerY: number;
    worldWidth: number;
    worldHeight: number;
    monsters: { x: number; y: number; isBoss: boolean }[];
}

function App() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [showIntro, setShowIntro] = useState(true);
    const [currentScene, setCurrentScene] = useState<string>('boot');
    const [playerStats, setPlayerStats] = useState<PlayerStats>({
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        level: 1,
        exp: 0,
        expToNext: 100,
        gold: 1000,
        attack: 10,
        defense: 5,
    });
    const [inventory, setInventory] = useState<InventoryItem[]>([
        {
            id: 'hp_potion_1',
            name: '동동주',
            type: 'consumable',
            icon: '🍶',
            quantity: 10,
            description: 'HP를 50 회복합니다.',
            price: 50,
            effect: { hp: 50 },
        },
        {
            id: 'mp_potion_1',
            name: '마력 물약',
            type: 'consumable',
            icon: '💧',
            quantity: 5,
            description: 'MP를 30 회복합니다.',
            price: 80,
            effect: { mp: 30 },
        },
    ]);
    const [skills, setSkills] = useState<Skill[]>([
        {
            id: 'slash',
            name: '참격',
            icon: '⚔️',
            damage: 25,
            mpCost: 5,
            cooldown: 1000,
            currentCooldown: 0,
            requiredLevel: 1,
            description: '기본 검술 공격',
        },
        {
            id: 'fireball',
            name: '화염구',
            icon: '🔥',
            damage: 50,
            mpCost: 15,
            cooldown: 3000,
            currentCooldown: 0,
            requiredLevel: 5,
            description: '강력한 화염 마법',
        },
        {
            id: 'heal',
            name: '치유',
            icon: '💚',
            damage: 0,
            mpCost: 20,
            cooldown: 5000,
            currentCooldown: 0,
            requiredLevel: 3,
            description: 'HP를 30 회복',
        },
        {
            id: 'thunder',
            name: '낙뢰',
            icon: '⚡',
            damage: 80,
            mpCost: 25,
            cooldown: 4000,
            currentCooldown: 0,
            requiredLevel: 10,
            description: '번개를 소환하여 공격',
        },
        {
            id: 'ice_storm',
            name: '빙풍',
            icon: '❄️',
            damage: 60,
            mpCost: 20,
            cooldown: 3500,
            currentCooldown: 0,
            requiredLevel: 8,
            description: '얼음 폭풍으로 범위 공격',
        },
        {
            id: 'battle_cry',
            name: '전투함성',
            icon: '📯',
            damage: 0,
            mpCost: 30,
            cooldown: 10000,
            currentCooldown: 0,
            requiredLevel: 15,
            description: '10초간 공격력 50% 증가',
        },
    ]);
    const [quickSlots, setQuickSlots] = useState<QuickSlot[]>([
        { slot: 0, item: null },
        { slot: 1, item: null },
        { slot: 2, item: null },
        { slot: 3, item: null },
        { slot: 4, item: null },
    ]);
    const [showInventory, setShowInventory] = useState(false);
    const [showDungeonSelector, setShowDungeonSelector] = useState(false);
    const [showSkillBar, setShowSkillBar] = useState(true);
    const [showQuestPanel, setShowQuestPanel] = useState(false);
    const [showCodeViewer, setShowCodeViewer] = useState(false);
    const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
    const [isAutoAttack, setIsAutoAttack] = useState(false);
    const [combatStats, setCombatStats] = useState<CombatStats>({
        totalDamage: 0,
        killCount: 0,
        critCount: 0,
        hitCount: 0,
        startTime: Date.now(),
        dps: 0,
    });
    const [minimapData, setMinimapData] = useState<MinimapData | null>(null);
    const [quests, setQuests] = useState<Quest[]>([
        {
            id: 'daily_kill_50',
            title: '몬스터 사냥꾼',
            description: '몬스터 50마리를 처치하세요',
            type: 'daily',
            objectives: [{ type: 'kill', target: 'any', current: 0, required: 50 }],
            rewards: { exp: 500, gold: 200 },
            completed: false,
            claimed: false,
        },
        {
            id: 'daily_kill_200',
            title: '학살자',
            description: '몬스터 200마리를 처치하세요',
            type: 'daily',
            objectives: [{ type: 'kill', target: 'any', current: 0, required: 200 }],
            rewards: { exp: 2000, gold: 1000 },
            completed: false,
            claimed: false,
        },
        {
            id: 'daily_gold',
            title: '골드 수집가',
            description: '골드를 1000 획득하세요',
            type: 'daily',
            objectives: [{ type: 'collect', target: 'gold', current: 0, required: 1000 }],
            rewards: { exp: 300, gold: 500 },
            completed: false,
            claimed: false,
        },
        {
            id: 'main_level_10',
            title: '성장의 시작',
            description: '레벨 10에 도달하세요',
            type: 'main',
            objectives: [{ type: 'level', target: 'player', current: 1, required: 10 }],
            rewards: { exp: 1000, gold: 500 },
            completed: false,
            claimed: false,
        },
        {
            id: 'main_level_50',
            title: '숙련자의 길',
            description: '레벨 50에 도달하세요',
            type: 'main',
            objectives: [{ type: 'level', target: 'player', current: 1, required: 50 }],
            rewards: { exp: 10000, gold: 5000 },
            completed: false,
            claimed: false,
        },
    ]);

    // --------------- Auto Save / Load Functionality ----------------
    useEffect(() => {
        // Load game on startup
        const savedData = localStorage.getItem('baramstory_save');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.playerStats) setPlayerStats(parsed.playerStats);
                if (parsed.inventory) setInventory(parsed.inventory);
                if (parsed.quests) setQuests(parsed.quests);
                console.log('Game Loaded from LocalStorage');
            } catch (e) {
                console.error('Failed to load save data', e);
            }
        }
    }, []);

    useEffect(() => {
        // Auto-save every 30 seconds
        const saveInterval = setInterval(() => {
            const stateToSave = {
                playerStats,
                inventory,
                quests,
                timestamp: Date.now(),
            };
            localStorage.setItem('baramstory_save', JSON.stringify(stateToSave));
            console.log('Game Auto-Saved');
        }, 30000);

        return () => clearInterval(saveInterval);
    }, [playerStats, inventory, quests]);
    // ---------------------------------------------------------------

    // Initialize Phaser Game
    useEffect(() => {
        if (!gameRef.current) {
            const Phaser = import('phaser').then(({ default: Phaser }) => {
                gameRef.current = new Phaser.Game(gameConfig);
            });
        }
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        }
    }, []);


    // 게임 이벤트 핸들러
    const handlePlayerUpdate = useCallback((stats: PlayerStats) => {
        setPlayerStats(stats);
        // 레벨 퀘스트 업데이트
        setQuests(prev => prev.map(quest => {
            if (quest.objectives[0].type === 'level') {
                const newCurrent = stats.level;
                const completed = newCurrent >= quest.objectives[0].required;
                return {
                    ...quest,
                    objectives: [{ ...quest.objectives[0], current: newCurrent }],
                    completed,
                };
            }
            return quest;
        }));
    }, []);

    const handleAddItem = useCallback((item: InventoryItem) => {
        setInventory((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    }, []);

    const handleUseItem = useCallback((item: InventoryItem) => {
        if (item.type === 'consumable' && item.effect) {
            setPlayerStats(prev => ({
                ...prev,
                hp: Math.min(prev.maxHp, prev.hp + (item.effect?.hp || 0)),
                mp: Math.min(prev.maxMp, prev.mp + (item.effect?.mp || 0)),
            }));
            // Reduce quantity
            setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
        }
    }, []);

    const handleUseSkill = useCallback((skillId: string) => {
        // Very basic skill usage stub
        const skill = skills.find(s => s.id === skillId);
        if (skill && playerStats.mp >= skill.mpCost && skill.currentCooldown <= 0) {
            setPlayerStats(prev => ({ ...prev, mp: prev.mp - skill.mpCost }));
            setSkills(prev => prev.map(s => s.id === skillId ? { ...s, currentCooldown: s.cooldown } : s));
            console.log(`Used skill: ${skill.name}`);
            // Trigger visual effect via EventBus in real game
        }
    }, [skills, playerStats.mp]);


    const handleGoldChange = useCallback((amount: number) => {
        setPlayerStats((prev) => {
            const newGold = prev.gold + amount;
            // 골드 퀘스트 업데이트
            if (amount > 0) {
                setQuests(prevQuests => prevQuests.map(quest => {
                    if (quest.objectives[0].type === 'collect' && quest.objectives[0].target === 'gold') {
                        const newCurrent = Math.min(quest.objectives[0].current + amount, quest.objectives[0].required);
                        return {
                            ...quest,
                            objectives: [{ ...quest.objectives[0], current: newCurrent }],
                            completed: newCurrent >= quest.objectives[0].required,
                        };
                    }
                    return quest;
                }));
            }
            return { ...prev, gold: newGold };
        });
    }, []);

    const handleMonsterKilled = useCallback(() => {
        setQuests(prev => prev.map(quest => {
            if (quest.objectives[0].type === 'kill') {
                const newCurrent = Math.min(quest.objectives[0].current + 1, quest.objectives[0].required);
                return {
                    ...quest,
                    objectives: [{ ...quest.objectives[0], current: newCurrent }],
                    completed: newCurrent >= quest.objectives[0].required,
                };
            }
            return quest;
        }));
    }, []);

    const handleCombatStatsUpdate = useCallback((stats: CombatStats) => {
        setCombatStats(stats);
    }, []);

    const handleMinimapUpdate = useCallback((data: MinimapData) => {
        setMinimapData(data);
    }, []);

    const handleAutoAttackToggle = useCallback((enabled: boolean) => {
        setIsAutoAttack(enabled);
    }, []);

    const handleAddBuff = useCallback((buff: ActiveBuff) => {
        setActiveBuffs(prev => {
            const existing = prev.find(b => b.id === buff.id);
            if (existing) {
                return prev.map(b => b.id === buff.id ? buff : b);
            }
            return [...prev, buff];
        });
    }, []);

    // 퀘스트 보상 수령
    const handleClaimQuest = useCallback((questId: string) => {
        const quest = quests.find(q => q.id === questId);
        if (quest && quest.completed && !quest.claimed) {
            // 보상 지급
            if (quest.rewards.exp) {
                setPlayerStats(prev => ({
                    ...prev,
                    exp: prev.exp + quest.rewards.exp!,
                }));
            }
            if (quest.rewards.gold) {
                setPlayerStats(prev => ({
                    ...prev,
                    gold: prev.gold + quest.rewards.gold!,
                }));
            }
            // 퀘스트 완료 처리
            setQuests(prev => prev.map(q =>
                q.id === questId ? { ...q, claimed: true } : q
            ));
        }
    }, [quests]);

    // 쿨다운 업데이트
    useEffect(() => {
        const interval = setInterval(() => {
            setSkills((prev) =>
                prev.map((skill) => ({
                    ...skill,
                    currentCooldown: Math.max(0, skill.currentCooldown - 100),
                }))
            );
            // 버프 시간 업데이트
            setActiveBuffs(prev =>
                prev
                    .map(buff => ({ ...buff, remainingTime: buff.remainingTime - 0.1 }))
                    .filter(buff => buff.remainingTime > 0)
            );
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // 키보드 이벤트 핸들러
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ESC 키 처리 - 열린 모달을 순서대로 닫음
            if (e.key === 'Escape') {
                if (showInventory) { setShowInventory(false); return; }
                if (showQuestPanel) { setShowQuestPanel(false); return; }
                if (showDungeonSelector) { setShowDungeonSelector(false); return; }
                if (showCodeViewer) { setShowCodeViewer(false); return; }
            }

            // 단축키
            switch (e.key.toLowerCase()) {
                case 'i': setShowInventory(prev => !prev); break;
                case 'q': setShowQuestPanel(prev => !prev); break;
                case 'k': setShowSkillBar(prev => !prev); break; // Using K for skill bar toggle or 'S'
                case 'm': setShowDungeonSelector(prev => !prev); break; // 'M' for map/move
                case '`': setShowCodeViewer(prev => !prev); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showInventory, showQuestPanel, showDungeonSelector, showCodeViewer]);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none">
            {showIntro && <GameIntro onStart={() => setShowIntro(false)} />}

            {/* Phaser Game Container */}
            <div id="game-container" className="absolute inset-0 z-0"></div>

            {/* HUD */}
            <HUD playerStats={playerStats} />

            {/* Skill Bar */}
            {showSkillBar && (
                <SkillBar
                    skills={skills}
                    quickSlots={quickSlots}
                    onUseSkill={handleUseSkill}
                />
            )}

            {/* Windows / Modals */}
            {showInventory && (
                <Inventory
                    inventory={inventory}
                    onUseItem={handleUseItem}
                    onClose={() => setShowInventory(false)}
                />
            )}

            {showQuestPanel && (
                <QuestPanel
                    quests={quests}
                    onClaim={handleClaimQuest}
                    onClose={() => setShowQuestPanel(false)}
                />
            )}

            {showDungeonSelector && (
                <DungeonSelector
                    onSelectDungeon={(id) => {
                        console.log('Selected Dungeon:', id);
                        // In real game, change scene
                        setShowDungeonSelector(false);
                    }}
                    onClose={() => setShowDungeonSelector(false)}
                />
            )}

            {showCodeViewer && (
                <CodeViewer onClose={() => setShowCodeViewer(false)} />
            )}

            {/* Helper UI */}
            <div className="absolute top-20 left-4 text-white text-xs opacity-50 z-10 pointer-events-none">
                <p>I: 인벤토리</p>
                <p>Q: 퀘스트</p>
                <p>M: 사냥터이동</p>
                <p>ESC: 닫기</p>
                <p>` : 시스템창</p>
            </div>
        </div>
    );
}

export default App;
