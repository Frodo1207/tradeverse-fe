// Game Registry - 定义所有游戏的加载配置
// 这是一个映射表，前端根据 gameId 查找如何加载游戏

import React from 'react';

// 动态导入 React 游戏组件
const DiceGame = React.lazy(() => import('../../games/dice/DiceGame'));
const RPSGame = React.lazy(() => import('../../games/rps/RPSGame'));

export const GameRegistry = {
    // 1. 原生 React 游戏
    'dice': {
        type: 'react',
        component: DiceGame,
        orientation: 'portrait', // or 'landscape'
        options: {},
        ticketPrice: 2.0,
        currency: 'USDT',
        supportedCurrencies: ['USDT'],
        fixedBet: true,
        fixedCurrency: true
    },

    'rps': {
        type: 'react',
        component: RPSGame,
        orientation: 'portrait',
        options: {},
        ticketPrice: 10.0,
        currency: 'USDT',
        supportedCurrencies: ['USDT'],
        fixedBet: true,
        fixedCurrency: true
    },

    // Poker demo served by its own Go server frontend
    'poker': {
        type: 'external',
        url: (((typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.POKER_URL) || import.meta.env.VITE_POKER_URL || 'http://localhost:8004')) + '/poker',
        orientation: 'landscape'
    },

    // Competitive bomb uses dice component as placeholder gameplay

    // 2. 示例：Unity/WebGL 游戏 (通过 Iframe 加载)
    // 'unity-demo': {
    //     type: 'iframe',
    //     url: '/games/unity-demo/index.html', // 静态资源路径
    //     orientation: 'landscape',
    //     aspectRatio: 16 / 9
    // },

    // 3. 示例：Phaser 游戏 (作为 React 组件包装)
    // 'phaser-demo': {
    //     type: 'react', // Phaser 通常也可以封装在 React 组件中
    //     component: React.lazy(() => import('../../games/phaser/PhaserWrapper')),
    //     orientation: 'landscape'
    // }
};

export const getGameConfig = (gameId) => {
    return GameRegistry[gameId] || null;
};
