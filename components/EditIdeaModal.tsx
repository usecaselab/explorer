import React, { useState, useCallback } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { submitEdit } from '../lib/api';
import type { IdeaEntry } from './IdeaPage';
import { DOMAIN_CONFIG } from './IdeaShowcase';
import SignInModal from './SignInModal';

interface EditIdeaModalProps {
  idea: IdeaEntry;
  open: boolean;
  onClose: () => void;
}

const DOMAIN_OPTIONS = Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => ({
  id,
  label: cfg.label,
  color: cfg.color,
}));

export default function EditIdeaModal({ idea, open, onClose }: EditIdeaModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(idea.title);
  const [problem, setProblem] = useState(idea.problem);
  const [solution, setSolution] = useState(idea.solutionSketch);
  const [why, setWhy] = useState(idea.whyEthereum);
  const [domains, setDomains] = useState<string[]>(idea.domains);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
    [busy, title, problem, solution, why, domains, idea]
  );

  if (!open) return null;

  if (!session) {
    return <SignInModal open={true} onClose={handleClose} />;
  }

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
            className="px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl my-8"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-black">
              Improve this idea
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Suggest edits. Approved changes replace the live content.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-black transition-colors"
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
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
          />
        </Field>

        <Field label="Problem" hint={`${problem.length}/2000`}>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
          />
        </Field>

        <Field label="Solution sketch" hint={`${solution.length}/2000`}>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
          />
        </Field>

        <Field label="Why Ethereum" hint={`${why.length}/2000`}>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            maxLength={2000}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
          />
        </Field>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Domains <span className="text-gray-400">(pick up to 4)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DOMAIN_OPTIONS.map((d) => {
              const active = domains.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDomain(d.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          <div className="mb-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Submitting…' : 'Submit edit for review'}
        </button>
      </form>
    </div>
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
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
