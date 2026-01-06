import React, { createContext, useContext, useState, useEffect } from 'react';
import { walletService } from '../services/api';
import { useUser } from './UserContext';

const WalletContext = createContext();

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    const refreshBalance = async () => {
        try {
            const data = await walletService.getBalance();
            let assets = null;
            if (Array.isArray(data)) {
                assets = data;
            } else if (data && Array.isArray(data.assets)) {
                assets = data.assets;
            }

            if (assets && assets.length > 0) {
                const usdt = assets.find(a => (a.currency || a.symbol) === 'USDT');
                const first = assets[0];
                const amt = usdt ? (usdt.balance ?? usdt.amount ?? 0) : (first.balance ?? first.amount ?? 0);
                setBalance(Number(amt) || 0);
            } else if (typeof data?.balance === 'number') {
                setBalance(data.balance);
            } else {
                setBalance(0);
            }
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            refreshBalance();
        } else {
            setBalance(0);
            setLoading(false);
        }
    }, [user]);

    const value = {
        balance,
        loading,
        refreshBalance
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
