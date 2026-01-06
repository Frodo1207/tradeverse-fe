import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, Flame, Zap, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { rankingService } from '../../services/api';

const LiveEarningsFeed = () => {
    const { t } = useTranslation();
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    // Token配置
    const tokens = {
        DOGE: { color: '#eab308', icon: '🐕', glow: 'shadow-yellow-500/50' },
        USDT: { color: '#10b981', icon: '💵', glow: 'shadow-green-500/50' },
        USDC: { color: '#3b82f6', icon: '💎', glow: 'shadow-blue-500/50' },
        SOL:  { color: '#a855f7', icon: '☀️', glow: 'shadow-purple-500/50' },
        SHIB: { color: '#ef4444', icon: '🐺', glow: 'shadow-red-500/50' },
        PEPE: { color: '#22c55e', icon: '🐸', glow: 'shadow-green-500/50' },
    };

    // 游戏列表
    const games = [
        { name: 'Neon Runner', icon: '⚡' },
        { name: 'Crypto Quest', icon: '🎮' },
        { name: 'Arena Valor', icon: '⚔️' },
        { name: 'Mystic Deck', icon: '🃏' },
        { name: 'Strike Force', icon: '🎯' },
        { name: 'Prediction Master', icon: '📈' },
        { name: 'Dungeon Raid', icon: '🏰' },
        { name: 'Speed Racer', icon: '🏎️' },
    ];

    // 生成模拟收益数据
    const generateEarning = (id) => {
        const tokenKeys = Object.keys(tokens);
        const token = tokenKeys[Math.floor(Math.random() * tokenKeys.length)];
        const game = games[Math.floor(Math.random() * games.length)];

        // 根据代币类型生成合理的金额范围
        const amountRanges = {
            DOGE: [10, 500],
            USDT: [0.5, 20],
            USDC: [0.5, 20],
            SOL: [0.1, 5],
            SHIB: [1000, 50000],
            PEPE: [1000, 50000],
        };

        const [min, max] = amountRanges[token];
        const amount = (Math.random() * (max - min) + min).toFixed(2);

        const timestamps = ['刚刚', '1分钟前', '2分钟前', '3分钟前', '5分钟前'];

        return {
            id,
            player: `Player#${Math.floor(1000 + Math.random() * 9000)}`,
            avatar: ['🎮', '👾', '🕹️', '🎯', '🏆'][Math.floor(Math.random() * 5)],
            game: game.name,
            gameIcon: game.icon,
            amount: parseFloat(amount),
            token,
            timestamp: timestamps[Math.floor(Math.random() * timestamps.length)],
            isBigWin: parseFloat(amount) > (token === 'DOGE' ? 200 : token === 'SOL' ? 2 : 10)
        };
    };

    const [earnings, setEarnings] = useState([]);
    const seenIdsRef = useRef(new Set());

    useEffect(() => {
        const toNumber = (v) => {
            if (typeof v === 'number') return v;
            if (typeof v === 'string') return parseFloat(v);
            if (v && typeof v === 'object') {
                if (typeof v.Decimal === 'string') return parseFloat(v.Decimal);
                if (typeof v.decimal === 'string') return parseFloat(v.decimal);
            }
            return 0;
        };
        const fetchData = async () => {
            try {
                const res = await rankingService.recentRewards({ period: '24h', limit: 50 });
                const rows = res.data || [];
                const mapped = rows.map((e, i) => ({
                    id: e.id || `${e.sessionId}-${e.currency}-${toNumber(e.amount)}-${e.createdAt}`,
                    player: e.username || `User#${e.userId}`,
                    avatar: ['🎮','👾','🕹️','🎯','🏆'][i%5],
                    game: e.gameId,
                    gameIcon: '🎮',
                    amount: toNumber(e.amount),
                    token: e.currency,
                    timestamp: new Date(e.createdAt).toLocaleString(),
                    isBigWin: toNumber(e.amount) > (e.currency === 'DOGE' ? 200 : e.currency === 'SOL' ? 2 : e.currency === 'USDT' ? 10 : 1000)
                }));
                if (mapped.length > 0) {
                    setEarnings((prev) => {
                        const newItems = [];
                        for (const m of mapped) {
                            if (!seenIdsRef.current.has(m.id)) {
                                seenIdsRef.current.add(m.id);
                                newItems.push(m);
                            }
                        }
                        if (newItems.length === 0) return prev;
                        return [...newItems, ...prev].slice(0, 50);
                    });
                } else {
                    if (earnings.length === 0) {
                        setEarnings(Array.from({ length: 20 }, (_, i) => generateEarning(`earning-${i}`)));
                    }
                }
            } catch {
                setEarnings(Array.from({ length: 20 }, (_, i) => generateEarning(`earning-${i}`)));
            }
        };
        fetchData();
        const interval = setInterval(() => {
            if (document.hidden) return;
            fetchData();
        }, 30000);
        return () => { clearInterval(interval); };
    }, []);

    // 平滑无限滚动
    useEffect(() => {
        if (!scrollRef.current || isPaused) return;

        let scrollY = 0;
        let animationFrameId;

        const scroll = () => {
            scrollY += 0.5; // 滚动速度（像素/帧）

            if (scrollRef.current) {
                const maxScroll = scrollRef.current.scrollHeight / 2;

                // 当滚动到一半时重置（因为内容是复制的）
                if (scrollY >= maxScroll) {
                    scrollY = 0;
                }

                scrollRef.current.style.transform = `translateY(-${scrollY}px)`;
            }

            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isPaused]);

    // 渲染单条收益卡片
    const renderEarningCard = (earning) => (
        <div
            key={earning.id}
            className={`
                group relative bg-black/40 backdrop-blur-md border rounded-xl p-4
                hover:border-white/30 transition-all duration-300 cursor-pointer
                ${earning.isBigWin
                    ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                    : 'border-white/10'
                }
            `}
        >
            {/* 大额收益标签 */}
            {earning.isBigWin && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Trophy size={10} />
                    {t('home.liveEarnings.bigWin')}
                </div>
            )}

            <div className="flex items-center justify-between gap-2 md:gap-4">
                {/* 左侧：玩家信息 */}
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="text-2xl flex-shrink-0">{earning.avatar}</div>
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                            {earning.player}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span>{earning.gameIcon}</span>
                            <span className="truncate">{earning.game}</span>
                        </div>
                    </div>
                </div>

                {/* 中间：Earned 标签 */}
                <div className="hidden sm:block flex-shrink-0 px-3">
                    <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                        <TrendingUp size={12} />
                        <span>{t('home.liveEarnings.earned')}</span>
                    </div>
                </div>

                {/* 右侧：金额 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                        <div
                            className="text-xl md:text-2xl font-black"
                            style={{
                                color: (tokens[earning.token] || { color: '#9ca3af' }).color,
                                textShadow: `0 0 20px ${(tokens[earning.token] || { color: '#9ca3af' }).color}`
                            }}
                        >
                            +{earning.amount} {earning.token}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                            {earning.timestamp}
                        </div>
                    </div>
                    <div className="text-2xl">{(tokens[earning.token] || { icon: '💰' }).icon}</div>
                </div>
            </div>

            {/* Hover效果：底部发光线 */}
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `linear-gradient(90deg, transparent, ${(tokens[earning.token] || { color: '#9ca3af' }).color}, transparent)`,
                    boxShadow: `0 0 10px ${(tokens[earning.token] || { color: '#9ca3af' }).color}`
                }}
            ></div>
        </div>
    );

    return (
        <div className="relative w-full py-12 overflow-hidden">
            {/* 标题 */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <Flame className="text-purple-500 animate-pulse" size={28} />
                    <h2 className="text-3xl md:text-4xl font-black uppercase bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        {t('home.liveEarnings.title')}
                    </h2>
                    <Flame className="text-purple-500 animate-pulse" size={28} />
                </div>
                <p className="text-gray-400 text-sm md:text-base font-mono">
                    {t('home.liveEarnings.subtitle')}
                </p>
            </div>

            {/* 收益信息流容器 */}
            <div className="relative max-w-4xl mx-auto px-4 md:px-6">
                {/* 顶部渐变遮罩 */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10 pointer-events-none"></div>
                {/* 底部渐变遮罩 */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10 pointer-events-none"></div>

                {/* 滚动容器 */}
                <div
                    className="h-[400px] overflow-hidden relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* 使用双份数据实现无缝循环 */}
                    <div ref={scrollRef} className="space-y-3">
                        {earnings.map((earning) => renderEarningCard(earning))}
                        {/* 复制一份用于无缝循环 */}
                        {earnings.map((earning) => renderEarningCard({ ...earning, id: `${earning.id}-copy` }))}
                    </div>
                </div>

                {/* 提示文字 */}
                <div className="text-center mt-4 text-xs text-gray-500 font-mono">
                    {t('home.liveEarnings.hoverToPause')}
                </div>
            </div>

            {/* 底部CTA */}
            <div className="text-center mt-8">
                <button className="group relative bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-wider overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 transition-transform">
                    <span className="relative z-10 flex items-center gap-2">
                        <Zap size={16} />
                        {t('home.liveEarnings.startEarningNow')}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
            </div>
        </div>
    );
};

export default LiveEarningsFeed;
