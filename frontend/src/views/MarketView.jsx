import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Grid, Layout, Star, ShoppingBag, User, Filter, Heart, MoreHorizontal, ArrowUpRight, LogOut, Wallet, Activity, Tag } from 'lucide-react';

const MarketView = () => {
    const [activeCategory, setActiveCategory] = useState('Art');
    const categories = ['Collection', 'Art', 'Sports', 'Gaming', 'Cards'];

    const config = {
        title: 'NFT Market',
        subtitle: 'Digital Assets',
        desc: 'Discover, collect, and trade extraordinary NFTs from top artists and game creators.',
        bg: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074&auto=format&fit=crop',
        color: '#eab308', // Yellow theme
    };

    // Mock Data
    const topList = [
        { 
            id: 201, 
            title: "DRQ_ #37909", 
            price: "12.78", 
            currency: "ETH", 
            image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=2564&auto=format&fit=crop",
            directBy: "9.7",
            type: "Legend"
        },
        { 
            id: 202, 
            title: "CYBER_ #9921", 
            price: "15.42", 
            currency: "ETH", 
            image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=2564&auto=format&fit=crop",
            directBy: "8.4",
            type: "Legend"
        }
    ];

    const rareNfts = [
        { 
            id: 101, 
            title: "Bored Ape", 
            creator: "5811EX", 
            comingBy: "45TY78", 
            priceString: "ETH 6/57 - X3 = [6570.344]", 
            image: "https://images.unsplash.com/photo-1620336655052-b967f036a30c?q=80&w=2574&auto=format&fit=crop",
            creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
            comingByAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
        },
        { 
            id: 102, 
            title: "Cyber Rabbit", 
            creator: "5811EX", 
            comingBy: "45TY78", 
            priceString: "ETH 6/57 - X3 = [6570.344]", 
            image: "https://images.unsplash.com/photo-1622547748225-3fc4abd2d00d?q=80&w=2572&auto=format&fit=crop",
            creatorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop",
            comingByAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop"
        },
        { 
            id: 103, 
            title: "Neon Punk", 
            creator: "5811EX", 
            comingBy: "45TY78", 
            priceString: "ETH 6/57 - X3 = [6570.344]", 
            image: "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=2556&auto=format&fit=crop",
            creatorAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop",
            comingByAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
        },
        { 
            id: 104, 
            title: "Pink Skull", 
            creator: "5811EX", 
            comingBy: "45TY78", 
            priceString: "ETH 6/57 - X3 = [6570.344]", 
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
            creatorAvatar: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=100&auto=format&fit=crop",
            comingByAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop"
        },
        { 
            id: 105, 
            title: "Space Kid", 
            creator: "5811EX", 
            comingBy: "45TY78", 
            priceString: "ETH 6/57 - X3 = [6570.344]", 
            image: "https://images.unsplash.com/photo-1645731504305-256c4c9660c7?q=80&w=2574&auto=format&fit=crop",
            creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
            comingByAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
        },
        { 
            id: 106, 
            title: "Lava Spirit", 
            creator: "5811EX", 
            comingBy: "45TY78", 
            priceString: "ETH 6/57 - X3 = [6570.344]", 
            image: "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2574&auto=format&fit=crop",
            creatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
            comingByAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&auto=format&fit=crop"
        },
    ];

    return (
        <div className="relative w-full min-h-screen pt-24 pb-12 px-4 md:px-8 overflow-y-auto animate-fade-in max-w-7xl mx-auto font-sans">
            
            {/* Header Section - Dynamic Dashboard (Consistent with Platform) */}
            <div className="relative w-full h-[45vh] max-h-[400px] min-h-[300px] rounded-3xl overflow-hidden border border-white/10 mb-12 group shadow-2xl">
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                {/* Background Image */}
                <img
                    src={config.bg}
                    alt={config.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[30s] ease-linear opacity-60"
                />

                <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between">
                    {/* Stats Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-xs md:text-sm font-mono bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border" style={{ borderColor: `${config.color}50`, color: config.color }}>
                            <ShoppingBag size={14} /> MARKETPLACE • LIVE
                        </div>
                        
                        <div className="flex gap-3">
                            <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                                <Wallet size={18} />
                            </div>
                            <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
                                <User size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="relative">
                        <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                            {config.title}
                        </h1>
                        
                        {/* Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mt-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search NFTs, Collections..." 
                                    className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-500"
                                />
                            </div>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Navigation */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-white/10">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 text-lg font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeCategory === cat
                                ? 'text-yellow-400'
                                : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        {cat}
                        {activeCategory === cat && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Column: Top NFT */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold uppercase tracking-wider text-yellow-400">Top NFT</h3>
                    </div>
                    
                    {topList.map(nft => (
                        <div key={nft.id} className="relative">
                             {/* Card Background with Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-b from-purple-600/20 to-transparent rounded-[2rem] blur opacity-50"></div>
                            
                            <div className="relative bg-[#0f172a] rounded-[2rem] p-6 border border-white/5 text-center overflow-hidden">
                                {/* Header Info */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-500 uppercase font-mono">Direct by</div>
                                        <div className="text-sm font-bold text-white">{nft.directBy} <span className="text-[10px] text-gray-600">★</span></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase font-mono">NFT type</div>
                                        <div className="text-sm font-bold text-white">{nft.type}</div>
                                    </div>
                                </div>

                                {/* Image with Effects */}
                                <div className="relative mx-auto w-48 h-48 mb-6 group cursor-pointer">
                                    <div className="absolute inset-0 rounded-full border-[1px] border-purple-500/30 scale-110 animate-pulse"></div>
                                    <div className="absolute inset-0 rounded-full border-[1px] border-cyan-500/30 scale-125 opacity-50"></div>
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#1e293b] shadow-[0_0_30px_rgba(168,85,247,0.2)] relative z-10">
                                        <img src={nft.image} alt={nft.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                </div>

                                {/* Title & Price */}
                                <h4 className="text-xl font-black text-[#bef264] mb-2 tracking-wide">{nft.title}</h4>
                                <div className="flex items-center justify-center gap-2 text-gray-400 font-mono text-sm mb-4">
                                    <span className="w-8 h-[1px] bg-gray-700"></span>
                                    {nft.currency} : {nft.price}
                                    <span className="w-8 h-[1px] bg-gray-700"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Rare NFT */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Rare NFT</h3>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                                <Layout size={16} />
                            </button>
                            <button className="p-2 bg-yellow-400 text-black rounded-lg border border-yellow-400 transition-colors">
                                <Grid size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rareNfts.map(nft => (
                            <div key={nft.id} className="bg-[#0f172a] rounded-3xl p-4 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 group">
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4 bg-[#1e293b]/50 p-2 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <img src={nft.creatorAvatar} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-mono leading-none mb-1">Direct by</span>
                                            <span className="text-xs font-bold text-white">{nft.creator}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-gray-500 font-mono leading-none mb-1">Coming by</span>
                                            <span className="text-xs font-bold text-white">{nft.comingBy}</span>
                                        </div>
                                        <img src={nft.comingByAvatar} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-black/20">
                                    <img src={nft.image} alt={nft.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur rounded-full hover:bg-red-500/80 hover:text-white transition-colors text-gray-300 opacity-0 group-hover:opacity-100">
                                        <Heart size={16} />
                                    </button>
                                </div>

                                {/* Price Info */}
                                <div className="mb-4">
                                    <div className="text-[10px] text-gray-500 font-mono mb-1">Price: {nft.priceString}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors text-gray-300">
                                        <ArrowUpRight size={14} /> View history
                                    </button>
                                    <button className="flex-1 py-3 rounded-xl bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
                                        Buy now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketView;
