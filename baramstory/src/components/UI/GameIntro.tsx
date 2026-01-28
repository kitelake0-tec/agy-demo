import React, { useState } from 'react';

interface GameIntroProps {
    onStart: () => void;
}

const GameIntro: React.FC<GameIntroProps> = ({ onStart }) => {
    const [step, setStep] = useState(0);

    const texts = [
        "오래전 세상을 지배하던 고대 왕국은 잊혀졌으나...",
        "전설 속의 힘을 찾는 모험가들의 발길은 끊이지 않았다.",
        "이제 당신의 모험이 시작됩니다."
    ];

    const handleNext = () => {
        if (step < texts.length - 1) {
            setStep(step + 1);
        } else {
            onStart();
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black text-white font-serif">
            <div className="max-w-2xl text-center p-8 border-4 border-double border-yellow-600 bg-slate-900 rounded-lg shadow-2xl">
                <h1 className="text-5xl font-bold mb-8 text-yellow-500 tracking-widest text-shadow">바람의 나라</h1>
                <div className="h-32 flex items-center justify-center">
                    <p className="text-2xl text-gray-300 animate-fade-in transition-opacity duration-1000">
                        {texts[step]}
                    </p>
                </div>
                <button
                    onClick={handleNext}
                    className="mt-8 px-8 py-3 bg-red-800 hover:bg-red-700 border border-red-500 rounded text-xl transition-all"
                >
                    {step < texts.length - 1 ? "다음" : "모험 시작"}
                </button>
            </div>
        </div>
    );
};

export default GameIntro;
