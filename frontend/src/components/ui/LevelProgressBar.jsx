import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { usePlayerProgress } from '../../contexts/PlayerProgressContext';

const LevelProgressBar = ({ gameMode, theme = 'purple', variant = 'default' }) => {
    const { progress, getExpRequired, getLevelRewards } = usePlayerProgress();

    const currentProgress = progress[gameMode];
    const expRequired = getExpRequired(gameMode, currentProgress.level);
    const expPercentage = (currentProgress.currentExp / expRequired) * 100;
    const nextRewards = getLevelRewards(gameMode, currentProgress.level + 1);

    // 主题颜色
    const themes = {
        green: {
            gradient: 'from-green-500 to-emerald-600',
            glow: 'shadow-green-500/50',
            accent: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/30'
        },
        red: {
            gradient: 'from-red-500 to-rose-600',
            glow: 'shadow-red-500/50',
            accent: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30'
        },
        purple: {
            gradient: 'from-purple-500 to-violet-600',
            glow: 'shadow-purple-500/50',
            accent: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30'
        },
        yellow: {
            gradient: 'from-yellow-500 to-amber-600',
            glow: 'shadow-yellow-500/50',
            accent: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30'
        }
    };

    const currentTheme = themes[theme] || themes.purple;

    // Banner Variant (Simplified, Transparent)
    if (variant === 'banner') {
        return (
            <div className="w-full">
                <div className="flex items-end justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded bg-gradient-to-br ${currentTheme.gradient} shadow-lg ${currentTheme.glow}`}>
                            <Star size={14} className="text-white" fill="white" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl font-black text-white leading-none">
                                    LV.{currentProgress.level}
                                </h3>
                                <span className={`text-xs font-bold ${currentTheme.accent} uppercase tracking-wider`}>
                                    {gameMode}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-mono text-gray-300">
                            <span className="text-white font-bold">{currentProgress.currentExp}</span> / {expRequired} XP
                        </div>
                    </div>
                </div>

                {/* 经验条 */}
                <div className="relative h-2 bg-black/40 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${expPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${currentTheme.gradient} relative`}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Default Variant (Card Style)
    return (
        <div className={`p-8 rounded-2xl border ${currentTheme.border} ${currentTheme.bg} backdrop-blur-md`}>
            {/* 等级标题 */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${currentTheme.gradient} shadow-lg ${currentTheme.glow}`}>
                        <Star size={24} className="text-white" fill="white" />
                    </div>
                    <div>
                        <h3 className={`text-2xl font-black ${currentTheme.accent}`}>
                            LEVEL {currentProgress.level}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">
                            {currentProgress.totalGamesPlayed} Games Played
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-sm text-gray-400 font-mono">Next Level</div>
                    <div className={`text-lg font-bold ${currentTheme.accent}`}>
                        {currentProgress.currentExp}/{expRequired} EXP
                    </div>
                </div>
            </div>

            {/* 经验条 */}
            <div className="relative h-4 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${currentTheme.gradient} relative`}
                >
                    {/* 光晕效果 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </motion.div>

                {/* 百分比文字 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-white drop-shadow-lg">
                        {Math.floor(expPercentage)}%
                    </span>
                </div>
            </div>

            {/* 下一级奖励预览 */}
            {nextRewards && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className={currentTheme.accent} />
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Next Level Rewards
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {nextRewards.DOGE && (
                            <div className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs font-bold text-green-400">
                                +{nextRewards.DOGE} DOGE
                            </div>
                        )}
                        {nextRewards.PEPE && (
                            <div className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-400">
                                +{nextRewards.PEPE} PEPE
                            </div>
                        )}
                        {nextRewards.SHIB && (
                            <div className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs font-bold text-orange-400">
                                +{nextRewards.SHIB} SHIB
                            </div>
                        )}
                        {nextRewards.USDT && (
                            <div className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-xs font-bold text-yellow-400">
                                +{nextRewards.USDT} USDT
                            </div>
                        )}
                        {nextRewards.items && nextRewards.items.map((item, idx) => (
                            <div key={idx} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-400">
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LevelProgressBar;
