import React from 'react';
import { IdeaEntry } from '../types';

interface IdeaCardProps {
  idea: IdeaEntry;
  onClick: () => void;
}

const DOMAIN_COLORS: Record<string, { bg: string; text: string }> = {
  'ai': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'business-operations': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'civil-society': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'commerce': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'data': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'environment': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'finance': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'food-and-agriculture': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'government': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'health': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'identity': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'logistics-and-trade': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'media': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'real-estate-and-housing': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'science': { bg: 'bg-violet-100', text: 'text-violet-700' },
  'utilities': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-100', text: 'text-gray-700' };

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick }) => {
  const color = DOMAIN_COLORS[idea.domainId] || DEFAULT_COLOR;
  const truncated = idea.problem.length > 120
    ? idea.problem.slice(0, 120) + '...'
    : idea.problem;

  return (
    <button
      onClick={onClick}
      className="text-left bg-white border-2 border-black rounded-xl p-5 shadow-sketch-sm hover:shadow-sketch hover:-translate-y-1 transition-all group flex flex-col gap-3 h-full"
    >
      <h3 className="font-bold text-lg font-heading leading-tight group-hover:text-ethBlue transition-colors">
        {idea.title}
      </h3>
      {truncated && (
        <p className="text-gray-600 font-medium leading-snug text-sm flex-1">
          {truncated}
        </p>
      )}
      <span className={`inline-block self-start text-xs font-bold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
        {idea.domainTitle}
      </span>
    </button>
  );
};

export default IdeaCard;
