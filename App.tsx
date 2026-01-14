
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DOMAINS, DOMAIN_IDS, DOMAIN_CATEGORIES } from './constants';
import { DomainData, Update } from './types';
import { parseDomainMarkdown } from './utils';
import DomainSidebar from './components/DomainSidebar';
import OverviewTab from './components/OverviewTab';
import UpdatesTab from './components/UpdatesTab';
import BrainstormTab from './components/BrainstormTab';
import BountiesTab from './components/BountiesTab';
import PageFooter from './components/PageFooter';
import SiteFooter from './components/SiteFooter';
import Logo from './components/Logo';
import { Search, Menu, X, Triangle, Square, ExternalLink, ChevronRight, Home } from 'lucide-react';

type Tab = 'overview' | 'activity' | 'brainstorm' | 'bounties';

// Home view for the landing state
const HomeView: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-start min-h-[60vh] relative p-6 md:p-12 pt-8 md:pt-20 overflow-hidden">
    
    {/* Abstract Background Layer */}
    <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-full blur-3xl" />
    </div>
    
    {/* Content Container */}
    <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
             <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                An interactive compendium of real world Ethereum use cases.
             </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {[
                { 
                    icon: "🔍", 
                    title: "Explore Domains", 
                    text: "Dive into 30+ sectors to see what problems can be solved with public blockchains.",
                    color: "bg-blue-100",
                    rotate: "rotate-[-1deg]"
                },
                { 
                    icon: "💡", 
                    title: "Spark Ideas", 
                    text: "Use our AI co-architect to brainstorm new use cases and contribute to the community gallery.",
                    color: "bg-yellow-100",
                    rotate: "rotate-[1deg]"
                },
                { 
                    icon: "🛠️", 
                    title: "Track Activity", 
                    text: "Follow the latest projects, funding opportunities, and research updates in each field.",
                    color: "bg-red-100",
                    rotate: "rotate-[-1deg]"
                }
            ].map((card, i) => (
                <div key={i} className={`bg-white border-2 border-black rounded-2xl p-6 shadow-sketch hover:-translate-y-2 hover:shadow-sketch-hover transition-all duration-300 ${card.rotate} flex flex-col items-center text-center group`}>
                    <div className={`w-14 h-14 ${card.color} rounded-full border-2 border-black flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">{card.title}</h3>
                    <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base">{card.text}</p>
                </div>
            ))}
        </div>

    </div>
  </div>
);

const App: React.FC = () => {
  const [domains, setDomains] = useState<DomainData[]>(DOMAINS);
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  // Helper to find category of active domain
  const activeCategory = useMemo(() => {
      if (!activeData) return null;
      for (const [category, items] of Object.entries(DOMAIN_CATEGORIES)) {
          const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
           const map: Record<string, string> = {
                'Alternative Money': 'alt-money',
                'AI': 'ai',
            };
          const ids = items.map(i => map[i] || normalize(i));
          if (ids.includes(activeData.id)) return category;
      }
      return 'Explore';
  }, [activeData]);

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
    setActiveTab('overview');
  };

  const handleAddUpdate = (update: Update) => {
    if (!activeDomainId) return;
    setDomains(prevDomains => prevDomains.map(d => {
      if (d.id === activeDomainId) {
        return {
          ...d,
          updates: [update, ...(d.updates || [])]
        };
      }
      return d;
    }));
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

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-3 border-b-2 border-black bg-white/95 backdrop-blur-sm shadow-sm">
        
        <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 -ml-2 text-markerBlack"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            {/* Logo / Title */}
            <button 
                className="flex items-center select-none hover:opacity-80 transition-opacity text-left"
                onClick={() => {
                    setActiveDomainId(null);
                    setSearchQuery('');
                }}
            >
                <Logo showText />
            </button>
        </div>

        {/* Autocomplete Search Bar */}
        <div className="relative" ref={searchContainerRef}>
            <div className={`
                flex items-center gap-2 border-2 border-black px-3 py-1.5 rounded-full bg-white transition-all 
                ${isSearchFocused ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5 ring-2 ring-blue-100' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}
            `}>
                <Search className="w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search ideas, problems..." 
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="outline-none text-sm w-32 md:w-64 bg-transparent font-medium text-markerBlack placeholder-gray-400" 
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3 text-gray-400 hover:text-black" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border-2 border-black rounded-xl shadow-sketch overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((result) => (
                                <li key={result.id}>
                                    <button 
                                        onClick={() => handleSelectSearchResult(result.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold font-heading text-markerBlack group-hover:text-ethBlue">{result.title}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            <span className="text-gray-400 mr-1">↳</span>
                                            {result.detail}
                                        </p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-400 text-sm font-medium italic">
                            No results found.
                        </div>
                    )}
                </div>
            )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <aside className={`
            fixed inset-y-0 left-0 w-72 bg-white border-r-2 border-black z-50 p-4 transform transition-transform duration-300 md:relative md:transform-none md:bg-transparent md:border-none md:z-0 md:p-0 md:w-auto
            ${isSidebarOpen ? 'translate-x-0 shadow-[100vw_0_0_0_rgba(0,0,0,0.5)]' : '-translate-x-full md:translate-x-0'}
        `}>
            <div className="md:hidden flex justify-end mb-16">
                <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6 text-markerBlack" /></button>
            </div>
            
            <DomainSidebar 
                domains={DOMAIN_IDS} 
                selectedDomainId={activeDomainId} 
                onSelect={(id) => {
                    setActiveDomainId(id);
                    setIsSidebarOpen(false);
                    setActiveTab('overview');
                }} 
            />
        </aside>

        {/* Right Panel */}
        <section className="flex-1 flex flex-col min-w-0">
            {!activeData ? (
                <HomeView />
            ) : (
                <div className="flex flex-col gap-4">
                    
                    <div className="border-2 border-black rounded-3xl bg-white p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col">
                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                            
                            {/* Title of Domain & Join Link */}
                            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-markerBlack leading-tight">{activeData.title}</h2>
                                    {activeData.problemStatement === "Loading..." && (
                                        <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 border border-yellow-300 rounded mt-2 animate-pulse">
                                            Fetching data...
                                        </div>
                                    )}
                                </div>
                                
                                <a 
                                    href="#" 
                                    className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-ethLightBlue border-2 border-black rounded-xl font-bold text-markerBlack shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all text-sm md:text-base group"
                                >
                                    Join the Community 
                                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex gap-6 border-b-2 border-dashed border-gray-200 mb-8 flex-wrap">
                                {['Overview', 'Activity', 'Brainstorm', 'Bounties'].map((tab) => {
                                    const tabKey = tab.toLowerCase() as Tab;
                                    const isActive = activeTab === tabKey;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tabKey)}
                                            className={`
                                                pb-3 px-1 font-heading font-bold text-lg transition-all relative whitespace-nowrap
                                                ${isActive 
                                                    ? 'text-ethBlue' 
                                                    : 'text-gray-400 hover:text-gray-600'}
                                            `}
                                        >
                                            {tab}
                                            {isActive && (
                                                <span className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-ethBlue rounded-full" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1">
                                {activeTab === 'overview' && (
                                    <>
                                        <OverviewTab data={activeData} />
                                        <PageFooter />
                                    </>
                                )}
                                {activeTab === 'activity' && <UpdatesTab updates={activeData.updates} onAddUpdate={handleAddUpdate} />}
                                {activeTab === 'brainstorm' && <BrainstormTab data={activeData} />}
                                {activeTab === 'bounties' && <BountiesTab bounties={activeData.bounties} />}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </section>

      </main>

      <SiteFooter />
    </div>
  );
};

export default App;
