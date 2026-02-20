import React, { useEffect } from 'react';
import { IdeaEntry } from '../types';
import { renderMarkdownLinks } from '../utils';
import { X, AlertCircle, Lightbulb, BookOpen, Zap } from 'lucide-react';

interface IdeaDetailModalProps {
  idea: IdeaEntry;
  onClose: () => void;
}

const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({ idea, onClose }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
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
            <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 mb-3">
              {idea.domainTitle}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold font-heading text-markerBlack leading-tight">
              {idea.title}
            </h2>
            {idea.targetUser && (
              <p className="text-sm text-gray-500 mt-2">
                For: {idea.targetUser}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors border-2 border-transparent hover:border-black"
          >
            <X className="w-6 h-6 text-markerBlack" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">

          {/* The Problem */}
          {idea.problem && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-alertRed fill-current" />
                <h3 className="text-2xl font-bold font-heading">The Problem</h3>
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
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailModal;
