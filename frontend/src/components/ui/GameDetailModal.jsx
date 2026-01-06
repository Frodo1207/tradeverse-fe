import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Coins, Trophy, Info, AlertCircle } from 'lucide-react';

const GameDetailModal = ({ game, isOpen, onClose, onPlay }) => {
    if (!isOpen || !game) return null;

    // Mock Rewards if not present in game object
    const rewards = game.rewards || [
        { token: "DOGE", min: 100, max: 300, chance: "High", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/50" },
        { token: "PEPE", min: 200, max: 300, chance: "Medium", color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/50" },
        { token: "SHIB", min: 1000, max: 5000, chance: "Low", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/50" }
    ];

    const ticketPrice = game.ticketPrice || "0.20 USDT";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f0f0f] w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col md:flex-row border border-white/10"
                        >
                            {/* Background Effects */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0f0f0f] to-[#0f0f0f] z-0"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] z-0 pointer-events-none"></div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-md border border-white/10"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Side: Game Visuals */}
                            <div className="w-full md:w-2/5 relative h-64 md:h-auto z-10">
                                <div className="absolute inset-0">
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {game.category || "Arcade"}
                                        </span>
                                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            Multiplayer
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white leading-tight mb-2">{game.title}</h2>
                                    <p className="text-gray-400 text-sm line-clamp-2">{game.description || "Experience the thrill of this classic arcade game reimagined for the crypto era."}</p>
                                </div>
                            </div>

                            {/* Right Side: Details & Actions */}
                            <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col z-10">

                                {/* Rewards Section */}
                                <div className="mb-8">
                                    <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                                        <Trophy className="text-yellow-400" size={20} />
                                        Potential Rewards
                                    </h3>
                                    <div className="grid gap-3">
                                        {rewards.map((reward, idx) => (
                                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${reward.border} ${reward.bg} relative overflow-hidden group`}>
                                                <div className="flex items-center gap-3 z-10">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-black/40 ${reward.color}`}>
                                                        {reward.token[0]}
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold ${reward.color}`}>{reward.min} - {reward.max} {reward.token}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Drop Rate: {reward.chance}</div>
                                                    </div>
                                                </div>
                                                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rules / Info */}
                                <div className="flex-1 mb-8">
                                    <h3 className="text-white font-bold flex items-center gap-2 mb-3">
                                        <Info className="text-blue-400" size={18} />
                                        Game Rules
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5"></span>
                                            Pay the entry fee to start a round.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5"></span>
                                            Achieve the target score to unlock the reward chest.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5"></span>
                                            Rewards are distributed randomly via smart contract.
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Bar */}
                                <div className="bg-[#111] border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Entry Fee</div>
                                        <div className="text-2xl font-black text-white flex items-center gap-2">
                                            {ticketPrice}
                                        </div>
                                    </div>
                                    <button
                                        onClick={onPlay}
                                        className="flex-1 bg-[#ED4E33] hover:bg-[#d93d24] text-white font-bold py-3 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-[#ED4E33]/50 flex items-center justify-center gap-2"
                                    >
                                        <Play fill="currentColor" size={20} />
                                        PLAY NOW
                                    </button>
                                </div>
                                <div className="text-center mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
                                    <AlertCircle size={12} />
                                    <span>Fair Play Guaranteed via Chainlink VRF</span>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GameDetailModal;
