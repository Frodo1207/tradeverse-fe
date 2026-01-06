import React, { Suspense, useEffect, useState } from 'react';
import { X, Maximize2, Minimize2, RefreshCw, Loader2, Coins } from 'lucide-react';
import { getGameConfig } from './GameRegistry';
import { gameService } from '../../services/api';
import { useWallet } from '../../contexts/WalletContext';
import { useTransactionModal } from '../../contexts/TransactionModalContext';
import InsufficientBalanceModal from '../ui/InsufficientBalanceModal';

// 适配器：React 组件游戏
const ReactGameAdapter = ({ component: Component, ...props }) => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading Game Assets...</div>}>
            <Component {...props} />
        </Suspense>
    );
};

// ... (IframeGameAdapter remains same)

const GameContainer = ({ gameId, onClose, onBalanceUpdate, initialConfig }) => {
    const { refreshBalance } = useWallet();
    const { openModal } = useTransactionModal();
    const [config, setConfig] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    const [error, setError] = useState(null);
    const [reward, setReward] = useState(null);
    const [checking, setChecking] = useState(false);
    const [needDeposit, setNeedDeposit] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [showBalanceModal, setShowBalanceModal] = useState(false);

    useEffect(() => {
        const base = getGameConfig(gameId);
        if (!base) {
            console.error(`Game ${gameId} not found in registry`);
            return;
        }
        // Prefer registry base to override initialConfig when fixed properties are required
        const merged = initialConfig ? { ...initialConfig, ...base } : base;
        setConfig(merged);
        setSelectedCurrency(
            merged.currency || (Array.isArray(merged.supportedCurrencies) ? merged.supportedCurrencies[0] : 'USDT')
        );
    }, [gameId, initialConfig]);

    const effectiveConfig = config || { ticketPrice: 1.0, currency: 'USDT', supportedCurrencies: ['USDT'], bets: {} };

    const getLimitsForCurrency = (currency) => {
        const defaultMin = config?.ticketPrice || 1.0;
        const defaultMax = config?.ticketPrice || 1.0;
        const bets = config?.bets || {};
        if (bets && bets[currency]) {
            const b = bets[currency];
            return { min: b.Min ?? b.min ?? defaultMin, max: b.Max ?? b.max ?? defaultMax };
        }
        return { min: defaultMin, max: config?.maxBet || defaultMax };
    };

    const handleLaunch = async () => {
        if (isLaunching) return;
        setIsLaunching(true);
        setError(null);

        try {
            // 1. Start session if not started
            let currentSessionId = sessionData?.sessionId;
            if (!currentSessionId) {
                const start = await gameService.startSession({ gameId });
                if (!start.sessionId) throw new Error('Failed to start session');
                currentSessionId = start.sessionId;
            }

            // 2. Purchase ticket (debit)
            const { min, max } = getLimitsForCurrency(selectedCurrency || 'USDT');
            const amountNum = betAmount ? parseFloat(betAmount) : (effectiveConfig.ticketPrice || 1.0);
            if (isNaN(amountNum) || amountNum <= 0 || amountNum < min || amountNum > max) {
                throw new Error(`Invalid bet amount. Range: ${min} - ${max}`);
            }

            const ticket = await gameService.purchaseTicket({
                sessionId: currentSessionId,
                betAmount: amountNum,
                currency: selectedCurrency || effectiveConfig.currency || 'USDT'
            });

            if (!ticket.ticketToken) throw new Error('Failed to purchase ticket');

            setSessionData({
                sessionId: currentSessionId,
                ticketToken: ticket.ticketToken,
                betAmount: amountNum,
                currency: selectedCurrency || effectiveConfig.currency || 'USDT'
            });

            setIsGameStarted(true);
            refreshBalance();
        } catch (err) {
            const code = err?.response?.data?.error || '';
            const msg = err?.response?.data?.message || err.message || '';
            const status = err?.response?.status;
            const url = err?.config?.url || '';
            console.error('Launch failed:', code || msg, err);
            const insufficient = String(code).toLowerCase().includes('insufficient') || String(msg).toLowerCase().includes('insufficient');
            const purchaseRoute = url.includes('/game/purchase-ticket');

            if (purchaseRoute || insufficient || status === 400) {
                setShowBalanceModal(true);
                setIsGameStarted(false);
                setError(null);
            } else {
                setError(msg || 'Failed to start game. Please try again.');
                setNeedDeposit(false);
            }
        } finally {
            setIsLaunching(false);
        }
    };

    const handleReplay = () => {
        setIsGameStarted(false);
        setSessionData(null);
        setReward(null);
        setError(null);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const handleFinished = async () => {
        if (!sessionData?.sessionId) return;
        setChecking(true);
        try {
            const status = await gameService.rewardStatus({ sessionId: sessionData.sessionId });
            setReward(status);
            refreshBalance();
        } catch (e) {
            setReward(null);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${isFullscreen ? 'p-0' : 'p-4 md:p-8'} overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#0f0518] to-black bg-[length:400%_400%] animate-gradient-slow`}>
            {/* Game Header / Toolbar */}
            <div className="relative z-10 flex justify-between items-center mb-4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                <div className="text-white font-bold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isGameStarted ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                    {isGameStarted ? 'Playing:' : 'Ready to Launch:'} <span className="text-[#ED4E33]">{gameId.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Game Viewport */}
            <div className="flex-1 relative z-10 bg-black/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                {!isGameStarted ? (
                    <div className="relative z-10 text-center flex flex-col items-center animate-fade-in p-8">
                        <div className="w-24 h-24 bg-[#ED4E33]/20 rounded-full flex items-center justify-center mb-6 border border-[#ED4E33]/50 shadow-[0_0_30px_rgba(237,78,51,0.3)]">
                            <RefreshCw size={40} className={`text-[#ED4E33] ${isLaunching ? 'animate-spin' : ''}`} />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                            {gameId}
                        </h2>
                        <div className="text-gray-400 mb-6 max-w-md">
                            <div className="mb-2">
                                Ticket Price: <span className="text-white font-bold">{effectiveConfig.ticketPrice || 1.0} {selectedCurrency || effectiveConfig.currency || 'USDT'}</span>
                            </div>
                            {Array.isArray(effectiveConfig.supportedCurrencies) && effectiveConfig.supportedCurrencies.length > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="uppercase tracking-wider text-gray-500">Currency</span>
                                    <select
                                        value={selectedCurrency || ''}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        disabled={effectiveConfig.fixedCurrency}
                                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-white/30"
                                    >
                                        {effectiveConfig.supportedCurrencies.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="mt-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bet Amount</label>
                                {effectiveConfig.fixedBet ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-mono text-sm">{(effectiveConfig.ticketPrice || 2.0).toFixed(2)} {selectedCurrency || effectiveConfig.currency || 'USDT'}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={betAmount}
                                            onChange={(e) => setBetAmount(e.target.value)}
                                            placeholder={`${getLimitsForCurrency(selectedCurrency || 'USDT').min} - ${getLimitsForCurrency(selectedCurrency || 'USDT').max}`}
                                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-white/30 w-40"
                                        />
                                        <span className="text-white font-mono text-sm">{selectedCurrency || 'USDT'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleLaunch}
                            disabled={isLaunching}
                            className="bg-[#ED4E33] hover:bg-[#d93d24] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg hover:shadow-[#ED4E33]/50 flex items-center gap-3"
                        >
                            {isLaunching ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Coins size={20} /> Pay & Launch
                                </>
                            )}
                        </button>
                        <div className="mt-8 flex gap-4 text-xs text-gray-600 font-mono">
                            <span>SECURE PAYMENT</span>
                            <span>•</span>
                            <span>INSTANT ACCESS</span>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 w-full h-full">
                        {config.type === 'react' && (
                            <ReactGameAdapter
                                component={config.component}
                                onBalanceUpdate={onBalanceUpdate}
                                gameId={gameId}
                                sessionData={sessionData}
                                onReplay={handleReplay}
                                onFinished={handleFinished}
                            />
                        )}

                        {config.type === 'iframe' && (
                            <IframeGameAdapter
                                url={config.url}
                                aspectRatio={config.aspectRatio}
                                onBalanceUpdate={onBalanceUpdate}
                                sessionData={sessionData}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Footer / Controls Hint */}
            <div className="mt-4 text-center text-xs text-gray-600 font-mono">
                POWERED BY NEXUS.GG ENGINE • SECURE CONNECTION
            </div>
            {isGameStarted && (
                <div className="mt-2 text-center">
                    <button onClick={handleFinished} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded">
                        {checking ? 'Checking...' : 'Check Reward Status'}
                    </button>
                    {reward && (
                        <div className="mt-2 text-xs text-gray-300">
                            <span className="font-mono">{reward.status}</span>
                            {(() => {
                                try {
                                    const metaStr = reward.metadata;
                                    let rc = reward.currency;
                                    if (metaStr) {
                                        const m = JSON.parse(metaStr);
                                        if (m && typeof m.rewardCurrency === 'string' && m.rewardCurrency.length > 0) {
                                            rc = m.rewardCurrency;
                                        }
                                    }
                                    if (reward.payout !== undefined) {
                                        const amt = Number(reward.payout || 0);
                                        const dec = rc === 'USDT' ? 2 : rc === 'PEPE' ? 0 : 8;
                                        if (amt > 0) {
                                            return (
                                                <span className="ml-2 font-bold text-green-400">+{amt.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })} {rc}</span>
                                            );
                                        }
                                    }
                                } catch (_) {}
                                return null;
                            })()}
                        </div>
                    )}
                </div>
            )}
            {!isGameStarted && needDeposit && (
                <div className="mt-2 text-center">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded text-xs">
                        Insufficient balance. Please deposit to continue.
                        <button onClick={() => setShowBalanceModal(true)} className="ml-2 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded">
                            Deposit
                        </button>
                    </div>
                </div>
            )}

            <InsufficientBalanceModal
                isOpen={showBalanceModal}
                onClose={() => setShowBalanceModal(false)}
                onDeposit={() => openModal('deposit')}
            />
        </div>
    );
};

export default GameContainer;
