import React from 'react';
import { Check, Lock } from 'lucide-react';

const LevelRoadmap = ({
    levels = [],
    currentLevel = 1,
    currentXp = 0,
    maxXp = 100,
    themeColor = "text-blue-500",
    barColor = "bg-blue-500"
}) => {
    // Calculate progress percentage for the current level
    const progressPercent = Math.min(100, Math.max(0, (currentXp / maxXp) * 100));

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line Background */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full z-0"></div>

                {/* Connecting Line Progress (Global) - simplified for visual effect */}
                {/* Ideally this would calculate total progress across all nodes, but for now let's just show it up to the current level node */}

                {levels.map((level) => {
                    const isCompleted = level.id < currentLevel;
                    const isCurrent = level.id === currentLevel;
                    const isLocked = level.id > currentLevel;

                    return (
                        <div key={level.id} className="relative z-10 flex flex-col items-center group">
                            {/* Node Circle */}
                            <div
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                    ${isCompleted ? `${barColor} border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.5)]` : ''}
                                    ${isCurrent ? `bg-black ${themeColor} border-current scale-125 shadow-[0_0_20px_currentColor]` : ''}
                                    ${isLocked ? 'bg-black border-white/20 text-gray-600' : ''}
                                `}
                            >
                                {isCompleted ? <Check size={20} strokeWidth={3} /> :
                                    isCurrent ? <span className="font-black text-lg">{level.id}</span> :
                                        <Lock size={16} />}
                            </div>

                            {/* Level Label */}
                            <div className={`mt-4 text-center transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                    {level.label}
                                </div>
                                {isCurrent && (
                                    <div className={`text-[10px] font-mono ${themeColor}`}>
                                        {currentXp} / {maxXp} XP
                                    </div>
                                )}
                            </div>

                            {/* Current Level Progress Bar (Floating below) */}
                            {isCurrent && (
                                <div className="absolute -bottom-8 w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelRoadmap;
