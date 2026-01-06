import axios from 'axios';

const RUNTIME = (typeof window !== 'undefined' && window.__ENV__) || {};
const API_URL = RUNTIME.API_URL || import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    try {
        const method = (config.method || 'get').toUpperCase();
        const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
        const headerNames = config.headers ? Object.keys(config.headers) : [];
        console.log('[HTTP SEND]', method, fullUrl, { headers: headerNames, hasAuth: !!config.headers?.Authorization, dataType: config.data ? typeof config.data : 'undefined' });
    } catch (_) { void 0; }
    return config;
});

export const authService = {
    login: async (walletAddress, signature, message) => {
        try {
            const response = await api.post('/auth/login', {
                walletAddress,
                signature,
                message
            });
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export const userService = {
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.put('/user/profile', data);
        return response.data;
    }
};

export const walletService = {
    getBalance: async () => {
        const response = await api.get('/wallet/balance');
        return response.data;
    },

    deposit: async (amount, currency) => {
        const response = await api.post('/wallet/deposit', { amount, currency });
        return response.data;
    },

    withdraw: async (amount, currency) => {
        const response = await api.post('/wallet/withdraw', { amount, currency });
        return response.data;
    },

    getHistory: async (page = 1, limit = 10) => {
        const response = await api.get(`/wallet/transactions?page=${page}&limit=${limit}`);
        return response.data;
    }
};

export const swapService = {
    quote: async (from, to, amount) => {
        const response = await api.post('/swap/quote', { from, to, amount });
        return response.data;
    },
    execute: async (from, to, amount, minReceive) => {
        const response = await api.post('/swap/execute', { from, to, amount, minReceive });
        return response.data;
    }
};

export const gameService = {
    getGames: async () => {
        const response = await api.get('/games');
        return response.data;
    },

    userSessions: async ({ page = 1, limit = 20 } = {}) => {
        const response = await api.get('/game/sessions', { params: { page, limit } });
        return response.data;
    }
};

export const rankingService = {
    recentRewards: async ({ period = '24h', limit = 100 } = {}) => {
        const response = await api.get('/ranking/recent-rewards', { params: { period, limit } });
        return response.data;
    },
    topWinners: async ({ currency = 'USDT', period = '24h', limit = 50 } = {}) => {
        const response = await api.get('/ranking/top-winners', { params: { currency, period, limit } });
        return response.data;
    },
    topWinnersByGame: async ({ gameId = 'dice', period = '24h', limit = 50 } = {}) => {
        const response = await api.get('/ranking/top-winners-by-game', { params: { gameId, period, limit } });
        return response.data;
    },
    topWinnersUSD: async ({ period = '24h', limit = 50 } = {}) => {
        const response = await api.get('/ranking/top-winners-usd', { params: { period, limit } });
        return response.data;
    },
    hotGames: async ({ period = '24h', limit = 10 } = {}) => {
        const response = await api.get('/ranking/hot-games', { params: { period, limit } });
        return response.data;
    },
    topSingleWin: async ({ period = '7d', limit = 50 } = {}) => {
        const response = await api.get('/ranking/top-single-win', { params: { period, limit } });
        return response.data;
    }
};

export const economyService = {
    getValuation: async () => {
        const response = await api.get('/economy/valuation');
        return response.data;
    },
    setPrice: async ({ currency, usdRate }) => {
        const response = await api.post('/economy/prices', { currency, usdRate });
        return response.data;
    }
};

export const xpService = {
    status: async (moduleId = 'solo') => {
        const response = await api.get('/xp/status', { params: { moduleId } });
        return response.data;
    },
    claim: async (moduleId, idempotencyKey) => {
        const response = await api.post('/xp/claim', { moduleId }, { headers: { 'Idempotency-Key': idempotencyKey } });
        return response.data;
    }
};

export default api;
