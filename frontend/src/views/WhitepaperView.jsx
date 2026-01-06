import React from 'react';
import { FileText, Layers, Shield, Zap, Globe, Cpu, Users, Lock, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhitepaperView = ({ onBack }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'zh' ? 'zh' : 'en';

    const content = {
        en: {
            title: 'Whitepaper',
            subtitle: 'The technical architecture, economic model, and vision behind the Nexus.GG gaming ecosystem.',
            contents: 'Contents',
            download: 'Download PDF',
            cta: {
                title: 'Ready to Join the Revolution?',
                desc: 'Be part of the future of gaming. Start playing, earning, and creating on Nexus.GG today.',
                button: 'Launch App'
            },
            sections: [
                {
                    id: 'intro',
                    title: 'Introduction',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                <strong>Nexus.GG</strong> is a next-generation decentralized gaming ecosystem that bridges the gap between traditional gaming and Web3. 
                                Our platform offers a seamless experience where players can compete, earn, and trade assets with true ownership.
                            </p>
                            <p>
                                By leveraging blockchain technology, we ensure transparency, fairness, and security for all in-game transactions and outcomes. 
                                Whether you are a competitive gamer, a casual player, or an NFT collector, Nexus.GG provides a diverse range of opportunities to engage and thrive.
                            </p>
                        </div>
                    )
                },
                {
                    id: 'ecosystem',
                    title: 'Ecosystem & Games',
                    content: (
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                Our ecosystem is built on four pillars of entertainment:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong className="text-white">Competitive Arena:</strong> Skill-based matchmaking for MOBA and FPS titles where players compete for prize pools.</li>
                                <li><strong className="text-white">Card Games:</strong> Strategic TCG and Poker tables with provably fair mechanics.</li>
                                <li><strong className="text-white">Prediction Markets:</strong> Real-time forecasting on crypto, sports, and global events.</li>
                                <li><strong className="text-white">Single Player:</strong> Arcade-style games for casual play and instant rewards.</li>
                            </ul>
                        </div>
                    )
                },
                {
                    id: 'technology',
                    title: 'Technology Stack',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Nexus.GG utilizes a hybrid architecture to deliver high-performance gaming with blockchain security:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h4 className="text-white font-bold mb-2">Off-Chain Engine</h4>
                                    <p className="text-sm">High-frequency game logic and matchmaking run on optimized servers to ensure zero-latency gameplay.</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h4 className="text-white font-bold mb-2">On-Chain Settlement</h4>
                                    <p className="text-sm">Assets, rewards, and critical outcomes are verified and settled on-chain for transparency.</p>
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'tokenomics',
                    title: 'Tokenomics',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                The native token <strong>$NEXUS</strong> fuels the ecosystem, serving multiple utility purposes:
                            </p>
                            <ul className="list-none space-y-3">
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span><strong>Governance:</strong> Token holders can vote on platform updates and game listings.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span><strong>Staking:</strong> Earn passive yield and unlock VIP tiers by staking $NEXUS.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span><strong>Transaction Fees:</strong> Reduced fees for marketplace trading and game entry.</span>
                                </li>
                            </ul>
                        </div>
                    )
                },
                {
                    id: 'roadmap',
                    title: 'Roadmap',
                    content: (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2"></div>
                                    <div className="w-0.5 h-full bg-white/10"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-bold text-white mb-1">Phase 1: Beta & Core Stabilization (Q1 2025)</h4>
                                    <p className="text-sm text-gray-400">Poker and RPS live, wallet integration, ranking service, stability.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
                                    <div className="w-0.5 h-full bg-white/10"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-bold text-white mb-1">Phase 2: SDK Release (Q2 2025)</h4>
                                    <p className="text-sm text-gray-400">GameKit + gamverse-sdk public release; third-party onboarding.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full mt-2"></div>
                                    <div className="w-0.5 h-full bg-white/10"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-bold text-white mb-1">Phase 3: Marketplace & Rewards (Q3 2025)</h4>
                                    <p className="text-sm text-gray-400">Asset marketplace, seasonal rewards, expanded leaderboards.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">Phase 4: Mobile & Cross-chain (Q4 2025)</h4>
                                    <p className="text-sm text-gray-400">iOS/Android beta, cross-chain bridge, social features.</p>
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'security',
                    title: 'Security & Fairness',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                We prioritize user security through rigorous audits and best practices:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Provably Fair:</strong> All RNG-based outcomes are verifiable on-chain.</li>
                                <li><strong>Non-Custodial Wallets:</strong> Users retain full control of their private keys and assets.</li>
                                <li><strong>Anti-Cheat:</strong> Advanced behavioral analysis to detect and ban cheaters in competitive modes.</li>
                            </ul>
                        </div>
                    )
                }
            ]
        },
        zh: {
            title: '白皮书',
            subtitle: 'Nexus.GG 游戏生态系统的技术架构、经济模型与愿景。',
            contents: '目录',
            download: '下载 PDF',
            cta: {
                title: '准备好加入革命了吗？',
                desc: '成为游戏未来的一部分。立即在 Nexus.GG 开始游玩、赚钱和创造。',
                button: '启动应用'
            },
            sections: [
                {
                    id: 'intro',
                    title: '简介',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                <strong>Nexus.GG</strong> 是下一代去中心化游戏生态系统，旨在弥合传统游戏与 Web3 之间的鸿沟。
                                我们的平台提供无缝体验，让玩家可以在拥有真实资产所有权的同时进行竞技、赚钱和交易。
                            </p>
                            <p>
                                通过利用区块链技术，我们确保所有游戏内交易和结果的透明度、公平性和安全性。
                                无论您是竞技玩家、休闲玩家还是 NFT 收藏家，Nexus.GG 都提供了多样化的参与和成长机会。
                            </p>
                        </div>
                    )
                },
                {
                    id: 'ecosystem',
                    title: '生态系统与游戏',
                    content: (
                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                我们的生态系统建立在四大娱乐支柱之上：
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong className="text-white">竞技场：</strong> 针对 MOBA 和 FPS 游戏的基于技能的匹配系统，玩家可争夺奖金池。</li>
                                <li><strong className="text-white">卡牌游戏：</strong> 具有可证明公平机制的战略 TCG 和扑克牌桌。</li>
                                <li><strong className="text-white">预测市场：</strong> 针对加密货币、体育和全球事件的实时预测。</li>
                                <li><strong className="text-white">单人游戏：</strong> 适合休闲游玩和即时奖励的街机风格游戏。</li>
                            </ul>
                        </div>
                    )
                },
                {
                    id: 'technology',
                    title: '技术栈',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                Nexus.GG 采用混合架构，提供高性能游戏体验与区块链安全性：
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h4 className="text-white font-bold mb-2">链下引擎</h4>
                                    <p className="text-sm">高频游戏逻辑和匹配在优化服务器上运行，确保零延迟游戏体验。</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h4 className="text-white font-bold mb-2">链上结算</h4>
                                    <p className="text-sm">资产、奖励和关键结果在链上进行验证和结算，以确保透明度。</p>
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'tokenomics',
                    title: '代币经济学',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                原生代币 <strong>$NEXUS</strong> 驱动整个生态系统，具有多种实用功能：
                            </p>
                            <ul className="list-none space-y-3">
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span><strong>治理：</strong> 代币持有者可以对平台更新和游戏上架进行投票。</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span><strong>质押：</strong> 通过质押 $NEXUS 赚取被动收益并解锁 VIP 等级。</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <span><strong>交易费用：</strong> 降低市场交易和游戏入场费用。</span>
                                </li>
                            </ul>
                        </div>
                    )
                },
                {
                    id: 'roadmap',
                    title: '发展路线图',
                    content: (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2"></div>
                                    <div className="w-0.5 h-full bg-white/10"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-bold text-white mb-1">第一阶段：测试与核心稳定 (2025 Q1)</h4>
                                    <p className="text-sm text-gray-400">扑克与猜拳上线，钱包接入，排行榜与稳定性优化。</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
                                    <div className="w-0.5 h-full bg-white/10"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-bold text-white mb-1">第二阶段：SDK 发布 (2025 Q2)</h4>
                                    <p className="text-sm text-gray-400">GameKit 与 gamverse-sdk 对外开放，第三方游戏接入。</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full mt-2"></div>
                                    <div className="w-0.5 h-full bg-white/10"></div>
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-lg font-bold text-white mb-1">第三阶段：市场与激励 (2025 Q3)</h4>
                                    <p className="text-sm text-gray-400">资产市场、赛季激励、排行榜扩展。</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-1">第四阶段：移动端与跨链 (2025 Q4)</h4>
                                    <p className="text-sm text-gray-400">iOS/Android 测试版、跨链桥、社交功能。</p>
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    id: 'security',
                    title: '安全与公平',
                    content: (
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                我们通过严格的审计和最佳实践优先保障用户安全：
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>可证明公平：</strong> 所有基于 RNG 的结果均可在链上验证。</li>
                                <li><strong>非托管钱包：</strong> 用户保留对其私钥和资产的完全控制权。</li>
                                <li><strong>反作弊：</strong> 先进的行为分析技术，用于检测和封禁竞技模式中的作弊者。</li>
                            </ul>
                        </div>
                    )
                }
            ]
        }
    };

    const icons = {
        intro: <Globe className="text-blue-400" />,
        ecosystem: <Layers className="text-purple-400" />,
        technology: <Cpu className="text-yellow-400" />,
        tokenomics: <Zap className="text-green-400" />,
        roadmap: <Map className="text-orange-400" />,
        security: <Shield className="text-red-400" />
    };

    const currentContent = content[lang];

    return (
        <div className="relative w-full min-h-screen pt-24 pb-12 px-4 md:px-8 overflow-y-auto animate-fade-in max-w-7xl mx-auto font-sans">
            {/* Language Toggle */}
            <div className="absolute top-24 right-8 z-50">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center">
                    <button
                        onClick={() => i18n.changeLanguage('en')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => i18n.changeLanguage('zh')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'zh' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        中文
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block mb-4"
                >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <FileText size={32} className="text-white" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                        {currentContent.title}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {currentContent.subtitle}
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 hidden lg:block">
                    <div className="sticky top-32 space-y-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-4">{currentContent.contents}</h3>
                        {currentContent.sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="block px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                            >
                                {section.title}
                            </a>
                        ))}
                        <div className="pt-8 pl-4">
                            <button className="w-full bg-[#ED4E33] hover:bg-[#d93d24] text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                <FileText size={16} /> {currentContent.download}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9 space-y-16">
                    {currentContent.sections.map((section) => (
                        <motion.section
                            id={section.id}
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="relative"
                        >
                            {/* Section Decorator */}
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-white/10 to-transparent rounded-full"></div>
                            
                            <div className="pl-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        {icons[section.id]}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                                </div>
                                
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl">
                                    {section.content}
                                </div>
                            </div>
                        </motion.section>
                    ))}

                    {/* Footer / Call to Action */}
                    <div className="mt-20 p-12 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-4">{currentContent.cta.title}</h3>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                {currentContent.cta.desc}
                            </p>
                            <button onClick={onBack} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                                {currentContent.cta.button}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhitepaperView;
