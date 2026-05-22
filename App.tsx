import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import PersonaLanding from './components/PersonaLanding';
import PersonaPage from './components/PersonaPage';
import IdeaPage, { IdeaEntry } from './components/IdeaPage';
import IdeaShowcase, { getDomainConfig } from './components/IdeaShowcase';
import GraphView from './components/GraphView';
import { fetchAllIdeas, fetchAllPersonas, type Persona, type Idea } from './lib/api';
import SubmitIdeaModal from './components/SubmitIdeaModal';
import ContactModal from './components/ContactModal';
import ThemeToggle from './components/ThemeToggle';

import RFPsPage from './components/RFPsPage';
import RFPPage from './components/RFPPage';
import { findRFP, type RFP } from './lib/rfps';
import { Search, X } from 'lucide-react';

type LandingView = 'home' | 'ideas' | 'graph';

type Route =
  | { page: 'home' }
  | { page: 'ideas' }
  | { page: 'graph' }
  | { page: 'persona'; personaId: string }
  | { page: 'idea'; ideaId: string }
  | { page: 'rfps' }
  | { page: 'rfp'; rfpId: string };

function parseRoute(): Route {
  const path = window.location.pathname;
  if (path === '/ideas') return { page: 'ideas' };
  if (path === '/graph') return { page: 'graph' };
  if (path === '/rfp') return { page: 'rfps' };
  const rfpMatch = path.match(/^\/rfp\/([^/]+)$/);
  if (rfpMatch) return { page: 'rfp', rfpId: rfpMatch[1] };
  const personaMatch = path.match(/^\/persona\/([^/]+)$/);
  if (personaMatch) return { page: 'persona', personaId: personaMatch[1] };
  const ideaMatch = path.match(/^\/idea\/([^/]+)$/);
  if (ideaMatch) return { page: 'idea', ideaId: ideaMatch[1] };
  return { page: 'home' };
}

const VIEW_PATH: Record<LandingView, string> = { home: '/', ideas: '/ideas', graph: '/graph' };
const VIEWS: { id: LandingView; label: string }[] = [
  { id: 'home', label: 'Personas' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'graph', label: 'Graph' },
];

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);
  const [activeIdea, setActiveIdea] = useState<IdeaEntry | null>(null);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [activeRFP, setActiveRFP] = useState<RFP | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const savedLandingScrollRef = useRef<number | null>(null);
  const cameFromInternalRef = useRef(false);

  const landingViewRef = useRef<LandingView>('home');
  if (route.page === 'home' || route.page === 'ideas' || route.page === 'graph') {
    landingViewRef.current = route.page;
  }
  const landingView = landingViewRef.current;

  useEffect(() => {
    fetchAllIdeas().then(setAllIdeas).catch(() => {});
    fetchAllPersonas().then(setAllPersonas).catch(() => {});
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const isLanding = (p: Route['page']) => p === 'home' || p === 'ideas' || p === 'graph';

  useLayoutEffect(() => {
    if (isLanding(route.page) && savedLandingScrollRef.current != null) {
      const y = savedLandingScrollRef.current;
      savedLandingScrollRef.current = null;
      window.scrollTo(0, y);
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty('--sticky-header-h', `${el.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateView = useCallback((view: LandingView) => {
    window.history.pushState(null, '', VIEW_PATH[view]);
    setActiveIdea(null);
    setActivePersona(null);
    setActiveRFP(null);
    setRoute({ page: view });
  }, []);

  const navigateHome = useCallback(() => navigateView('home'), [navigateView]);

  const navigateToPersona = useCallback((persona: Persona) => {
    if (isLanding(route.page)) savedLandingScrollRef.current = window.scrollY;
    cameFromInternalRef.current = true;
    window.history.pushState(null, '', `/persona/${persona.id}`);
    setActivePersona(persona);
    setRoute({ page: 'persona', personaId: persona.id });
  }, [route.page]);

  const navigateToPersonaById = useCallback((personaId: string) => {
    const found = allPersonas.find((p) => p.id === personaId);
    if (found) navigateToPersona(found);
  }, [allPersonas, navigateToPersona]);

  const navigateToIdea = useCallback((idea: IdeaEntry) => {
    if (isLanding(route.page)) savedLandingScrollRef.current = window.scrollY;
    cameFromInternalRef.current = true;
    window.history.pushState(null, '', `/idea/${idea.id}`);
    setActiveIdea(idea);
    setRoute({ page: 'idea', ideaId: idea.id });
  }, [route.page]);

  const handleBack = useCallback(() => {
    if (cameFromInternalRef.current) {
      window.history.back();
    } else {
      navigateHome();
    }
  }, [navigateHome]);

  const navigateRFPs = useCallback(() => {
    window.history.pushState(null, '', '/rfp');
    setActiveIdea(null);
    setActivePersona(null);
    setActiveRFP(null);
    setRoute({ page: 'rfps' });
  }, []);

  const navigateToRFP = useCallback((rfp: RFP) => {
    window.history.pushState(null, '', `/rfp/${rfp.id}`);
    setActiveRFP(rfp);
    setRoute({ page: 'rfp', rfpId: rfp.id });
  }, []);

  const navigateBackToRFPs = useCallback(() => {
    window.history.pushState(null, '', '/rfp');
    setActiveRFP(null);
    setRoute({ page: 'rfps' });
  }, []);

  // Search acts on whichever view is showing. From a detail page, bounce to
  // the last landing view so the query has something to act on.
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (value && !isLanding(route.page)) navigateView(landingView);
  }, [route.page, landingView, navigateView]);

  // Global "/" shortcut focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Direct URL load or back/forward to a persona
  useEffect(() => {
    if (route.page !== 'persona') return;
    const existing = allPersonas.find((p) => p.id === route.personaId);
    if (existing) {
      setActivePersona(existing);
      return;
    }
    if (allPersonas.length === 0) return;
    window.history.replaceState(null, '', '/');
    setRoute({ page: 'home' });
  }, [route, allPersonas]);

  // Direct URL load or back/forward to an idea
  useEffect(() => {
    if (route.page !== 'idea') return;
    const ideaRow = allIdeas.find((i) => i.id === route.ideaId);
    if (ideaRow) {
      setActiveIdea({
        id: ideaRow.id,
        title: ideaRow.title,
        problem: ideaRow.problem,
        solutionSketch: ideaRow.solutionSketch,
        whyEthereum: ideaRow.whyEthereum,
        domains: ideaRow.domains,
        author: ideaRow.author,
        createdAt: ideaRow.createdAt,
        updatedAt: ideaRow.updatedAt,
      });
      return;
    }
    if (allIdeas.length === 0) {
      setLoading(true);
      return;
    }
    setLoading(false);
    window.history.replaceState(null, '', '/');
    setRoute({ page: 'home' });
  }, [route, allIdeas]);

  useEffect(() => {
    if (route.page === 'idea' && allIdeas.length > 0) setLoading(false);
  }, [route, allIdeas]);

  // Direct URL load or back/forward to an RFP
  useEffect(() => {
    if (route.page !== 'rfp') {
      setActiveRFP(null);
      return;
    }
    const found = findRFP(route.rfpId);
    if (found) {
      setActiveRFP(found);
    } else {
      window.history.replaceState(null, '', '/rfp');
      setRoute({ page: 'rfps' });
    }
  }, [route]);

  const showLandingWrapper = isLanding(route.page) || route.page === 'persona' || route.page === 'idea';
  const activeView: LandingView | null = isLanding(route.page)
    ? (route.page as LandingView)
    : route.page === 'persona' || route.page === 'idea'
      ? landingView
      : null;

  const renderToggle = () => (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-neutral-900">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          onClick={() => navigateView(v.id)}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            activeView === v.id
              ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-neutral-950 dark:text-neutral-100">
      <div className="w-full flex flex-col flex-1 min-w-0">
        <header
          ref={headerRef}
          className="sticky top-0 z-20 w-full px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-gray-900"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={navigateHome}
              aria-label="Home"
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <img src="/initiative.svg" alt="Use Case Lab" className="h-7 dark:invert" />
            </button>
            <div className="hidden sm:block">{renderToggle()}</div>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <div className="relative w-36 sm:w-56 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape' && searchQuery) {
                      e.preventDefault();
                      setSearchQuery('');
                    }
                  }}
                  placeholder="Search ideas..."
                  aria-label="Search ideas"
                  className={`w-full pl-9 py-2 bg-gray-100 dark:bg-neutral-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 transition-colors ${searchQuery ? 'pr-9' : 'pr-3 md:pr-9'}`}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (!searchFocused && (
                  <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 pointer-events-none select-none">
                    /
                  </kbd>
                ))}
              </div>
              <ThemeToggle className="p-2 flex-shrink-0" />
            </div>
          </div>

          <div className="sm:hidden mt-3">{renderToggle()}</div>
        </header>

        {/* Landing: personas / ideas / graph. Kept mounted (hidden) while a
            detail page is open so view state survives the round trip. */}
        {showLandingWrapper && (
          <div
            className={
              !isLanding(route.page)
                ? 'hidden'
                : landingView === 'graph'
                  ? 'flex flex-col flex-1'
                  : 'flex flex-col flex-1 pt-6 sm:pt-8'
            }
          >
            {landingView === 'home' && (
              <PersonaLanding
                onSelect={navigateToPersona}
                searchQuery={searchQuery}
                ideas={allIdeas}
              />
            )}
            {landingView === 'ideas' && (
              <IdeaShowcase
                onSelect={(idea) => navigateToIdea(idea)}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            )}
            {landingView === 'graph' && (
              <GraphView
                personas={allPersonas}
                ideas={allIdeas}
                searchQuery={searchQuery}
                onSelectPersona={navigateToPersonaById}
                onSelectIdea={navigateToIdea}
              />
            )}
          </div>
        )}

        {route.page === 'persona' && activePersona && (
          <PersonaPage
            persona={activePersona}
            ideas={allIdeas}
            onBack={handleBack}
            onSelectIdea={navigateToIdea}
            onSelectPersona={navigateToPersonaById}
          />
        )}

        {route.page === 'idea' && (
          loading || !activeIdea ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <IdeaPage
              idea={activeIdea}
              accentColor={getDomainConfig(activeIdea.domains).color}
              onBack={handleBack}
              onSelectPersona={navigateToPersonaById}
            />
          )
        )}

        {route.page === 'rfps' && <RFPsPage onSelect={navigateToRFP} />}
        {route.page === 'rfp' && activeRFP && (
          <RFPPage rfp={activeRFP} onBack={navigateBackToRFPs} />
        )}

        <footer className="mt-auto w-full px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-4 sm:gap-5">
              <button onClick={() => setSubmitOpen(true)} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                Add Idea
              </button>
              <button onClick={navigateRFPs} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                RFPs
              </button>
              <button onClick={() => setContactOpen(true)} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                Contact
              </button>
            </div>
            <a
              href="https://ethereum.foundation"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Ethereum Foundation
            </a>
          </div>
        </footer>
      </div>

      <SubmitIdeaModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

export default App;
