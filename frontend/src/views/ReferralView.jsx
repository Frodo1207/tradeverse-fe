import React, { useState } from 'react';
import {
    Users, Copy, Share2, DollarSign, TrendingUp,
    ArrowRight, Gift, ShieldCheck, ChevronRight
} from 'lucide-react';

const ReferralView = ({ onBack }) => {
    const [copied, setCopied] = useState(false);

    // Mock Data
    const inviteCode = "VENSON-777";
    const inviteLink = `https://ploygamverse.io/register?ref=${inviteCode}`;

    const stats = {
        totalEarned: "1,250.50",
        pendingCommission: "145.20",
        totalInvited: 42,
        activeReferrals: 18
    };

    const referrals = [
        { id: 1, user: "CryptoKing***", date: "2024-03-20", volume: "$12,500", commission: "$125.00", status: "Active" },
        { id: 2, user: "MoonWalker***", date: "2024-03-18", volume: "$4,200", commission: "$42.00", status: "Active" },
        { id: 3, user: "DiamondHand***", date: "2024-03-15", volume: "$850", commission: "$8.50", status: "Inactive" },
        { id: 4, user: "WhaleWatcher***", date: "2024-03-10", volume: "$25,000", commission: "$250.00", status: "Active" },
        { id: 5, user: "DogeFather***", date: "2024-03-05", volume: "$1,200", commission: "$12.00", status: "Active" },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative w-full min-h-screen pt-24 pb-12 px-4 md:px-8 overflow-y-auto animate-fade-in max-w-7xl mx-auto">

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay z-0"></div>

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-purple-400 font-bold mb-4">
                            <Gift size={20} /> PARTNER PROGRAM
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Invite Friends.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Earn Forever.</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-8">
                            Get up to <span className="text-white font-bold">20% commission</span> on every wager your friends make. Instant payouts, no caps, lifetime earnings.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <ShieldCheck size={16} className="text-green-400" /> Transparent Tracking
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <DollarSign size={16} className="text-yellow-400" /> Instant Payouts
                            </div>
                        </div>
                    </div>

                    {/* Invite Card */}
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full md:w-auto min-w-[350px] shadow-2xl">
                        <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 text-center">Your Exclusive Invite Code</div>
                        <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 mb-4 flex items-center justify-between">
                            <span className="text-2xl font-mono font-bold text-white tracking-widest">{inviteCode}</span>
                            <button
                                onClick={handleCopy}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {copied ? <span className="text-green-400 text-xs font-bold">COPIED</span> : <Copy size={20} />}
                            </button>
                        </div>
                        <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                            <Share2 size={18} /> Share Invite Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} />
                    </div>
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Earnings</div>
                    <div className="text-4xl font-black text-white mb-1">${stats.totalEarned}</div>
                    <div className="text-green-400 text-xs font-bold flex items-center gap-1">
                        <TrendingUp size={12} /> +12% this week
                    </div>
                </div>

                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} />
                    </div>
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Invited</div>
                    <div className="text-4xl font-black text-white mb-1">{stats.totalInvited}</div>
                    <div className="text-purple-400 text-xs font-bold">
                        {stats.activeReferrals} Active Users
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden">
                    <div className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-2">Available to Claim</div>
                    <div className="text-4xl font-black text-white mb-4">${stats.pendingCommission}</div>
                    <button className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-4 rounded-lg text-sm transition-colors w-full">
                        Claim Commission
                    </button>
                </div>
            </div>

            {/* Referral List */}
            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Referral History</h3>
                    <button className="text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors flex items-center gap-1">
                        View All <ChevronRight size={16} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold">User</th>
                                <th className="p-4 font-bold">Date Joined</th>
                                <th className="p-4 font-bold">Total Volume</th>
                                <th className="p-4 font-bold">Commission</th>
                                <th className="p-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {referrals.map((ref) => (
                                <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-white font-bold">{ref.user}</td>
                                    <td className="p-4 text-gray-400 text-sm">{ref.date}</td>
                                    <td className="p-4 text-white font-bold">{ref.volume}</td>
                                    <td className="p-4 text-green-400 font-bold">+{ref.commission}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${ref.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {ref.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="fixed bottom-8 left-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all z-50 group"
            >
                <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default ReferralView;
