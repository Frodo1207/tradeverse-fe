import React from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Check } from 'lucide-react';

const WalletSelectionModal = ({ isOpen, onClose, wallets, onSelectWallet }) => {

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">连接钱包</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Wallet List */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        {wallets.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={() => {
                                    if (wallet.detected) {
                                        onSelectWallet(wallet);
                                    } else {
                                        window.open(wallet.downloadUrl, '_blank');
                                    }
                                }}
                                className={`w-full p-4 rounded-xl border transition-all ${wallet.detected
                                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    : 'bg-black/40 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl overflow-hidden p-2">
                                            {(() => {
                                                // 1. Try to use the provided icon if it's a valid URL/DataURI
                                                if (wallet.icon?.startsWith('data:') || wallet.icon?.startsWith('http')) {
                                                    return <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />;
                                                }

                                                // 2. Final fallback: render as text (emoji)
                                                return wallet.icon;
                                            })()}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-lg">
                                                {wallet.name}
                                            </div>
                                            {wallet.detected ? (
                                                <div className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                                                    <Check size={12} /> 已安装
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-500">
                                                    未检测到
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!wallet.detected && (
                                        <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                                            <Download size={16} />
                                            安装
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {wallets.filter(w => w.detected).length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">未检测到已安装的钱包</div>
                            <p className="text-sm text-gray-500">请安装以太坊钱包插件（如 MetaMask/OKX/Coinbase）后重试</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                    <p className="text-xs text-gray-500 text-center">
                        初次使用？选择一个钱包进行安装
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WalletSelectionModal;
