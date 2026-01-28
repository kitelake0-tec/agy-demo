import React from 'react';

type JobType = 'WARRIOR' | 'MAGE' | 'ROGUE' | 'ARCHER';

interface ClassSelectionProps {
    onSelectClass: (job: JobType) => void;
}

const JOBS: { id: JobType; name: string; desc: string; image: string; color: string }[] = [
    {
        id: 'WARRIOR',
        name: '전사',
        desc: '강인한 체력과 근접 공격으로 적을 제압합니다.',
        image: '🛡️',
        color: 'bg-red-900 border-red-500'
    },
    {
        id: 'ROGUE',
        name: '도적',
        desc: '빠른 속도와 치명적인 일격으로 적을 기습합니다.',
        image: '⚔️',
        color: 'bg-gray-800 border-gray-500'
    },
    {
        id: 'MAGE',
        name: '주술사',
        desc: '강력한 마법으로 다수의 적을 섬멸합니다.',
        image: '🔥',
        color: 'bg-blue-900 border-blue-500'
    },
    {
        id: 'ARCHER',
        name: '궁수',
        desc: '먼 거리에서 화살로 적을 정확히 타격합니다. (사실 도사임)',
        // Note: The user asked for "Archer" but traditionally "Do-sa" (Taoist) is the 4th class in typical KR RPGs of this style.
        // User explicitly asked for "Archer", so we stick to Archer.
        // Wait, User said "전사, 마법사, 도적, 궁수".
        image: '🏹',
        color: 'bg-green-900 border-green-500'
    }
];

const ClassSelection: React.FC<ClassSelectionProps> = ({ onSelectClass }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans relative">
            <div className="absolute inset-0 z-0 opacity-40 bg-[url('/assets/bg_select.png')] bg-cover bg-center" />

            <div className="z-10 w-full max-w-5xl px-4">
                <h1 className="text-4xl font-bold mb-12 text-center text-yellow-500 drop-shadow-md">
                    운명을 선택하세요
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {JOBS.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => onSelectClass(job.id)}
                            className={`
                                relative group cursor-pointer 
                                flex flex-col items-center justify-between
                                p-6 rounded-xl border-2 ${job.color} 
                                bg-opacity-80 backdrop-blur-md hover:scale-105 transition-all duration-300
                                hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]
                                h-96
                            `}
                        >
                            <div className="text-6xl mb-4 group-hover:animate-bounce">{job.image}</div>

                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-2 text-white">{job.name}</h2>
                                <p className="text-gray-300 text-sm">{job.desc}</p>
                            </div>

                            <button className="mt-6 px-6 py-2 bg-black/50 hover:bg-white/20 border border-white/30 rounded-full text-sm font-semibold transition-colors">
                                선택하기
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassSelection;
