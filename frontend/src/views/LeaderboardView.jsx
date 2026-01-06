import React, { useState, useEffect, useCallback } from 'react';
import {
    Trophy, TrendingUp, DollarSign, Activity, Flame,
    ArrowUpRight, Users, Crown, Zap, BarChart3, Calendar
} from 'lucide-react';

import { motion } from 'framer-motion';
import BitcoinParticleBanner from '../components/effects/BitcoinParticleBanner';
import { rankingService } from '../services/api';

const LeaderboardView = ({ onBack }) => {
    // Mock Data State
    const [stats, setStats] = useState({
        totalRevenue: 1245890,
        activePlayers: 15420,
        maxWin: { player: "CryptoKing", amount: 50000, multiplier: "5000x", game: "Crash" }
    });

    const [hotGames, setHotGames] = useState([]);

    const [topEarners, setTopEarners] = useState([]);

    const fmt = (val) => Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const toNumber = (v) => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') return parseFloat(v);
        if (v && typeof v === 'object') {
            if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
            if (typeof v.decimal === 'string') return parseFloat(v.decimal);
        }
        return 0;
    };

    const fetchTop = useCallback(async () => {
        try {
            const res = await rankingService.topWinnersUSD({ period: '24h', limit: 5 });
            const rows = res.data || [];
            const mapped = rows.map((r, i) => {
                const userId = r.userId ?? r.UserID;
                const name = r.username ? r.username : (userId ? `User#${userId}` : 'User');
                const amt = toNumber(r.amount ?? r.Amount);
                return { rank: i+1, name, earned: `+${fmt(amt)} USDT`, game: 'All Games' };
            });
            setTopEarners(mapped);
        } catch {
            setTopEarners([]);
        }
    }, []);

    useEffect(() => {
        fetchTop();
        const onReward = () => { fetchTop(); };
        window.addEventListener('reward:new', onReward);
        const interval = setInterval(() => { if (!document.hidden) fetchTop(); }, 60000);
        return () => { window.removeEventListener('reward:new', onReward); clearInterval(interval); };
    }, [fetchTop]);

    useEffect(() => {
        const fetchHot = async () => {
            try {
                const res = await rankingService.hotGames({ period: '24h', limit: 10 });
                const rows = res.data || [];
                const max = rows.reduce((m, r) => Math.max(m, Number(r.rewardsUSD?.decimal || r.rewardsUSD?.Decimal || r.rewardsUSD || 0)), 0);
                const mapHeat = (usd) => {
                    const n = Number(usd);
                    if (!max || max <= 0) return 0;
                    return Math.round(Math.min(100, (n / max) * 100));
                };
                const mapped = rows.map((r, i) => {
                    const usd = Number(r.rewardsUSD?.decimal || r.rewardsUSD?.Decimal || r.rewardsUSD || 0);
                    return {
                        rank: i + 1,
                        name: r.gameId,
                        type: 'Arcade',
                        heat: mapHeat(usd),
                        players: `${r.players}`,
                        revenue: `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    };
                });
                setHotGames(mapped);
            } catch {
                setHotGames([]);
            }
        };
        fetchHot();
        const interval = setInterval(() => { if (!document.hidden) fetchHot(); }, 60000);
        return () => { clearInterval(interval); };
    }, []);

    return (
        <div className="relative w-full min-h-screen pt-24 pb-12 px-4 md:px-8 overflow-y-auto animate-fade-in max-w-7xl mx-auto">

            {/* Bitcoin Particle Banner */}
            <BitcoinParticleBanner />

            {/* Header Info */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                    <Calendar size={16} /> TODAY'S PERFORMANCE SUMMARY
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-500 font-bold text-xs tracking-wider">MARKET LIVE</span>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Revenue */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-md border border-green-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/60 transition-colors"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-green-400 font-bold tracking-wider text-sm">
                        <BarChart3 size={16} /> TOTAL TICKET REVENUE
                    </div>
                    <div className="text-4xl font-black text-white mb-2">
                        ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded">
                            <ArrowUpRight size={12} /> +12.5%
                        </span>
                        vs yesterday
                    </div>
                </motion.div>

                {/* Max Win */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/40 backdrop-blur-md border border-yellow-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/60 transition-colors"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-yellow-400 font-bold tracking-wider text-sm">
                        <Crown size={16} /> HIGHEST PAYOUT (MAX WIN)
                    </div>
                    <div className="text-4xl font-black text-white mb-1">
                        {stats.maxWin.multiplier}
                    </div>
                    <div className="text-lg font-bold text-yellow-200 mb-2">
                        ${stats.maxWin.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        Winner: <span className="text-white font-bold">{stats.maxWin.player}</span> in {stats.maxWin.game}
                    </div>
                </motion.div>

                {/* Daily Heat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-black/40 backdrop-blur-md border border-red-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/60 transition-colors"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flame size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-red-400 font-bold tracking-wider text-sm">
                        <Activity size={16} /> DAILY HEAT (ACTIVE USERS)
                    </div>
                    <div className="text-4xl font-black text-white mb-2">
                        {stats.activePlayers.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-red-400 flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded animate-pulse">
                            <Zap size={12} /> LIVE
                        </span>
                        Currently playing
                    </div>
                </motion.div>
            </div>

            {/* Detailed Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Hot Games Ranking */}
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Flame className="text-orange-500" /> HOT GAMES RANKING
                    </h3>
                    <div className="space-y-4">
                        {hotGames.map((game, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 group">
                                <div className={`w-8 h-8 flex items-center justify-center font-black text-lg rounded-lg ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-700 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    {game.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white flex items-center gap-2">
                                        {game.name}
                                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{game.type}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${game.heat}%` }}></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white">{game.revenue}</div>
                                    <div className="text-xs text-gray-500">{game.players} players</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Earners Ranking */}
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-green-500" /> TOP EARNERS TODAY
                    </h3>
                    <div className="space-y-4">
                        {topEarners.map((earner, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                                <div className={`w-8 h-8 flex items-center justify-center font-black text-lg rounded-full ${i === 0 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-700 text-white' : 'bg-white/10 text-gray-400'}`}>
                                    {earner.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white">{earner.name}</div>
                                    <div className="text-xs text-gray-400">Playing: {earner.game}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-green-400">{earner.earned}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaderboardView;
