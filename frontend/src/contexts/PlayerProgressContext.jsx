import React, { createContext, useState, useContext, useEffect } from 'react';

// 经验公式配置
const EXP_CONFIG = {
    'Single Player': { base: 100, perGame: 10, growth: 1.5 },
    'Competitive': { base: 120, perGame: 12, growth: 1.5 },
    'Card Games': { base: 80, perGame: 8, growth: 1.5 },
    'Prediction': { base: 150, perGame: 15, growth: 1.5 }
};

// 奖励配置
const REWARDS_CONFIG = {
    'Single Player': {
        2: { DOGE: 300, items: ['EXP Boost Card x1'] },
        3: { DOGE: 600, USDT: 5, items: ['Rare Skin'] },
        4: { DOGE: 1000, USDT: 10, items: ['Epic Weapon'] },
        5: { DOGE: 1500, USDT: 20, items: ['Legendary Weapon'] },
        10: { DOGE: 5000, USDT: 100, items: ['Ultimate Skin Pack'] }
    },
    'Competitive': {
        2: { PEPE: 500, items: ['Competitive Badge'] },
        3: { PEPE: 1000, SHIB: 200, items: ['Rank Frame'] },
        4: { PEPE: 2000, USDT: 15, items: ['Elite Badge'] },
        5: { USDT: 50, items: ['Champion Skin'] },
        10: { USDT: 200, items: ['Grandmaster Title'] }
    },
    'Card Games': {
        2: { PEPE: 400, items: ['Common Card Pack x3'] },
        3: { PEPE: 800, items: ['Rare Card Pack x2'] },
        4: { PEPE: 1500, USDT: 20, items: ['Epic Card Pack x1'] },
        5: { USDT: 30, items: ['Legendary Card Pack x1'] },
        10: { USDT: 150, items: ['Mythic Card Pack x1'] }
    },
    'Prediction': {
        2: { USDT: 10, items: ['Prediction Boost +5%'] },
        3: { USDT: 25, items: ['Prediction Boost +10%'] },
        4: { USDT: 50, items: ['VIP Analytics Access'] },
        5: { USDT: 100, items: ['VIP Prediction Rights'] },
        10: { USDT: 500, items: ['Oracle Status'] }
    }
};

const PlayerProgressContext = createContext();

export const usePlayerProgress = () => {
    const context = useContext(PlayerProgressContext);
    if (!context) {
        throw new Error('usePlayerProgress must be used within PlayerProgressProvider');
    }
    return context;
};

export const PlayerProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('playerProgress');
        const today = new Date().toDateString();
        const defaultState = {
            'Single Player': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            'Competitive': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            'Card Games': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            'Prediction': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            daily: { gamesPlayed: 0, tickets: 0, lastReset: today }
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            let merged = { ...defaultState, ...parsed };
            if (!parsed.daily || parsed.daily.lastReset !== today) {
                merged = { ...merged, daily: { gamesPlayed: 0, tickets: 0, lastReset: today } };
            }
            return merged;
        }
        return defaultState;
    });

    // 保存到 localStorage
    useEffect(() => {
        localStorage.setItem('playerProgress', JSON.stringify(progress));
    }, [progress]);

    // 计算升级所需经验
    const getExpRequired = (gameMode, level) => {
        const config = EXP_CONFIG[gameMode];
        return Math.floor(config.base * Math.pow(config.growth, level - 1));
    };

    // 获取升级奖励
    const getLevelRewards = (gameMode, level) => {
        return REWARDS_CONFIG[gameMode][level] || null;
    };

    // 完成一局游戏，增加经验
    const completeGame = (gameMode, callback) => {
        setProgress(prev => {
            const current = prev[gameMode];
            const expGained = EXP_CONFIG[gameMode].perGame;
            const newExp = current.currentExp + expGained;
            const expRequired = getExpRequired(gameMode, current.level);

            let newLevel = current.level;
            let remainingExp = newExp;
            const levelsGained = [];

            // 检查是否升级（可能连续升级）
            while (remainingExp >= getExpRequired(gameMode, newLevel)) {
                remainingExp -= getExpRequired(gameMode, newLevel);
                newLevel++;
                levelsGained.push(newLevel);
            }

            // Daily Logic
            const newDailyGames = (prev.daily?.gamesPlayed || 0) + 1;
            let newTickets = prev.daily?.tickets || 0;

            // Award ticket every 10 games
            if (newDailyGames % 10 === 0) {
                newTickets += 1;
            }

            const newProgress = {
                ...prev,
                [gameMode]: {
                    level: newLevel,
                    currentExp: remainingExp,
                    totalGamesPlayed: current.totalGamesPlayed + 1
                },
                daily: {
                    ...prev.daily,
                    gamesPlayed: newDailyGames,
                    tickets: newTickets
                }
            };

            // 如果升级了，触发回调
            if (levelsGained.length > 0 && callback) {
                callback(levelsGained, expGained);
            }

            return newProgress;
        });
    };

    // 重置某个游戏模块的进度（测试用）
    const resetProgress = (gameMode) => {
        setProgress(prev => ({
            ...prev,
            [gameMode]: { level: 1, currentExp: 0, totalGamesPlayed: 0 }
        }));
    };

    // 重置所有进度
    const resetAllProgress = () => {
        const initialState = {
            'Single Player': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            'Competitive': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            'Card Games': { level: 1, currentExp: 0, totalGamesPlayed: 0 },
            'Prediction': { level: 1, currentExp: 0, totalGamesPlayed: 0 }
        };
        setProgress(initialState);
    };

    const value = {
        progress,
        completeGame,
        getExpRequired,
        getLevelRewards,
        resetProgress,
        resetAllProgress
    };

    return (
        <PlayerProgressContext.Provider value={value}>
            {children}
        </PlayerProgressContext.Provider>
    );
};
