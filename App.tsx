import React, { useState, useEffect, useCallback } from 'react';
import IdeaShowcase, { getDomainConfig, parseIdeaMarkdown } from './components/IdeaShowcase';
import IdeaPage, { IdeaEntry } from './components/IdeaPage';
import ToolkitPage from './components/ToolkitPage';
import BountyPage from './components/BountyPage';
import WalletButton from './components/WalletButton';
import { Wrench, Plus, Search, Coins } from 'lucide-react';

type Page = 'home' | 'idea' | 'toolkit' | 'bounties';

function parseRoute(): { page: Page } | { page: 'idea'; ideaId: string } {
  const path = window.location.pathname;
  if (path === '/toolkit') return { page: 'toolkit' };
  if (path === '/bounties') return { page: 'bounties' };
  const match = path.match(/^\/idea\/([^/]+)$/);
  if (match) return { page: 'idea', ideaId: match[1] };
  return { page: 'home' };
}

const App: React.FC = () => {
  const [route, setRoute] = useState(parseRoute);
  const [allIdeas, setAllIdeas] = useState<IdeaEntry[]>([]);
  const [activeIdea, setActiveIdea] = useState<IdeaEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bountySearch, setBountySearch] = useState('');

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateToIdea = useCallback((idea: IdeaEntry, ideas: IdeaEntry[]) => {
    window.history.pushState(null, '', `/idea/${idea.id}`);
    setAllIdeas(ideas);
    setActiveIdea(idea);
    setRoute({ page: 'idea', ideaId: idea.id });
    window.scrollTo(0, 0);
  }, []);

  const navigateHome = useCallback(() => {
    window.history.pushState(null, '', '/');
    setActiveIdea(null);
    setRoute({ page: 'home' });
  }, []);

  const navigateToolkit = useCallback(() => {
    window.history.pushState(null, '', '/toolkit');
    setActiveIdea(null);
    setRoute({ page: 'toolkit' });
    window.scrollTo(0, 0);
  }, []);

  const navigateBounties = useCallback((search?: string) => {
    window.history.pushState(null, '', '/bounties');
    setActiveIdea(null);
    setBountySearch(search ?? '');
    setRoute({ page: 'bounties' });
    window.scrollTo(0, 0);
  }, []);

  // Handle direct URL load or back/forward to an idea
  useEffect(() => {
    if (route.page !== 'idea') {
      setActiveIdea(null);
      return;
    }

    const existing = allIdeas.find(i => i.id === (route as { page: 'idea'; ideaId: string }).ideaId);
    if (existing) {
      setActiveIdea(existing);
      window.scrollTo(0, 0);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const manifestRes = await fetch('/data/ideas/manifest.json');
        const manifest: string[] = await manifestRes.json();

        const loaded = await Promise.all(
          manifest.map(async (filename) => {
            const response = await fetch(`/data/ideas/${filename}`);
            if (!response.ok) return null;
            const text = await response.text();
            return parseIdeaMarkdown(text, filename.replace('.md', ''));
          })
        );

        const valid = loaded.filter(Boolean) as IdeaEntry[];
        setAllIdeas(valid);

        const ideaId = (route as { page: 'idea'; ideaId: string }).ideaId;
        const target = valid.find(i => i.id === ideaId);
        if (target) {
          setActiveIdea(target);
          window.scrollTo(0, 0);
        } else {
          window.history.replaceState(null, '', '/');
          setRoute({ page: 'home' });
        }
      } catch (err) {
        console.warn('Failed to load idea', err);
        window.history.replaceState(null, '', '/');
        setRoute({ page: 'home' });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [route, allIdeas]);

  const showIdea = route.page === 'idea' && activeIdea;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <button onClick={navigateHome} className="hover:opacity-70 transition-opacity">
          <img src="/initiative.svg" alt="Use Case Lab" className="h-7 sm:h-8" />
        </button>
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigateBounties()}
            className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Coins className="w-3 h-3" /> Bounties
          </button>
          <button
            onClick={navigateToolkit}
            className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Wrench className="w-3 h-3" /> Toolkit
          </button>
          <WalletButton />
          <a
            href={`https://github.com/usecaselab/explorer/issues/new?template=use-case-submission.md&title=${encodeURIComponent('[Use Case] ')}&body=${encodeURIComponent(`## Idea\n\n\n## Problem it solves\n\n\n## Relevant domains\n\n\n## Links or references\n\n`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit an Idea
          </a>
        </nav>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : route.page === 'bounties' ? (
        <BountyPage
          onBack={navigateHome}
          onSelectIdea={(idea) => navigateToIdea(idea, allIdeas.length ? allIdeas : [idea])}
          initialSearch={bountySearch}
        />
      ) : route.page === 'toolkit' ? (
        <ToolkitPage onBack={navigateHome} />
      ) : showIdea ? (
        <IdeaPage
          idea={activeIdea}
          accentColor={getDomainConfig(activeIdea.domains).color}
          onBack={navigateHome}
          allIdeas={allIdeas}
          onSelectIdea={(idea) => navigateToIdea(idea, allIdeas)}
          onFundBounty={(title) => navigateBounties(title)}
        />
      ) : (
        <>
          {/* Hero */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 md:pt-32 pb-6 sm:pb-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-3xl mx-auto">
              122+ ideas to<br />
              <span className="text-gray-400">build on ethereum</span>
            </h1>
            <div className="mt-6 sm:mt-8 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ideas..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-gray-50 transition-colors"
                />
              </div>
            </div>
          </section>

          <IdeaShowcase onSelect={navigateToIdea} searchQuery={searchQuery} />
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <a href="https://usecaselab.org" target="_blank" rel="noopener noreferrer" className="font-heading hover:text-gray-600 transition-colors">Use Case Lab</a>
          <a href="https://ethereum.foundation" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Ethereum Foundation</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
