
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { IdeaEntry } from './types';
import IdeaCard from './components/IdeaCard';
import IdeaDetailModal from './components/IdeaDetailModal';
import SiteFooter from './components/SiteFooter';
import RoleSelector, { ROLES } from './components/RoleSelector';
import { Search, X } from 'lucide-react';

// Skeleton card placeholder shown while loading
const SkeletonCard: React.FC = () => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sketch-sm flex flex-col gap-3 h-full animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4" />
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
    </div>
    <div className="h-5 bg-gray-100 rounded-full w-20" />
  </div>
);

// Home view — idea-centric browsing experience
interface HomeViewProps {
  ideaEntries: IdeaEntry[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  searchResults: { id: string; title: string; domainTitle: string; detail: string }[];
  handleSelectSearchResult: (ideaId: string) => void;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  activeDomainFilter: string[] | null;
  setActiveDomainFilter: (filter: string[] | null) => void;
  ideaCounts: Record<string, number>;
  onSelectIdea: (id: string) => void;
  selectedSearchIndex: number;
  setSelectedSearchIndex: (idx: number) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  ideaEntries,
  loading,
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchResults,
  handleSelectSearchResult,
  searchContainerRef,
  activeDomainFilter,
  setActiveDomainFilter,
  ideaCounts,
  onSelectIdea,
  selectedSearchIndex,
  setSelectedSearchIndex,
}) => {
  const filteredIdeas = useMemo(() => {
    if (!activeDomainFilter) return ideaEntries;
    return ideaEntries.filter(e => activeDomainFilter.includes(e.domainId));
  }, [ideaEntries, activeDomainFilter]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(Math.min(selectedSearchIndex + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(Math.max(selectedSearchIndex - 1, 0));
    } else if (e.key === 'Enter' && selectedSearchIndex >= 0) {
      e.preventDefault();
      handleSelectSearchResult(searchResults[selectedSearchIndex].id);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen relative overflow-hidden">

      {/* Hero Section */}
      <div className="relative z-20 w-full bg-white border-b-2 border-black">
        <div className="relative w-full flex flex-col items-center pt-10 md:pt-16 pb-10 px-4 overflow-visible">

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-800 font-normal max-w-2xl mx-auto leading-relaxed text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Explore <span className="text-ethBlue">{loading ? '' : `${ideaEntries.length}+`} ideas</span> for building real-world Ethereum use cases
          </p>

          {/* Search Bar */}
          <div className="relative z-50 w-full max-w-2xl px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" ref={searchContainerRef}>
            <div className={`
              flex items-center gap-2 sm:gap-3 border-2 border-black px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white transition-all
              ${isSearchFocused ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1 ring-2 ring-blue-100' : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
            `}>
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  setSelectedSearchIndex(0);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                role="combobox"
                aria-expanded={isSearchFocused && !!searchQuery}
                aria-controls="search-results"
                aria-activedescendant={selectedSearchIndex >= 0 && searchResults.length > 0 ? `search-result-${selectedSearchIndex}` : undefined}
                className="outline-none text-base sm:text-lg w-full bg-transparent font-medium text-markerBlack placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
                  <X className="w-5 h-5 text-gray-400 hover:text-black" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-black rounded-2xl shadow-sketch overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {searchResults.length > 0 ? (
                  <ul id="search-results" role="listbox">
                    {searchResults.map((result, idx) => (
                      <li key={result.id} id={`search-result-${idx}`} role="option" aria-selected={idx === selectedSearchIndex}>
                        <button
                          onClick={() => handleSelectSearchResult(result.id)}
                          className={`w-full text-left px-5 py-4 border-b border-gray-100 last:border-0 transition-colors group ${
                            idx === selectedSearchIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold font-heading text-markerBlack group-hover:text-ethBlue text-lg">{result.title}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{result.domainTitle}</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            <span className="text-gray-400 mr-1">&darr;</span>
                            {result.detail}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-5 text-center text-gray-400 font-medium italic" role="status">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 w-full px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              onClick={() => {
                if (ideaEntries.length === 0) return;
                const randomIdea = ideaEntries[Math.floor(Math.random() * ideaEntries.length)];
                onSelectIdea(randomIdea.id);
              }}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-pastelYellow border-2 border-black rounded-xl font-normal text-markerBlack shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sketch-sm"
            >
              I'm Feeling Lucky
            </button>
            <a
              href="https://github.com/usecaselab/explorer/issues/new?template=use-case-submission.md&title=%5BUse%20Case%5D%20"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-white border-2 border-black rounded-xl font-normal text-markerBlack shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sketch-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Submit Use Case
            </a>
          </div>

          {/* Role Selector */}
          <RoleSelector
            activeDomainFilter={activeDomainFilter}
            setActiveDomainFilter={setActiveDomainFilter}
            ideaCounts={ideaCounts}
          />

        </div>
      </div>

      {/* Domain Filter + Grid Section */}
      <div className="relative z-10 w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              Showing {filteredIdeas.length} of {ideaEntries.length} ideas
            </span>
            {activeDomainFilter && (
              <button
                onClick={() => setActiveDomainFilter(null)}
                className="text-sm font-bold text-ethBlue hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                {filteredIdeas.map(idea => (
                  <IdeaCard key={idea.id} idea={idea} onClick={() => onSelectIdea(idea.id)} />
                ))}
              </div>
              {filteredIdeas.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-medium italic">
                  No ideas found for this domain yet.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// URL helpers
const getIdeaFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('idea');
};

const getCategoryFromUrl = (): string[] | null => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('category');
  if (!slug) return null;
  const role = ROLES.find(r => r.slug === slug);
  return role ? role.domains : null;
};

const setUrlParams = (ideaId: string | null, domains: string[] | null) => {
  const url = new URL(window.location.href);
  if (ideaId) {
    url.searchParams.set('idea', ideaId);
  } else {
    url.searchParams.delete('idea');
  }
  const role = domains ? ROLES.find(r =>
    r.domains.length === domains.length && r.domains.every(d => domains.includes(d))
  ) : null;
  if (role) {
    url.searchParams.set('category', role.slug);
  } else {
    url.searchParams.delete('category');
  }
  window.history.pushState({}, '', url.toString());
};

const App: React.FC = () => {
  const [ideaEntries, setIdeaEntries] = useState<IdeaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(getIdeaFromUrl);
  const [activeDomainFilter, setActiveDomainFilterState] = useState<string[] | null>(getCategoryFromUrl);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch all ideas from single JSON file
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/data/ideas.json');
        const ideas: IdeaEntry[] = await res.json();
        // Shuffle once per session so card order feels fresh
        for (let i = ideas.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ideas[i], ideas[j]] = [ideas[j], ideas[i]];
        }
        setIdeaEntries(ideas);
      } catch (error) {
        console.error('Failed to load idea data', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sync active idea with URL
  const selectIdea = useCallback((id: string | null) => {
    setActiveIdeaId(id);
    setUrlParams(id, activeDomainFilter);
  }, [activeDomainFilter]);

  // Sync category filter with URL
  const setActiveDomainFilter = useCallback((domains: string[] | null) => {
    setActiveDomainFilterState(domains);
    setUrlParams(activeIdeaId, domains);
  }, [activeIdeaId]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setActiveIdeaId(getIdeaFromUrl());
      setActiveDomainFilterState(getCategoryFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Idea counts per domain for RoleSelector
  const ideaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ideaEntries.forEach(e => {
      counts[e.domainId] = (counts[e.domainId] || 0) + 1;
    });
    return counts;
  }, [ideaEntries]);

  // Active idea data
  const activeIdea = activeIdeaId
    ? ideaEntries.find(e => e.id === activeIdeaId) || null
    : null;

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search across ideas
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { id: string; title: string; domainTitle: string; detail: string }[] = [];

    ideaEntries.forEach(idea => {
      let detail = '';

      if (idea.title.toLowerCase().includes(query)) {
        detail = idea.solutionSketch || idea.domainTitle;
      } else if (idea.solutionSketch.toLowerCase().includes(query)) {
        detail = idea.solutionSketch;
      } else if (idea.domainTitle.toLowerCase().includes(query)) {
        detail = idea.solutionSketch || 'Domain match';
      } else if (idea.problem.toLowerCase().includes(query)) {
        detail = 'Matches problem statement';
      } else {
        return;
      }

      results.push({
        id: idea.id,
        title: idea.title,
        domainTitle: idea.domainTitle,
        detail: detail.length > 80 ? detail.slice(0, 80) + '...' : detail,
      });
    });

    return results.slice(0, 8);
  }, [searchQuery, ideaEntries]);

  const handleSelectSearchResult = (ideaId: string) => {
    selectIdea(ideaId);
    setSearchQuery('');
    setIsSearchFocused(false);
    setSelectedSearchIndex(0);
  };

  const handleCloseModal = () => {
    selectIdea(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-x-hidden text-markerBlack">

      {/* Main Content */}
      <HomeView
        ideaEntries={ideaEntries}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        searchResults={searchResults}
        handleSelectSearchResult={handleSelectSearchResult}
        searchContainerRef={searchContainerRef}
        activeDomainFilter={activeDomainFilter}
        setActiveDomainFilter={setActiveDomainFilter}
        ideaCounts={ideaCounts}
        onSelectIdea={(id) => selectIdea(id)}
        selectedSearchIndex={selectedSearchIndex}
        setSelectedSearchIndex={setSelectedSearchIndex}
      />
      <SiteFooter />

      {/* Idea Detail Modal */}
      {activeIdea && (
        <IdeaDetailModal
          idea={activeIdea}
          onClose={handleCloseModal}
          allIdeas={ideaEntries}
          onSelectIdea={(id) => selectIdea(id)}
        />
      )}
    </div>
  );
};

export default App;
