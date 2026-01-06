import React, { useState } from 'react';
import { TrendingUp, Globe, Search, User, Star, Gift, ArrowRight, Activity, DollarSign, BarChart3, BarChart2, PieChart, ArrowUpRight, Clock, Award } from 'lucide-react';
import LevelProgressBar from '../../components/ui/LevelProgressBar';
import LevelUpModal from '../../components/ui/LevelUpModal';
import LevelRewardsTrack from '../../components/ui/LevelRewardsTrack';
import { usePlayerProgress } from '../../contexts/PlayerProgressContext';

const PredictionView = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('crypto');

    const config = {
        title: '预测游戏',
        subtitle: '市场与竞猜',
        desc: 'Predict real-world outcomes and market movements. Test your foresight and win big.',
        bg: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2032&auto=format&fit=crop',
        color: '#eab308', // Yellow
        icon: <TrendingUp size={14} />,
        games: [
            { title: "Crypto Oracle", genre: "Market", rating: "4.7", players: "200K", progress: 100, image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2032&auto=format&fit=crop" },
            { title: "Sports Blitz", genre: "Betting", rating: "4.4", players: "1.5M", progress: 0, image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop" }
        ]
    };

    const { progress, completeGame } = usePlayerProgress();
    const [levelUpModal, setLevelUpModal] = React.useState({ isOpen: false, levelsGained: [], rewards: null });

    const handleCompleteGame = () => {
        completeGame('Prediction', (levelsGained, expGained) => {
            setLevelUpModal({
                isOpen: true,
                levelsGained,
                rewards: { DOGE: 50, USDT: 5 } // Example rewards
            });
        });
    };



    // Mock Data for Live Ticker
    const tickerItems = [
        { symbol: "BTC", price: "$98,450", change: "+2.4%", up: true },
        { symbol: "ETH", price: "$5,230", change: "-0.8%", up: false },
        { symbol: "SOL", price: "$340", change: "+5.1%", up: true },
        { symbol: "DOGE", price: "$0.45", change: "+12%", up: true },
    ];

    return (
        <div className="relative w-full min-h-screen pt-24 pb-12 px-4 md:px-8 overflow-y-auto animate-fade-in max-w-7xl mx-auto">



            {/* Header Section - Dynamic Dashboard */}
            <div className="relative w-full h-[45vh] max-h-[500px] min-h-[380px] rounded-3xl overflow-hidden border border-white/10 mb-12 group shadow-2xl">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {/* Background Image */}
                <img
                    src={config.bg}
                    alt={config.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[30s] ease-linear opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
                />

                <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between">
                    {/* Stats Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border" style={{ borderColor: `${config.color}50`, color: config.color }}>
                            <Activity size={14} /> LIVE MARKET • PREDICTION ZONE
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                                <Search size={18} />
                            </div>
                            <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                                <User size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Title & Level Progress */}
                    <div className="relative">
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                            {config.title}
                        </h1>
                        <p className="text-gray-300 font-mono text-sm md:text-base mb-8 flex items-center gap-3 max-w-2xl">
                            <span style={{ color: config.color }} className="bg-white/10 p-1 rounded">{config.icon}</span> {config.desc}
                        </p>

                        {/* Interactive Ticker */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mb-8">
                            {tickerItems.map((item, i) => (
                                <div key={i} className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 min-w-[140px]">
                                    <span className="font-bold text-white">{item.symbol}</span>
                                    <span className="text-gray-400 text-sm">{item.price}</span>
                                    <span className={`text-xs font-mono ${item.up ? 'text-green-400' : 'text-red-400'}`}>{item.change}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-8">
                            {/* Integrated Level Progress */}
                            <div className="w-full md:w-2/3 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <LevelProgressBar gameMode="Prediction" theme="yellow" variant="banner" />
                            </div>

                            {/* Stats Button */}
                            <button className="w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap h-fit">
                                <Star size={16} className="text-yellow-400" /> My Predictions
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mb-8">
                <div className="relative w-full overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-900/40 via-black/60 to-black/80 backdrop-blur-md">
                    <img
                        src="https://images.unsplash.com/photo-1471295253337-3ceaa1f15d4d?q=80&w=2000&auto=format&fit=crop"
                        alt="World Cup"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400 uppercase tracking-wider inline-flex items-center gap-2">
                                <Globe size={12} /> 全球赛事预测
                            </div>
                            <h2 className="mt-4 text-3xl md:text-4xl font-black text-white tracking-tight">期待下一个美加墨世界杯的预测比赛</h2>
                            <p className="mt-3 text-gray-300 max-w-xl">全新赛事预测玩法即将上线，覆盖赛前/赛中多维度市场，敬请期待。</p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col items-center gap-3 min-w-[260px]">
                            <div className="text-4xl font-black text-yellow-400">2026</div>
                            <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors">敬请期待</button>
                        </div>
                    </div>
                </div>
            </div>

            

            {/* Level Rewards (Rewards Track) */}
            <div className="mt-16 mb-16">
                <LevelRewardsTrack currentLevel={progress['Prediction'].level} theme="yellow" />
            </div>

            {/* Level Up Modal */}
            <LevelUpModal
                isOpen={levelUpModal.isOpen}
                onClose={() => setLevelUpModal({ ...levelUpModal, isOpen: false })}
                gameMode="Prediction"
                newLevel={levelUpModal.levelsGained[levelUpModal.levelsGained.length - 1]}
                rewards={levelUpModal.rewards}
                theme="yellow"
            />

            {/* Back Button (Fixed) */}
            <button
                onClick={onBack}
                className="fixed bottom-8 left-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all z-50 group"
            >
                <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
        </div >
    );
};

export default PredictionView;
