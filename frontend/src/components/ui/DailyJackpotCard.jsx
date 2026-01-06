import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { usePlayerProgress } from '../../contexts/PlayerProgressContext';

const DailyJackpotCard = () => {
    const { progress } = usePlayerProgress();
    const dailyGames = progress.daily?.gamesPlayed || 0;
    const tickets = progress.daily?.tickets || 0;

    // Calculate progress to next ticket (0-10)
    const progressToNextTicket = dailyGames % 10;
    const progressPercent = (progressToNextTicket / 10) * 100;

    // Simulated Jackpot Amount (starts at base, increases over time)
    const [jackpotAmount, setJackpotAmount] = useState(125840);

    // Countdown Timer
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Jackpot increment animation
        const interval = setInterval(() => {
            setJackpotAmount(prev => prev + Math.floor(Math.random() * 5));
        }, 3000);

        // Countdown logic (Target: 10 PM tonight)
        const timerInterval = setInterval(() => {
            const now = new Date();
            const target = new Date();
            target.setHours(22, 0, 0, 0); // 10:00 PM

            if (now > target) {
                target.setDate(target.getDate() + 1); // Next day if passed
            }

            const diff = target - now;
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timerInterval);
        };
    }, []);

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-900/40 via-black/60 to-black/80 backdrop-blur-md group">
            {/* Animated Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse"></div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Left: Jackpot Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles size={12} /> Daily Jackpot
                        </span>
                        <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> Draws at 22:00
                        </span>
                    </div>

                    <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] font-mono tracking-tighter mb-2">
                        ${jackpotAmount.toLocaleString()}
                    </div>

                    <div className="text-sm text-gray-400 font-mono flex items-center justify-center md:justify-start gap-4">
                        <span>Next Draw: <span className="text-white font-bold">{timeLeft}</span></span>
                        <span className="text-green-400 flex items-center gap-1"><TrendingUp size={12} /> Pool Growing</span>
                    </div>
                </div>

                {/* Right: Player Progress */}
                <div className="w-full md:w-auto min-w-[300px] bg-black/40 border border-white/10 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="text-sm font-bold text-white mb-1">Daily Quest</div>
                            <div className="text-xs text-gray-400">Play 10 games to get a ticket</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-yellow-400">{tickets}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Tickets Owned</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-4 bg-black/60 rounded-full border border-white/10 overflow-hidden mb-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                        </motion.div>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                            {progressToNextTicket} / 10 Games
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Reset at 00:00</span>
                        {progressToNextTicket === 0 && dailyGames > 0 ? (
                            <span className="text-green-400 font-bold flex items-center gap-1 animate-pulse">
                                <Ticket size={12} /> Ticket Earned!
                            </span>
                        ) : (
                            <span className="text-yellow-500/80 font-bold">
                                {10 - progressToNextTicket} more to go
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyJackpotCard;
