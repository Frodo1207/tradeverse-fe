import React, { useState } from 'react';
import {
    Zap, Crosshair, ArrowRight, Gamepad2, Trophy, Layers, TrendingUp,
    ChevronDown, Globe, Shield, Cpu, Users, Activity, Github, Twitter, Disc, Plus, Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NebulaFogBackground from '../components/effects/NebulaFogBackground';
import HorizontalScrollSection from '../components/ui/HorizontalScrollSection';
import ScrollReveal from '../components/ui/ScrollReveal';
import TypewriterText from '../components/ui/TypewriterText';
import LiveEarningsFeed from '../components/ui/LiveEarningsFeed';

import i18n from '../i18n';

const HomeView = ({ onCategorySelect }) => {
    const { t } = useTranslation();
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const partners = ["ETHEREUM", "POLYGON", "SOLANA", "CHAINLINK", "THE GRAPH", "IPFS", "ARBITRUM", "OPTIMISM"];

    const features = [
        { title: t('home.modes.singlePlayer.title'), icon: <Gamepad2 size={32} />, desc: t('home.modes.singlePlayer.desc'), color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
        { title: t('home.modes.competitive.title'), icon: <Trophy size={32} />, desc: t('home.modes.competitive.desc'), color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
        { title: t('home.modes.cardGames.title'), icon: <Layers size={32} />, desc: t('home.modes.cardGames.desc'), color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { title: t('home.modes.prediction.title'), icon: <TrendingUp size={32} />, desc: t('home.modes.prediction.desc'), color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
    ];

    const faqs = [
        { q: t('home.faq.q1.q'), a: t('home.faq.q1.a') },
        { q: t('home.faq.q2.q'), a: t('home.faq.q2.a') },
        { q: t('home.faq.q3.q'), a: t('home.faq.q3.a') },
        { q: t('home.faq.q4.q'), a: t('home.faq.q4.a') }
    ];

    const ecosystemPrefix = t('home.ecosystem.titlePrefix');

    return (
        <div className="relative w-full bg-[#050505]">
            {/* Subtle Grid Background for the whole page */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex flex-col justify-center w-full pt-20 overflow-hidden">
                {/* Nebula Background - Restricted to Hero */}
                <NebulaFogBackground intensity={1.0} className="absolute inset-0 z-[-1]" />

                <div className="container mx-auto px-6 max-w-7xl w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ width: "100%" }}
                    >
                        <div className="mb-6 text-sm md:text-base font-mono text-[#8B5CF6] tracking-[0.3em] uppercase flex items-center gap-3 font-bold">
                            <span className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-full animate-pulse"></span>
                            {t('home.hero.tagline')}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ width: "100%" }}
                    >
                        <h1 className={`text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-10 uppercase ${i18n.language === 'zh' ? 'font-sans tracking-tight' : 'font-mono'} break-words`}>
                            {t('home.hero.headingPrefix')}<br />
                            <TypewriterText
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-[#8B5CF6] animate-gradient-x block"
                                phrases={[
                                    t('home.hero.phrases.ownItAll'),
                                    t('home.hero.phrases.earnLegacy'),
                                    t('home.hero.phrases.defyReality'),
                                    t('home.hero.phrases.ruleTheVerse')
                                ]}
                            />
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{ width: "100%" }}
                    >
                        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 md:gap-12 p-6 md:p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl hover:border-[#8B5CF6]/50 transition-colors duration-500 group">
                            <div className="max-w-2xl">
                                <p className="text-lg md:text-2xl text-gray-200 leading-relaxed mb-6 font-light">
                                    {t('home.hero.description')}
                                </p>
                                <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm font-mono text-gray-400">
                                    <span className="flex items-center gap-2 group-hover:text-white transition-colors"><Zap size={16} className="text-[#8B5CF6]" /> {t('home.hero.highlights.zeroGasFees')}</span>
                                    <span className="flex items-center gap-2 group-hover:text-white transition-colors"><Crosshair size={16} className="text-[#8B5CF6]" /> {t('home.hero.highlights.crossChain')}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <button
                                    onClick={() => onCategorySelect('Lobby')}
                                    className="bg-[#8B5CF6] text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold hover:bg-white hover:text-[#8B5CF6] transition-all flex items-center justify-center gap-3 group/btn shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] w-full sm:w-auto"
                                >
                                    {t('home.hero.cta.startPlaying')}
                                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
                                </button>
                                <button className="border border-white/30 hover:border-white text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-medium transition-all hover:bg-white/5 flex items-center justify-center w-full sm:w-auto">
                                    {t('home.hero.cta.exploreMarket')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500 flex flex-col items-center gap-2">
                    <span className="text-xs font-mono tracking-widest uppercase">{t('home.hero.scroll')}</span>
                    <ChevronDown size={20} />
                </div>
            </section>

            {/* Live Earnings Feed */}
            <section className="relative z-10 bg-black/40">
                <LiveEarningsFeed />
            </section>

            {/* Partners Ticker */}
            <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden">
                <div className="flex gap-16 animate-infinite-scroll whitespace-nowrap">
                    {[...partners, ...partners, ...partners, ...partners].map((p, i) => (
                        <span key={i} className="text-2xl font-black text-white/20 font-mono select-none">{p}</span>
                    ))}
                </div>
            </section>

            {/* Horizontal Scroll Features Section */}
            <HorizontalScrollSection features={features} onCategorySelect={() => onCategorySelect('Lobby')} />

            {/* Bento Grid Ecosystem */}
            <section className="py-32 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 text-center">
                        {ecosystemPrefix ? `${ecosystemPrefix} ` : null}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">{t('home.ecosystem.titleHighlight')}</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Large Stat Card */}
                        <ScrollReveal className="md:col-span-2" width="100%">
                            <div className="bg-black/40 border border-white/10 p-10 rounded-3xl flex flex-col justify-between min-h-[300px] group hover:border-white/30 transition-colors h-full">
                                <div>
                                    <h3 className="text-gray-400 font-mono mb-2 flex items-center gap-2"><Users size={16} /> {t('home.ecosystem.totalPlayers')}</h3>
                                    <div className="text-6xl md:text-8xl font-black text-white mb-4">2.4M+</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[75%] bg-[#8B5CF6] animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Feature Card 1 */}
                        <ScrollReveal delay={0.2} width="100%">
                            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center hover:bg-white/5 transition-colors group h-full">
                                <div className="p-4 bg-yellow-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                    <Zap size={40} className="text-yellow-400" />
                                </div>
                                <h4 className="text-2xl font-bold mb-2">{t('home.ecosystem.zeroGas.title')}</h4>
                                <p className="text-gray-400 text-sm">{t('home.ecosystem.zeroGas.desc')}</p>
                            </div>
                        </ScrollReveal>

                        {/* Feature Card 2 */}
                        <ScrollReveal delay={0.3} width="100%">
                            <div className="bg-black/40 border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center hover:bg-white/5 transition-colors group h-full">
                                <div className="p-4 bg-blue-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                    <Globe size={40} className="text-blue-400" />
                                </div>
                                <h4 className="text-2xl font-bold mb-2">{t('home.ecosystem.globalServers.title')}</h4>
                                <p className="text-gray-400 text-sm">{t('home.ecosystem.globalServers.desc')}</p>
                            </div>
                        </ScrollReveal>

                        {/* Wide Feature Card */}
                        <ScrollReveal className="md:col-span-2" delay={0.4} width="100%">
                            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 p-10 rounded-3xl flex items-center justify-between group hover:border-white/30 transition-colors h-full">
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">{t('home.ecosystem.crossChainReady.title')}</h3>
                                    <p className="text-gray-400 max-w-md">{t('home.ecosystem.crossChainReady.desc')}</p>
                                </div>
                                <Activity size={64} className="text-purple-400 opacity-50 group-hover:scale-110 transition-transform" />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 container mx-auto px-6 max-w-4xl">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center">{t('home.faq.title')}</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-white/10 rounded-2xl bg-black/20 overflow-hidden">
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-bold text-lg">{faq.q}</span>
                                {openFaq === i ? <Minus size={20} className="text-[#8B5CF6]" /> : <Plus size={20} className="text-gray-500" />}
                            </button>
                            <div className={`px-6 text-gray-400 leading-relaxed transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                {faq.a}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/10 bg-black/80">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center">
                            <Gamepad2 className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold font-mono">NEXUS<span className="text-[#8B5CF6]">.GG</span></span>
                    </div>

                    <div className="flex gap-8 text-gray-400 text-sm font-bold uppercase tracking-wider">
                        <a href="#" className="hover:text-white transition-colors">{t('home.footer.privacy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('home.footer.terms')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('home.footer.contact')}</a>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Github size={20} /></a>
                        <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Disc size={20} /></a>
                    </div>
                </div>
                <div className="text-center text-gray-600 text-xs mt-12 font-mono">
                    {t('home.footer.copyright')}
                </div>
            </footer>
        </div>
    );
};

export default HomeView;
