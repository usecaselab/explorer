import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { useSession } from '../lib/auth-client';
import { submitIdea } from '../lib/api';
import { DOMAIN_CONFIG } from './IdeaShowcase';
import { setPending, type SubmitIdeaDraft } from '../lib/pending-action';
import { useEscapeKey } from '../lib/useEscapeKey';
import SignInModal from './SignInModal';

interface SubmitIdeaModalProps {
  open: boolean;
  onClose: () => void;
  initialDraft?: SubmitIdeaDraft | null;
}

const DOMAIN_OPTIONS = Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => ({
  id,
  label: cfg.label,
  color: cfg.color,
}));

export default function SubmitIdeaModal({ open, onClose, initialDraft }: SubmitIdeaModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [why, setWhy] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // Lock body scroll while the page-style modal is open so it feels like a real page.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
    setTitle('');
    setProblem('');
    setSolution('');
    setWhy('');
    setDomains([]);
    setError(null);
    setSubmitted(false);
  }, []);

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
      if (domains.length === 0) {
        setError('Pick at least one domain.');
        return;
      }

      if (!session) {
        setPending({
          type: 'submit-idea',
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
        await submitIdea({
          title: title.trim(),
          problem: problem.trim(),
          solutionSketch: solution.trim(),
          whyEthereum: why.trim(),
          domains,
        });
        setSubmitted(true);
      } catch (err: any) {
        setError(err.message || 'Could not submit. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [busy, title, problem, solution, why, domains, session]
  );

  if (!open) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-24 text-center">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-black mb-3">
            Submitted
          </h1>
          <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
            Your idea is in the review queue. Once approved it shows up in the
            explorer for everyone to vote and build on.
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

  const submitLabel = busy ? 'Submitting…' : session ? 'Submit for review' : 'Sign in & submit';

  return (
    <>
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              className="-m-2 p-2 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black active:text-black transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="submit"
              form="submit-idea-form"
              disabled={busy}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 active:bg-gray-800 disabled:opacity-50"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {busy ? 'Submitting…' : session ? 'Submit' : 'Sign in & submit'}
            </button>
          </div>
        </div>

        <form
          id="submit-idea-form"
          onSubmit={submit}
          className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20"
        >
          {/* Hero */}
          <div className="mb-12 sm:mb-20">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Submit an<br />
              <span className="text-gray-400">idea</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              Tell us what you'd build on Ethereum. Approved ideas land in the explorer for everyone to vote and build on.
            </p>
          </div>

          {/* Title — borderless big-type input, like writing in a notebook */}
          <Section heading="What's the idea?">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              placeholder="A short, punchy title"
              className="w-full font-heading text-2xl sm:text-3xl font-bold tracking-tight bg-transparent placeholder:text-gray-300 placeholder:font-normal focus:outline-none border-b border-gray-200 focus:border-black pb-3"
            />
            <Counter current={title.length} max={120} />
          </Section>

          <Divider />

          <Section
            heading="What's broken?"
            hint="Be specific. The clearer the gap, the better the idea."
          >
            <ProseTextarea
              value={problem}
              onChange={setProblem}
              maxLength={2000}
              rows={5}
              placeholder="Today this is missing or doesn't work because…"
            />
          </Section>

          <Divider />

          <Section
            heading="How would you fix it?"
            hint="Sketch the shape — not full specs."
          >
            <ProseTextarea
              value={solution}
              onChange={setSolution}
              maxLength={2000}
              rows={5}
              placeholder="The idea is to…"
            />
          </Section>

          <Divider />

          <Section
            heading="Why Ethereum?"
            hint="Verifiability, composability, neutrality, enforcement — what does Ethereum bring that nothing else can?"
          >
            <ProseTextarea
              value={why}
              onChange={setWhy}
              maxLength={2000}
              rows={4}
              placeholder="This needs Ethereum because…"
            />
          </Section>

          <Divider />

          <Section heading="Where does it fit?" hint="Pick up to 4 domains.">
            <div className="flex flex-wrap gap-2">
              {DOMAIN_OPTIONS.map((d) => {
                const active = domains.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDomain(d.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
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
          </Section>

          {error && (
            <div className="mt-12 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <button
              type="submit"
              disabled={busy}
              className="w-full sm:w-auto sm:min-w-[260px] px-8 py-4 rounded-xl bg-black text-white text-base font-medium hover:bg-gray-800 active:bg-gray-800 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitLabel}
            </button>
            <p className="mt-3 text-xs text-gray-400">
              {session
                ? 'Your idea goes to a review queue.'
                : "We'll ask you to sign in to attribute the submission."}
            </p>
          </div>
        </form>
      </div>
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}

function Section({
  heading,
  hint,
  children,
}: {
  heading: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 sm:py-12">
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-black tracking-tight">
        {heading}
      </h2>
      {hint && (
        <p className="mt-2 text-sm text-gray-500 max-w-xl leading-relaxed">{hint}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Divider() {
  return <hr className="border-gray-100" />;
}

function ProseTextarea({
  value,
  onChange,
  maxLength,
  rows,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  rows: number;
  placeholder?: string;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required
        rows={rows}
        placeholder={placeholder}
        className="w-full px-5 py-4 rounded-xl border border-gray-200 text-base leading-relaxed bg-transparent focus:outline-none focus:border-black resize-none"
      />
      <Counter current={value.length} max={maxLength} />
    </div>
  );
}

function Counter({ current, max }: { current: number; max: number }) {
  // Show only when nearing the limit — quiet by default.
  if (current < max * 0.7) return null;
  const remaining = max - current;
  const tone = remaining < 100 ? 'text-red-500' : 'text-gray-400';
  return (
    <div className={`mt-1.5 text-right text-xs ${tone}`}>{remaining} left</div>
  );
}
