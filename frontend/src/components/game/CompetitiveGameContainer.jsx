import React, { useEffect, useState, Suspense } from 'react';
import { X, Users, Loader2, Coins, Swords } from 'lucide-react';
import { matchService } from '../../services/api';
import { getGameConfig } from './GameRegistry';

const CompetitiveGameContainer = ({ gameId, onClose }) => {
  const base = getGameConfig(gameId);
  const [matchId, setMatchId] = useState(null);
  const [players, setPlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [committed, setCommitted] = useState(0);
  const [betAmount, setBetAmount] = useState(10);
  const [currency, setCurrency] = useState('USDT');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);
  const [startedFlag, setStartedFlag] = useState(false);

  const handleStartMatching = async () => {
    setMatching(true);
    setError(null);
    try {
      const res = await matchService.find();
      setMatchId(res.matchId);
      setBetAmount(res.betAmount || 10);
      setCurrency(res.currency || 'USDT');
      setMaxPlayers(res.maxPlayers || 2);
      setPlayers(res.players || 1);
      setCommitted(res.committed || 0);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Failed to start matching');
      setMatching(false);
    }
  };

  const handleCommit = async () => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await matchService.commit({ matchId });
      setSessionId(res.sessionId);
      if (typeof res.committed === 'number') setCommitted(res.committed);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Failed to commit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    const poll = async () => {
      if (!matchId) return;
      try {
        const st = await matchService.status({ matchId });
        setPlayers(st.players || 0);
        setMaxPlayers(st.maxPlayers || 2);
        setCommitted(st.committed || 0);
      } catch {}
      timer = setTimeout(poll, 1500);
    };
    poll();
    return () => timer && clearTimeout(timer);
  }, [matchId, matching]);

  useEffect(() => {
    const autoStart = async () => {
      if (!matchId || startedFlag) return;
      if (committed >= maxPlayers) {
        try {
          await matchService.start({ matchId });
          setStartedFlag(true);
        } catch {}
      }
    };
    autoStart();
  }, [matchId, committed, startedFlag, maxPlayers]);

  const handleCancel = async () => {
    if (!matchId) {
      setMatching(false);
      return;
    }
    try {
      await matchService.cancel({ matchId });
    } catch {}
    setMatchId(null);
    setMatching(false);
    setPlayers(0);
    setSessionId(null);
    setCommitted(0);
    setStartedFlag(false);
  };

  const handleFinish = async (winners) => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
    try {
      await matchService.finish({ matchId, sessionId, winners });
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Failed to finish match');
    } finally {
      setLoading(false);
    }
  };

  const canStart = committed >= maxPlayers && !!sessionId;

  return (
    <div className="fixed inset-0 z-50 flex flex-col p-4 md:p-8 relative overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#0f0518] to-black bg-[length:400%_400%] animate-gradient-slow">
      <div className="relative z-10 flex justify-between items-center mb-4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        <div className="text-white font-bold flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${matchId ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
          Competitive: <span className="text-red-400">{gameId?.toUpperCase() || 'GAME'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="text-white font-black text-xl mb-2 flex items-center gap-2"><Swords size={18} /> Match Setup</div>
          <div className="text-gray-400 text-sm mb-4">Bet: <span className="text-white font-bold">{betAmount} {currency}</span></div>
          <div className="text-gray-400 text-sm mb-4 flex items-center gap-2"><Users size={16} /> Players: <span className="text-white font-bold">{players}/{maxPlayers}</span></div>
          {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2 text-xs mb-3">{error}</div>}
          {!matching ? (
            <button onClick={handleStartMatching} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Swords size={16} /> Start Matching
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                {players < maxPlayers ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Matching... {players}/{maxPlayers}
                  </>
                ) : committed < maxPlayers ? (
                  <>Ready {committed}/{maxPlayers}</>
                ) : (
                  <>Ready {committed}/{maxPlayers}</>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handleCancel} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl">Cancel</button>
                <button onClick={handleCommit} disabled={players < maxPlayers || loading} className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-2 rounded-xl">Join & Pay</button>
              </div>
            </div>
          )}
          {canStart && <div className="mt-3 text-xs text-green-400">Ready. Both players joined.</div>}
          {canStart && <button onClick={() => handleFinish()} className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2"><Coins size={16} /> Finish</button>}
        </div>

        <div className="md:col-span-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex items-center justify-center">
          {canStart && base?.type === 'react' ? (
            <Suspense fallback={<div className="text-white">Loading...</div>}>
              <base.component matchId={matchId} sessionId={sessionId} betAmount={betAmount} betCurrency={currency} onFinished={() => {}} />
            </Suspense>
          ) : (
            <div className="text-gray-400 text-sm">Waiting for players...</div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-4 text-center text-xs text-gray-600 font-mono">NEXUS.GG Competitive Engine</div>
    </div>
  );
};

export default CompetitiveGameContainer;
