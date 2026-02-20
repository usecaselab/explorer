import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IdeaEntry } from '../types';
import { renderMarkdownLinks } from '../utils';
import { domainLabel } from './RoleSelector';
import { X, AlertCircle, Lightbulb, BookOpen, Zap, ArrowRight, Link, Check, Pencil } from 'lucide-react';

interface IdeaDetailModalProps {
  idea: IdeaEntry;
  onClose: () => void;
  allIdeas: IdeaEntry[];
  onSelectIdea: (id: string) => void;
}

const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({ idea, onClose, allIdeas, onSelectIdea }) => {
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Auto-focus close button on mount
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [idea]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // Related ideas: share at least one domain, exclude current, take first 3
  const relatedIdeas = allIdeas
    .filter(i => i.id !== idea.id && i.domains.some(d => idea.domains.includes(d)))
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="idea-modal-title"
      ref={modalRef}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between p-6 md:p-8 pb-4 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {idea.domains.map(d => (
                <span key={d} className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {domainLabel(d)}
                </span>
              ))}
            </div>
            <h2 id="idea-modal-title" className="text-2xl md:text-4xl font-bold font-heading text-markerBlack leading-tight">
              {idea.title}
            </h2>

          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-black"
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <Link className="w-6 h-6 text-markerBlack" />
              )}
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-black"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-markerBlack" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">

          {/* The Problem */}
          {idea.problem && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-alertRed fill-current" />
                <h3 className="text-2xl font-bold font-heading">Problem</h3>
              </div>
              <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-sketch relative">
                <div className="absolute -top-3 left-6 w-20 h-4 bg-alertRed/30 -rotate-1 border border-transparent"></div>
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  {renderMarkdownLinks(idea.problem)}
                </p>
              </div>
            </section>
          )}

          {/* Solution Sketch */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-2xl font-bold font-heading">Solution Sketch</h3>
            </div>
            <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-sketch-sm">
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {idea.solutionSketch ? renderMarkdownLinks(idea.solutionSketch) : <span className="text-gray-400 italic">No description yet.</span>}
              </p>
            </div>
          </section>

          {/* Why Ethereum */}
          {idea.whyEthereum && (() => {
            const capabilityMatch = idea.whyEthereum.match(/^(Verifiability|Composability|Enforcement):\s*/);
            const capability = capabilityMatch ? capabilityMatch[1] : null;
            const explanation = capabilityMatch
              ? idea.whyEthereum.slice(capabilityMatch[0].length)
              : idea.whyEthereum;
            const badgeColors: Record<string, string> = {
              Verifiability: 'bg-blue-100 text-blue-700',
              Composability: 'bg-purple-100 text-purple-700',
              Enforcement: 'bg-green-100 text-green-700',
            };
            const badgeClass = capability ? badgeColors[capability] : '';
            return (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-ethBlue" />
                  <h3 className="text-2xl font-bold font-heading">Why Ethereum?</h3>
                </div>
                <div className="bg-ethLightBlue border-2 border-black p-6 rounded-2xl shadow-sketch-sm">
                  {capability && (
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${badgeClass}`}>
                      {capability}
                    </span>
                  )}
                  <p className="text-lg font-medium text-gray-800 leading-relaxed">
                    {renderMarkdownLinks(explanation)}
                  </p>
                </div>
              </section>
            );
          })()}

          {/* Resources */}
          {idea.resources.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-2xl font-bold font-heading">Resources</h3>
              </div>
              <ul className="space-y-3 pl-5 list-disc marker:text-gray-300">
                {idea.resources.map((resource, idx) => (
                  <li key={idx} className="text-base leading-relaxed pl-1">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {resource.name}
                    </a>
                    {resource.description && (
                      <span className="text-gray-600"> - {renderMarkdownLinks(resource.description)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Examples */}
          {idea.examples && idea.examples.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-2xl font-bold font-heading">Examples</h3>
              </div>
              <ul className="space-y-3 pl-5 list-disc marker:text-gray-300">
                {idea.examples.map((example, idx) => (
                  <li key={idx} className="text-base leading-relaxed pl-1">
                    <a
                      href={example.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {example.name}
                    </a>
                    {example.description && (
                      <span className="text-gray-600"> - {renderMarkdownLinks(example.description)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Improve this idea */}
          <div className="flex justify-center pt-2">
            <a
              href={`https://github.com/usecaselab/explorer/issues/new?title=${encodeURIComponent(`[Improve] ${idea.title}`)}&body=${encodeURIComponent(`## Idea\n${idea.title} (${idea.domains.map(domainLabel).join(', ')})\n\n## What's wrong or could be better?\n\n`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Improve this idea
            </a>
          </div>

          {/* Related Ideas */}
          {relatedIdeas.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="w-5 h-5 text-ethBlue" />
                <h3 className="text-2xl font-bold font-heading">Related Ideas</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedIdeas.map(related => (
                  <button
                    key={related.id}
                    onClick={() => onSelectIdea(related.id)}
                    className="text-left p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-sketch-sm transition-all group"
                  >
                    <span className="font-bold font-heading text-markerBlack group-hover:text-ethBlue block leading-snug">
                      {related.title}
                    </span>
                    {related.problem && (
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {related.problem.length > 60 ? related.problem.slice(0, 60) + '...' : related.problem}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailModal;
