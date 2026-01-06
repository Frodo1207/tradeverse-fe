import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, walletService } from '../services/api';
import { useToast } from './ToastContext';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState("0.00");
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, info } = useToast();

    const refreshBalance = useCallback(async () => {
        if (!user) return;
        try {
            const data = await walletService.getBalance();
            const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            setAssets(list);
            const toNum = (v) => {
                if (typeof v === 'number') return v;
                if (typeof v === 'string') return parseFloat(v);
                if (v && typeof v === 'object') {
                    if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
                    if (typeof v.decimal === 'string') return parseFloat(v.decimal);
                }
                return 0;
            };
            const usdt = list.find(a => a.currency === 'USDT');
            const amt = usdt ? toNum(usdt.balance) : 0;
            setBalance(amt.toFixed(2));
        } catch (err) {
            console.error("Failed to refresh balance:", err);
            setAssets([]);
            setBalance("0.00");
        }
    }, [user]);

    // Initial Session Check
    useEffect(() => {
        const initSession = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (err) {
                console.error("Session check failed:", err);
            } finally {
                setLoading(false);
            }
        };
        initSession();
    }, []);

    // Fetch balance when user changes
    useEffect(() => {
        if (user) {
            refreshBalance();
        } else {
            setBalance("0.00");
            setAssets([]);
        }
    }, [user, refreshBalance]);

    // Persist user changes to localStorage to survive refresh
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch (e) {
            console.error('Failed to persist user to localStorage:', e);
        }
    }, [user]);

    const login = async (walletAddress, signature, message) => {
        const data = await authService.login(walletAddress, signature, message);
        setUser(data.user);
        success(`Welcome back, ${data.user.username}!`);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        info("You have successfully logged out.");
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser, // Exposed for updates if needed
            balance,
            assets,
            loading,
            login,
            logout,
            refreshBalance
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
