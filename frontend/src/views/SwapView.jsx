import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Settings, History, Wallet, ChevronDown, Info } from 'lucide-react';
import { swapService } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import WalletConnectButton from '../components/ui/WalletConnectButton';

const SwapView = () => {
    const [activeTab, setActiveTab] = useState('Exchange');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USDT');
    const [toCurrency, setToCurrency] = useState('SOL');
    const [quote, setQuote] = useState(null);
    const [quoting, setQuoting] = useState(false);
    const [executing, setExecuting] = useState(false);
    const { user, assets, refreshBalance } = useUser();
    const { success, error } = useToast();

    const tabs = ['Exchange', 'Liquidity', 'Bridge'];

    const MotionDiv = motion.div;
    const MotionH1 = motion.h1;
    const MotionP = motion.p;

    const toNumber = (v) => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') return parseFloat(v);
        if (v && typeof v === 'object') {
            if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
            if (typeof v.decimal === 'string') return parseFloat(v.decimal);
        }
        return 0;
    };

    const currencies = useMemo(() => {
        const list = Array.isArray(assets) ? assets.map(a => a.currency).filter(Boolean) : [];
        const base = ['USDT', 'SOL', 'DOGE'];
        const set = new Set([...list, ...base]);
        return Array.from(set);
    }, [assets]);

    useEffect(() => {
        const amt = parseFloat(fromAmount);
        if (!user || !fromCurrency || !toCurrency) return;
        if (fromCurrency === toCurrency) return;
        if (!(amt > 0)) { setQuote(null); setToAmount(''); return; }
        let mounted = true;
        setQuoting(true);
        swapService.quote(fromCurrency, toCurrency, amt)
            .then((resp) => {
                const q = resp?.data || resp;
                if (!mounted) return;
                setQuote(q);
                const toAfter = toNumber(q?.toAfterFee);
                setToAmount(toAfter ? String(toAfter) : '');
            })
            .catch(() => {
                if (!mounted) return;
                setQuote(null);
                setToAmount('');
            })
            .finally(() => { if (mounted) setQuoting(false); });
        return () => { mounted = false; };
    }, [user, fromCurrency, toCurrency, fromAmount]);

    const getBalance = (cur) => {
        if (!Array.isArray(assets)) return 0;
        const a = assets.find(x => x.currency === cur);
        return a ? toNumber(a.balance) : 0;
    };

    const switchPair = () => {
        const fc = fromCurrency;
        const tc = toCurrency;
        setFromCurrency(tc);
        setToCurrency(fc);
        setFromAmount(toAmount ? String(toAmount) : '');
        setToAmount('');
    };

    const onExecute = async () => {
        try {
            const amt = parseFloat(fromAmount);
            if (!(amt > 0)) return;
            if (!quote) return;
            setExecuting(true);
            const minRecv = toNumber(quote?.minimumReceived) || 0;
            const resp = await swapService.execute(fromCurrency, toCurrency, amt, minRecv);
            if (resp?.success) {
                const received = toNumber(resp?.data?.receivedAmount);
                setToAmount(received ? String(received) : toAmount);
                success(`兑换成功：${fromCurrency} → ${toCurrency}`);
                await refreshBalance();
                setQuote(null);
                setFromAmount('');
            } else {
                const msg = resp?.error || 'Swap failed';
                error(msg);
            }
        } catch (e) {
            error(e?.response?.data?.error || e.message || 'Swap failed');
        } finally {
            setExecuting(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-[#050505] flex items-center justify-center pt-20 pb-10">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Purple Wave/Gradient */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Grid Pattern */}
                {/* Wave Pattern */}
                <div className="absolute inset-0 opacity-60">
                    <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
                                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
                                <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                            </linearGradient>
                        </defs>
                        {/* Primary Waves - Smooth Flowing */}
                        <path d="M0,450 C400,350 600,550 800,450 S 1200,350 1440,450" stroke="url(#waveGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDuration: '8s' }} />
                        <path d="M0,400 C350,500 550,300 750,400 S 1150,500 1440,400" stroke="url(#waveGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                        <path d="M0,500 C450,400 650,600 850,500 S 1250,400 1440,500" stroke="url(#waveGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
                        <path d="M0,350 C300,450 500,250 700,350 S 1100,450 1440,350" stroke="url(#waveGradient)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{ animationDuration: '9s', animationDelay: '0.5s' }} />

                        {/* Additional Waves for Density - Smoothed */}
                        <path d="M0,300 C400,400 600,200 800,300 S 1200,400 1440,300" stroke="url(#waveGradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s', opacity: 0.7 }} />
                        <path d="M0,550 C350,450 550,650 750,550 S 1150,450 1440,550" stroke="url(#waveGradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDuration: '13s', animationDelay: '1.5s', opacity: 0.7 }} />
                        <path d="M0,380 C420,280 620,480 820,380 S 1220,280 1440,380" stroke="url(#waveGradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDuration: '14s', animationDelay: '0.2s', opacity: 0.6 }} />
                        <path d="M0,480 C380,580 580,380 780,480 S 1180,580 1440,480" stroke="url(#waveGradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDuration: '15s', animationDelay: '2.5s', opacity: 0.6 }} />

                        {/* Secondary Thinner Waves (White/Static) - Smoothed */}
                        <path d="M0,420 C410,320 610,520 810,420 S 1210,320 1440,420" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                        <path d="M0,480 C390,580 590,380 790,480 S 1190,580 1440,480" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                        <path d="M0,320 C430,420 630,220 830,320 S 1230,420 1440,320" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
                        <path d="M0,580 C370,480 570,680 770,580 S 1170,480 1440,580" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
                        <path d="M0,390 C440,290 640,490 840,390 S 1240,290 1440,390" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Floating Coins (Decorative) */}
            <MotionDiv
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-[15%] hidden lg:block"
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center border-2 border-white/20">
                    <span className="text-2xl font-bold text-white">₿</span>
                </div>
            </MotionDiv>

            <MotionDiv
                animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/3 right-[15%] hidden lg:block"
            >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center border-2 border-white/20">
                    <span className="text-xl font-bold text-white">Ξ</span>
                </div>
            </MotionDiv>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md px-4">

                {/* Header Text */}
                <div className="text-center mb-8">
                    <MotionH1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tighter text-white mb-2"
                    >
                        SHIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SWAP</span>
                    </MotionH1>
                    <MotionP
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm font-mono"
                    >
                        Trade tokens in an instant
                    </MotionP>
                </div>

                {/* Swap Card */}
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden"
                >
                    {/* Glow Effect on Card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-8 bg-black/40 p-1 rounded-xl w-fit mx-auto border border-white/5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Settings Row */}
                    <div className="flex justify-between items-center mb-4 px-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Swap</span>
                        <div className="flex gap-3">
                            <button className="text-gray-400 hover:text-white transition-colors"><History size={18} /></button>
                            <button className="text-gray-400 hover:text-white transition-colors"><Settings size={18} /></button>
                        </div>
                    </div>

                    {/* From Input */}
                    <div className="bg-[#111] rounded-2xl p-4 mb-2 border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-xs font-medium">From</span>
                            <span className="text-gray-400 text-xs font-medium">Balance: {getBalance(fromCurrency).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <input
                                type="number"
                                placeholder="0.0"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                className="bg-transparent text-3xl font-bold text-white placeholder-gray-600 outline-none w-full"
                            />
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="flex items-center gap-2 bg-[#222] hover:bg-[#333] transition-colors px-3 py-2 rounded-full border border-white/10 shrink-0 text-white font-bold text-sm"
                            >
                                {currencies.map(c => (
                                    <option key={`from-${c}`} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Swap Arrow */}
                    <div className="flex justify-center -my-3 relative z-10">
                        <button onClick={switchPair} className="bg-[#1a1a1a] border-4 border-[#0a0a0a] rounded-xl p-2 text-purple-400 hover:text-white hover:bg-purple-600 transition-all shadow-lg hover:scale-110 active:scale-95">
                            <ArrowDownUp size={20} />
                        </button>
                    </div>

                    {/* To Input */}
                    <div className="bg-[#111] rounded-2xl p-4 mt-2 mb-6 border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-xs font-medium">To</span>
                            <span className="text-gray-400 text-xs font-medium">Balance: {getBalance(toCurrency).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <input
                                type="number"
                                placeholder="0.0"
                                value={toAmount}
                                onChange={(e) => setToAmount(e.target.value)}
                                className="bg-transparent text-3xl font-bold text-white placeholder-gray-600 outline-none w-full"
                            />
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 transition-colors px-3 py-2 rounded-full border border-white/10 shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.3)] text-white font-bold text-sm"
                            >
                                {currencies.map(c => (
                                    <option key={`to-${c}`} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex justify-between items-center px-2 mb-6 text-xs font-mono text-gray-500">
                        <span className="flex items-center gap-1">Price <Info size={12} /></span>
                        <span>
                            {quote ? `1 ${fromCurrency} = ${toNumber(quote?.price).toFixed(8)} ${toCurrency}` : '—'}
                        </span>
                    </div>

                    {/* Action Button */}
                    {!user ? (
                        <div className="w-full flex justify-center">
                            <WalletConnectButton onNavigate={() => {}} />
                        </div>
                    ) : (
                        <button
                            disabled={executing || quoting || !quote || fromCurrency === toCurrency || !(parseFloat(fromAmount) > 0)}
                            onClick={onExecute}
                            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-2xl text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${executing || quoting || !quote ? 'opacity-60 cursor-not-allowed' : 'hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]'}`}
                        >
                            {executing ? 'Swapping...' : (quoting ? 'Quoting...' : 'Swap')}
                        </button>
                    )}

                </MotionDiv>

                {/* Bottom Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                            <span className="font-bold">S</span>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold">SHIA Price</div>
                            <div className="text-white font-mono font-bold">$0.000045</div>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <span className="font-bold">#</span>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold">Block</div>
                            <div className="text-white font-mono font-bold">17926508</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SwapView;
