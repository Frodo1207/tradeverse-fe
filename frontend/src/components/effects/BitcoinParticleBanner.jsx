import React, { useEffect, useRef } from 'react';

const BitcoinParticleBanner = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let targetPoints = [];

        // Configuration
        const particleColor = '#FFD700'; // Gold
        const particleSize = 2;
        const mouseRadius = 80;
        const friction = 0.95;
        const ease = 0.15;

        let mouse = { x: null, y: null };

        // Handle Mouse Move
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        // Initialize Canvas & Points
        const init = () => {
            if (!containerRef.current) return;

            canvas.width = containerRef.current.offsetWidth;
            canvas.height = containerRef.current.offsetHeight;

            // 1. Create off-screen canvas to sample text points
            const textCanvas = document.createElement('canvas');
            textCanvas.width = canvas.width;
            textCanvas.height = canvas.height;
            const tCtx = textCanvas.getContext('2d');

            // 2. Draw "₿" symbol
            const fontSize = Math.min(canvas.width, canvas.height) * 0.8; // Increased size slightly
            tCtx.font = `900 ${fontSize}px "Arial", sans-serif`;
            tCtx.fillStyle = 'white';
            tCtx.textAlign = 'center';
            tCtx.textBaseline = 'middle';

            // Position on the right side (75% width)
            // On mobile (small width), keep it centered or adjust
            const xPos = canvas.width > 768 ? canvas.width * 0.75 : canvas.width / 2;
            tCtx.fillText('₿', xPos, canvas.height / 2);

            // 3. Scan pixels to create target points
            targetPoints = [];
            const imageData = tCtx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const gap = 6; // Density of particles (lower = more particles)

            for (let y = 0; y < canvas.height; y += gap) {
                for (let x = 0; x < canvas.width; x += gap) {
                    const index = (y * canvas.width + x) * 4;
                    const alpha = data[index + 3];

                    if (alpha > 128) {
                        targetPoints.push({ x, y });
                    }
                }
            }

            // 4. Initialize Particles
            particles = targetPoints.map(point => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                originX: point.x,
                originY: point.y,
                vx: 0,
                vy: 0,
                size: Math.random() * 2 + 1,
                color: `hsl(${40 + Math.random() * 15}, 100%, ${50 + Math.random() * 30}%)` // Golden hues
            }));
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optional: Draw faint connection lines or glow
            // ctx.globalCompositeOperation = 'lighter';

            particles.forEach(p => {
                // Physics: Move towards origin
                const dx = p.originX - p.x;
                const dy = p.originY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = distance * 0.01;
                const angle = Math.atan2(dy, dx);

                // Attraction to target
                p.vx += Math.cos(angle) * force;
                p.vy += Math.sin(angle) * force;

                // Mouse Repulsion
                if (mouse.x !== null) {
                    const mDx = mouse.x - p.x;
                    const mDy = mouse.y - p.y;
                    const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

                    if (mDist < mouseRadius) {
                        const mAngle = Math.atan2(mDy, mDx);
                        const mForce = (mouseRadius - mDist) / mouseRadius;
                        p.vx -= Math.cos(mAngle) * mForce * 5;
                        p.vy -= Math.sin(mAngle) * mForce * 5;
                    }
                }

                // Apply friction
                p.vx *= friction;
                p.vy *= friction;

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Draw Particle
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        window.addEventListener('resize', init);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', init);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[350px] bg-[#0a0a0a] overflow-hidden rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)] mb-12 group">

            {/* 1. Base Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

            {/* 2. Rich Golden Ambient Glow (Top Right Source) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_0%,rgba(234,179,8,0.15),transparent_70%)]"></div>

            {/* 3. Deep Warm Undertone (Bottom Left) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_100%,rgba(120,53,15,0.1),transparent_60%)]"></div>

            {/* 4. Vignette for Focus */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#000000_100%)] opacity-60"></div>

            {/* Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-10 cursor-pointer opacity-90 mix-blend-screen" />

            {/* Overlay Content */}
            <div className="absolute inset-0 z-20 flex items-center pointer-events-none px-8 md:px-16 py-8">
                <div className="max-w-2xl">
                    {/* Top Tag */}
                    <div className="mb-4 px-4 py-1.5 bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-full inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-yellow-400 font-mono text-xs font-bold tracking-widest uppercase">Daily Ranking System</span>
                    </div>

                    {/* Main Slogan */}
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-yellow-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)] tracking-tighter leading-none mb-3 text-left">
                        RISE TO<br />GLORY
                    </h2>

                    {/* Sub Slogan */}
                    <p className="text-gray-400 text-sm md:text-base font-light tracking-widest uppercase text-left mb-6">
                        Compete for the ultimate <span className="text-yellow-400 font-bold">Crypto Fortune</span>
                    </p>

                    {/* Stats / Info Row */}
                    <div className="flex items-center gap-8 border-t border-white/10 pt-4">
                        <div>
                            <div className="text-xl font-bold text-white">$1.2M+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Distributed Today</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div>
                            <div className="text-xl font-bold text-white">50k+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Active Legends</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div>
                            <div className="text-xl font-bold text-yellow-400">24h</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Cycle Reset</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-yellow-500/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-yellow-500/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-yellow-500/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-yellow-500/30 rounded-br-3xl"></div>
        </div>
    );
};

export default BitcoinParticleBanner;
