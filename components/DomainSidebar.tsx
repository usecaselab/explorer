import React, { useState, useEffect } from 'react';
import { DOMAIN_CATEGORIES } from '../constants';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DomainSidebarProps {
  selectedDomainId: string | null;
  onSelect: (id: string) => void;
  domains: string[];
}

const DomainSidebar: React.FC<DomainSidebarProps> = ({ selectedDomainId, onSelect, domains }) => {
  // Helper to normalize ID for matching
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

  const getDomainId = (domain: string) => {
    const map: Record<string, string> = {
        'Alternative Money': 'alt-money',
    };
    return map[domain] || normalize(domain);
  };

  // State for open categories
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  // Auto-expand category when selectedDomainId changes
  useEffect(() => {
    if (selectedDomainId) {
      for (const [category, items] of Object.entries(DOMAIN_CATEGORIES)) {
        if (items.some(item => getDomainId(item) === selectedDomainId)) {
          setOpenCategories(prev => {
            const newSet = new Set(prev);
            newSet.add(category);
            return newSet;
          });
          break;
        }
      }
    }
  }, [selectedDomainId]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4 p-2 md:pr-4 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
      {domains.length === 0 && (
         <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 italic">
            No domains match your search.
         </div>
      )}

      {/* Render Categorized Groups */}
      {Object.entries(DOMAIN_CATEGORIES).map(([category, items]) => {
        // Filter items based on available domains (in case of future search filtering)
        const visibleItems = items.filter(item => domains.includes(item));
        if (visibleItems.length === 0) return null;

        const isOpen = openCategories.has(category);

        return (
          <div key={category} className="flex flex-col">
            <button 
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full text-left py-3 px-1 hover:bg-gray-50 rounded-lg group transition-colors mb-1"
            >
              <span className="font-bold font-heading text-gray-800 text-xl md:text-lg">{category}</span>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 md:w-4 md:h-4 text-gray-500 group-hover:text-black" />
              ) : (
                <ChevronRight className="w-5 h-5 md:w-4 md:h-4 text-gray-500 group-hover:text-black" />
              )}
            </button>

            {isOpen && (
              <div className="flex flex-col gap-2 pl-2 border-l-2 border-gray-100 animate-in slide-in-from-top-2 duration-200">
                {visibleItems.map((domain) => {
                  const domainId = getDomainId(domain);
                  const isSelected = selectedDomainId === domainId;

                  return (
                    <button
                      key={domain}
                      onClick={() => onSelect(domainId)}
                      className={`
                        w-full text-left px-3 py-3 md:py-2 rounded-lg border-2 transition-all duration-200
                        font-medium text-lg md:text-sm text-markerBlack flex items-center gap-2
                        ${isSelected 
                          ? 'bg-blue-100 border-black shadow-sketch-sm font-bold translate-x-1' 
                          : 'bg-white border-transparent hover:border-gray-200 hover:bg-white hover:translate-x-1'
                        }
                      `}
                    >
                       {isSelected && <div className="w-2 h-2 md:w-1.5 md:h-1.5 rounded-full bg-ethBlue flex-shrink-0"></div>}
                       <span className={isSelected ? 'text-black' : 'text-gray-600'}>{domain}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DomainSidebar;