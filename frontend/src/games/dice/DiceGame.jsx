import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, History, Zap, Trophy, TrendingUp, Star } from 'lucide-react';
import { gameService } from '../../services/api';
import { useWallet } from '../../contexts/WalletContext';
import { useTransactionModal } from '../../contexts/TransactionModalContext';
import InsufficientBalanceModal from '../../components/ui/InsufficientBalanceModal';
import Dice3D from './Dice3D';

const DiceGame = ({ sessionData, onReplay, onFinished }) => {
    const { balance, refreshBalance } = useWallet();
    const { openModal } = useTransactionModal();
    const [showBalanceModal, setShowBalanceModal] = useState(false);

    // Game State
    const [betAmount, setBetAmount] = useState(sessionData ? sessionData.betAmount : 1.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null); // { rolled, profit, win, multiplier }
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Handlers
    const handlePlay = async () => {
        if (isPlaying || gameFinished) return;

        if (!sessionData && betAmount > balance) {
            setShowBalanceModal(true);
            return;
        }

        setError(null);
        setIsPlaying(true);
        setRolling(true);
        setShowResult(false);
        setResult(null);

        try {
            if (!sessionData || !sessionData.sessionId) {
                throw new Error('Session not initialized');
            }
            const currentSessionId = sessionData.sessionId;

            // Artificial delay for "feeling" if API is too fast, but Dice3D handles min spin time visually if needed
            // Actually, we want the API call to start immediately.
            
            const clientSeed = Math.random().toString(36).substring(7);

            const playResp = await gameService.play({
                sessionId: currentSessionId,
                clientSeed: clientSeed
            });

            const rewards = Array.isArray(playResp?.rewards) ? playResp.rewards : (Array.isArray(playResp?.details?.rewards) ? playResp.details.rewards : []);
            const payoutNum = typeof playResp.payout === 'number' ? playResp.payout : parseFloat(playResp.payout || 0);
            const winFlag = (payoutNum > 0) || (rewards.length > 0);
            
            // Wait a minimal amount of time to ensure the user sees the rolling animation start
            await new Promise(r => setTimeout(r, 800));

            const newResult = {
                rolled: playResp.rolled,
                profit: playResp.profit !== undefined ? playResp.profit : (payoutNum - parseFloat(betAmount)),
                win: winFlag,
                payout: payoutNum,
                rewards: rewards
            };
            
            setResult(newResult);
            setRolling(false); // Triggers landing animation

            setHistory(prev => [{
                id: Date.now(),
                rolled: playResp.rolled,
                win: winFlag,
                profit: playResp.profit
            }, ...prev].slice(0, 20));

            refreshBalance();

            try {
                const detail = { sessionId: currentSessionId, rewards, payout: payoutNum };
                window.dispatchEvent(new CustomEvent('reward:new', { detail }));
            } catch {}

            setGameFinished(true);
            if (onFinished) {
                // Don't call onFinished immediately, wait for animation
            }

        } catch (err) {
            console.error(err);
            setRolling(false);
            setIsPlaying(false);
            const errorMsg = err.response?.data?.error || err.message || "Game error";
            if (String(errorMsg).toLowerCase().includes('insufficient')) {
                setShowBalanceModal(true);
            } else {
                setError(errorMsg);
            }
        }
    };

    const onRollComplete = () => {
        setShowResult(true);
        setIsPlaying(false);
        if (onFinished && gameFinished) {
             onFinished();
        }
    };

    const handleReplayClick = async () => {
        if (onReplay) {
            setGameFinished(false);
            setResult(null);
            setShowResult(false);
            await onReplay();
        }
    };

    // Helper to format currency
    const formatAmount = (currency, amount) => {
        const dec = (currency === 'USDT') ? 2 : (currency === 'PEPE' || currency === 'DOGE' || currency === 'SHIB') ? 0 : 8;
        return Number(amount).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 h-full">
            
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Trophy size={20} /></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Win Chance</div>
                        <div className="text-xl font-black text-white">66.6%</div>
                    </div>
                </div>
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><Zap size={20} /></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Max Payout</div>
                        <div className="text-xl font-black text-white">x1000</div>
                    </div>
                </div>
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><TrendingUp size={20} /></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Your Bet</div>
                        <div className="text-xl font-black text-white">{betAmount} USDT</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
                
                {/* LEFT: Game Board */}
                <div className="w-full lg:w-2/3 bg-[#0f0f0f] rounded-3xl border border-white/5 relative overflow-hidden flex flex-col shadow-2xl">
                    {/* Ambient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10 pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    
                    {/* Game Area */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 min-h-[400px]">
                        
                        {/* Dice Container */}
                        <div className="relative">
                            {/* Glow Effect behind Dice */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] transition-all duration-1000 ${
                                rolling ? 'bg-purple-500/20 animate-pulse' : 
                                result?.win ? 'bg-green-500/30' : 
                                'bg-blue-500/10'
                            }`}></div>

                            <Dice3D 
                                rolling={rolling} 
                                value={result?.rolled} 
                                onRollComplete={onRollComplete} 
                            />
                        </div>

                        {/* Result Overlay */}
                        <AnimatePresence>
                            {showResult && result && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="mt-12 text-center"
                                >
                                    <div className={`text-5xl font-black mb-2 filter drop-shadow-lg ${result.win ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500' : 'text-gray-500'}`}>
                                        {result.win ? 'YOU WON!' : 'TRY AGAIN'}
                                    </div>
                                    
                                    {result.win && (
                                        <div className="flex flex-col gap-2 mt-4">
                                            {result.rewards.map((rw, idx) => (
                                                <motion.div 
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-md mx-auto"
                                                >
                                                    <span className="text-2xl">💰</span>
                                                    <span className="text-xl font-bold text-green-400">+{formatAmount(rw.currency, rw.amount)} {rw.currency}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* History Ticker */}
                    <div className="bg-black/40 border-t border-white/5 p-4 overflow-hidden">
                        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                            <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 shrink-0">
                                <History size={14} /> History
                            </div>
                            <div className="h-4 w-[1px] bg-white/10 shrink-0"></div>
                            {history.map((h) => (
                                <div key={h.id} className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border ${
                                    h.win ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/5 text-gray-500'
                                }`}>
                                    {h.rolled}
                                </div>
                            ))}
                            {history.length === 0 && <div className="text-xs text-gray-600 italic">No rolls yet</div>}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Controls */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    
                    {/* Control Panel */}
                    <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 shadow-xl flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap className="text-[#ED4E33]" /> Controls
                            </h3>
                            <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-gray-400">
                                Manual Mode
                            </div>
                        </div>

                        {/* Bet Input */}
                        <div className="mb-8">
                            <label className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-3 block">Bet Amount</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    disabled={!!sessionData}
                                    className={`w-full bg-black/40 border-2 border-white/10 rounded-2xl py-4 px-5 text-xl text-white font-mono font-bold focus:border-[#ED4E33] focus:outline-none transition-all ${sessionData ? 'opacity-50 cursor-not-allowed' : 'group-hover:border-white/20'}`}
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">USDT</div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {['1.0', '2.0', '5.0', '10.0'].map(amt => (
                                    <button 
                                        key={amt}
                                        onClick={() => !sessionData && setBetAmount(amt)}
                                        disabled={!!sessionData}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-400 transition-colors disabled:opacity-50"
                                    >
                                        {amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Play Button */}
                        <div className="mt-auto">
                            {gameFinished ? (
                                <button
                                    onClick={handleReplayClick}
                                    className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest bg-green-500 hover:bg-green-400 text-black shadow-[0_0_30px_rgba(74,222,128,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Play Again
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlay}
                                    disabled={isPlaying || !!error}
                                    className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                        isPlaying 
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-[#ED4E33] to-[#ff6b4a] hover:from-[#ff6b4a] hover:to-[#ED4E33] text-white shadow-[0_0_30px_rgba(237,78,51,0.4)]'
                                    }`}
                                >
                                    {isPlaying ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw className="animate-spin" size={24} /> Rolling...
                                        </div>
                                    ) : 'Roll Dice'}
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-shake">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}
                    </div>

                    {/* Paytable Card */}
                    <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5">
                        <h3 className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-4 flex items-center gap-2">
                            <Star size={14} /> Payout Table
                        </h3>
                        <div className="space-y-2">
                            {[
                                { roll: 1, reward: '0.001 SOL', chance: '16.6%' },
                                { roll: 2, reward: '0.5 USDT', chance: '16.6%' },
                                { roll: 3, reward: 'DOGE + SHIB', chance: '16.6%' },
                                { roll: 4, reward: '1000 PEPE', chance: '16.6%' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-bold text-sm">{item.roll}</div>
                                        <div className="text-sm font-bold text-gray-300">{item.reward}</div>
                                    </div>
                                    <div className="text-xs text-gray-600 font-mono">{item.chance}</div>
                                </div>
                            ))}
                             <div className="flex items-center justify-between p-3 opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center font-bold text-sm text-gray-500">5-6</div>
                                    <div className="text-sm font-bold text-gray-500">No Reward</div>
                                </div>
                                <div className="text-xs text-gray-700 font-mono">33.3%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InsufficientBalanceModal
                isOpen={showBalanceModal}
                onClose={() => setShowBalanceModal(false)}
                onDeposit={() => openModal('deposit')}
            />
        </div >
    );
};


export default DiceGame;
