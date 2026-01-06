import React from 'react';
import {
    Gamepad2, Trophy, Swords, Layers, TrendingUp,
    Globe, Search, User, Star, Gift, ArrowRight
} from 'lucide-react';
import RewardCard from '../components/ui/RewardCard';
import SinglePlayerGameCard from '../components/ui/SinglePlayerGameCard';

const BattlePassView = ({ onBack, category = 'Single Player' }) => {
    // 配置不同板块的显示信息
    const categoryConfig = {
        'Single Player': {
            title: '单机游戏',
            subtitle: '沉浸式单人冒险',
            desc: 'Explore immersive solo adventures. Earn XP, level up your profile, and unlock exclusive rewards.',
            bg: 'https://images.unsplash.com/photo-1614726365723-49cfae945dc1?q=80&w=2069&auto=format&fit=crop',
            color: '#4ade80', // Green
            icon: <Gamepad2 size={14} />,
            games: [
                { title: "Cyber Odyssey 2077", genre: "Action RPG", rating: "4.9", players: "1.2M", progress: 45, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1930&auto=format&fit=crop" },
                { title: "Lost Relics", genre: "Adventure", rating: "4.7", players: "850K", progress: 12, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1968&auto=format&fit=crop" }
            ]
        },
        'Competitive': {
            title: '竞技游戏',
            subtitle: '全球排位赛',
            desc: 'Battle against players worldwide. Climb the leaderboards and earn massive crypto prize pools.',
            bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
            color: '#ef4444', // Red
            icon: <Swords size={14} />,
            games: [
                { title: "Arena Valor", genre: "MOBA", rating: "4.8", players: "5.2M", progress: 80, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" },
                { title: "Strike Force", genre: "FPS", rating: "4.6", players: "3.1M", progress: 65, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop" }
            ]
        },
        'Card Games': {
            title: '卡牌游戏',
            subtitle: '策略与收藏',
            desc: 'Build your ultimate deck. Collect rare NFT cards and outsmart your opponents in turn-based duels.',
            bg: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop',
            color: '#a855f7', // Purple
            icon: <Layers size={14} />,
            games: [
                { title: "Mystic Deck", genre: "TCG", rating: "4.9", players: "900K", progress: 20, image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop" },
                { title: "Ether Legends", genre: "Strategy", rating: "4.5", players: "400K", progress: 5, image: "https://images.unsplash.com/photo-1635321276222-03e276359707?q=80&w=1930&auto=format&fit=crop" }
            ]
        },
        'Prediction': {
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
        }
    };

    const config = categoryConfig[category] || categoryConfig['Single Player'];

    // 模拟等级奖励数据
    const levelRewards = [
        { level: 5, type: "Starter Pack", rarity: "common", image: "https://cdn-icons-png.flaticon.com/512/3662/3662499.png", active: true },
        { level: 10, type: "Rare Skin", rarity: "rare", image: "https://cdn-icons-png.flaticon.com/512/2153/2153580.png", active: true },
        { level: 15, type: "Exp Boost", rarity: "rare", image: "https://cdn-icons-png.flaticon.com/512/2275/2275990.png", active: false },
        { level: 20, type: "Legendary Sword", rarity: "legendary", image: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png", active: false },
        { level: 25, type: "Mystery Box", rarity: "epic", image: "https://cdn-icons-png.flaticon.com/512/4205/4205869.png", active: false },
        { level: 30, type: "1000 Tokens", rarity: "legendary", image: "https://cdn-icons-png.flaticon.com/512/1162/1162951.png", active: false },
        { level: 35, type: "Unique Avatar", rarity: "epic", image: "https://cdn-icons-png.flaticon.com/512/2553/2553696.png", active: false },
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
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[30s] ease-linear opacity-60"
                />

                <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between">
                    {/* Stats Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border" style={{ borderColor: `${config.color}50`, color: config.color }}>
                            <Globe size={14} /> ONLINE • {category.toUpperCase()} ZONE
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
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-lg">
                            {config.title}
                        </h1>
                        <p className="text-gray-300 font-mono text-sm md:text-base mb-8 flex items-center gap-3 max-w-2xl">
                            <span style={{ color: config.color }} className="bg-white/10 p-1 rounded">{config.icon}</span> {config.desc}
                        </p>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            {/* Player Level Bar */}
                            <div className="w-full max-w-2xl bg-black/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                                <div className="flex justify-between text-sm font-bold mb-3">
                                    <span className="text-white flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> {category.toUpperCase()} LEVEL 12</span>
                                    <span className="font-mono" style={{ color: config.color }}>8,450 / 10,000 XP</span>
                                </div>
                                <div className="h-5 bg-black/60 rounded-full border border-white/10 overflow-hidden relative">
                                    <div
                                        className="absolute top-0 left-0 h-full w-[84%]"
                                        style={{
                                            background: `linear-gradient(90deg, #2563eb 0%, ${config.color} 100%)`,
                                            boxShadow: `0 0 20px ${config.color}`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase flex items-center gap-2 transition-all hover:scale-105">
                                    <Star size={16} className="text-yellow-400" /> My Achievements
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Level Rewards (Rewards Track) */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3">
                        <Gift size={24} style={{ color: config.color }} /> Level Rewards
                    </h3>
                    <div className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded border border-white/10">NEXT REWARD AT LV.15</div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x px-2">
                    {levelRewards.map((reward, i) => (
                        <div key={i} className="snap-start">
                            <RewardCard {...reward} />
                        </div>
                    ))}
                    <div className="min-w-[140px] h-[180px] flex flex-col items-center justify-center border border-white/5 border-dashed rounded-lg text-gray-600 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <span className="text-3xl font-bold mb-2">?</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Coming Soon</span>
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div>
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div className="flex gap-8 overflow-x-auto">
                        <button className="text-white font-bold text-2xl border-b-2 pb-6 -mb-6.5 whitespace-nowrap" style={{ borderColor: config.color }}>All Games</button>
                        <button className="text-gray-500 hover:text-white font-bold text-2xl transition-colors pb-6 whitespace-nowrap">Top Rated</button>
                        <button className="text-gray-500 hover:text-white font-bold text-2xl transition-colors pb-6 whitespace-nowrap">New</button>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-6 md:mt-0">
                        SORT BY: <span className="text-white font-bold cursor-pointer bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">POPULAR</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {config.games.map((game, i) => (
                        <SinglePlayerGameCard
                            key={i}
                            title={game.title}
                            genre={game.genre}
                            image={game.image}
                            progress={game.progress}
                            rating={game.rating}
                            players={game.players}
                        />
                    ))}
                    {/* Duplicate for demo */}
                    {config.games.map((game, i) => (
                        <SinglePlayerGameCard
                            key={i + 10}
                            title={game.title + " II"}
                            genre={game.genre}
                            image={game.image}
                            progress={0}
                            rating={game.rating}
                            players={game.players}
                        />
                    ))}
                </div>
            </div>

            {/* Back Button (Fixed) */}
            <button
                onClick={onBack}
                className="fixed bottom-8 left-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all z-50 group"
            >
                <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default BattlePassView;
