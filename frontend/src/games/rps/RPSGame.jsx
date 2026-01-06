import React, { useEffect, useState } from 'react';
import { Swords, Hand, Loader2, CheckCircle2 } from 'lucide-react';
import { matchService, gameService } from '../../services/api';
import { useWallet } from '../../contexts/WalletContext';

const RPSGame = ({ matchId, sessionId, betAmount, betCurrency }) => {
  const { refreshBalance } = useWallet();
  const [started, setStarted] = useState(false);
  const [move, setMove] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('pending');
  const [result, setResult] = useState('');
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState(null);
  const [movesSubmitted, setMovesSubmitted] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [confirmed, setConfirmed] = useState(0);
  const [localConfirmed, setLocalConfirmed] = useState(false);

  useEffect(() => {
    const init = async () => {
      try { const st = await matchService.status({ matchId }); setStarted(!!st.started); } catch {}
      try { await matchService.start({ matchId }); setStarted(true); } catch {}
    };
    init();
  }, [matchId]);

  const submitMove = async (m) => {
    if (!matchId || !sessionId) return;
    setSubmitting(true); setError(null); setMove(m);
    try { await matchService.submit({ matchId, sessionId, move: m }); } catch (e) { setError(e?.response?.data?.error || e.message || 'Failed to submit move'); }
    setSubmitting(false);
  };

  const finish = async () => {
    try {
      const res = await matchService.finish({ matchId, sessionId });
      setLocalConfirmed(true);
      if (typeof res.confirmed === 'number') setConfirmed(res.confirmed);
      if (res.message === 'waiting_other_confirm') {
        // 对方未确认，等待轮询推进
      }
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Failed to finish');
    }
  };

  useEffect(() => {
    let tid;
    const poll = async () => {
      try {
        const res = await gameService.userSessions({ limit: 10 });
        const list = res.data || [];
        const found = list.find(s => s.sessionId === sessionId);
        if (found) {
          setStatus(found.status || 'pending');
          setResult(found.result || '');
          if (found.metadata) {
            try {
              const m = JSON.parse(found.metadata);
              const details = m.details || {};
              const r = Array.isArray(details.rewards) ? details.rewards : [];
              setRewards(r.map(x => ({ currency: x.currency, amount: Number(x.amount) })));
            } catch {}
          }
          if (found.status === 'settled') { refreshBalance(); }
        }
        try {
          const ms = await matchService.status({ matchId });
          setMovesSubmitted(ms.movesSubmitted || 0);
          setMaxPlayers(ms.maxPlayers || 2);
          setConfirmed(ms.confirmed || 0);
        } catch {}
      } catch {}
      tid = setTimeout(poll, 2000);
    };
    poll();
    return () => tid && clearTimeout(tid);
  }, [sessionId, refreshBalance, matchId]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <div className="text-2xl font-black mb-2 flex items-center gap-2"><Swords size={20} /> RPS Duel</div>
      <div className="text-xs text-gray-400 mb-4">Bet: {betAmount} {betCurrency}</div>
      {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 text-xs mb-3">{error}</div>}
      {!started ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 size={16} className="animate-spin" /> Waiting for start...</div>
      ) : (
        <>
          <div className="flex gap-3 mb-4">
            {['rock','paper','scissors'].map(m => (
              <button key={m} onClick={() => submitMove(m)} disabled={submitting || status==='settled'} className={`px-4 py-3 rounded-xl border ${move===m?'border-green-500 text-green-400':'border-white/10 text-white'} bg-white/5 hover:bg-white/10`}>{m.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={finish} disabled={status==='settled' || movesSubmitted < maxPlayers || localConfirmed} className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2">
            <Hand size={16} /> Finish
          </button>
          {movesSubmitted < maxPlayers && (
            <div className="mt-2 text-xs text-yellow-400">Waiting for opponent move...</div>
          )}
          {movesSubmitted >= maxPlayers && !status==='settled' && (
            <div className="mt-2 text-xs text-yellow-400">Confirmations: {confirmed}/{maxPlayers}</div>
          )}
          <div className="mt-3 text-xs text-gray-400 font-mono">Status: {status} {result && (<span className={`ml-2 ${result==='WIN'?'text-green-400':'text-red-400'} font-bold`}>{result}</span>)} </div>
          {status==='settled' && (
            <div className="mt-3 bg-white/5 border border-white/10 rounded-lg p-3 w-64">
              <div className="text-sm text-white font-bold mb-1 flex items-center gap-1"><CheckCircle2 size={16} /> Rewards</div>
              {rewards.length>0 ? rewards.map((rw,i)=>(<div key={i} className="text-xs text-green-400 font-mono">+{rw.amount.toLocaleString(undefined,{minimumFractionDigits: rw.currency==='USDT'?2:8, maximumFractionDigits: rw.currency==='USDT'?2:8})} {rw.currency}</div>)) : <div className="text-xs text-gray-400">No rewards</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RPSGame;
