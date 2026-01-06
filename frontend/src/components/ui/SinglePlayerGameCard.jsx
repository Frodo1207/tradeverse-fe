import React from 'react';
import { Star, User, Trophy, Play } from 'lucide-react';

const SinglePlayerGameCard = ({ title, genre, progress, image, rating, players, onClick }) => (
    <div onClick={onClick} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#4ade80] hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-all duration-300 group cursor-pointer flex flex-col h-full relative">
        {/* Image Header */}
        <div className="relative h-40 w-full overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80"></div>

            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[#4ade80] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-[#4ade80]/30">
                <Star size={10} fill="currentColor" /> {rating}
            </div>

            <div className="absolute bottom-2 left-4">
                <div className="text-[10px] font-bold bg-[#4ade80] text-black px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                    {genre}
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1 relative">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg text-white group-hover:text-[#4ade80] transition-colors leading-tight">{title}</h4>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1"><User size={12} /> {players}</span>
                <span className="flex items-center gap-1"><Trophy size={12} /> Rank #120</span>
            </div>

            <div className="mt-auto space-y-2">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase">
                    <span>Completion</span>
                    <span className="text-white">{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-[#4ade80]" style={{ width: `${progress}%` }}></div>
                </div>

                <button className="w-full mt-4 bg-white/5 hover:bg-[#4ade80] hover:text-black text-white text-xs font-bold py-2.5 rounded border border-white/10 group-hover:border-transparent transition-all flex items-center justify-center gap-2">
                    <Play size={12} fill="currentColor" /> PLAY NOW
                </button>
            </div>
        </div>
    </div>
);

export default SinglePlayerGameCard;
