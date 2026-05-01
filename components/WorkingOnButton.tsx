import React, { useState, useCallback, useEffect } from 'react';
import { Hammer, X } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { setWorking, unsetWorking } from '../lib/api';
import type { Builder } from '../lib/api';
import { setPending } from '../lib/pending-action';
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
    setFormOpen(true);
  }, []);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      if (!session) {
        setPending({
          type: 'working-on',
          ideaId,
          url: url.trim() || undefined,
          note: note.trim() || undefined,
        });
        setFormOpen(false);
        setSignInOpen(true);
        return;
      }
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
    [busy, url, note, ideaId, onChange, session]
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:p-4"
          onClick={() => setFormOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-xl max-h-[100dvh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-black">
                  {isBuilding ? 'Update your work' : "I'm building this"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tell others your angle. Add a link to your repo, demo, or notes if you have one.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="-m-2 p-2 text-gray-400 hover:text-black active:text-black transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              placeholder="What's your angle?"
              maxLength={500}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black resize-none"
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {note.length}/500
            </div>

            <label className="block text-sm font-medium text-gray-700 mt-4 mb-1.5">
              Link <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/you/your-repo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black"
            />

            <div className="flex items-center justify-between gap-3 mt-5">
              {isBuilding ? (
                <button
                  type="button"
                  onClick={stopBuilding}
                  disabled={busy}
                  className="text-sm font-medium text-red-600 hover:text-red-700 active:text-red-700 disabled:opacity-50 -mx-2 px-2 py-2"
                >
                  Stop building
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={busy}
                className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 active:bg-gray-800 disabled:opacity-50"
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
