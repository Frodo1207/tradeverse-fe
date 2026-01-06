import React, { useEffect, useState } from 'react';
import {
    Gamepad2, Heart,
    Play, Flame, Trophy, Monitor, Star, Users, TrendingUp, Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { gameService } from '../services/api';
import LobbyActiveBackground from '../components/effects/LobbyActiveBackground';

const TAG_KEY_BY_LABEL = {
    rpg: 'rpg',
    fps: 'fps',
    competitive: 'competitive',
    adventure: 'adventure',
    mmo: 'mmo',
    sports: 'sports',
    'open world': 'openWorld',
    sandbox: 'sandbox'
};

// Mock Data for "Fake Games"
const MOCK_GAMES = {
    hero: {
        id: 'valorant',
        title: 'VALORANT',
        subtitle: 'Riot Games',
        description: 'A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.',
        tags: ['Popular', 'FPS', 'Competitive'],
        rating: '4.9',
        reviews: '+12k Reviews',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        platforms: ['PC', 'Console']
    },
    sideList: [
        { id: 1, title: 'Cyberpunk 2077', image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop', status: 'Updated', rating: '4.8', players: '2.1M' },
        { id: 2, title: 'Elden Ring', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', status: 'New DLC', rating: '4.9', players: '850K' },
        { id: 3, title: 'Apex Legends', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1968&auto=format&fit=crop', status: 'Live', rating: '4.5', players: '1.2M' },
    ],
    newGames: [
        { id: 'u4', title: 'Uncharted 4', image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop', tag: 'Adventure', rating: '4.9', players: '45K' },
        { id: 'd2', title: 'Destiny 2', image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop', tag: 'MMO', rating: '4.6', players: '120K' },
        { id: 'f23', title: 'FIFA 23', image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop', tag: 'Sports', rating: '4.7', players: '300K' },
        { id: 'gta', title: 'GTA V', image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop', tag: 'Open World', rating: '4.8', players: '500K' },
        { id: 'mc', title: 'Minecraft', image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop', tag: 'Sandbox', rating: '4.9', players: '1M+' },
    ],
    downloads: {
        title: 'FIFA 23',
        tag: 'Sports Simulator',
        size: '26.5GB / 45GB',
        time: '1h 23m left',
        progress: 65,
        image: 'https://images.unsplash.com/photo-1511882150382-421056ac8d89?q=80&w=2070&auto=format&fit=crop'
    }
};

const LobbyView = () => {
    const { t } = useTranslation();
    const [realGames, setRealGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await gameService.getGames();
                if (response?.success) {
                    setRealGames(response.games || []);
                }
            } catch (error) {
                console.error('Failed to fetch games:', error);
            }
        };
        fetchGames();
    }, []);

    const handleGameClick = (url) => {
        const tk = localStorage.getItem('authToken') || '';
        if (url) {
            const target = tk ? `${url}#ticket=${encodeURIComponent(tk)}` : url;
            window.location.assign(target);
        }
    };

    return (
        <div className="relative isolate flex w-full min-h-screen bg-[#050505] pt-20 text-white font-sans selection:bg-[#8B5CF6] selection:text-white overflow-hidden">
            
            {/* Dynamic Background */}
            <LobbyActiveBackground />
            
            {/* Main Content */}
            <main className="relative z-10 flex-1 w-full overflow-x-hidden">
                <div className="max-w-7xl mx-auto px-6 py-6 lg:py-10 flex flex-col gap-10">
                    
                    {/* Top Section: Hero + Stats */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* Hero Section */}
                        <div className="xl:col-span-8 h-auto aspect-[4/5] md:aspect-[16/9] xl:aspect-auto xl:h-[400px]">
                            <div className="relative h-full w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group">
                                <img src={MOCK_GAMES.hero.image} alt={t('lobby.hero.imageAlt')} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050208] via-[#050208]/60 to-transparent md:bg-gradient-to-r"></div>
                                
                                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end md:justify-center items-start">
                                    <div className="flex gap-2 mb-4">
                                        <Badge icon={<Flame size={12} />} text={t('lobby.badges.popular')} color="bg-[#8B5CF6]" />
                                        <Badge icon={<Monitor size={12} />} text={t('lobby.badges.pc')} color="bg-white/10" />
                                    </div>
                                    
                                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 leading-none">
                                        {MOCK_GAMES.hero.title}
                                    </h2>
                                    <p className="text-sm md:text-xl text-white/60 mb-6 max-w-md font-light leading-relaxed line-clamp-3 md:line-clamp-none">
                                        {t('lobby.hero.description')}
                                    </p>

                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="flex -space-x-3">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#050208] overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt={t('lobby.hero.avatarAlt')} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-white/80 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                            {t('lobby.hero.reviews')}
                                        </span>
                                    </div>

                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button className="flex-1 md:flex-none bg-[#8B5CF6] hover:bg-[#A78BFA] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:-translate-y-1">
                                            <Play fill="currentColor" size={20} /> {t('lobby.actions.playNow')}
                                        </button>
                                        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-4 rounded-2xl transition-all backdrop-blur-md">
                                            <Heart size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Card */}
                        <div className="xl:col-span-4 h-auto md:h-[400px]">
                            <div className="bg-gradient-to-br from-[#240E33] to-[#0B0412] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden border border-white/5 h-full flex flex-col">
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Trophy size={120} />
                                </div>
                                
                                {/* Header */}
                                <div className="relative z-10 flex justify-between items-start mb-8">
                                    <h3 className="font-bold text-lg text-white">{t('lobby.stats.title')}</h3>
                                    <button className="text-white/30 hover:text-white transition-colors">
                                         <ArrowRightIcon />
                                    </button>
                                </div>

                                {/* Main Stat: Total Profit */}
                                <div className="relative z-10 mb-8">
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1">{t('lobby.stats.totalProfit')}</span>
                                    <div className="flex items-end gap-3">
                                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8B5CF6] tracking-tight">$24,593</span>
                                        <span className="text-sm font-bold text-green-400 mb-2 flex items-center bg-green-400/10 px-2 py-0.5 rounded-lg border border-green-400/20">
                                            <TrendingUp size={14} className="mr-1" /> +12%
                                        </span>
                                    </div>
                                </div>

                                {/* Grid Stats: Rounds & Win Rate */}
                                <div className="relative z-10 grid grid-cols-2 gap-4 mb-auto">
                                     <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-2 text-[#8B5CF6]">
                                            <Gamepad2 size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wider">{t('lobby.stats.rounds')}</span>
                                        </div>
                                        <span className="text-2xl font-black text-white">1,420</span>
                                     </div>
                                     <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-2 mb-2 text-[#D946EF]">
                                            <Target size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wider">{t('lobby.stats.winRate')}</span>
                                        </div>
                                        <span className="text-2xl font-black text-white">68.5%</span>
                                     </div>
                                </div>

                                {/* Footer / Favorite Games */}
                                <div className="relative z-10 mt-6 pt-6 border-t border-white/5">
                                     <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/30 font-bold uppercase tracking-wider">{t('lobby.stats.favoriteGames')}</span>
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-[#15081F] border border-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                                                    {i === 1 ? 'V' : i === 2 ? 'L' : 'C'}
                                                </div>
                                            ))}
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All Games Section */}
                    <div className="w-full">
                        <div className="flex justify-between items-end mb-8">
                            <h3 className="text-3xl font-bold">{t('lobby.allGames.title')}</h3>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold hover:bg-white/20 transition-colors">{t('lobby.filters.all')}</button>
                                <button className="px-4 py-2 bg-transparent border border-white/10 rounded-full text-sm font-bold text-white/40 hover:text-white hover:border-white/30 transition-colors">{t('lobby.filters.popular')}</button>
                                <button className="px-4 py-2 bg-transparent border border-white/10 rounded-full text-sm font-bold text-white/40 hover:text-white hover:border-white/30 transition-colors">{t('lobby.filters.new')}</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Real Games First (if any) */}
                            {realGames.map((game) => (
                                <GameCard 
                                    key={game.gameId} 
                                    title={game.gameName} 
                                    image={game.iconUrl || MOCK_GAMES.newGames[0].image}
                                    tag={game.category}
                                    t={t}
                                    onClick={() => handleGameClick(game.url)}
                                />
                            ))}
                            {/* Mock Games */}
                            {MOCK_GAMES.newGames.map((game) => (
                                <GameCard 
                                    key={game.id} 
                                    title={game.title} 
                                    image={game.image}
                                    tag={game.tag}
                                    t={t}
                                    onClick={() => {}}
                                />
                            ))}
                            {/* Additional Mock Data to fill grid */}
                            {MOCK_GAMES.sideList.map((game) => (
                                <GameCard 
                                    key={`side-${game.id}`}
                                    title={game.title}
                                    image={game.image}
                                    tag="RPG"
                                    t={t}
                                    onClick={() => {}}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Sub-components
const Badge = ({ icon, text, color }) => (
    <div className={`flex items-center gap-1.5 ${color} backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold`}>
        {icon}
        <span>{text}</span>
    </div>
);

const GameCard = ({ title, image, tag, rating = '4.5', players = '10K+', onClick, t }) => {
    const normalizedTag = typeof tag === 'string' ? tag.trim().toLowerCase() : '';
    const tagKey = TAG_KEY_BY_LABEL[normalizedTag];
    const tagLabel = tagKey ? t(`lobby.tags.${tagKey}`) : (tag || t('lobby.tags.game'));

    return (
        <div onClick={onClick} className="group relative h-[320px] rounded-[2rem] overflow-hidden cursor-pointer bg-[#15081F] border border-white/5 hover:border-[#8B5CF6]/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500">
        {/* Image Background */}
        <div className="absolute inset-0 h-full w-full">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0412] via-[#0B0412]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
            {/* Top Badge */}
            <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:border-[#8B5CF6] transition-colors duration-300">
                    {tagLabel}
                </span>
            </div>

            {/* Bottom Info */}
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-black text-2xl mb-2 leading-none text-white group-hover:text-[#8B5CF6] transition-colors">{title}</h4>
                
                <div className="flex items-center gap-4 text-xs font-bold text-white/50 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span>{rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users size={12} />
                        <span>{players}</span>
                    </div>
                </div>

                <button className="w-full py-3 bg-white/10 hover:bg-[#8B5CF6] text-white font-bold rounded-xl flex items-center justify-center gap-2 backdrop-blur-md transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    <Play size={16} fill="currentColor" /> {t('lobby.actions.playNow')}
                </button>
            </div>
        </div>
    </div>
    );
};

const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default LobbyView;
