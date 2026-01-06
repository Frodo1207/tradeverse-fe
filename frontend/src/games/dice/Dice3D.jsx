import React, { useEffect, useState } from 'react';

const Dice3D = ({ rolling, value, onRollComplete }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (rolling) {
            // Spin wildly while rolling
            const interval = setInterval(() => {
                setRotation({
                    x: Math.random() * 360 * 5,
                    y: Math.random() * 360 * 5
                });
            }, 100);
            return () => clearInterval(interval);
        } else if (value) {
            // Land on the correct face
            const spins = 2; 
            const base = 360 * spins;

            let target = { x: 0, y: 0 };
            switch(value) {
                case 1: target = { x: base, y: base }; break;
                case 6: target = { x: base, y: base + 180 }; break;
                case 2: target = { x: base, y: base - 90 }; break;
                case 5: target = { x: base, y: base + 90 }; break;
                case 3: target = { x: base - 90, y: base }; break;
                case 4: target = { x: base + 90, y: base }; break;
                default: target = { x: base, y: base };
            }
            
            // Defer update to avoid synchronous state update warning and ensure smooth transition
            requestAnimationFrame(() => {
                setRotation(target);
            });

            // Trigger completion after animation
            const timer = setTimeout(() => {
                if(onRollComplete) onRollComplete();
            }, 1000); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [rolling, value, onRollComplete]);

    // Styles for the cube faces
    const faceStyle = "absolute w-full h-full bg-white border-2 border-gray-300 rounded-xl flex items-center justify-center shadow-inner backface-hidden";
    // 3rem = 48px for w-24 (96px)
    const translateZ = "48px";

    return (
        <div style={{ perspective: '1000px' }} className="w-32 h-32 flex items-center justify-center">
            <div 
                className="relative w-24 h-24 transition-transform duration-1000 ease-out"
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` 
                }}
            >
                {/* Face 1 (Front) */}
                <div className={faceStyle} style={{ transform: `translateZ(${translateZ})` }}>
                    <div className="w-4 h-4 bg-black rounded-full shadow-sm"></div>
                </div>

                {/* Face 6 (Back) */}
                <div className={faceStyle} style={{ transform: `rotateY(180deg) translateZ(${translateZ})` }}>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                </div>

                {/* Face 2 (Right) */}
                <div className={faceStyle} style={{ transform: `rotateY(90deg) translateZ(${translateZ})` }}>
                    <div className="flex gap-8 -rotate-90">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                </div>

                {/* Face 5 (Left) */}
                <div className={faceStyle} style={{ transform: `rotateY(-90deg) translateZ(${translateZ})` }}>
                    <div className="grid grid-cols-2 gap-8 rotate-90">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                </div>

                {/* Face 3 (Top) */}
                <div className={faceStyle} style={{ transform: `rotateX(90deg) translateZ(${translateZ})` }}>
                    <div className="flex gap-8 transform rotate-45">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>

                {/* Face 4 (Bottom) */}
                <div className={faceStyle} style={{ transform: `rotateX(-90deg) translateZ(${translateZ})` }}>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dice3D;
