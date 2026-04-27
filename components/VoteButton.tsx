import React, { useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { vote, unvote } from '../lib/api';
import SignInModal from './SignInModal';

interface VoteButtonProps {
  ideaId: string;
  votes: number;
  voted: boolean;
  size?: 'sm' | 'md';
  onChange?: (next: { votes: number; voted: boolean }) => void;
}

export default function VoteButton({
  ideaId,
  votes,
  voted,
  size = 'md',
  onChange,
}: VoteButtonProps) {
  const { data: session } = useSession();
  const [busy, setBusy] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!session) {
        setSignInOpen(true);
        return;
      }
      if (busy) return;
      setBusy(true);
      const optimistic = voted
        ? { votes: votes - 1, voted: false }
        : { votes: votes + 1, voted: true };
      onChange?.(optimistic);
      try {
        const result = voted ? await unvote(ideaId) : await vote(ideaId);
        onChange?.({ votes: result.votes, voted: result.voted ?? !voted });
      } catch {
        // rollback on failure
        onChange?.({ votes, voted });
      } finally {
        setBusy(false);
      }
    },
    [session, busy, voted, votes, ideaId, onChange]
  );

  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-1' : 'px-3 py-1.5';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const textSize = isSm ? 'text-xs' : 'text-sm';

  return (
    <>
      <button
        onClick={toggle}
        disabled={busy}
        aria-pressed={voted}
        className={`inline-flex items-center gap-1 ${padding} rounded-full ${textSize} font-medium border transition-colors ${
          voted
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
        } disabled:opacity-50`}
      >
        <ArrowUp className={iconSize} />
        {votes}
      </button>
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}
