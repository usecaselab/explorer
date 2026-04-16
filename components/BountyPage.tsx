import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ArrowLeft, Coins, Trophy, Wallet, Info, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { getTokenBalance, getTokenSymbol, BOUNTY_POOL_USD, TOKEN_ADDRESS } from '../token';
import type { IdeaEntry } from './IdeaPage';
import { parseIdeaMarkdown } from './IdeaShowcase';

// --- Vote storage ---
const VOTES_KEY = 'ucl_bounty_votes';

interface VoteMap {
  [ideaId: string]: number; // token-weighted votes allocated by the connected user
}

function loadVotes(address: string): VoteMap {
  try {
    const raw = localStorage.getItem(`${VOTES_KEY}_${address.toLowerCase()}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveVotes(address: string, votes: VoteMap) {
  localStorage.setItem(`${VOTES_KEY}_${address.toLowerCase()}`, JSON.stringify(votes));
}

// Global cumulative votes across all wallets (simulated with localStorage)
const GLOBAL_KEY = 'ucl_bounty_global';

function loadGlobalVotes(): VoteMap {
  try {
    const raw = localStorage.getItem(GLOBAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGlobalVotes(votes: VoteMap) {
  localStorage.setItem(GLOBAL_KEY, JSON.stringify(votes));
}

// --- Helpers ---
function formatUSD(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// --- Component ---
interface BountyPageProps {
  onBack: () => void;
  onSelectIdea: (idea: IdeaEntry) => void;
}

const BountyPage: React.FC<BountyPageProps> = ({ onBack, onSelectIdea }) => {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const address = wallets[0]?.address as `0x${string}` | undefined;

  const [ideas, setIdeas] = useState<IdeaEntry[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [symbol, setSymbol] = useState('TOKEN');
  const [loadingBalance, setLoadingBalance] = useState(false);

  // My votes: ideaId → raw token amount allocated
  const [myVotes, setMyVotes] = useState<VoteMap>({});
  // Global aggregate votes
  const [globalVotes, setGlobalVotes] = useState<VoteMap>(loadGlobalVotes);

  // Total tokens I've allocated so far
  const totalAllocated = useMemo(
    () => Object.values(myVotes).reduce((a, b) => a + b, 0),
    [myVotes]
  );

  const balanceNumber = useMemo(
    () => Number(tokenBalance) / 10 ** tokenDecimals,
    [tokenBalance, tokenDecimals]
  );

  const remainingVotingPower = Math.max(0, balanceNumber - totalAllocated);

  // Load ideas
  useEffect(() => {
    const load = async () => {
      try {
        const manifestRes = await fetch('/data/ideas/manifest.json');
        const manifest: string[] = await manifestRes.json();
        const loaded = await Promise.all(
          manifest.map(async (filename) => {
            const res = await fetch(`/data/ideas/${filename}`);
            if (!res.ok) return null;
            const text = await res.text();
            return parseIdeaMarkdown(text, filename.replace('.md', ''));
          })
        );
        setIdeas(loaded.filter(Boolean) as IdeaEntry[]);
      } finally {
        setLoadingIdeas(false);
      }
    };
    load();
  }, []);

  // Load token balance + saved votes when wallet connects
  useEffect(() => {
    if (!address) {
      setTokenBalance(0n);
      setMyVotes({});
      return;
    }
    setLoadingBalance(true);
    Promise.all([
      getTokenBalance(address),
      getTokenSymbol(),
    ]).then(([bal, sym]) => {
      setTokenBalance(bal.raw);
      setSymbol(sym);
    }).finally(() => setLoadingBalance(false));

    setMyVotes(loadVotes(address));
  }, [address]);

  const handleVote = useCallback((ideaId: string, delta: number) => {
    if (!address) return;

    setMyVotes(prev => {
      const current = prev[ideaId] ?? 0;
      const next = Math.max(0, current + delta);
      const newTotal = totalAllocated - current + next;

      // Can't allocate more than balance
      if (newTotal > balanceNumber) return prev;

      const updated = { ...prev, [ideaId]: next };
      if (updated[ideaId] === 0) delete updated[ideaId];

      saveVotes(address, updated);

      // Update global: remove old contribution, add new
      setGlobalVotes(g => {
        const updated_g = { ...g };
        updated_g[ideaId] = Math.max(0, (updated_g[ideaId] ?? 0) - current + next);
        if (updated_g[ideaId] === 0) delete updated_g[ideaId];
        saveGlobalVotes(updated_g);
        return updated_g;
      });

      return updated;
    });
  }, [address, totalAllocated, balanceNumber]);

  const totalGlobalVotes = useMemo(
    () => Object.values(globalVotes).reduce((a, b) => a + b, 0),
    [globalVotes]
  );

  // Sort ideas by bounty (global votes) descending
  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => (globalVotes[b.id] ?? 0) - (globalVotes[a.id] ?? 0));
  }, [ideas, globalVotes]);

  const getBountyForIdea = (ideaId: string) => {
    if (totalGlobalVotes === 0) return 0;
    return (BOUNTY_POOL_USD * (globalVotes[ideaId] ?? 0)) / totalGlobalVotes;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      {/* Page header */}
      <div className="pt-8 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Bounties</h1>
            <p className="mt-2 text-gray-500 text-sm max-w-xl">
              Token fees fund a shared bounty pool. Connect your wallet and vote on which ideas deserve funding — your voting power equals your token holdings.
            </p>
          </div>

          {/* Pool stats */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 shrink-0">
            <Coins className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-xs text-gray-500">Bounty Pool</div>
              <div className="font-heading font-bold text-lg">{formatUSD(BOUNTY_POOL_USD)}</div>
            </div>
          </div>
        </div>

        {/* Token contract link */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="w-3 h-3" />
          <span>Token: </span>
          <a
            href={`https://basescan.org/token/${TOKEN_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-black transition-colors"
          >
            {TOKEN_ADDRESS.slice(0, 10)}…{TOKEN_ADDRESS.slice(-6)}
          </a>
          <span className="text-gray-300">· Base</span>
        </div>
      </div>

      {/* Wallet panel */}
      <div className="mb-8 p-4 sm:p-5 rounded-xl border border-gray-100 bg-gray-50">
        {!ready || loadingBalance ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading wallet…
          </div>
        ) : !authenticated ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Connect your wallet to vote</p>
              <p className="text-xs text-gray-400 mt-0.5">Voting power = your {symbol} balance</p>
            </div>
            <button
              onClick={login}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Wallet className="w-3.5 h-3.5" /> Connect Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-sm font-mono">{address ? shortenAddress(address) : ''}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {balanceNumber.toLocaleString()} {symbol} · {remainingVotingPower.toLocaleString()} unallocated
              </p>
            </div>
            {/* Voting power bar */}
            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Voting power used</span>
                <span>{balanceNumber > 0 ? Math.round((totalAllocated / balanceNumber) * 100) : 0}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${balanceNumber > 0 ? Math.min(100, (totalAllocated / balanceNumber) * 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ideas list */}
      {loadingIdeas ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="space-y-3">
          {sortedIdeas.map((idea, rank) => {
            const bounty = getBountyForIdea(idea.id);
            const myAlloc = myVotes[idea.id] ?? 0;
            const globalAlloc = globalVotes[idea.id] ?? 0;
            const pct = totalGlobalVotes > 0 ? (globalAlloc / totalGlobalVotes) * 100 : 0;

            return (
              <div key={idea.id} className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-white transition-all">
                {/* Rank */}
                <div className="w-6 text-center text-xs font-mono text-gray-300 shrink-0">
                  {rank === 0 && globalAlloc > 0 ? <Trophy className="w-4 h-4 text-amber-400 mx-auto" /> : `#${rank + 1}`}
                </div>

                {/* Title & domains */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => onSelectIdea(idea)}
                    className="text-sm font-medium text-left hover:underline line-clamp-1"
                  >
                    {idea.title}
                  </button>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {idea.domains.slice(0, 2).map(d => (
                      <span key={d} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">{d}</span>
                    ))}
                  </div>
                </div>

                {/* Vote bar */}
                <div className="hidden sm:block w-32">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{pct.toFixed(1)}%</span>
                    <span>{globalAlloc.toLocaleString()} votes</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Bounty amount */}
                <div className="text-right shrink-0 w-16">
                  <div className="text-sm font-mono font-semibold text-emerald-700">
                    {bounty > 0 ? formatUSD(bounty) : '—'}
                  </div>
                  <div className="text-xs text-gray-400">bounty</div>
                </div>

                {/* Vote buttons */}
                {authenticated && (
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleVote(idea.id, 1)}
                      disabled={remainingVotingPower < 1}
                      className="p-1 rounded hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Allocate 1 vote"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-gray-600 w-6 text-center">
                      {myAlloc > 0 ? myAlloc.toLocaleString() : '—'}
                    </span>
                    <button
                      onClick={() => handleVote(idea.id, -1)}
                      disabled={myAlloc === 0}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Remove 1 vote"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* How it works */}
      <div className="mt-12 p-5 rounded-xl bg-gray-50 border border-gray-100">
        <h3 className="font-heading font-semibold text-sm mb-3">How it works</h3>
        <ol className="space-y-2 text-sm text-gray-500 list-decimal list-inside">
          <li>Trading fees generated by the token accumulate into the bounty pool.</li>
          <li>Connect your wallet — your token balance becomes your voting power.</li>
          <li>Allocate votes to ideas proportionally to signal where bounties should go.</li>
          <li>Bounty allocation updates in real-time based on vote distribution.</li>
        </ol>
      </div>
    </div>
  );
};

export default BountyPage;
