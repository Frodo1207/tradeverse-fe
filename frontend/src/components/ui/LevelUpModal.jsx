import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles, Gift } from 'lucide-react';

const LevelUpModal = ({ isOpen, onClose, gameMode, newLevel, rewards, theme = 'purple' }) => {
    const { div: MotionDiv, button: MotionButton } = motion;
    // 主题颜色
    const themes = {
        green: {
            gradient: 'from-green-500 to-emerald-600',
            glow: 'shadow-[0_0_50px_rgba(34,197,94,0.5)]',
            accent: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/30'
        },
        red: {
            gradient: 'from-red-500 to-rose-600',
            glow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)]',
            accent: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30'
        },
        purple: {
            gradient: 'from-purple-500 to-violet-600',
            glow: 'shadow-[0_0_50px_rgba(168,85,247,0.5)]',
            accent: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30'
        },
        yellow: {
            gradient: 'from-yellow-500 to-amber-600',
            glow: 'shadow-[0_0_50px_rgba(234,179,8,0.5)]',
            accent: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30'
        }
    };

    const currentTheme = themes[theme] || themes.purple;

    if (!rewards) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 背景遮罩 */}
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    >
                        {/* 弹窗 */}
                        <MotionDiv
                            initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`relative max-w-lg w-full bg-gradient-to-br from-black to-gray-900 border-2 ${currentTheme.border} rounded-3xl overflow-hidden ${currentTheme.glow}`}
                        >
                            {/* 装饰性背景 */}
                            <div className="absolute inset-0 opacity-20">
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentTheme.gradient} rounded-full blur-3xl`}></div>
                                <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${currentTheme.gradient} rounded-full blur-3xl`}></div>
                            </div>

                            {/* 关闭按钮 */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                            >
                                <X size={20} className="text-white" />
                            </button>

                            {/* 内容 */}
                            <div className="relative z-10 p-8">
                                {/* 浮动的星星动画 */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(12)].map((_, i) => (
                                        <MotionDiv
                                            key={i}
                                            initial={{ y: 100, opacity: 0, rotate: 0 }}
                                            animate={{
                                                y: -100,
                                                opacity: [0, 1, 0],
                                                rotate: 360
                                            }}
                                            transition={{
                                                duration: 2,
                                                delay: i * 0.1,
                                                repeat: Infinity,
                                                repeatDelay: 1
                                            }}
                                            className={`absolute ${currentTheme.accent}`}
                                            style={{
                                                left: `${(i * 19 + 13) % 100}%`,
                                                top: '100%'
                                            }}
                                        >
                                            <Sparkles size={16} />
                                        </MotionDiv>
                                    ))}
                                </div>

                                {/* 标题 */}
                                <MotionDiv
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="text-center mb-6"
                                >
                                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${currentTheme.gradient} mb-4 ${currentTheme.glow}`}>
                                        <Trophy size={48} className="text-white" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-2">LEVEL UP!</h2>
                                    <p className="text-gray-400 font-mono">
                                        {gameMode}
                                    </p>
                                    <div className={`text-5xl font-black ${currentTheme.accent} mt-2`}>
                                        Level {newLevel - 1} → {newLevel}
                                    </div>
                                </MotionDiv>

                                {/* 奖励列表 */}
                                <MotionDiv
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-3 mb-6"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Gift size={20} className={currentTheme.accent} />
                                        <span className="text-lg font-bold text-white uppercase tracking-wider">
                                            Rewards Unlocked
                                        </span>
                                    </div>

                                    {/* 代币奖励 */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {rewards.DOGE && (
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center"
                                            >
                                                <div className="text-2xl font-black text-green-400">+{rewards.DOGE}</div>
                                                <div className="text-xs text-gray-400 font-mono">DOGE</div>
                                            </MotionDiv>
                                        )}
                                        {rewards.PEPE && (
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl text-center"
                                            >
                                                <div className="text-2xl font-black text-purple-400">+{rewards.PEPE}</div>
                                                <div className="text-xs text-gray-400 font-mono">PEPE</div>
                                            </MotionDiv>
                                        )}
                                        {rewards.SHIB && (
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl text-center"
                                            >
                                                <div className="text-2xl font-black text-orange-400">+{rewards.SHIB}</div>
                                                <div className="text-xs text-gray-400 font-mono">SHIB</div>
                                            </MotionDiv>
                                        )}
                                        {rewards.USDT && (
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-center"
                                            >
                                                <div className="text-2xl font-black text-yellow-400">+{rewards.USDT}</div>
                                                <div className="text-xs text-gray-400 font-mono">USDT</div>
                                            </MotionDiv>
                                        )}
                                    </div>

                                    {/* 物品奖励 */}
                                    {rewards.items && rewards.items.length > 0 && (
                                        <div className="space-y-2">
                                            {rewards.items.map((item, idx) => (
                                                <MotionDiv
                                                    key={idx}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                                    className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm font-bold text-blue-400 text-center"
                                                >
                                                    🎁 {item}
                                                </MotionDiv>
                                            ))}
                                        </div>
                                    )}
                                </MotionDiv>

                                {/* 领取按钮 */}
                                <MotionButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className={`w-full py-4 rounded-xl bg-gradient-to-r ${currentTheme.gradient} text-white font-black text-lg uppercase tracking-wider shadow-lg ${currentTheme.glow} transition-all`}
                                >
                                    Claim Rewards
                                </MotionButton>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>
    );
};

export default LevelUpModal;
