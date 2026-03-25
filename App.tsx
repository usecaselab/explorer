import React, { useState, useEffect, useCallback } from 'react';
import IdeaShowcase, { getDomainConfig, parseIdeaMarkdown } from './components/IdeaShowcase';
import IdeaPage, { IdeaEntry } from './components/IdeaPage';
import ToolkitPage from './components/ToolkitPage';
import { ArrowUpRight, Wrench, Copy, Check } from 'lucide-react';

function parseRoute(): { page: 'home' } | { page: 'idea'; ideaId: string } | { page: 'toolkit' } {
  const path = window.location.pathname;
  if (path === '/toolkit') return { page: 'toolkit' };
  const match = path.match(/^\/idea\/([^/]+)$/);
  if (match) return { page: 'idea', ideaId: match[1] };
  return { page: 'home' };
}

const INSTALL_CMD = 'curl -sL usecaselab.org/skill.md';

function CurlInstall() {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="mt-6 sm:mt-8 max-w-xl mx-auto">
      <button
        onClick={handleCopy}
        className="w-full flex items-center gap-2 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm hover:bg-gray-200 transition-colors group"
      >
        <span className="text-gray-400 select-none">$</span>
        <code className="flex-1 text-left truncate text-gray-600">{INSTALL_CMD}</code>
        {copied ? <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 transition-colors" />}
      </button>
      <p className="text-xs text-gray-400 mt-2">Claude Code skill — explore ideas from your terminal</p>
    </div>
  );
}

const App: React.FC = () => {
  const [route, setRoute] = useState(parseRoute);
  const [allIdeas, setAllIdeas] = useState<IdeaEntry[]>([]);
  const [activeIdea, setActiveIdea] = useState<IdeaEntry | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Navigate to an idea
  const navigateToIdea = useCallback((idea: IdeaEntry, ideas: IdeaEntry[]) => {
    window.history.pushState(null, '', `/idea/${idea.id}`);
    setAllIdeas(ideas);
    setActiveIdea(idea);
    setRoute({ page: 'idea', ideaId: idea.id });
    window.scrollTo(0, 0);
  }, []);

  // Navigate home
  const navigateHome = useCallback(() => {
    window.history.pushState(null, '', '/');
    setActiveIdea(null);
    setRoute({ page: 'home' });
  }, []);

  // Navigate to toolkit
  const navigateToolkit = useCallback(() => {
    window.history.pushState(null, '', '/toolkit');
    setActiveIdea(null);
    setRoute({ page: 'toolkit' });
    window.scrollTo(0, 0);
  }, []);

  // Handle direct URL load or back/forward to an idea
  useEffect(() => {
    if (route.page !== 'idea') {
      setActiveIdea(null);
      return;
    }

    // Check if we already have this idea loaded
    const existing = allIdeas.find(i => i.id === route.ideaId);
    if (existing) {
      setActiveIdea(existing);
      window.scrollTo(0, 0);
      return;
    }

    // Direct URL load — fetch the idea and all ideas
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

        const target = valid.find(i => i.id === route.ideaId);
        if (target) {
          setActiveIdea(target);
          window.scrollTo(0, 0);
        } else {
          // Idea not found — go home
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
        <button
          onClick={navigateHome}
          className="hover:opacity-70 transition-opacity"
        >
          <img src="/initiative.svg" alt="Use Case Lab" className="h-7 sm:h-8" />
        </button>
        <nav className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={navigateToolkit}
            className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Wrench className="w-3 h-3" /> Toolkit
          </button>
          <a
            href="https://www.usecaselab.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            About <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/usecaselab"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-sm text-gray-500 hover:text-black transition-colors items-center gap-1"
          >
            GitHub <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : route.page === 'toolkit' ? (
        <ToolkitPage onBack={navigateHome} />
      ) : showIdea ? (
        <IdeaPage
          idea={activeIdea}
          accentColor={getDomainConfig(activeIdea.domains).color}
          onBack={navigateHome}
          allIdeas={allIdeas}
          onSelectIdea={(idea) => navigateToIdea(idea, allIdeas)}
        />
      ) : (
        <>
          {/* Hero */}
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 md:pt-32 pb-6 sm:pb-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-3xl mx-auto">
              122+ ideas to<br />
              <span className="text-gray-400">build on ethereum</span>
            </h1>
            <CurlInstall />
          </section>

          <IdeaShowcase onSelect={navigateToIdea} />
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
