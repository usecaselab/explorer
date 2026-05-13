import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { DOMAIN_CONFIG } from './IdeaShowcase';
import { useEscapeKey } from '../lib/useEscapeKey';

const REPO = 'usecaselab/explorer';
const BRANCH = 'main';

interface SubmitIdeaModalProps {
  open: boolean;
  onClose: () => void;
}

const DOMAIN_OPTIONS = Object.entries(DOMAIN_CONFIG).map(([id, cfg]) => ({
  id,
  label: cfg.label,
  color: cfg.color,
}));

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'new-idea';
}

function buildMarkdown(draft: {
  title: string;
  problem: string;
  solution: string;
  why: string;
  domains: string[];
}): string {
  return [
    '---',
    `title: "${draft.title.replace(/"/g, '\\"')}"`,
    `domains: ${draft.domains.join(', ')}`,
    '---',
    '',
    '## Problem',
    '',
    draft.problem.trim(),
    '',
    '## Solution',
    '',
    draft.solution.trim(),
    '',
    '## Why Ethereum',
    '',
    draft.why.trim(),
    '',
  ].join('\n');
}

function buildGithubUrl(slug: string, markdown: string): string {
  const params = new URLSearchParams({
    filename: `public/data/ideas/${slug}.md`,
    value: markdown,
  });
  return `https://github.com/${REPO}/new/${BRANCH}?${params.toString()}`;
}

export default function SubmitIdeaModal({ open, onClose }: SubmitIdeaModalProps) {
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [why, setWhy] = useState('');
  const [domains, setDomains] = useState<string[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the first input when opening, so typing can start immediately.
    setTimeout(() => titleRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const reset = useCallback(() => {
    setTitle('');
    setProblem('');
    setSolution('');
    setWhy('');
    setDomains([]);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(reset, 300);
  }, [onClose, reset]);

  useEscapeKey(open, handleClose);

  const toggleDomain = (id: string) => {
    setDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  // Per-field validity drives both progress indicator and submit button state.
  const fieldStatus = useMemo(
    () => ({
      title: title.trim().length >= 4,
      problem: problem.trim().length >= 10,
      solution: solution.trim().length >= 10,
      why: why.trim().length >= 10,
      domains: domains.length > 0,
    }),
    [title, problem, solution, why, domains]
  );

  const allDone = Object.values(fieldStatus).every(Boolean);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!allDone) return;
      const markdown = buildMarkdown({
        title: title.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        why: why.trim(),
        domains,
      });
      const url = buildGithubUrl(slugify(title.trim()), markdown);
      window.open(url, '_blank', 'noopener');
    },
    [allDone, title, problem, solution, why, domains]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-950 text-black dark:text-neutral-100 overflow-y-auto flex flex-col">
      {/* Sticky top: close */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-900">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="-m-2 p-2 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="submit-idea-form" onSubmit={submit} className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-10">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Submit an idea
          </h1>
        </header>

        <div className="space-y-8 sm:space-y-10">
          <Field label="Title" hint="Short and punchy. Specific beats clever.">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="e.g. Verifiable ad delivery and influencer metrics"
              className="w-full font-heading text-xl sm:text-2xl font-bold tracking-tight bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-700 placeholder:font-normal focus:outline-none border-b border-gray-200 dark:border-gray-800 focus:border-black dark:focus:border-white pb-3"
            />
            <Counter current={title.length} max={120} />
          </Field>

          <Field label="Domains" hint={`Pick up to 4. ${domains.length}/4 selected.`}>
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
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: active ? 'currentColor' : d.color }}
                    />
                    {d.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Problem" hint="What's broken today? Name the concrete failure.">
            <ProseTextarea
              value={problem}
              onChange={setProblem}
              maxLength={2000}
              placeholder="Today this is missing or doesn't work because…"
            />
          </Field>

          <Field label="Solution" hint="Sketch the shape — not full specs. A paragraph or two.">
            <ProseTextarea
              value={solution}
              onChange={setSolution}
              maxLength={2000}
              placeholder="The idea is to…"
            />
          </Field>

          <Field
            label="Why Ethereum"
            hint="Verifiability, composability, neutrality, enforcement — which one is load-bearing?"
          >
            <ProseTextarea
              value={why}
              onChange={setWhy}
              maxLength={2000}
              placeholder="This needs Ethereum because…"
            />
          </Field>
        </div>
      </form>

      {/* Sticky footer with submit */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur border-t border-gray-100 dark:border-gray-900">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            form="submit-idea-form"
            disabled={!allDone}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span className="hidden sm:inline">Open pull request</span>
            <span className="sm:hidden">Submit</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
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
    <section>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mb-3">
        <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {label}
        </h2>
        {hint && (
          <span className="text-xs text-gray-400 dark:text-gray-500">{hint}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function ProseTextarea({
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // Auto-grow: resize to fit content on every change.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={3}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-base leading-relaxed bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-black dark:focus:border-white resize-none overflow-hidden"
      />
      <Counter current={value.length} max={maxLength} />
    </div>
  );
}

function Counter({ current, max }: { current: number; max: number }) {
  if (current < max * 0.7) return null;
  const remaining = max - current;
  const tone = remaining < 100 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500';
  return <div className={`mt-1.5 text-right text-xs ${tone}`}>{remaining} left</div>;
}
