import React from 'react';

const RewardCard = ({ level, type, image, active, rarity = "common" }) => {
    const rarityColors = {
        common: "border-gray-600 shadow-gray-500/20",
        rare: "border-blue-500 shadow-blue-500/40",
        epic: "border-purple-500 shadow-purple-500/40",
        legendary: "border-[#4ade80] shadow-[#4ade80]/40"
    };

    return (
        <div className={`
            relative min-w-[140px] h-[180px] bg-black/60 backdrop-blur-md border rounded-lg p-3 flex flex-col items-center justify-center group cursor-pointer transition-all duration-300
            ${active ? `${rarityColors[rarity]} border-opacity-100 scale-105 z-10` : 'border-white/10 opacity-70 hover:opacity-100 hover:scale-105'}
        `}>
            {active && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4ade80] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Unlocked
                </div>
            )}

            <div className={`w-20 h-20 mb-3 relative ${active ? 'animate-float' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-t from-${rarity === 'legendary' ? 'green' : 'blue'}-500/20 to-transparent blur-xl rounded-full`}></div>
                <img src={image} alt={type} className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>

            <div className="text-center w-full">
                <div className="text-xs font-mono text-gray-400 mb-1">LV.{level}</div>
                <div className="text-xs font-bold uppercase tracking-wider truncate w-full">{type}</div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
};

export default RewardCard;
