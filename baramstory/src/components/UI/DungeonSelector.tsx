import React from 'react';

interface DungeonSelectorProps {
    onSelectDungeon: (dungeonId: string) => void;
    onClose: () => void;
}

const DungeonSelector: React.FC<DungeonSelectorProps> = ({ onSelectDungeon, onClose }) => {
    const dungeons = [
        { id: 'field_1', name: '초보자 사냥터', level: '1-10', desc: '슬라임과 멧돼지가 출몰합니다.' },
        { id: 'dungeon_1', name: '해골 굴', level: '10-30', desc: '음산한 기운이 감돕니다.' },
        { id: 'dungeon_2', name: '화염의 둥지', level: '30-50', desc: '강력한 화염 몬스터들이 있습니다.' },
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/80">
            <div className="bg-slate-900 p-8 rounded-xl border-2 border-slate-500 max-w-2xl w-full">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">사냥터 이동</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {dungeons.map(d => (
                        <div
                            key={d.id}
                            className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-yellow-400 hover:bg-slate-700 cursor-pointer transition-all group"
                            onClick={() => {
                                onSelectDungeon(d.id);
                                onClose();
                            }}
                        >
                            <h3 className="text-xl font-bold text-yellow-400 mb-2">{d.name}</h3>
                            <div className="text-sm text-gray-400 mb-2">권장 레벨: {d.level}</div>
                            <p className="text-xs text-gray-500 group-hover:text-gray-300">{d.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DungeonSelector;
