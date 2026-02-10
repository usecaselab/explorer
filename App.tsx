
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DOMAINS, DOMAIN_CATEGORIES } from './constants';
import { DomainData } from './types';
import { parseDomainMarkdown } from './utils';
import lastUpdatedDates from 'virtual:last-updated';
import UseCaseModal from './components/UseCaseModal';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';
import { Search, X } from 'lucide-react';

// Home view for the landing state - Google-like search experience
interface HomeViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  searchResults: { id: string, title: string, type: string, detail: string }[];
  handleSelectSearchResult: (domainId: string) => void;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  onSelectDomain: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchResults,
  handleSelectSearchResult,
  searchContainerRef,
  onSelectDomain
}) => {
  const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  const getDomainId = (domain: string) => {
    const map: Record<string, string> = { 'Alternative Money': 'alt-money' };
    return map[domain] || normalize(domain);
  };

  // Category config with icons and vibrant colors
  const categoryConfig: Record<string, { icon: string, gradient: string, iconBg: string, shadow: string }> = {
    "Society": { icon: "🏛️", gradient: "from-violet-500 to-purple-600", iconBg: "bg-violet-100", shadow: "shadow-violet-200" },
    "Finance": { icon: "💰", gradient: "from-emerald-500 to-green-600", iconBg: "bg-emerald-100", shadow: "shadow-emerald-200" },
    "Consumer": { icon: "🛒", gradient: "from-orange-500 to-amber-600", iconBg: "bg-orange-100", shadow: "shadow-orange-200" },
    "Enterprise": { icon: "🏢", gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100", shadow: "shadow-blue-200" },
    "Digital": { icon: "💻", gradient: "from-cyan-500 to-teal-600", iconBg: "bg-cyan-100", shadow: "shadow-cyan-200" },
    "Physical": { icon: "🌍", gradient: "from-amber-500 to-yellow-600", iconBg: "bg-amber-100", shadow: "shadow-amber-200" }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen relative overflow-hidden">

      {/* Hero Section with decorated white background */}
      <div className="relative z-20 w-full bg-white border-b-2 border-black">

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large gradient blobs - visible on all screens */}
          <div className="absolute -top-20 -left-20 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-br from-violet-300/30 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 -right-20 w-40 md:w-60 h-40 md:h-60 bg-gradient-to-bl from-amber-300/40 to-orange-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-60 md:w-80 h-32 md:h-40 bg-gradient-to-t from-cyan-200/30 to-blue-300/20 rounded-full blur-3xl" />

          {/* Sketch-style decorative shapes - hidden on mobile for cleaner look */}
          <div className="hidden md:block absolute top-16 left-[5%] w-12 h-12 border-2 border-violet-300 rounded-xl rotate-12 opacity-60" />
          <div className="hidden md:block absolute top-28 left-[12%] w-6 h-6 bg-amber-400/40 rounded-full" />
          <div className="hidden md:block absolute top-44 left-[3%] w-4 h-4 bg-emerald-400/50 rotate-45" />
          <div className="hidden md:block absolute bottom-32 left-[8%] w-8 h-8 border-2 border-dashed border-cyan-400/50 rounded-full" />
          <div className="hidden md:block absolute bottom-20 left-[15%] w-3 h-3 bg-violet-500/40 rounded-full" />
          <div className="hidden md:block absolute bottom-40 left-[4%] w-5 h-5 border-2 border-orange-300 rotate-45 opacity-50" />

          {/* Sketch-style decorative shapes - right side - hidden on mobile */}
          <div className="hidden md:block absolute top-20 right-[6%] w-10 h-10 border-2 border-amber-400 rounded-lg -rotate-12 opacity-50" />
          <div className="hidden md:block absolute top-36 right-[10%] w-5 h-5 bg-cyan-400/50 rounded-full" />
          <div className="hidden md:block absolute top-48 right-[4%] w-6 h-6 border-2 border-dashed border-violet-400/60 rotate-12" />
          <div className="hidden md:block absolute bottom-28 right-[7%] w-8 h-8 bg-gradient-to-br from-amber-300/40 to-orange-400/40 rounded-xl rotate-6" />
          <div className="hidden md:block absolute bottom-44 right-[12%] w-4 h-4 bg-emerald-500/40 rounded-full" />
          <div className="hidden md:block absolute bottom-16 right-[5%] w-3 h-3 border-2 border-cyan-500 rotate-45 opacity-60" />

          {/* Ethereum diamond shapes - hidden on mobile */}
          <svg className="hidden md:block absolute top-24 left-[18%] w-8 h-12 text-ethBlue/20" viewBox="0 0 24 36" fill="currentColor">
            <path d="M12 0L0 18L12 24L24 18L12 0Z" />
            <path d="M12 26L0 20L12 36L24 20L12 26Z" opacity="0.6" />
          </svg>
          <svg className="hidden md:block absolute bottom-36 right-[16%] w-6 h-9 text-violet-400/30 rotate-12" viewBox="0 0 24 36" fill="currentColor">
            <path d="M12 0L0 18L12 24L24 18L12 0Z" />
            <path d="M12 26L0 20L12 36L24 20L12 26Z" opacity="0.6" />
          </svg>

          {/* Floating lines/connectors - hidden on mobile */}
          <div className="hidden md:block absolute top-32 left-[20%] w-16 h-0.5 bg-gradient-to-r from-transparent via-violet-300/40 to-transparent rotate-45" />
          <div className="hidden md:block absolute bottom-28 right-[20%] w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent -rotate-12" />

          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #627EEA 1.5px, transparent 1.5px)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="relative w-full flex flex-col items-center pt-12 md:pt-20 pb-10 px-4 overflow-visible">

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-2xl mx-auto leading-relaxed text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Discover real-world Ethereum use cases across <span className="text-ethBlue">30+ domains</span>
          </p>

          {/* Search Bar - Prominent and Centered */}
          <div className="relative z-50 w-full max-w-2xl px-2 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200" ref={searchContainerRef}>
            <div className={`
              flex items-center gap-2 sm:gap-3 border-2 border-black px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white transition-all
              ${isSearchFocused ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1 ring-2 ring-blue-100' : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
            `}>
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search use cases..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
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
                  <ul>
                    {searchResults.map((result) => (
                      <li key={result.id}>
                        <button
                          onClick={() => handleSelectSearchResult(result.id)}
                          className="w-full text-left px-5 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors group"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold font-heading text-markerBlack group-hover:text-ethBlue text-lg">{result.title}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{result.type}</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            <span className="text-gray-400 mr-1">↳</span>
                            {result.detail}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-5 text-center text-gray-400 font-medium italic">
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
                const allDomainIds = Object.values(DOMAIN_CATEGORIES).flat().map(d => getDomainId(d));
                const randomId = allDomainIds[Math.floor(Math.random() * allDomainIds.length)];
                onSelectDomain(randomId);
              }}
              className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-pastelYellow border-2 border-black rounded-xl font-bold text-markerBlack shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sketch-sm"
            >
              I'm Feeling Lucky
            </button>
            <a
              href="https://github.com/usecaselab/explorer/issues/new?template=use-case-submission.md&title=%5BUse%20Case%5D%20"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-white border-2 border-black rounded-xl font-bold text-markerBlack shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sketch-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Submit Use Case
            </a>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          {Object.entries(DOMAIN_CATEGORIES).map(([category, items], idx) => {
            const config = categoryConfig[category] || { icon: "📁", gradient: "from-gray-500 to-gray-600", iconBg: "bg-gray-100", shadow: "shadow-gray-200" };

            return (
              <div
                key={category}
                className={`group bg-white border-2 border-black rounded-2xl overflow-hidden shadow-sketch hover:shadow-sketch-hover hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Category Header with Gradient */}
                <div className={`bg-gradient-to-r ${config.gradient} px-5 py-4 flex items-center gap-3`}>
                  <div className={`w-10 h-10 ${config.iconBg} rounded-xl border-2 border-white/30 flex items-center justify-center text-xl shadow-sm`}>
                    {config.icon}
                  </div>
                  <h3 className="font-bold font-heading text-xl text-white">{category}</h3>
                  <span className="ml-auto text-white/80 text-sm font-medium">{items.length} domains</span>
                </div>

                {/* Domain Tags */}
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {items.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => onSelectDomain(getDomainId(domain))}
                        className="text-base px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-black hover:bg-white hover:shadow-sketch-sm transition-all hover:-translate-y-0.5"
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [domains, setDomains] = useState<DomainData[]>(DOMAINS);
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Markdown Data
  useEffect(() => {
    const loadDomainData = async () => {
        const updatedDomains = await Promise.all(DOMAINS.map(async (domain) => {
            try {
                const response = await fetch(`/data/${domain.id}.md`);
                if (response.ok) {
                    const text = await response.text();
                    return parseDomainMarkdown(text, domain);
                }
            } catch (error) {
                console.warn(`Failed to load markdown for ${domain.id}`, error);
            }
            return domain;
        }));
        setDomains(updatedDomains);
    };

    loadDomainData();
  }, []);

  const activeData = activeDomainId
    ? (domains.find(d => d.id === activeDomainId) || domains[0])
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

  // Autocomplete Search Logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { id: string, title: string, type: string, detail: string }[] = [];

    domains.forEach(d => {
      let matchFound = false;
      let type = '';
      let detail = '';

      // 1. Title Match
      if (d.title.toLowerCase().includes(query)) {
        matchFound = true;
        type = 'Domain';
        detail = 'Go to page';
      } 
      // 2. Idea Match
      else {
        const idea = d.ideas.find(i => i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query));
        if (idea) {
          matchFound = true;
          type = 'Idea';
          detail = idea.title;
        }
        // 3. Project Match
        else {
            const project = d.projects.find(p => p.name.toLowerCase().includes(query));
            if (project) {
                matchFound = true;
                type = 'Project';
                detail = project.name;
            }
             // 4. Problem Match
             else if (d.problemStatement.toLowerCase().includes(query)) {
                matchFound = true;
                type = 'Context';
                detail = 'Matches problem statement';
             }
        }
      }

      if (matchFound) {
        results.push({
            id: d.id,
            title: d.title,
            type,
            detail
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, domains]);

  const handleSelectSearchResult = (domainId: string) => {
    setActiveDomainId(domainId);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  // Handler for selecting a domain from anywhere
  const handleSelectDomain = (id: string) => {
    setActiveDomainId(id);
  };

  // Handler for closing the modal
  const handleCloseModal = () => {
    setActiveDomainId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-x-hidden text-markerBlack">

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
           style={{
             backgroundImage: `linear-gradient(#627EEA 1px, transparent 1px), linear-gradient(90deg, #627EEA 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}
      />

      {/* Main Content Area - Always show home page */}
      <HomeView
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        searchResults={searchResults}
        handleSelectSearchResult={handleSelectSearchResult}
        searchContainerRef={searchContainerRef}
        onSelectDomain={handleSelectDomain}
      />
      <SiteFooter />

      {/* Use Case Modal - Shows on top of home page */}
      {activeData && (
        <UseCaseModal data={activeData} lastUpdated={lastUpdatedDates[activeData.id]} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
