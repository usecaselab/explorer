import React, { useState, useCallback } from 'react';
import { X, Loader2, Check } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { submitIdea } from '../lib/api';
import { DOMAIN_CONFIG } from './IdeaShowcase';
import SignInModal from './SignInModal';

interface SubmitIdeaModalProps {
  open: boolean;
  onClose: () => void;
}

const DOMAIN_OPTIONS = Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => ({
  id,
  label: cfg.label,
  color: cfg.color,
}));

export default function SubmitIdeaModal({ open, onClose }: SubmitIdeaModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [why, setWhy] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceLabel, setResourceLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const reset = useCallback(() => {
    setTitle('');
    setProblem('');
    setSolution('');
    setWhy('');
    setDomains([]);
    setResourceUrl('');
    setResourceLabel('');
    setError(null);
    setSubmitted(false);
  }, []);

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
      if (domains.length === 0) {
        setError('Pick at least one domain.');
        return;
      }
      setBusy(true);
      try {
        const resources = resourceUrl.trim()
          ? [
              {
                name: resourceLabel.trim() || 'Reference',
                url: resourceUrl.trim(),
              },
            ]
          : [];
        await submitIdea({
          title: title.trim(),
          problem: problem.trim(),
          solutionSketch: solution.trim(),
          whyEthereum: why.trim(),
          domains,
          resources,
        });
        setSubmitted(true);
      } catch (err: any) {
        setError(err.message || 'Could not submit. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [busy, title, problem, solution, why, domains, resourceUrl, resourceLabel]
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
            Submitted
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Your idea is in the review queue. Once approved it shows up in the
            explorer for everyone to vote and build on.
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
              Submit an idea
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Goes to a review queue. Approved ideas land in the explorer.
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
            required
            placeholder="Verifiable energy credits"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
          />
        </Field>

        <Field label="Problem" hint={`${problem.length}/2000`}>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            maxLength={2000}
            required
            rows={3}
            placeholder="What's broken or missing?"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
          />
        </Field>

        <Field label="Solution sketch" hint={`${solution.length}/2000`}>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            maxLength={2000}
            required
            rows={3}
            placeholder="How would you solve it?"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black resize-none"
          />
        </Field>

        <Field label="Why Ethereum" hint={`${why.length}/2000`}>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            maxLength={2000}
            required
            rows={2}
            placeholder="What does Ethereum bring? (verifiability, composability, enforcement)"
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

        <Field label="Reference link (optional)">
          <div className="flex gap-2">
            <input
              value={resourceLabel}
              onChange={(e) => setResourceLabel(e.target.value)}
              placeholder="Label"
              className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
            />
            <input
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="https://"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </Field>

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
          {busy ? 'Submitting…' : 'Submit for review'}
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
