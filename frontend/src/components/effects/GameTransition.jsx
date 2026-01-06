import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const COLORS = {
    green: { bg: "bg-green-950", accent: "text-green-500", border: "border-green-500/30" },
    red: { bg: "bg-red-950", accent: "text-red-500", border: "border-red-500/30" },
    purple: { bg: "bg-purple-950", accent: "text-purple-500", border: "border-purple-500/30" },
    yellow: { bg: "bg-yellow-950", accent: "text-yellow-500", border: "border-yellow-500/30" },
    blue: { bg: "bg-blue-950", accent: "text-blue-500", border: "border-blue-500/30" },
};

const TransitionContent = ({ theme, title }) => {
    const currentTheme = COLORS[theme] || COLORS.blue;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Slower increment: 1-3% every 50ms (approx 2.5s to 100%)
                return prev + Math.floor(Math.random() * 3) + 1;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ delay: 0.4 }}
            className="relative z-20 flex flex-col items-center"
        >
            <div className={`p-6 rounded-full border-2 ${currentTheme.border} mb-6 animate-pulse relative`}>
                <Loader2 size={48} className={`${currentTheme.accent} animate-spin`} />
                <div className={`absolute inset-0 flex items-center justify-center font-mono font-bold text-sm ${currentTheme.accent}`}>
                    {Math.min(progress, 100)}%
                </div>
            </div>
            <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${currentTheme.accent} mb-2`}>
                {title}
            </h2>
            <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className={`h-full w-1/2 ${currentTheme.bg.replace('bg-', 'bg-').replace('950', '500')}`}
                />
            </div>
            <p className="mt-4 text-xs font-mono text-gray-400 tracking-[0.2em]">INITIALIZING SYSTEM...</p>
        </motion.div>
    );
};

const GameTransition = ({ isVisible, theme = "blue", title = "Loading...", type = "slide" }) => {
    const currentTheme = COLORS[theme] || COLORS.blue;

    const renderBackground = () => (
        <div className="absolute inset-0 opacity-20">
            {theme === 'green' && (
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(#22c55e 2px, transparent 2px), radial-gradient(#22c55e 2px, transparent 2px)`,
                    backgroundSize: '32px 32px',
                    backgroundPosition: '0 0, 16px 16px'
                }}></div>
            )}
            {theme === 'red' && (
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #ef4444 0, #ef4444 1px, transparent 0, transparent 50%)`,
                    backgroundSize: '20px 20px'
                }}></div>
            )}
            {theme === 'purple' && (
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, #a855f7 100%), radial-gradient(circle at 0% 0%, #a855f7 0%, transparent 50%)`,
                    backgroundSize: '100% 100%'
                }}>
                    <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>
            )}
            {theme === 'yellow' && (
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, #eab308 25%, #eab308 26%, transparent 27%, transparent 74%, #eab308 75%, #eab308 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #eab308 25%, #eab308 26%, transparent 27%, transparent 74%, #eab308 75%, #eab308 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px'
                }}></div>
            )}
            {theme === 'blue' && (
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            )}
        </div>
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">

                    {/* Slide Effect (Default) */}
                    {type === 'slide' && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className={`absolute inset-0 ${currentTheme.bg} flex items-center justify-center`}
                        >
                            {renderBackground()}
                            <TransitionContent theme={theme} title={title} />
                        </motion.div>
                    )}

                    {/* Door Effect (Split Left/Right) */}
                    {type === 'door' && (
                        <>
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className={`absolute left-0 top-0 bottom-0 w-1/2 ${currentTheme.bg} border-r border-white/10`}
                            >
                                {renderBackground()}
                            </motion.div>
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className={`absolute right-0 top-0 bottom-0 w-1/2 ${currentTheme.bg} border-l border-white/10`}
                            >
                                {renderBackground()}
                            </motion.div>
                            <TransitionContent theme={theme} title={title} />
                        </>
                    )}

                    {/* Shutter Effect (Vertical Bars) */}
                    {type === 'shutter' && (
                        <>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: "-100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "100%" }}
                                    transition={{ duration: 0.4, delay: i * 0.05, ease: "easeInOut" }}
                                    className={`absolute top-0 bottom-0 ${currentTheme.bg} border-r border-white/5`}
                                    style={{ left: `${i * 20}%`, width: '20%' }}
                                >
                                    {renderBackground()}
                                </motion.div>
                            ))}
                            <TransitionContent theme={theme} title={title} />
                        </>
                    )}

                    {/* Circle Effect (Iris Wipe) */}
                    {type === 'circle' && (
                        <motion.div
                            initial={{ clipPath: "circle(0% at 50% 50%)" }}
                            animate={{ clipPath: "circle(150% at 50% 50%)" }}
                            exit={{ clipPath: "circle(0% at 50% 50%)" }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className={`absolute inset-0 ${currentTheme.bg} flex items-center justify-center`}
                        >
                            {renderBackground()}
                            <TransitionContent theme={theme} title={title} />
                        </motion.div>
                    )}

                </div>
            )}
        </AnimatePresence>
    );
};

export default GameTransition;
