import React, { useEffect, useState } from 'react';
import { Layers, Globe, Search, User, Star, ArrowRight } from 'lucide-react';
import LevelProgressBar from '../../components/ui/LevelProgressBar';
import LevelUpModal from '../../components/ui/LevelUpModal';
import DailyJackpotCard from '../../components/ui/DailyJackpotCard';
import LevelRewardsTrack from '../../components/ui/LevelRewardsTrack';
import { usePlayerProgress } from '../../contexts/PlayerProgressContext';
import SinglePlayerGameCard from '../../components/ui/SinglePlayerGameCard';
import { gameService } from '../../services/api';

const CardGamesView = ({ onBack }) => {
    const config = {
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
    };

    const { progress } = usePlayerProgress();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [levelUpModal, setLevelUpModal] = React.useState({ isOpen: false, levelsGained: [], rewards: null });
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await gameService.getGames();
                if (response.success) {
                    const mapped = [];
                    for (const g of response.games || []) {
                        let type = 'single';
                        try {
                            if (g.category) { type = String(g.category).toLowerCase(); }
                            else if (g.metadata) { const meta = JSON.parse(g.metadata); type = String((meta.type || 'single')).toLowerCase(); }
                        } catch { void 0; }
                        if (type !== 'card') continue;
                        mapped.push({ id: g.gameId, title: g.gameName, genre: 'Card', rating: '5.0', players: '1K+', progress: 0, image: g.iconUrl || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop', url: g.url });
                    }
                    setGames(mapped);
                }
            } catch { setGames([]); } finally { setLoading(false); }
        };
        fetchGames();
    }, []);
    //



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


                    {/* Featured Decks */}
                    {/* Stats Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border" style={{ borderColor: `${config.color}50`, color: config.color }}>
                            <Globe size={14} /> ONLINE • CARD GAMES ZONE
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

                        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-8">
                            {/* Integrated Level Progress */}
                            <div className="w-full md:w-2/3 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <LevelProgressBar gameMode="Card Games" theme="purple" variant="banner" />
                            </div>

                            {/* Stats Button */}
                            <button className="w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 whitespace-nowrap h-fit">
                                <Star size={16} className="text-yellow-400" /> My Deck
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Jackpot Section */}
            <div className="mb-8">
                <DailyJackpotCard />
            </div>

            {/* Level Rewards (Rewards Track) */}
            <div className="mb-16">
                <LevelRewardsTrack currentLevel={progress['Card Games'].level} theme="purple" />
            </div>

            {/* Level Up Modal */}
            <LevelUpModal
                isOpen={levelUpModal.isOpen}
                onClose={() => setLevelUpModal({ ...levelUpModal, isOpen: false })}
                gameMode="Card Games"
                newLevel={levelUpModal.levelsGained[levelUpModal.levelsGained.length - 1]}
                rewards={levelUpModal.rewards}
                theme="purple"
            />

            {/* Games Grid */}
            <div>
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div className="flex gap-8 overflow-x-auto">
                        <button className="text-white font-bold text-2xl border-b-2 pb-6 -mb-6.5 whitespace-nowrap" style={{ borderColor: config.color }}>All Decks</button>
                        <button className="text-gray-500 hover:text-white font-bold text-2xl transition-colors pb-6 whitespace-nowrap">Meta</button>
                        <button className="text-gray-500 hover:text-white font-bold text-2xl transition-colors pb-6 whitespace-nowrap">New</button>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-6 md:mt-0">
                        SORT BY: <span className="text-white font-bold cursor-pointer bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">RARITY</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center py-20 text-gray-500">Loading games...</div>
                    ) : games.length > 0 ? (
                        games.map((game, i) => (
                            <SinglePlayerGameCard
                                key={i}
                                title={game.title}
                                genre={game.genre}
                                image={game.image}
                                progress={game.progress}
                                rating={game.rating}
                                players={game.players}
                                onClick={() => {
                                    const tk = localStorage.getItem('authToken') || '';
                                    if (game.url) {
                                        const url = tk ? `${game.url}#ticket=${encodeURIComponent(tk)}` : game.url;
                                        window.location.href = url;
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">No card games available yet.</div>
                    )}
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

export default CardGamesView;
