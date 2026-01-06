import React, { useState, useEffect, useMemo } from 'react';
import {
    User, Wallet, History, Settings, LogOut,
    ArrowUpRight, ArrowDownLeft, CreditCard,
    Gamepad2, Trophy, TrendingUp, Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { userService, walletService, economyService } from '../services/api';
import { gameService } from '../services/api';
import TransactionModal from '../components/ui/TransactionModal';
import EditProfileModal from '../components/ui/EditProfileModal';
import { useToast } from '../contexts/ToastContext';

import { useUser } from '../contexts/UserContext';
import { useTransactionModal } from '../contexts/TransactionModalContext';

const ProfileView = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('history');
    const { user, setUser } = useUser();
    const { openModal } = useTransactionModal();
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editProfileVariant, setEditProfileVariant] = useState('profile');

    const [assets, setAssets] = useState([]);

    const displayAssets = useMemo(() => {
        const toNumber = (v) => {
            if (typeof v === 'number') return v;
            if (typeof v === 'string') return parseFloat(v);
            if (v && typeof v === 'object') {
                if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
                if (typeof v.decimal === 'string') return parseFloat(v.decimal);
            }
            return 0;
        };
        const format = (token, val) => {
            const dec = token === 'USDT' ? 2 : token === 'PEPE' ? 0 : 8;
            return Number(val).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
        };
        const currentAssets = assets || [];
        const mapped = currentAssets.map(a => {
            const amt = toNumber(a.balance);
            return {
                token: a.currency,
                name: a.currency === 'USDT' ? t('profile.assets.usdtName') : a.currency,
                balance: format(a.currency, amt),
                value: `${format(a.currency, amt)} ${a.currency}`,
                change: "+0.0%"
            };
        });
        if (!mapped.find(a => a.token === 'USDT')) {
            mapped.unshift({ token: "USDT", name: t('profile.assets.usdtName'), balance: format('USDT', 0), value: `${format('USDT', 0)} USDT`, change: "+0.0%" });
        }
        return mapped;
    }, [assets, t]);

    const [history, setHistory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [valuation, setValuation] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [filterGame, setFilterGame] = useState('ALL');

    const uniqueGames = useMemo(() => {
        const games = new Set(history.map(item => item.game));
        return ['ALL', ...Array.from(games)];
    }, [history]);

    const filteredHistory = useMemo(() => {
        if (filterGame === 'ALL') return history;
        return history.filter(item => item.game === filterGame);
    }, [history, filterGame]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const balRes = await walletService.getBalance();
                const bal = balRes.data || balRes || [];
                setAssets(Array.isArray(bal) ? bal : (bal.assets || []));
                // Game sessions
                const res = await gameService.userSessions({ limit: 20 });
                const sessions = res.data || [];
                const fmtAmount = (token, val) => {
                    const dec = token === 'USDT' ? 2 : (token === 'PEPE' || token === 'DOGE' || token === 'SHIB') ? 0 : 8;
                    return Number(val).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
                };
                const mappedSessions = sessions.map(sess => {
                    const toNumberSession = (v) => {
                        if (typeof v === 'number') return v;
                        if (typeof v === 'string') return parseFloat(v);
                        if (v && typeof v === 'object') {
                            if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
                            if (typeof v.decimal === 'string') return parseFloat(v.decimal);
                        }
                        return 0;
                    };
                    let details = {};
                    let rewardCurrency = sess.currency;
                    let rewards = [];
                    let p = null;
                    const m = sess.metadata;
                    const pr = sess.proof;
                    if (m && typeof m === 'object') { p = m; }
                    else if (typeof m === 'string' && m.length > 0) { try { p = JSON.parse(m); } catch (e) { void 0 } }
                    if (!p && pr) {
                        if (pr && typeof pr === 'object') { p = pr; }
                        else if (typeof pr === 'string' && pr.length > 0) { try { p = JSON.parse(pr); } catch (e) { void 0 } }
                    }
                    if (p && p.details && typeof p.details === 'object') { details = p.details; }
                    if (p && typeof p.rewardCurrency === 'string' && p.rewardCurrency.length > 0) { rewardCurrency = p.rewardCurrency; }
                    if (details && Array.isArray(details.rewards)) { rewards = details.rewards; }
                    const payoutNum = toNumberSession(sess.payout || 0);
                    const resultType = (sess.result ? String(sess.result).toUpperCase() : (payoutNum > 0 || (rewards && rewards.length > 0) ? 'WIN' : 'LOSS'));
                    const displayCurrency = payoutNum > 0 ? rewardCurrency : sess.currency;
                    let amountParts = [];
                    if (rewards && rewards.length > 0) {
                        amountParts = rewards.map((r) => {
                            const cur = r.currency || '';
                            const amt = typeof r.amount === 'number' ? r.amount : parseFloat(r.amount || 0);
                            return `+${fmtAmount(cur, amt)} ${cur}`;
                        });
                    } else if (payoutNum > 0) {
                        amountParts = [`+${fmtAmount(displayCurrency, payoutNum)} ${displayCurrency}`];
                    } else {
                        amountParts = [];
                    }
                    return {
                        id: sess.sessionId,
                        game: sess.gameId,
                        result: resultType,
                        amount: amountParts,
                        time: new Date(sess.settledAt || sess.createdAt).toLocaleString(),
                        multiplier: '-',
                        details
                    };
                });
                setHistory(mappedSessions);

                // Wallet transactions
                const historyData = await walletService.getHistory();
                const toNumber = (v) => {
                    if (typeof v === 'number') return v;
                    if (typeof v === 'string') return parseFloat(v);
                    if (v && typeof v === 'object') {
                        if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
                        if (typeof v.decimal === 'string') return parseFloat(v.decimal);
                    }
                    return 0;
                };
                const format = (token, val) => {
                    const dec = token === 'USDT' ? 2 : token === 'PEPE' ? 0 : 8;
                    return Number(val).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
                };
                const mappedTxs = historyData.data.map(tx => ({
                    id: tx.id,
                    kind: tx.type,
                    title: tx.type === 'DEPOSIT' ? 'deposit' : tx.type === 'WITHDRAW' ? 'withdraw' : 'other',
                    status: tx.status,
                    description: tx.description || tx.type,
                    amount: `${tx.type === 'WITHDRAW' ? '-' : '+'}${format(tx.currency, toNumber(tx.amount))} ${tx.currency}`,
                    time: new Date(tx.createdAt).toLocaleString()
                }));
                setTransactions(mappedTxs);

                const val = await economyService.getValuation();
                setValuation(val.data || null);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {}
        };
        fetchData();
        const onReward = () => { fetchData(); };
        const onFocus = () => { fetchData(); };
        const onVisibility = () => { if (!document.hidden) fetchData(); };
        window.addEventListener('reward:new', onReward);
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.removeEventListener('reward:new', onReward);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    const { success, error } = useToast();

    const handleUpdateProfile = async (data) => {
        try {
            const updatedUser = await userService.updateProfile(data);
            setUser(updatedUser);
            success(t('profile.toast.updateSuccess'));
        } catch (err) {
            error(t('profile.toast.updateFail'));
            console.error(err);
        }
    };

    const handleEmailBound = async (nextUser) => {
        setUser(nextUser);
        success(t('profile.bindEmailModal.toast.verifySuccess'));
    };

    const openEditProfile = () => {
        setEditProfileVariant('profile');
        setIsEditProfileOpen(true);
    };

    const openBindEmail = () => {
        setEditProfileVariant('bindEmail');
        setIsEditProfileOpen(true);
    };

    return (
        <div className="relative w-full min-h-screen pt-24 pb-12 px-4 md:px-8 overflow-y-auto animate-fade-in max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center overflow-hidden bg-black">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User size={64} className="text-cyan-500" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-black text-white text-xs font-bold px-2 py-1 rounded-full border border-cyan-500">
                        LVL {user?.level || 0}
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl font-black text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                        {user?.username}
                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/50 uppercase tracking-wider">
                            {user?.vipStatus || t('profile.header.vipDefault')}
                        </span>
                    </h1>
                    <p className="text-gray-400 font-mono text-sm mb-4">
                        {t('profile.header.memberSince', { date: user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : t('profile.common.unknown') })}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-4">
                        <div className="text-gray-400 font-mono text-sm">
                            <span className="text-gray-500">{t('profile.email.label')}: </span>
                            <span className="text-white">{user?.email || t('profile.email.unbound')}</span>
                        </div>
                        {!user?.email && (
                            <button
                                onClick={openBindEmail}
                                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-cyan-500/20"
                            >
                                {t('profile.email.bind')}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <button
                            onClick={openEditProfile}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <Settings size={16} /> {t('profile.actions.editProfile')}
                        </button>
                        <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                            <LogOut size={16} /> {t('profile.actions.logout')}
                        </button>
                    </div>
                </div>


            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Wallet */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        {/* Decorative Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-500"></div>

                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                                    <Wallet size={18} />
                                </div>
                                {t('profile.wallet.title')}
                            </h3>
                            <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider">{t('profile.wallet.manage')}</button>
                        </div>

                        {/* Main Balance Card */}
                        <div className="mb-8 relative z-10">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{t('profile.wallet.totalValuation')}</div>
                            <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2">
                                {`$${valuation?.totalUSD ? Number(valuation.totalUSD.decimal || valuation.totalUSD.Decimal || valuation.totalUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
                            <button
                                onClick={() => openModal('deposit')}
                                className="bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm shadow-lg shadow-white/10"
                            >
                                <ArrowDownLeft size={16} /> {t('profile.wallet.deposit')}
                            </button>
                            <button
                                onClick={() => openModal('withdraw')}
                                className="bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm border border-white/5"
                            >
                                <ArrowUpRight size={16} /> {t('profile.wallet.withdraw')}
                            </button>
                        </div>

                        {/* Asset List */}
                        <div className="space-y-2 relative z-10">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">{t('profile.assets.title')}</div>
                            {displayAssets.map((asset, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/5 group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-sm border border-white/10 group-hover/item:border-cyan-500/30 transition-colors">
                                            {asset.token === 'BTC' ? '₿' : asset.token === 'ETH' ? 'Ξ' : asset.token === 'DOGE' ? 'Ð' : asset.token === 'SOL' ? '◎' : '$'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{asset.token}</div>
                                            <div className="text-[10px] text-gray-500 font-mono">{asset.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white text-sm font-mono">{asset.balance}</div>
                                        <div className="text-[10px] text-gray-500">{asset.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: History & Stats */}
                <div className="lg:col-span-2">
                    {/* ... History List ... */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[500px]">
                        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`text-lg font-bold pb-4 -mb-4 transition-colors border-b-2 ${activeTab === 'history' ? 'text-cyan-400 border-cyan-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                            >
                                {t('profile.tabs.gameHistory')}
                            </button>
                            <button
                                onClick={() => setActiveTab('transactions')}
                                className={`text-lg font-bold pb-4 -mb-4 transition-colors border-b-2 ${activeTab === 'transactions' ? 'text-cyan-400 border-cyan-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                            >
                                {t('profile.tabs.transactions')}
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`text-lg font-bold pb-4 -mb-4 transition-colors border-b-2 ${activeTab === 'security' ? 'text-cyan-400 border-cyan-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                            >
                                {t('profile.tabs.security')}
                            </button>
                        </div>

                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {/* Filter Chips */}
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {uniqueGames.map(game => (
                                        <button
                                            key={game}
                                            onClick={() => setFilterGame(game)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filterGame === game
                                                ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {game === 'ALL' ? t('profile.history.filters.allGames') : game}
                                        </button>
                                    ))}
                                </div>

                                {filteredHistory.map((item) => (
                                    <div key={item.id} className="bg-white/5 rounded-xl transition-all border border-transparent hover:border-cyan-500/50 overflow-hidden">
                                        <button
                                            onClick={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 focus:outline-none active:bg-white/10 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center shadow-lg ${item.result === 'WIN' ? 'bg-green-500/10 text-green-400 shadow-green-500/10' : 'bg-red-500/10 text-red-400 shadow-red-500/10'}`}>
                                                    <Gamepad2 size={24} />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{item.game}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{item.time}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right hidden md:block">
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">{t('profile.history.multiplier')}</div>
                                                    <div className={`font-mono font-bold ${parseFloat(item.multiplier) >= 1 ? 'text-white' : 'text-gray-500'}`}>{item.multiplier}</div>
                                                </div>
                                                <div className="text-right min-w-[140px]">
                                                    {Array.isArray(item.amount) ? (
                                                        <div className="flex flex-col items-end">
                                                            {item.amount.length > 0 ? item.amount.map((amt, i) => (
                                                                <div key={i} className={`font-mono font-black text-lg tracking-tight ${item.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>{amt}</div>
                                                            )) : (
                                                                <div className="text-xs text-gray-500">{t('profile.history.noReward')}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={`font-black text-lg tracking-tight ${item.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>{item.amount}</div>
                                                    )}
                                                    <div className={`text-[10px] font-black uppercase tracking-widest ${item.result === 'WIN' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {item.result === 'WIN' ? t('profile.history.result.win') : t('profile.history.result.loss')}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        {expanded[item.id] && item.details && (
                                            <div className="px-6 pb-6 pt-2 bg-black/20 border-t border-white/5 cursor-default" onClick={(e) => e.stopPropagation()}>
                                                {/* Technical Details Footer */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                                    {Object.entries(item.details).map(([k, v]) => {
                                                        if (['rewards', 'multiplier', 'payout', 'profit', 'win', 'currency'].includes(k)) return null;
                                                        return (
                                                            <div key={k} className="flex flex-col gap-1">
                                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{k}</span>
                                                                <span className="font-mono text-xs text-gray-400 break-all bg-black/20 p-2 rounded border border-white/5 select-all">
                                                                    {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">{t('profile.history.empty')}</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'transactions' && (
                            <div className="space-y-4">
                                {transactions.map((item) => (
                                    (() => {
                                        const isDeposit = item.kind === 'DEPOSIT';
                                        const title = item.title === 'deposit'
                                            ? t('profile.wallet.deposit')
                                            : item.title === 'withdraw'
                                                ? t('profile.wallet.withdraw')
                                                : item.description;
                                        const statusKey = item.status === 'COMPLETED'
                                            ? 'success'
                                            : item.status === 'FAILED'
                                                ? 'failed'
                                                : 'pending';
                                        return (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border-l-4 border-transparent hover:border-cyan-500">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDeposit ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{title}</div>
                                                <div className="text-xs text-gray-400">{item.time}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right min-w-[100px]">
                                                <div className={`font-bold text-lg ${isDeposit ? 'text-green-400' : 'text-white'}`}>
                                                    {item.amount}
                                                </div>
                                                <div className={`text-[10px] font-bold uppercase tracking-wider ${statusKey === 'success' ? 'text-green-500' : statusKey === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>
                                                    {t(`profile.transactions.status.${statusKey}`)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        );
                                    })()
                                ))}
                                {transactions.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">{t('profile.transactions.empty')}</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="p-4 border border-green-500/30 bg-green-500/5 rounded-xl flex items-center gap-4">
                                    <Shield className="text-green-500" size={32} />
                                    <div>
                                        <div className="font-bold text-white">{t('profile.security.verifiedTitle')}</div>
                                        <div className="text-sm text-gray-400">{t('profile.security.verifiedDesc')}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                currentUser={user}
                variant={editProfileVariant}
                onUpdate={editProfileVariant === 'bindEmail' ? handleEmailBound : handleUpdateProfile}
            />
        </div>
    );
};

export default ProfileView;
