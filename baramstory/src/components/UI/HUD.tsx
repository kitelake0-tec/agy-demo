import React from 'react';

interface HUDProps {
    playerStats: {
        hp: number;
        maxHp: number;
        mp: number;
        maxMp: number;
        level: number;
        exp: number;
        expToNext: number;
        gold: number;
    };
}

const HUD: React.FC<HUDProps> = ({ playerStats }) => {
    return (
        <div className="absolute top-0 left-0 p-4 text-white z-10 w-full pointer-events-none">
            <div className="flex justify-between items-start">
                <div className="bg-black/50 p-2 rounded">
                    <div className="text-xl font-bold mb-1">Lv. {playerStats.level}</div>
                    <div className="w-64 mb-1">
                        <div className="flex justify-between text-xs mb-0.5">
                            <span>HP</span>
                            <span>{playerStats.hp}/{playerStats.maxHp}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                            <div
                                className="bg-red-500 h-full transition-all duration-300"
                                style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="w-64 mb-1">
                        <div className="flex justify-between text-xs mb-0.5">
                            <span>MP</span>
                            <span>{playerStats.mp}/{playerStats.maxMp}</span>
                        </div>
                        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: `${(playerStats.mp / playerStats.maxMp) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="w-64">
                        <div className="flex justify-between text-xs mb-0.5">
                            <span>EXP</span>
                            <span>{((playerStats.exp / playerStats.expToNext) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-yellow-400 h-full transition-all duration-300"
                                style={{ width: `${(playerStats.exp / playerStats.expToNext) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-black/50 p-2 rounded text-yellow-400 font-bold">
                    💰 {playerStats.gold.toLocaleString()} Gold
                </div>
            </div>
        </div>
    );
};

export default HUD;
