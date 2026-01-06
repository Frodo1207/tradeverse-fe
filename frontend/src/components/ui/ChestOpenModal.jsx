import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Box } from 'lucide-react';

const ChestOpenModal = ({ isOpen, onClose, onOpen, loading, rewards, theme = 'green' }) => {
    const [step, setStep] = useState('ready'); // ready, opening, revealed

    useEffect(() => {
        if (isOpen) {
            setStep('ready');
        }
    }, [isOpen]);

    useEffect(() => {
        if (loading) {
            setStep('opening');
        } else if (rewards) {
            setStep('revealed');
        } else if (!loading && !rewards && step === 'opening') {
            // Error case: request finished but no rewards, reset to ready
            setStep('ready');
        }
    }, [loading, rewards]);

    const handleOpen = () => {
        if (step === 'ready') {
            onOpen();
        }
    };

    const themes = {
        green: {
            gradient: 'from-green-500 to-emerald-600',
            glow: 'shadow-[0_0_50px_rgba(34,197,94,0.5)]',
            accent: 'text-green-400',
            bg: 'bg-green-500/10',
            border: 'border-green-500/30',
            button: 'bg-green-500 hover:bg-green-600'
        },
        red: {
            gradient: 'from-red-500 to-rose-600',
            glow: 'shadow-[0_0_50px_rgba(239,68,68,0.5)]',
            accent: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            button: 'bg-red-500 hover:bg-red-600'
        },
        purple: {
            gradient: 'from-purple-500 to-violet-600',
            glow: 'shadow-[0_0_50px_rgba(168,85,247,0.5)]',
            accent: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            button: 'bg-purple-500 hover:bg-purple-600'
        },
        yellow: {
            gradient: 'from-yellow-500 to-amber-600',
            glow: 'shadow-[0_0_50px_rgba(234,179,8,0.5)]',
            accent: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            button: 'bg-yellow-500 hover:bg-yellow-600'
        }
    };

    const t = themes[theme] || themes.green;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                onClick={rewards ? onClose : undefined}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`relative max-w-md w-full bg-gradient-to-br from-gray-900 to-black border-2 ${t.border} rounded-3xl overflow-hidden ${t.glow} flex flex-col items-center p-8`}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 opacity-30">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${t.gradient} rounded-full blur-[100px] animate-pulse`}></div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <X size={20} className="text-white/50 hover:text-white" />
                    </button>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center w-full">
                        
                        {/* Title */}
                        <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-8 text-center">
                            {step === 'revealed' ? 'Rewards Claimed!' : 'Daily Chest'}
                        </h2>

                        {/* Chest Animation Container */}
                        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {step === 'ready' && (
                                    <motion.div
                                        key="chest-closed"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                                        exit={{ scale: 0 }}
                                        transition={{ 
                                            rotate: { repeat: Infinity, duration: 2, repeatDelay: 1 }
                                        }}
                                        className="text-9xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                                        onClick={handleOpen}
                                    >
                                        📦
                                    </motion.div>
                                )}
                                {step === 'opening' && (
                                    <motion.div
                                        key="chest-opening"
                                        initial={{ scale: 1 }}
                                        animate={{ 
                                            scale: [1, 1.2, 0.8, 1.5],
                                            rotate: [0, -10, 10, -20, 20, 0],
                                            filter: ["brightness(1)", "brightness(2)"]
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 1.5 }}
                                        className="text-9xl"
                                    >
                                        📦
                                    </motion.div>
                                )}
                                {step === 'revealed' && (
                                    <motion.div
                                        key="rewards"
                                        initial={{ scale: 0, y: 50 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        {/* Reward Icons */}
                                        <div className="flex gap-4">
                                            {rewards?.coins && Object.entries(rewards.coins).map(([currency, amount], i) => (
                                                <div key={currency} className="flex flex-col items-center animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                                                    <div className="text-5xl mb-2">💰</div>
                                                    <div className={`text-lg font-bold ${t.accent}`}>{amount} {currency}</div>
                                                </div>
                                            ))}
                                            {rewards?.items && rewards.items.map((item, i) => (
                                                <div key={i} className="flex flex-col items-center animate-bounce" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                                                    <div className="text-5xl mb-2">🎟️</div>
                                                    <div className={`text-lg font-bold ${t.accent}`}>{item}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Button */}
                        {step === 'ready' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOpen}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-white shadow-lg ${t.button} transition-all`}
                            >
                                Open Chest
                            </motion.button>
                        )}
                        
                        {step === 'opening' && (
                            <div className="text-white/50 font-bold animate-pulse">
                                Opening...
                            </div>
                        )}

                        {step === 'revealed' && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                Collect Rewards
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChestOpenModal;
