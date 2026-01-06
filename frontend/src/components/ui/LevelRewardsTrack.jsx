import React, { useRef, useEffect, useState } from 'react';
import { Lock, Check, Gift } from 'lucide-react';
import { xpService } from '../../services/api';
import ChestOpenModal from './ChestOpenModal';

const LevelRewardsTrack = ({ currentLevel = 1, theme = 'green', moduleId = '' }) => {
    const scrollRef = useRef(null);
    const [xp, setXp] = useState(null);
    const [xpLoadedFor, setXpLoadedFor] = useState('');
    const [claiming, setClaiming] = useState(false);
    const [claimResult, setClaimResult] = useState(null);
    const [showChestModal, setShowChestModal] = useState(false);

    // Theme Configuration
    const themes = {
        green: { main: 'text-green-400', bg: 'bg-green-500', border: 'border-green-500/30', glow: 'shadow-green-500/50', gradient: 'from-green-500 to-emerald-600' },
        red: { main: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500/30', glow: 'shadow-red-500/50', gradient: 'from-red-500 to-rose-600' },
        purple: { main: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/30', glow: 'shadow-purple-500/50', gradient: 'from-purple-500 to-violet-600' },
        yellow: { main: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/50', gradient: 'from-yellow-500 to-amber-600' },
    };
    const t = themes[theme] || themes.green;
    const isXP = !!moduleId;
    const xpData = isXP && xpLoadedFor === moduleId ? xp : null;
    const xpLoading = isXP && xpLoadedFor !== moduleId;
    const buildDefaultRewards = () => {
        return Array.from({ length: 30 }, (_, i) => {
            const level = i + 1;
            const isMilestone = level % 5 === 0;
            const isBigMilestone = level % 10 === 0;

            let type = "Coins";
            let value = `${level * 100}`;
            let icon = "🪙";

            if (isBigMilestone) {
                type = "Legendary Skin";
                value = "1 Item";
                icon = "👑";
            } else if (isMilestone) {
                type = "Rare Chest";
                value = "1 Chest";
                icon = "📦";
            }

            return {
                level,
                type,
                value,
                icon,
                status: level < currentLevel ? 'claimed' : level === currentLevel ? 'current' : 'locked',
                isMilestone
            };
        });
    };

    const buildXPRewards = () => {
        const threshold = 12;
        const count = (xpData && typeof xpData.count === 'number') ? xpData.count : 0;
        const claimedCount = (xpData && typeof xpData.claimedCount === 'number') ? xpData.claimedCount : 0;
        
        return Array.from({ length: threshold }, (_, i) => {
            const level = i + 1;
            const isMilestone = level % 4 === 0;
            const stage = level / 4;
            
            let status = 'locked';
            if (isMilestone) {
                if (claimedCount >= stage) {
                    status = 'claimed';
                } else if (count >= level) {
                    status = 'current'; // Ready to claim
                } else {
                    status = 'locked';
                }
            } else {
                if (count >= level) {
                    status = 'claimed';
                } else if (count === level - 1) {
                    status = 'active'; // Next round to play (renamed from current to distinguish)
                } else {
                    status = 'locked';
                }
            }
            
            const type = isMilestone ? 'Daily Chest' : 'Play Round';
            const value = isMilestone 
                ? (status === 'claimed' ? 'Opened' : (status === 'current' ? 'Ready' : `${level} rounds`))
                : (status === 'claimed' ? 'Done' : 'To Do');
            const icon = isMilestone ? '📦' : '🎮';
            return { level, type, value, icon, status, isMilestone };
        });
    };

    const rewards = isXP ? buildXPRewards() : buildDefaultRewards();

    useEffect(() => {
        if (!moduleId) return;
        xpService.status(moduleId)
            .then((r) => {
                if (r && r.success && r.data) setXp(r.data);
                else setXp(null);
                setXpLoadedFor(moduleId);
            })
            .catch(() => {
                setXp(null);
                setXpLoadedFor(moduleId);
            });
    }, [moduleId]);

    const onClaimClick = () => {
        if (!moduleId || xpLoading || claiming) return;
        setClaimResult(null);
        setShowChestModal(true);
    };

    const handleRealClaim = async () => {
        if (!moduleId || claiming) return;
        setClaiming(true);
        try {
            const key = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : (Date.now().toString(36) + Math.random().toString(36).slice(2));
            const r = await xpService.claim(moduleId, key);
            if (r && r.success && r.data) {
                setClaimResult(r.data);
                // Refresh status to get updated claimedCount
                const status = await xpService.status(moduleId);
                if (status && status.success && status.data) {
                    setXp(status.data);
                    setXpLoadedFor(moduleId);
                }
            }
        } catch (err) {
            console.error('XP claim failed:', err);
        }
        setClaiming(false);
    };

    const handleCloseModal = () => {
        setShowChestModal(false);
        setClaimResult(null);
    };

    useEffect(() => {
        if (!scrollRef.current) return;
        let index = currentLevel - 1;
        if (isXP) {
            const threshold = rewards.length;
            const count = (xpData && typeof xpData.count === 'number') ? xpData.count : 0;
            // Scroll to next playable or claimable
            index = Math.min(count, threshold - 1);
        }
        const currentCard = scrollRef.current.children[index];
        if (currentCard) {
            const scrollLeft = currentCard.offsetLeft - scrollRef.current.clientWidth / 2 + currentCard.clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [currentLevel, isXP, xpData, rewards.length]);

    return (
        <div className="relative w-full">
            <ChestOpenModal 
                isOpen={showChestModal}
                onClose={handleCloseModal}
                onOpen={handleRealClaim}
                loading={claiming}
                rewards={claimResult?.rewards || claimResult}
                theme={theme}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className={`text-2xl font-black uppercase tracking-widest flex items-center gap-3 ${t.main}`}>
                    <Gift size={24} /> Battle Pass Rewards
                </h3>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-600"></div> Locked</div>
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${t.bg} animate-pulse`}></div> Current</div>
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${t.bg} opacity-50`}></div> Claimed</div>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="relative w-full overflow-x-auto pb-12 pt-8 scrollbar-hide snap-x px-4 md:px-8"
            >
                <div className="flex gap-0 relative min-w-max">
                    {/* Connecting Line (Background) */}
                    <div className="absolute top-[0.75rem] left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
                    <div
                        className={`absolute top-[0.75rem] left-0 h-0.5 ${t.bg} -translate-y-1/2 z-0 transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                        style={{ width: `${(() => { if (isXP) { const threshold = rewards.length; const count = Math.min((xpData && typeof xpData.count === 'number') ? xpData.count : 0, threshold); return ((xpData && xpData.claimed) ? 1 : (count / threshold)) * 100; } return (currentLevel / rewards.length) * 100; })()}%`, opacity: 0.8 }}
                    ></div>

                    {rewards.map((reward, i) => (
                        <div key={i} className="relative flex-shrink-0 w-32 md:w-40 flex flex-col items-center snap-center group">

                            {/* Level Indicator (On the line) */}
                            <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-300 mb-6
                                ${reward.status === 'locked' ? 'bg-[#0a0a0a] border-white/10 text-gray-600' :
                                    reward.status === 'current' ? `${t.bg} border-white text-black scale-150 shadow-[0_0_20px_currentColor]` :
                                    reward.status === 'active' ? 'bg-[#1a1a1a] border-white/40 text-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.2)]' :
                                        `${t.bg} border-transparent text-black`
                                }
                            `}>
                                {reward.status === 'claimed' ? <Check size={10} /> : reward.level}
                            </div>

                            {/* Reward Card */}
                            <div 
                                onClick={isXP && reward.status === 'current' && reward.isMilestone ? onClaimClick : undefined} 
                                className={`
                                relative w-28 md:w-36 aspect-[3/4] rounded-xl border backdrop-blur-md flex flex-col items-center justify-center gap-2 p-2 transition-all duration-300 cursor-pointer
                                ${reward.status === 'locked' ? 'bg-black/40 border-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0' :
                                    reward.status === 'current' ? `bg-gradient-to-b ${t.gradient} border-white/50 -translate-y-2 shadow-xl scale-105` :
                                    reward.status === 'active' ? 'bg-white/5 border-white/30 grayscale-0 opacity-100 shadow-lg' :
                                        'bg-white/5 border-white/10 hover:bg-white/10'
                                }
                            `}>
                                {/* Milestone Glow */}
                                {reward.isMilestone && reward.status !== 'locked' && (
                                    <div className={`absolute inset-0 rounded-xl ${t.glow} opacity-20 animate-pulse`}></div>
                                )}

                                {/* Icon */}
                                <div className={`text-3xl md:text-4xl filter drop-shadow-lg transform transition-transform ${reward.status === 'current' ? 'scale-110 mb-4' : 'group-hover:scale-110'}`}>
                                    {reward.icon}
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <div className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${reward.status === 'current' ? 'text-white/80' : 'text-gray-500'}`}>
                                        {reward.type}
                                    </div>
                                    <div className={`text-sm font-black ${reward.status === 'current' ? 'text-white' : 'text-white'}`}>
                                        {reward.value}
                                    </div>
                                </div>

                                {/* Status Badge / Button */}
                                {reward.status === 'current' && reward.isMilestone ? (
                                    <div className="absolute inset-x-3 bottom-3 z-20">
                                        <button className="w-full bg-white text-black text-[10px] font-black py-2 rounded shadow-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all animate-pulse flex items-center justify-center gap-1">
                                            Claim <Gift size={10} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                                        {reward.status === 'locked' && <Lock size={12} className="text-gray-600" />}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LevelRewardsTrack;
