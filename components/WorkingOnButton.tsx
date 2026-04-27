import React, { useState, useCallback, useEffect } from 'react';
import { Hammer, X } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { setWorking, unsetWorking } from '../lib/api';
import type { Builder } from '../lib/api';
import SignInModal from './SignInModal';

interface WorkingOnButtonProps {
  ideaId: string;
  myWorking: Builder | null;
  onChange?: (builders: Builder[]) => void;
}

export default function WorkingOnButton({
  ideaId,
  myWorking,
  onChange,
}: WorkingOnButtonProps) {
  const { data: session } = useSession();
  const [signInOpen, setSignInOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (formOpen && myWorking) {
      setUrl(myWorking.url || '');
      setNote(myWorking.note || '');
    }
  }, [formOpen, myWorking]);

  const open = useCallback(() => {
    if (!session) {
      setSignInOpen(true);
      return;
    }
    setFormOpen(true);
  }, [session]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setBusy(true);
      try {
        const result = await setWorking(ideaId, {
          url: url.trim() || undefined,
          note: note.trim() || undefined,
        });
        onChange?.(result.builders);
        setFormOpen(false);
      } catch {
        // surface the error via alert for now; could add an inline toast later
        alert('Could not save. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [busy, url, note, ideaId, onChange]
  );

  const stopBuilding = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await unsetWorking(ideaId);
      onChange?.(result.builders);
      setFormOpen(false);
    } finally {
      setBusy(false);
    }
  }, [busy, ideaId, onChange]);

  const isBuilding = !!myWorking;

  return (
    <>
      <button
        onClick={open}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
          isBuilding
            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
        }`}
      >
        <Hammer className="w-3.5 h-3.5" />
        {isBuilding ? "You're building this" : "I'm building this"}
      </button>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setFormOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-black">
                  {isBuilding ? 'Update your work' : "I'm building this"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Optional — paste a link to your repo, demo, or notes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-gray-400 hover:text-black"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-xs font-medium text-gray-600 mb-1">
              Link (optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/you/your-repo"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black mb-4"
            />

            <label className="block text-xs font-medium text-gray-600 mb-1">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's your angle?"
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
            />
            <div className="text-[11px] text-gray-400 text-right mt-1">
              {note.length}/500
            </div>

            <div className="flex items-center justify-between gap-2 mt-4">
              {isBuilding ? (
                <button
                  type="button"
                  onClick={stopBuilding}
                  disabled={busy}
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Stop building
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
