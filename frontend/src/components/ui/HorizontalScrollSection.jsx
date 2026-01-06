import React, { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import HexagonBackground from '../effects/HexagonBackground';

const HorizontalScrollSection = ({ features, onCategorySelect }) => {
    const { t } = useTranslation();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-30%"]);

    return (
        <section ref={targetRef} className="relative h-[200vh] bg-[#050505]">
            {/* Sticky Container */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Hexagon Background */}
                <HexagonBackground />

                {/* Content Container */}
                <div className="relative z-10 w-full pl-20">
                    <div className="mb-12 max-w-xl">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                            {t('home.modesSection.titlePrefix')} <span className="text-purple-500">{t('home.modesSection.titleHighlight')}</span>
                        </h2>
                        <p className="text-gray-300 mt-4 text-lg">
                            {t('home.modesSection.description')}
                        </p>
                    </div>

                    <motion.div style={{ x }} className="flex gap-8">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                onClick={() => onCategorySelect(f.title)}
                                className={`
                                    relative h-[450px] w-[500px] shrink-0 overflow-hidden rounded-3xl
                                    border border-white/10 bg-black/40 backdrop-blur-md
                                    cursor-pointer transition-all hover:scale-[1.02] hover:border-purple-500/50 group
                                `}
                            >
                                <div className={`absolute inset-0 opacity-20 ${f.bg}`}></div>
                                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                                    <div>
                                        <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${f.color}`}>
                                            {f.icon}
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 uppercase text-white">{f.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-500 group-hover:gap-4 transition-all">
                                        {t('home.modesSection.playNow')} <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HorizontalScrollSection;
