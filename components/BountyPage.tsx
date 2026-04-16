import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowLeft, Coins, Trophy, Wallet, Info, ChevronUp, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { getTokenBalance, getBountyPool, TOKEN_ADDRESS, TOKEN_SYMBOL, FEE_RECIPIENT, VOTE_INCREMENT, formatTokenAmount } from '../token';
import type { IdeaEntry } from './IdeaPage';
import { parseIdeaMarkdown } from './IdeaShowcase';

// --- Vote storage (localStorage) ---
const VOTES_KEY = 'ucl_bounty_votes_v2';
const GLOBAL_KEY = 'ucl_bounty_global_v2';

interface VoteMap { [ideaId: string]: number }

function loadVotes(address: string): VoteMap {
  try { return JSON.parse(localStorage.getItem(`${VOTES_KEY}_${address.toLowerCase()}`) ?? '{}'); } catch { return {}; }
}
function saveVotes(address: string, votes: VoteMap) {
  localStorage.setItem(`${VOTES_KEY}_${address.toLowerCase()}`, JSON.stringify(votes));
}
function loadGlobalVotes(): VoteMap {
  try { return JSON.parse(localStorage.getItem(GLOBAL_KEY) ?? '{}'); } catch { return {}; }
}
function saveGlobalVotes(votes: VoteMap) {
  localStorage.setItem(GLOBAL_KEY, JSON.stringify(votes));
}

function formatUSD(n: number) {
  if (n === 0) return '$0';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}

// --- Component ---
interface BountyPageProps {
  onBack: () => void;
  onSelectIdea: (idea: IdeaEntry) => void;
  initialSearch?: string;
}

const BountyPage: React.FC<BountyPageProps> = ({ onBack, onSelectIdea, initialSearch = '' }) => {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const address = wallets[0]?.address as `0x${string}` | undefined;

  const [ideas, setIdeas] = useState<IdeaEntry[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [bountyPool, setBountyPool] = useState<{ weth: number; usd: number } | null>(null);
  const [search, setSearch] = useState(initialSearch);

  // Sync if parent changes initialSearch (e.g. "Help Fund this Idea" navigates here)
  useEffect(() => { setSearch(initialSearch); }, [initialSearch]);

  const [myVotes, setMyVotes] = useState<VoteMap>({});
  const [globalVotes, setGlobalVotes] = useState<VoteMap>(loadGlobalVotes);

  const totalAllocated = useMemo(() => Object.values(myVotes).reduce((a, b) => a + b, 0), [myVotes]);
  const remainingPower = Math.max(0, tokenBalance - totalAllocated);

  // Load ideas
  useEffect(() => {
    (async () => {
      try {
        const manifest: string[] = await (await fetch('/data/ideas/manifest.json')).json();
        const loaded = await Promise.all(manifest.map(async f => {
          const res = await fetch(`/data/ideas/${f}`);
          if (!res.ok) return null;
          return parseIdeaMarkdown(await res.text(), f.replace('.md', ''));
        }));
        setIdeas(loaded.filter(Boolean) as IdeaEntry[]);
      } finally { setLoadingIdeas(false); }
    })();
  }, []);

  // Load bounty pool from on-chain
  useEffect(() => {
    getBountyPool().then(setBountyPool);
  }, []);

  // Load token balance + saved votes when wallet connects
  useEffect(() => {
    if (!address) { setTokenBalance(0); setMyVotes({}); return; }
    setLoadingBalance(true);
    getTokenBalance(address).then(b => setTokenBalance(b.number)).finally(() => setLoadingBalance(false));
    setMyVotes(loadVotes(address));
  }, [address]);

  const handleVote = useCallback((ideaId: string, delta: number) => {
    if (!address) return;
    const increment = VOTE_INCREMENT * delta;
    setMyVotes(prev => {
      const current = prev[ideaId] ?? 0;
      const next = Math.max(0, current + increment);
      const newTotal = totalAllocated - current + next;
      if (newTotal > tokenBalance) return prev;
      const updated = { ...prev, [ideaId]: next };
      if (updated[ideaId] === 0) delete updated[ideaId];
      saveVotes(address, updated);
      setGlobalVotes(g => {
        const ng = { ...g, [ideaId]: Math.max(0, (g[ideaId] ?? 0) - current + next) };
        if (ng[ideaId] === 0) delete ng[ideaId];
        saveGlobalVotes(ng);
        return ng;
      });
      return updated;
    });
  }, [address, totalAllocated, tokenBalance]);

  const totalGlobalVotes = useMemo(() => Object.values(globalVotes).reduce((a, b) => a + b, 0), [globalVotes]);

  const getBountyForIdea = (ideaId: string) => {
    if (!bountyPool || totalGlobalVotes === 0) return 0;
    return bountyPool.usd * ((globalVotes[ideaId] ?? 0) / totalGlobalVotes);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ideas;
    return ideas.filter(i => i.title.toLowerCase().includes(q) || i.domains.some(d => d.includes(q)));
  }, [ideas, search]);

  const sortedIdeas = useMemo(() => {
    return [...filtered].sort((a, b) => (globalVotes[b.id] ?? 0) - (globalVotes[a.id] ?? 0));
  }, [filtered, globalVotes]);

  const pctUsed = tokenBalance > 0 ? Math.min(100, (totalAllocated / tokenBalance) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-16">

      {/* Page header */}
      <div className="pt-8 pb-4">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Bounties</h1>
            <p className="mt-1.5 text-gray-500 text-sm max-w-lg">
              Token trading fees fund a bounty pool. Vote with your {TOKEN_SYMBOL} holdings to direct funding toward ideas.
            </p>
          </div>
          {/* Pool stat — links to fee recipient on BaseScan */}
          <a
            href={`https://basescan.org/address/${FEE_RECIPIENT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-4 py-3 shrink-0 self-start group"
          >
            <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">Fee Pool ↗</div>
              <div className="font-heading font-bold text-lg leading-tight">
                {bountyPool === null ? '…' : bountyPool.usd > 0 ? formatUSD(bountyPool.usd) : `${bountyPool.weth.toFixed(4)} ETH`}
              </div>
            </div>
          </a>
        </div>

        {/* Token link */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="w-3 h-3 shrink-0" />
          <a href={`https://bankr.bot/launches/${TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
            ${TOKEN_SYMBOL}
          </a>
          <span className="text-gray-300">·</span>
          <span>Base</span>
          <span className="text-gray-300">·</span>
          <span className="font-mono text-gray-300">{TOKEN_ADDRESS.slice(0, 8)}…{TOKEN_ADDRESS.slice(-6)}</span>
        </div>
      </div>

      {/* Wallet panel — compact */}
      <div className="mb-5 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50">
        {!ready || loadingBalance ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading wallet…
          </div>
        ) : !authenticated ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-500">Connect wallet to vote with your {TOKEN_SYMBOL}</span>
            <button onClick={login} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors shrink-0">
              <Wallet className="w-3 h-3" /> Connect
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="min-w-0">
              <span className="text-xs font-mono text-gray-600">{address ? `${address.slice(0,6)}…${address.slice(-4)}` : ''}</span>
              <span className="text-xs text-gray-400 ml-2">{formatTokenAmount(tokenBalance)} {TOKEN_SYMBOL}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{formatTokenAmount(totalAllocated)} allocated</span>
                <span>{pctUsed.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pctUsed}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { n: '1', label: 'Fees accumulate', sub: `${TOKEN_SYMBOL} trading fees fund the pool` },
          { n: '2', label: 'Connect wallet', sub: 'Your balance = voting power' },
          { n: '3', label: 'Vote in 10M steps', sub: 'Allocate tokens to ideas' },
          { n: '4', label: 'Bounties update', sub: 'Distribution shifts in real-time' },
        ].map(s => (
          <div key={s.n} className="flex flex-col gap-1 px-3 py-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-mono text-gray-300">{s.n}</span>
            <span className="text-xs font-semibold text-gray-700 leading-snug">{s.label}</span>
            <span className="text-xs text-gray-400 leading-snug">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search ideas…"
          className="w-full pl-9 pr-8 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-gray-50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Ideas list */}
      {loadingIdeas ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
        </div>
      ) : sortedIdeas.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No ideas match "{search}"</div>
      ) : (
        <div className="space-y-2">
          {sortedIdeas.map((idea, rank) => {
            const bounty = getBountyForIdea(idea.id);
            const myAlloc = myVotes[idea.id] ?? 0;
            const globalAlloc = globalVotes[idea.id] ?? 0;
            const pct = totalGlobalVotes > 0 ? (globalAlloc / totalGlobalVotes) * 100 : 0;
            const canUp = authenticated && remainingPower >= VOTE_INCREMENT;
            const canDown = authenticated && myAlloc >= VOTE_INCREMENT;

            return (
              <div key={idea.id} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white transition-all">
                {/* Rank */}
                <div className="w-5 text-center shrink-0">
                  {rank === 0 && globalAlloc > 0
                    ? <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto" />
                    : <span className="text-xs font-mono text-gray-300">#{rank + 1}</span>}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <button onClick={() => onSelectIdea(idea)} className="text-sm font-medium text-left hover:underline line-clamp-1 w-full text-left">
                    {idea.title}
                  </button>
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {idea.domains.slice(0, 2).map(d => (
                      <span key={d} className="text-xs px-1.5 py-px bg-gray-100 text-gray-400 rounded">{d}</span>
                    ))}
                  </div>
                </div>

                {/* Vote bar */}
                <div className="hidden sm:block w-24 shrink-0">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 text-right">{pct.toFixed(1)}%</div>
                </div>

                {/* Bounty */}
                <div className="text-right shrink-0 w-14">
                  <div className="text-sm font-mono font-semibold text-emerald-700">{bounty > 0 ? formatUSD(bounty) : '—'}</div>
                  <div className="text-xs text-gray-300">bounty</div>
                </div>

                {/* Vote controls */}
                {authenticated && (
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <button onClick={() => handleVote(idea.id, 1)} disabled={!canUp}
                      className="p-1 rounded hover:bg-emerald-50 text-gray-300 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-gray-500 leading-none">
                      {myAlloc > 0 ? formatTokenAmount(myAlloc) : '—'}
                    </span>
                    <button onClick={() => handleVote(idea.id, -1)} disabled={!canDown}
                      className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default BountyPage;
