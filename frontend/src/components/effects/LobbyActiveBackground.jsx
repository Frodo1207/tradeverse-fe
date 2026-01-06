import React from 'react';
import { motion } from 'framer-motion';

const LobbyActiveBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2e1065]/35 via-[#120822]/55 to-[#050505]" />
            {/* 1. Static Grid Pattern with Mask */}
            <div 
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
                }}
            />

            {/* 2. Moving Gradient Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.25, 0.95, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[110px] opacity-70 transform-gpu"
                style={{
                    willChange: 'transform',
                    background: 'radial-gradient(circle at center, rgba(168,85,247,0.55), transparent 60%)',
                }}
            />
            
            <motion.div
                animate={{
                    x: [0, -70, 30, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 1.18, 0.96, 1],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[0%] right-[-15%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-60 transform-gpu"
                style={{
                    willChange: 'transform',
                    background: 'radial-gradient(circle at center, rgba(59,130,246,0.45), transparent 62%)',
                }}
            />

            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 30, -30, 0],
                    scale: [1, 1.22, 0.98, 1],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-20%] left-[10%] w-[70vw] h-[70vw] rounded-full blur-[130px] opacity-60 transform-gpu"
                style={{
                    willChange: 'transform',
                    background: 'radial-gradient(circle at center, rgba(99,102,241,0.42), transparent 65%)',
                }}
            />

             {/* Floating Particles (Optional, subtle) */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.04),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.05),transparent_50%)]"></div>
            
            {/* 3. Vignette & Depth Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/10 via-transparent to-[#050505]/80" />
        </div>
    );
};

export default LobbyActiveBackground;
