import React from 'react';

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
    item: any | null; // Can be item or skill, simplified here
}

interface SkillBarProps {
    skills: Skill[];
    quickSlots: QuickSlot[];
    onUseSkill: (skillId: string) => void;
}

const SkillBar: React.FC<SkillBarProps> = ({ skills, quickSlots, onUseSkill }) => {
    // We'll just display a skill bar at the bottom using the skills list for now
    // In a real implementation this would map quickSlots to keys 1-5

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/60 rounded-lg border border-slate-600 z-10">
            {skills.slice(0, 6).map((skill, index) => {
                const onCooldown = skill.currentCooldown > 0;
                return (
                    <div
                        key={skill.id}
                        className={`relative w-12 h-12 bg-slate-800 border-2 ${onCooldown ? 'border-red-500' : 'border-slate-500'} rounded hover:border-yellow-400 cursor-pointer overflow-hidden`}
                        onClick={() => !onCooldown && onUseSkill(skill.id)}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-2xl grayscale-0">
                            {skill.icon}
                        </div>
                        <div className="absolute top-0 left-0 text-[10px] font-bold bg-black/70 px-1 text-white">
                            {index + 1}
                        </div>
                        {onCooldown && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold text-xs">
                                {(skill.currentCooldown / 1000).toFixed(1)}s
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 text-[8px] bg-blue-900 px-1 text-white">
                            {skill.mpCost} MP
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SkillBar;
