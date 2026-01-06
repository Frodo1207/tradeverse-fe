import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TransactionModal = ({ isOpen, onClose, type, onConfirm, currencies = ['USDT'] }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState(currencies[0] || 'USDT');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

        setLoading(true);
        try {
            await onConfirm(parseFloat(amount), currency);
            setAmount('');
            onClose();
        } catch (error) {
            console.error("Transaction failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const isDeposit = type === 'deposit';

    return createPortal(
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div
                className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
                {/* Background Glow */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-${isDeposit ? 'cyan' : 'purple'}-500/20 blur-[100px] pointer-events-none`} />

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-full bg-${isDeposit ? 'cyan' : 'purple'}-500/10 flex items-center justify-center mx-auto mb-6 border border-${isDeposit ? 'cyan' : 'purple'}-500/20`}>
                        {isDeposit ? (
                            <ArrowDownLeft size={32} className="text-cyan-400" />
                        ) : (
                            <ArrowUpRight size={32} className="text-purple-400" />
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-2">
                        {isDeposit ? t('profile.txModal.depositTitle') : t('profile.txModal.withdrawTitle')}
                    </h2>
                    <p className="text-gray-400 text-center text-sm mb-8">
                        {isDeposit ? t('profile.txModal.depositDesc') : t('profile.txModal.withdrawDesc')}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('profile.txModal.currency')}</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-white/30"
                            >
                                {currencies.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                {t('profile.txModal.amount', { currency })}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={t('profile.txModal.amountPlaceholder')}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-white/30 transition-colors"
                                    autoFocus
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                                    {currency}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className={`w-full py-4 rounded-xl font-bold text-black transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isDeposit
                                ? 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                : 'bg-purple-400 hover:bg-purple-300 shadow-[0_0_20px_rgba(192,132,252,0.3)]'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {isDeposit ? t('profile.txModal.confirmDeposit') : t('profile.txModal.confirmWithdraw')}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>, document.body
    );
};

export default TransactionModal;
