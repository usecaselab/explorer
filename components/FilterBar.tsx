import React from 'react';

interface FilterBarProps {
  domains: { id: string; title: string }[];
  activeDomain: string | null;
  onSelect: (domainId: string | null) => void;
  totalCount: number;
  filteredCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ domains, activeDomain, onSelect, totalCount, filteredCount }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
          Showing {filteredCount} of {totalCount} ideas
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSelect(null)}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-all flex-shrink-0 ${
            activeDomain === null
              ? 'bg-black text-white border-black shadow-sketch-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
          }`}
        >
          All
        </button>
        {domains.map(domain => (
          <button
            key={domain.id}
            onClick={() => onSelect(domain.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-bold border-2 transition-all flex-shrink-0 ${
              activeDomain === domain.id
                ? 'bg-black text-white border-black shadow-sketch-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            {domain.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
