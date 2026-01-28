import React from 'react';

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
    };
    completed: boolean;
    claimed: boolean;
}

interface QuestPanelProps {
    quests: Quest[];
    onClaim: (questId: string) => void;
    onClose: () => void;
}

const QuestPanel: React.FC<QuestPanelProps> = ({ quests, onClaim, onClose }) => {
    return (
        <div className="absolute right-0 top-20 bg-black/50 p-4 rounded-l-lg text-white w-64 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2 border-b border-gray-600 pb-2">
                <h3 className="font-bold">퀘스트 목록</h3>
                <button onClick={onClose} className="text-xs text-gray-400">[닫기]</button>
            </div>

            <div className="space-y-4">
                {quests.filter(q => !q.claimed).map(quest => (
                    <div key={quest.id} className="bg-slate-900/80 p-2 rounded border border-slate-700">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs px-1 rounded ${quest.type === 'main' ? 'bg-yellow-600' : 'bg-blue-600'}`}>
                                {quest.type === 'main' ? '메인' : '일일'}
                            </span>
                            {quest.completed && (
                                <button
                                    onClick={() => onClaim(quest.id)}
                                    className="text-xs bg-green-600 px-2 py-0.5 rounded hover:bg-green-500 animate-pulse"
                                >
                                    보상받기
                                </button>
                            )}
                        </div>
                        <h4 className="font-bold text-sm text-yellow-100">{quest.title}</h4>
                        <div className="text-xs text-gray-400 mb-2">{quest.description}</div>

                        {quest.objectives.map((obj, i) => (
                            <div key={i} className="text-xs mt-1">
                                <div className="flex justify-between text-gray-300">
                                    <span>진행도</span>
                                    <span>{obj.current} / {obj.required}</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-0.5">
                                    <div
                                        className="bg-green-500 h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (obj.current / obj.required) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestPanel;
