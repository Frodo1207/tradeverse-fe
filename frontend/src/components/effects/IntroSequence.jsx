import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const IntroSequence = ({ onComplete }) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('launching');

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setStage('counting');
        }, 1500);
        return () => clearTimeout(timer1);
    }, []);

    useEffect(() => {
        if (stage === 'counting') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(onComplete, 500);
                        return 100;
                    }
                    return prev + Math.floor(Math.random() * 5) + 1;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [stage, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center font-mono text-white overflow-hidden">
            <div className="relative z-10 text-center">
                {stage === 'launching' && (
                    <div className="animate-pulse-fast">
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase glitch-effect">
                            {t('intro.gameOn')}
                        </h1>
                        <div className="mt-4 text-xs tracking-[1em] opacity-50">{t('intro.connecting')}</div>
                    </div>
                )}

                {stage === 'counting' && (
                    <div>
                        <div className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none font-variant-numeric tabular-nums">
                            {progress}%
                        </div>
                        <div className="flex justify-between items-center w-full px-2 mt-4">
                            <span className="text-xs text-purple-500">{t('intro.loadingAssets')}</span>
                            <div className="h-1 flex-1 mx-4 bg-gray-800 overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">V.1.0</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntroSequence;
