
import React, { useState, useRef, useEffect } from 'react';
import {
    Wallet, Copy, LogOut, Shield, User,
    ArrowDownLeft, ArrowUpRight, ChevronDown, Check, Gift
} from 'lucide-react';
import { economyService } from '../../services/api';
import { preauthService } from '../../services/requests/preauth';
import { authUserService } from '../../services/requests/auth';
import WalletSelectionModal from './WalletSelectionModal';
import { detectAvailableWallets, connectWallet, ensureEvmChain, signMessage } from '../../utils/walletUtils';
import { useTransactionModal } from '../../contexts/TransactionModalContext';
import { useUser } from '../../contexts/UserContext';
import { useWallet } from '../../contexts/WalletContext';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

const WalletConnectButton = ({ onNavigate, mobile = false }) => {
    const { t } = useTranslation();
    const CHAIN_OPTIONS = [
        {
            key: 'bsc',
            label: 'BSC',
            type: 'evm',
            evm: {
                chainId: '0x38',
                addEthereumChainParams: {
                    chainId: '0x38',
                    chainName: 'BNB Smart Chain',
                    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/']
                }
            }
        },
        {
            key: 'eth',
            label: 'ETH',
            type: 'evm',
            evm: {
                chainId: '0x1',
                addEthereumChainParams: {
                    chainId: '0x1',
                    chainName: 'Ethereum Mainnet',
                    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://cloudflare-eth.com/'],
                    blockExplorerUrls: ['https://etherscan.io/']
                }
            }
        },
        {
            key: 'polygon',
            label: 'POL',
            type: 'evm',
            evm: {
                chainId: '0x89',
                addEthereumChainParams: {
                    chainId: '0x89',
                    chainName: 'Polygon',
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/']
                }
            }
        },
        {
            key: 'arb',
            label: 'ARB',
            type: 'evm',
            evm: {
                chainId: '0xa4b1',
                addEthereumChainParams: {
                    chainId: '0xa4b1',
                    chainName: 'Arbitrum One',
                    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                    blockExplorerUrls: ['https://arbiscan.io/']
                }
            }
        },
        { key: 'sol', label: 'SOL', type: 'solana' }
    ];

    const [selectedChainKey, setSelectedChainKey] = useState(() => {
        try {
            return localStorage.getItem('selectedChain') || 'bsc';
        } catch {
            return 'bsc';
        }
    });
    const selectedChain = CHAIN_OPTIONS.find((c) => c.key === selectedChainKey) || CHAIN_OPTIONS[0];
    const [chainName, setChainName] = useState(selectedChain.label);
    const [isOpen, setIsOpen] = useState(false);
    const [isChainOpen, setIsChainOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableWallets, setAvailableWallets] = useState([]);
    const dropdownRef = useRef(null);
    const { user, setUser, logout } = useUser();
    const { balance, refreshBalance } = useWallet();
    const [valuationUSD, setValuationUSD] = useState(null);
    const { openModal } = useTransactionModal();
    const { success } = useToast();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsChainOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setChainName(selectedChain.label);
        try {
            localStorage.setItem('selectedChain', selectedChain.key);
        } catch (e) { void e; }
    }, [selectedChain.key, selectedChain.label]);

    const handleConnect = () => {
        try {
            console.debug('[Wallet] Connect button clicked');
            // Detect available wallets
            const wallets = detectAvailableWallets().filter(w => w.type === selectedChain.type);
            console.debug('[Wallet] Detected wallets:', wallets);
            setAvailableWallets(wallets);
            setIsModalOpen(true);
        } catch (error) {
            console.error('[Wallet] Error in handleConnect:', error);
        }
    };

    const handleWalletSelect = async (wallet) => {
        console.debug('[Wallet] Selected wallet:', wallet?.name);
        setIsModalOpen(false);

        try {
            setChainName(selectedChain.label);
            if (selectedChain.type === 'evm' && selectedChain.evm?.chainId) {
                await ensureEvmChain(wallet.provider, selectedChain.evm);
            }
            // 1. Connect to selected wallet
            const walletAddress = await connectWallet(wallet.provider, selectedChain.type);
            console.debug('[Wallet] Connected address:', walletAddress);

            if (selectedChain.type === 'solana') {
                alert("当前仅调试 EVM 登录流程，Solana 暂未接入");
                return;
            }

            const qs = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
            const refFromUrl = qs.get('ref') || qs.get('r');
            const refFromStorage = localStorage.getItem('ref');
            const ref = refFromUrl || refFromStorage || 'tradeverse';

            const msgResp = await preauthService.getMsg(walletAddress);
            const msgCode = msgResp?.code;
            const msgData = msgResp?.data;
            const msgId = msgData?.id;
            const message = msgData?.message;

            if (msgCode !== 0 || !msgId || !message) {
                throw new Error(msgResp?.msg || 'Failed to get sign message');
            }

            const signature = await signMessage(wallet.provider, walletAddress, message, wallet.type);
            console.debug('[Wallet] Signature received:', signature?.slice ? signature.slice(0, 10) + '...' : signature);

            const verifyResp = await preauthService.verifyMsg({ id: msgId, sign: signature, ref });
            const verifyCode = verifyResp?.code;
            const verifyData = verifyResp?.data;
            const provisionalToken = verifyData?.provisional_token;

            if (verifyCode !== 0 || !provisionalToken) {
                if (verifyCode === 6) {
                    alert("签名消息已过期，请重新获取并签名");
                    return;
                }
                if (verifyCode === 10) {
                    alert("签名无效：请确认签名的是后端返回的 message 原文，且地址一致");
                    return;
                }
                if (verifyCode === 800) {
                    alert("邀请码无效或缺失：首次注册必须提供有效 ref");
                    return;
                }
                throw new Error(verifyResp?.msg || 'verify_msg failed');
            }

            localStorage.setItem('spwapiToken', provisionalToken);
            localStorage.setItem('authToken', provisionalToken);

            let nextUser = {
                walletAddress,
                user_no: verifyData?.user_no,
                email: verifyData?.email ?? null,
                username: verifyData?.user_no ? `User-${verifyData.user_no}` : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            };

            try {
                const profileResp = await authUserService.getProfile();
                if (profileResp?.code === 0 && profileResp?.data) {
                    const d = profileResp.data || {};
                    const userMain = d.user_main || {};
                    const userProfile = d.user_profile || {};
                    const userRef = d.user_ref ?? null;
                    const providers = Array.isArray(d.user_providers) ? d.user_providers : [];

                    nextUser = {
                        ...nextUser,
                        id: userMain.id,
                        user_no: userMain.user_no ?? nextUser.user_no,
                        email: (userMain.email ?? nextUser.email) ?? null,
                        add_time: userMain.add_time,
                        status: userMain.status,
                        ref_id: userMain.ref_id,
                        profile: userProfile,
                        user_ref: userRef,
                        user_providers: providers,
                        username: userMain.user_no ? `User-${userMain.user_no}` : nextUser.username
                    };
                }
            } catch (e) { void e; }
            setUser(nextUser);
            try {
                localStorage.setItem('user', JSON.stringify(nextUser));
            } catch (e) { void e; }

            // Ensure wallet balance sync after login
            refreshBalance();
            success(t('wallet.connected', { addr: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` }));

        } catch (error) {
            const msg = String(error && error.message ? error.message : error);
            console.error('[Wallet] Connection failed:', msg, error);
            if (error.code === 4001) {
                alert("连接被拒绝 / Connection rejected");
            } else if (msg.includes('Unsupported wallet')) {
                alert("当前仅支持以太坊钱包（MetaMask/OKX/Coinbase 等），请使用 EVM 钱包");
            } else {
                alert("连接失败，请重试 / Connection failed, please try again");
            }
        }
    };

    const handleDisconnect = () => {
        logout();
        setIsOpen(false);
    };

    const handleCopy = () => {
        if (user?.walletAddress) {
            navigator.clipboard.writeText(user.walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!user) {
        return (
            <>
                <div className={`${mobile ? 'w-full flex flex-col gap-3' : 'flex items-center gap-3'}`}>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsChainOpen(v => !v)}
                            className={`${mobile ? 'w-full py-3' : 'px-4 py-2.5'} bg-black/40 border border-white/10 text-white rounded-lg font-bold hover:bg-[#1a1a1a] hover:border-white/20 transition-all flex items-center gap-2`}
                        >
                            <span className="font-black">{selectedChain.label}</span>
                            <ChevronDown size={16} className={`transition-transform ${isChainOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isChainOpen && (
                            <div className={`${mobile ? 'w-full' : 'absolute left-0 mt-2 w-44'} bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50`}>
                                {CHAIN_OPTIONS.map((c) => (
                                    <button
                                        key={c.key}
                                        onClick={() => {
                                            setSelectedChainKey(c.key);
                                            setIsChainOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left font-bold text-sm transition-colors ${
                                            c.key === selectedChain.key ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleConnect}
                        className={`${mobile ? 'w-full justify-center py-4 text-lg' : 'px-6 py-2.5 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/50'} bg-white text-black rounded-lg font-bold hover:bg-purple-600 hover:text-white transition-all transform flex items-center gap-2`}
                    >
                        <Wallet size={mobile ? 24 : 18} />
                        {t('wallet.connect')}
                    </button>
                </div>
                <WalletSelectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    wallets={availableWallets}
                    onSelectWallet={handleWalletSelect}
                />
            </>
        );
    }

    return (
        <div className={`relative ${mobile ? 'w-full' : ''}`} ref={dropdownRef}>
            {/* Connected Trigger Button */}
            <button
                onClick={async () => {
                    if (mobile) {
                        onNavigate('Profile');
                        return;
                    }
                    const next = !isOpen;
                    setIsOpen(next);
                    if (next) {
                        try {
                            await refreshBalance();
                            const val = await economyService.getValuation();
                            const total = val?.data?.totalUSD;
                            const num = total?.decimal || total?.Decimal || total;
                            setValuationUSD(typeof num === 'number' ? num : parseFloat(num || 0));
                        } catch (e) { void e; }
                    }
                }}
                className={`flex items-center gap-3 rounded-lg border transition-all ${
                    mobile 
                        ? 'w-full p-4 justify-between border-white/10 bg-white/5 text-xl' 
                        : 'px-4 py-2'
                } ${isOpen
                    ? 'bg-[#1a1a1a] border-white/20 text-white'
                    : 'bg-black/40 border-white/10 text-gray-200 hover:bg-[#1a1a1a] hover:border-white/20'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`${mobile ? 'w-10 h-10 text-sm' : 'w-6 h-6 text-[10px]'} rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white overflow-hidden`}>
                        {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <Wallet size={mobile ? 18 : 12} />}
                    </div>
                    <span className="font-mono font-bold">
                        {user?.username || (user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '...')}
                    </span>
                </div>
                {!mobile && <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
            </button>


            {isOpen && (
                <div className={`${
                    mobile 
                        ? 'static mt-4 w-full bg-transparent border-0 shadow-none' 
                        : 'absolute right-0 top-full mt-2 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl'
                    } overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200`}
                >
                    <div className={`${mobile ? 'p-0 mb-6' : 'p-5 border-b border-white/5'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <span className={`w-2 h-2 rounded-full ${selectedChain.type === 'solana' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                                {chainName}
                            </div>
                            <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors">
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            </button>
                        </div>
                        {!mobile && (
                            <div className="font-mono text-white font-bold text-lg tracking-wide">
                                {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '...'}
                            </div>
                        )}
                    </div>


                    <div className={`${mobile ? 'p-0 mb-6' : 'p-5'}`}>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('wallet.card.usdtBalance')}</div>
                                <div className="text-2xl font-black text-white">
                                    {Number(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('wallet.card.totalValuation')}</div>
                                <div className="text-2xl font-black text-white flex items-baseline gap-1">
                                    <span className="text-base text-gray-500">$</span>
                                    {Number(valuationUSD || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button
                                onClick={() => {
                                    openModal('deposit');
                                    setIsOpen(false);
                                }}
                                className="bg-white text-black py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowDownLeft size={16} /> {t('wallet.actions.deposit')}
                            </button>
                            <button
                                onClick={() => {
                                    openModal('withdraw');
                                    setIsOpen(false);
                                }}
                                className="bg-white/10 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowUpRight size={16} /> {t('wallet.actions.withdraw')}
                            </button>
                        </div>

                    </div>
                    <div className={`${mobile ? 'p-0 border-t border-white/10 pt-6' : 'p-2 border-t border-white/5 bg-white/[0.02]'}`}>
                        <button
                            onClick={() => {
                                onNavigate('Profile');
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left group ${mobile ? 'text-lg font-bold' : ''}`}
                        >
                            <User size={18} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                            <span className="font-bold text-sm">{t('wallet.menu.personalCenter')}</span>
                        </button>

                        <button
                            onClick={() => {
                                onNavigate('Referral');
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left group ${mobile ? 'text-lg font-bold' : ''}`}
                        >
                            <Gift size={18} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                            <span className="font-bold text-sm">{t('wallet.menu.referralProgram')}</span>
                        </button>

                        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left group ${mobile ? 'text-lg font-bold' : ''}`}>
                            <Shield size={18} className="text-gray-500 group-hover:text-green-400 transition-colors" />
                            <span className="font-bold text-sm">{t('wallet.menu.securityCenter')}</span>
                        </button>

                        <button
                            onClick={handleDisconnect}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left mt-1 ${mobile ? 'text-lg font-bold' : ''}`}
                        >
                            <LogOut size={18} />
                            <span className="font-bold text-sm">{t('wallet.menu.disconnect')}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Wallet Selection Modal */}
            <WalletSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                wallets={availableWallets}
                onSelectWallet={handleWalletSelect}
            />
        </div>
    );
};

export default WalletConnectButton;
