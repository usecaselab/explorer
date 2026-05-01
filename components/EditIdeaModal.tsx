import React, { useState, useCallback, useEffect } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { submitEdit } from '../lib/api';
import type { IdeaEntry } from './IdeaPage';
import { DOMAIN_CONFIG } from './IdeaShowcase';
import { setPending, type EditIdeaDraft } from '../lib/pending-action';
import { useEscapeKey } from '../lib/useEscapeKey';
import SignInModal from './SignInModal';

interface EditIdeaModalProps {
  idea: IdeaEntry;
  open: boolean;
  onClose: () => void;
  initialDraft?: EditIdeaDraft | null;
}

const DOMAIN_OPTIONS = Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => ({
  id,
  label: cfg.label,
  color: cfg.color,
}));

export default function EditIdeaModal({ idea, open, onClose, initialDraft }: EditIdeaModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(idea.title);
  const [problem, setProblem] = useState(idea.problem);
  const [solution, setSolution] = useState(idea.solutionSketch);
  const [why, setWhy] = useState(idea.whyEthereum);
  const [domains, setDomains] = useState<string[]>(idea.domains);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // Restore an in-flight draft handed back after the OAuth round-trip.
  useEffect(() => {
    if (!initialDraft || !open) return;
    setTitle(initialDraft.title);
    setProblem(initialDraft.problem);
    setSolution(initialDraft.solution);
    setWhy(initialDraft.why);
    setDomains(initialDraft.domains);
  }, [initialDraft, open]);

  const reset = useCallback(() => {
    setTitle(idea.title);
    setProblem(idea.problem);
    setSolution(idea.solutionSketch);
    setWhy(idea.whyEthereum);
    setDomains(idea.domains);
    setError(null);
    setSubmitted(false);
  }, [idea]);

  const handleClose = useCallback(() => {
    if (!busy) {
      onClose();
      setTimeout(reset, 300);
    }
  }, [busy, onClose, reset]);

  useEscapeKey(open, handleClose);

  const toggleDomain = (id: string) => {
    setDomains((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setError(null);

      // Build a sparse diff: only include fields the user actually changed
      const draft: Parameters<typeof submitEdit>[0] = { ideaId: idea.id };
      if (title.trim() !== idea.title) draft.title = title.trim();
      if (problem.trim() !== idea.problem) draft.problem = problem.trim();
      if (solution.trim() !== idea.solutionSketch) draft.solutionSketch = solution.trim();
      if (why.trim() !== idea.whyEthereum) draft.whyEthereum = why.trim();
      const sameDomains =
        domains.length === idea.domains.length &&
        domains.every((d, i) => d === idea.domains[i]);
      if (!sameDomains) draft.domains = domains;

      if (Object.keys(draft).length === 1) {
        setError('Nothing changed.');
        return;
      }
      if (draft.domains && draft.domains.length === 0) {
        setError('Pick at least one domain.');
        return;
      }

      if (!session) {
        setPending({
          type: 'edit-idea',
          ideaId: idea.id,
          draft: {
            title: title.trim(),
            problem: problem.trim(),
            solution: solution.trim(),
            why: why.trim(),
            domains,
          },
        });
        setSignInOpen(true);
        return;
      }

      setBusy(true);
      try {
        await submitEdit(draft);
        setSubmitted(true);
      } catch (err: any) {
        setError(err.message || 'Could not submit. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [busy, title, problem, solution, why, domains, idea, session]
  );

  if (!open) return null;

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={handleClose}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-black mb-2">
            Edit submitted
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Once approved, your changes will appear on this idea.
          </p>
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 active:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 sm:p-4 overflow-y-auto"
        onClick={handleClose}
      >
        <form
          onSubmit={submit}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl p-5 sm:p-8 shadow-xl sm:my-8"
        >
          <div className="flex items-start justify-between mb-6 gap-3">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-black">
                Improve this idea
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Suggest edits. Approved changes replace the live content.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="-m-2 p-2 text-gray-400 hover:text-black active:text-black transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Field label="Title" hint={`${title.length}/120`}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black"
            />
          </Field>

          <Field label="Problem" hint={`${problem.length}/2000`}>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black resize-none"
            />
          </Field>

          <Field label="Solution sketch" hint={`${solution.length}/2000`}>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black resize-none"
            />
          </Field>

          <Field label="Why Ethereum" hint={`${why.length}/2000`}>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-base focus:outline-none focus:border-black resize-none"
            />
          </Field>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domains <span className="text-gray-400 font-normal">(pick up to 4)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_OPTIONS.map((d) => {
                const active = domains.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDomain(d.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-200'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: active ? '#fff' : d.color }}
                    />
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full px-4 py-3.5 rounded-lg bg-black text-white text-base font-medium hover:bg-gray-800 active:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? 'Submitting…' : session ? 'Submit edit for review' : 'Sign in & submit edit'}
          </button>
        </form>
      </div>
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
