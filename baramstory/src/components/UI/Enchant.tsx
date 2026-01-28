import React, { useState } from 'react';
import { InventoryItem } from '../../game/types';

interface EnchantProps {
    inventory: InventoryItem[];
    playerGold: number;
    onClose: () => void;
    onEnchant: (weapon: InventoryItem, cost: number, successRate: number) => void;
}

const Enchant: React.FC<EnchantProps> = ({
    inventory,
    playerGold,
    onClose,
    onEnchant
}) => {
    const [selectedWeapon, setSelectedWeapon] = useState<InventoryItem | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter only weapons from inventory
    const weapons = inventory.filter(item =>
        // Basic heuristic: weapons usually have attack stats or specific IDs
        item.effect?.attack && item.effect.attack > 0
    );

    const monsterEssence = inventory.find(i => i.id === 'monster_essence');
    const essenceCount = monsterEssence ? monsterEssence.quantity : 0;

    // Enchantment Logic Calculation
    const getEnchantInfo = (weapon: InventoryItem) => {
        // Current upgrade level could be part of ID or a separate prop, 
        // but for this simple version, we'll base cost on base attack
        // In a real app, item objects would have an 'upgradeLevel' property.
        const baseCost = 500;
        const baseEssence = 2;
        // Mock calculation
        const currentAttack = weapon.effect?.attack || 0;
        const upgradeLevel = Math.floor((currentAttack - 5) / 5); // Example: 10 dmg -> lv 1

        const goldCost = baseCost * (upgradeLevel + 1);
        const essenceCost = baseEssence * (upgradeLevel + 1);
        const successRate = Math.max(10, 100 - (upgradeLevel * 10)); // 100, 90, 80... min 10%

        return { goldCost, essenceCost, successRate, nextAttack: currentAttack + 5 };
    };

    const handleEnchant = async () => {
        if (!selectedWeapon || isProcessing) return;

        const info = getEnchantInfo(selectedWeapon);
        if (playerGold < info.goldCost || essenceCount < info.essenceCost) return;

        setIsProcessing(true);

        // Simulate animation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        onEnchant(selectedWeapon, info.goldCost, info.successRate);
        setIsProcessing(false);
        setSelectedWeapon(null); // Reset selection or update stats handled by parent
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative bg-gray-900 border-2 border-purple-500 rounded-xl p-6 w-[500px] flex flex-col items-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
                    ⚔️ 무기 강화 ⚔️
                </h2>

                {/* Selected Weapon Slot */}
                <div className={`
          w-24 h-24 rounded-lg border-2 flex items-center justify-center mb-6 relative
          ${selectedWeapon ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-gray-700 bg-gray-800 border-dashed'}
        `}>
                    {selectedWeapon ? (
                        <span className="text-5xl animate-pulse">{selectedWeapon.icon}</span>
                    ) : (
                        <span className="text-gray-600 text-sm">무기 선택</span>
                    )}
                </div>

                {selectedWeapon ? (
                    <div className="w-full">
                        <div className="text-center mb-4">
                            <div className="text-xl font-bold text-white">{selectedWeapon.name}</div>
                            <div className="text-purple-300">현재 공격력: {selectedWeapon.effect?.attack}</div>
                            <div className="text-sm text-gray-400">⬇</div>
                            <div className="text-green-400 font-bold">강화 후: {getEnchantInfo(selectedWeapon).nextAttack}</div>
                        </div>

                        <div className="bg-gray-800 rounded p-4 mb-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>필요 골드</span>
                                <span className={playerGold < getEnchantInfo(selectedWeapon).goldCost ? 'text-red-500' : 'text-yellow-400'}>
                                    {getEnchantInfo(selectedWeapon).goldCost} G
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>마물의 정수</span>
                                <span className={essenceCount < getEnchantInfo(selectedWeapon).essenceCost ? 'text-red-500' : 'text-blue-400'}>
                                    {essenceCount} / {getEnchantInfo(selectedWeapon).essenceCost} 개
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-gray-700 pt-2">
                                <span>성공 확률</span>
                                <span className="text-green-400 font-bold">{getEnchantInfo(selectedWeapon).successRate}%</span>
                            </div>
                        </div>

                        <button
                            onClick={handleEnchant}
                            disabled={
                                isProcessing ||
                                playerGold < getEnchantInfo(selectedWeapon).goldCost ||
                                essenceCount < getEnchantInfo(selectedWeapon).essenceCost
                            }
                            className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${isProcessing
                                ? 'bg-gray-600 cursor-wait'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg'
                                }`}
                        >
                            {isProcessing ? '강화 중...' : '강화 시작!'}
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-48 overflow-y-auto bg-gray-800 rounded p-2 grid grid-cols-5 gap-2 content-start">
                        {weapons.length > 0 ? weapons.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedWeapon(item)}
                                className="w-16 h-16 bg-gray-700 rounded border border-gray-600 hover:border-purple-400 cursor-pointer flex flex-col items-center justify-center"
                            >
                                <div className="text-2xl">{item.icon}</div>
                            </div>
                        )) : (
                            <div className="col-span-5 text-center text-gray-500 py-10">강화할 무기가 없습니다.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Enchant;
