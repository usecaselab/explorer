import React, { useState, useEffect, useCallback, useRef } from 'react';
import IdeaShowcase, { getDomainConfig } from './components/IdeaShowcase';
import IdeaPage, { IdeaEntry } from './components/IdeaPage';
import { fetchAllIdeas, fetchOverrides, vote, setWorking } from './lib/api';
import ToolkitPage from './components/ToolkitPage';
import SignInButton from './components/SignInButton';
import SubmitIdeaModal from './components/SubmitIdeaModal';
import AdminPage from './components/AdminPage';
import { Wrench, Plus, Search, Info } from 'lucide-react';
import { useSession } from './lib/auth-client';
import { consumePending, type SubmitIdeaDraft, type EditIdeaDraft } from './lib/pending-action';

function parseRoute():
  | { page: 'home' }
  | { page: 'idea'; ideaId: string }
  | { page: 'toolkit' }
  | { page: 'admin' } {
  const path = window.location.pathname;
  if (path === '/toolkit') return { page: 'toolkit' };
  if (path === '/admin') return { page: 'admin' };
  const match = path.match(/^\/idea\/([^/]+)$/);
  if (match) return { page: 'idea', ideaId: match[1] };
  return { page: 'home' };
}

function applyOverride(
  idea: IdeaEntry,
  override?: {
    title?: string | null;
    problem?: string | null;
    solutionSketch?: string | null;
    whyEthereum?: string | null;
    domains?: string[];
    resources?: { name: string; url: string; description?: string }[];
  }
): IdeaEntry {
  if (!override) return idea;
  return {
    ...idea,
    title: override.title || idea.title,
    problem: override.problem || idea.problem,
    solutionSketch: override.solutionSketch || idea.solutionSketch,
    whyEthereum: override.whyEthereum || idea.whyEthereum,
    domains: override.domains || idea.domains,
    resources: override.resources || idea.resources,
  };
}

const App: React.FC = () => {
  const [route, setRoute] = useState(parseRoute);
  const [allIdeas, setAllIdeas] = useState<IdeaEntry[]>([]);
  const [activeIdea, setActiveIdea] = useState<IdeaEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitInitialDraft, setSubmitInitialDraft] = useState<SubmitIdeaDraft | null>(null);
  const [pendingEdit, setPendingEdit] = useState<{ ideaId: string; draft: EditIdeaDraft } | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const { data: session } = useSession();
  const replayedRef = useRef(false);

  // Replay any pending action stashed before the OAuth round-trip.
  useEffect(() => {
    if (!session || replayedRef.current) return;
    const action = consumePending();
    if (!action) {
      replayedRef.current = true;
      return;
    }
    replayedRef.current = true;

    (async () => {
      try {
        switch (action.type) {
          case 'vote':
            await vote(action.ideaId);
            setRefreshNonce((n) => n + 1);
            break;
          case 'working-on':
            await setWorking(action.ideaId, { url: action.url, note: action.note });
            setRefreshNonce((n) => n + 1);
            break;
          case 'submit-idea':
            setSubmitInitialDraft(action.draft);
            setSubmitOpen(true);
            break;
          case 'edit-idea':
            setPendingEdit({ ideaId: action.ideaId, draft: action.draft });
            break;
        }
      } catch (err) {
        console.warn('Pending action replay failed', err);
      }
    })();
  }, [session]);

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Open the submit modal when arriving from outside via /?submit=1
  // (used by the static /about/ subsite which can't open the modal directly).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submit') === '1') {
      setSubmitOpen(true);
      params.delete('submit');
      const qs = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
    }
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
        const [allIdeas, exploredRes, overrides] = await Promise.all([
          fetchAllIdeas(),
          fetch('/data/explored.json'),
          fetchOverrides().catch(() => ({} as Record<string, any>)),
        ]);
        const exploredMap: Record<string, any[]> = exploredRes.ok ? await exploredRes.json() : {};

        const valid: IdeaEntry[] = allIdeas.map((row) => {
          const idea: IdeaEntry = {
            id: row.id,
            title: row.title,
            problem: row.problem,
            solutionSketch: row.solutionSketch,
            whyEthereum: row.whyEthereum,
            domains: row.domains,
            resources: row.resources.map((r) => ({ ...r, description: r.description ?? '' })),
            author: row.author,
            createdAt: row.createdAt,
          };
          if (exploredMap[idea.id]) idea.explored = exploredMap[idea.id];
          return applyOverride(idea, overrides[idea.id]);
        });
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
          <a
            href="/about/"
            className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Info className="w-3 h-3" /> About
          </a>
          <button
            onClick={navigateToolkit}
            className="text-xs sm:text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Wrench className="w-3 h-3" /> Toolkit
          </button>
          <button
            onClick={() => setSubmitOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-black text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit an Idea
          </button>
          <SignInButton />
        </nav>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : route.page === 'toolkit' ? (
        <ToolkitPage onBack={navigateHome} />
      ) : route.page === 'admin' ? (
        <AdminPage onBack={navigateHome} />
      ) : showIdea ? (
        <IdeaPage
          idea={activeIdea}
          accentColor={getDomainConfig(activeIdea.domains).color}
          onBack={navigateHome}
          allIdeas={allIdeas}
          onSelectIdea={(idea) => navigateToIdea(idea, allIdeas)}
          refreshNonce={refreshNonce}
          pendingEdit={pendingEdit && pendingEdit.ideaId === activeIdea.id ? pendingEdit.draft : null}
          onPendingEditConsumed={() => setPendingEdit(null)}
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

          <IdeaShowcase
            onSelect={navigateToIdea}
            searchQuery={searchQuery}
            refreshNonce={refreshNonce}
            onClearSearch={() => setSearchQuery('')}
          />
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <a href="https://usecaselab.org" target="_blank" rel="noopener noreferrer" className="font-heading hover:text-gray-600 transition-colors">Use Case Lab</a>
          <a href="https://ethereum.foundation" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Ethereum Foundation</a>
        </div>
      </footer>

      <SubmitIdeaModal
        open={submitOpen}
        onClose={() => {
          setSubmitOpen(false);
          setTimeout(() => setSubmitInitialDraft(null), 300);
        }}
        initialDraft={submitInitialDraft}
      />
    </div>
  );
};

export default App;
