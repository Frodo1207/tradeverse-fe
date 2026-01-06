import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, Wallet } from 'lucide-react';

const InsufficientBalanceModal = ({ isOpen, onClose, onDeposit }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div
                className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/20 blur-[100px] pointer-events-none" />

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <AlertCircle size={32} className="text-red-400" />
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-2">
                        余额不足
                    </h2>
                    <p className="text-gray-400 text-center text-sm mb-8">
                        您的余额不足以进行此操作，请先充值。
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onClose();
                                if (onDeposit) {
                                    onDeposit();
                                }
                            }}
                            className="w-full py-4 rounded-xl font-bold text-black transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                        >
                            <Wallet size={20} />
                            立即充值
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-xl font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InsufficientBalanceModal;
