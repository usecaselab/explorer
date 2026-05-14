import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import IdeaShowcase, { getDomainConfig } from './components/IdeaShowcase';
import IdeaPage, { IdeaEntry } from './components/IdeaPage';
import { fetchAllIdeas } from './lib/api';
import ToolkitPage from './components/ToolkitPage';
import SubmitIdeaModal from './components/SubmitIdeaModal';
import ContactModal from './components/ContactModal';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

import RFPsPage from './components/RFPsPage';
import RFPPage from './components/RFPPage';
import { findRFP, type RFP } from './lib/rfps';
import { Menu, Plus, Search } from 'lucide-react';

type Route =
  | { page: 'home' }
  | { page: 'idea'; ideaId: string }
  | { page: 'toolkit' }
  | { page: 'rfps' }
  | { page: 'rfp'; rfpId: string };

function parseRoute(): Route {
  const path = window.location.pathname;
  if (path === '/toolkit') return { page: 'toolkit' };
  if (path === '/rfp') return { page: 'rfps' };
  const rfpMatch = path.match(/^\/rfp\/([^/]+)$/);
  if (rfpMatch) return { page: 'rfp', rfpId: rfpMatch[1] };
  const ideaMatch = path.match(/^\/idea\/([^/]+)$/);
  if (ideaMatch) return { page: 'idea', ideaId: ideaMatch[1] };
  return { page: 'home' };
}

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [allIdeas, setAllIdeas] = useState<IdeaEntry[]>([]);
  const [activeIdea, setActiveIdea] = useState<IdeaEntry | null>(null);
  const [activeRFP, setActiveRFP] = useState<RFP | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [totalIdeas, setTotalIdeas] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  // Saved window.scrollY when leaving the home page for an idea; restored on
  // return so the user lands where they were.
  const savedHomeScrollRef = useRef<number | null>(null);
  // Tracks whether the current idea page was reached via in-app navigation
  // (vs. a deep link / refresh). Determines whether back uses history.back().
  const cameFromInternalRef = useRef(false);

  useEffect(() => {
    fetchAllIdeas()
      .then((rows) => setTotalIdeas(rows.length))
      .catch(() => {});
  }, []);

  // Firefox restores scroll position on pushState. Disable browser restoration
  // and reset ourselves on every route change.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // useLayoutEffect runs synchronously after DOM mutations but before paint,
  // so the scroll position is set before the user sees the new route — no
  // visible scroll/jump between the old and new positions.
  useLayoutEffect(() => {
    if (route.page === 'home' && savedHomeScrollRef.current != null) {
      const y = savedHomeScrollRef.current;
      savedHomeScrollRef.current = null;
      window.scrollTo(0, y);
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  // Publish the sticky header height as a CSS variable so child sticky
  // elements (e.g. the category carousel) can pin directly beneath it
  // without hardcoding a per-breakpoint offset.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty(
        '--sticky-header-h',
        `${el.offsetHeight}px`
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Global "/" shortcut state — wired further down once navigateHome is defined.
  const pendingSearchFocusRef = useRef(false);

  // Browser back/forward
  useEffect(() => {
    const onPopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Open the submit modal when arriving via /?submit=1 (used by /about/ subsite).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('submit') === '1') {
      setSubmitOpen(true);
      params.delete('submit');
      const qs = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
    }
  }, []);

  const navigateToIdea = useCallback((idea: IdeaEntry, ideas: IdeaEntry[]) => {
    if (route.page === 'home') {
      savedHomeScrollRef.current = window.scrollY;
    }
    cameFromInternalRef.current = true;
    window.history.pushState(null, '', `/idea/${idea.id}`);
    setAllIdeas(ideas);
    setActiveIdea(idea);
    setRoute({ page: 'idea', ideaId: idea.id });
  }, [route.page]);

  const navigateHome = useCallback(() => {
    window.history.pushState(null, '', '/');
    setActiveIdea(null);
    setActiveRFP(null);
    setRoute({ page: 'home' });
  }, []);

  // Back from idea: if the user arrived via in-app nav, prefer browser back
  // so we don't pile a redundant '/' onto the history stack. Otherwise (deep
  // link), push a new home entry.
  const handleBackFromIdea = useCallback(() => {
    if (cameFromInternalRef.current) {
      window.history.back();
    } else {
      navigateHome();
    }
  }, [navigateHome]);

  const navigateToolkit = useCallback(() => {
    window.history.pushState(null, '', '/toolkit');
    setActiveIdea(null);
    setActiveRFP(null);
    setRoute({ page: 'toolkit' });
  }, []);

  const navigateRFPs = useCallback(() => {
    window.history.pushState(null, '', '/rfp');
    setActiveIdea(null);
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

  // When the user types into the search bar from a non-home page, jump them
  // home so the filtered results render.
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (value && route.page !== 'home') navigateHome();
    },
    [route.page, navigateHome]
  );

  // Global "/" shortcut: focus search on the ideas page; navigate home first if elsewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      if (route.page === 'home') {
        searchRef.current?.focus();
        searchRef.current?.select();
      } else {
        pendingSearchFocusRef.current = true;
        navigateHome();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [route.page, navigateHome]);

  useEffect(() => {
    if (route.page === 'home' && pendingSearchFocusRef.current) {
      pendingSearchFocusRef.current = false;
      requestAnimationFrame(() => {
        searchRef.current?.focus();
        searchRef.current?.select();
      });
    }
  }, [route]);

  // Direct URL load or back/forward to an idea
  useEffect(() => {
    if (route.page !== 'idea') {
      setActiveIdea(null);
      return;
    }
    const existing = allIdeas.find((i) => i.id === route.ideaId);
    if (existing) {
      setActiveIdea(existing);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const rows = await fetchAllIdeas();
        const valid: IdeaEntry[] = rows.map((row) => ({
          id: row.id,
          title: row.title,
          problem: row.problem,
          solutionSketch: row.solutionSketch,
          whyEthereum: row.whyEthereum,
          domains: row.domains,
          author: row.author,
          createdAt: row.createdAt,
        }));
        setAllIdeas(valid);
        const target = valid.find((i) => i.id === route.ideaId);
        if (target) {
          setActiveIdea(target);
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

  const sidebarRoute = route.page;

  return (
    <div className="min-h-screen flex bg-white text-black dark:bg-neutral-950 dark:text-neutral-100">
      <Sidebar
        current={sidebarRoute}
        onNavigateHome={navigateHome}
        onNavigateRFPs={navigateRFPs}
        onNavigateToolkit={navigateToolkit}
        onOpenContact={() => setContactOpen(true)}
      />

      <div className="flex-1 min-w-0 flex flex-col md:pl-8 lg:pl-16">
        {/* Top bar: persistent search across all pages. Add Idea CTA shows on
            the ideas page only. Mobile stacks logo/menu above search/add.
            Sticky so the search bar stays available while scrolling. */}
        <header
          ref={headerRef}
          className="sticky top-0 z-20 w-full max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-gray-900"
        >
          {/* Mobile-only top row: logo left, hamburger right */}
          <div className="md:hidden flex items-center justify-between mb-5">
            <button
              onClick={navigateHome}
              className="hover:opacity-70 transition-opacity"
              aria-label="Home"
            >
              <img src="/initiative.svg" alt="Use Case Lab" className="h-7 dark:invert" />
            </button>
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 -mr-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Search + Add Idea row */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
            {route.page === 'home' || route.page === 'idea' ? (
              <div className="flex-1 max-w-md relative min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search ideas..."
                  aria-label="Search ideas"
                  className="w-full pl-9 pr-3 md:pr-10 py-2 bg-gray-100 dark:bg-neutral-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 focus:bg-gray-50 dark:focus:bg-neutral-900 transition-colors"
                />
                {!searchFocused && !searchQuery && (
                  <kbd className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 pointer-events-none select-none">
                    /
                  </kbd>
                )}
              </div>
            ) : (
              // Spacer keeps the desktop header height consistent across pages
              // (so heroes align). Collapses to nothing on mobile.
              <div className="hidden md:block flex-1 max-w-md h-9" aria-hidden="true" />
            )}
            {(route.page === 'home' || route.page === 'idea') && (
              <button
                onClick={() => setSubmitOpen(true)}
                className="md:ml-auto inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
                aria-label="Add idea"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Idea</span>
              </button>
            )}
          </div>
        </header>

        {/* Keep the home (showcase) DOM mounted while viewing an idea so
            scroll position, active category, and pagination survive the
            round trip. Hidden when on idea route; fully removed elsewhere. */}
        {(route.page === 'home' || route.page === 'idea') && (
          <div className={route.page === 'idea' ? 'hidden' : ''}>
            <section className="w-full max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                {totalIdeas !== null ? `${Math.floor(totalIdeas / 10) * 10}+` : '120+'} ideas to<br />
                <span className="text-gray-400 dark:text-gray-600">build on ethereum</span>
              </h1>
            </section>

            <IdeaShowcase
              onSelect={navigateToIdea}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          </div>
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
              onBack={handleBackFromIdea}
            />
          )
        )}

        {route.page === 'toolkit' && <ToolkitPage />}
        {route.page === 'rfps' && <RFPsPage onSelect={navigateToRFP} />}
        {route.page === 'rfp' && activeRFP && (
          <RFPPage rfp={activeRFP} onBack={navigateBackToRFPs} />
        )}

        <footer className="mt-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-end text-sm text-gray-400 dark:text-gray-500">
            <a href="https://ethereum.foundation" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Ethereum Foundation</a>
          </div>
        </footer>
      </div>

      <SubmitIdeaModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <MobileNav
        open={mobileNavOpen}
        current={sidebarRoute}
        onClose={() => setMobileNavOpen(false)}
        onNavigateHome={navigateHome}
        onNavigateRFPs={navigateRFPs}
        onNavigateToolkit={navigateToolkit}
        onOpenContact={() => setContactOpen(true)}
      />
    </div>
  );
};

export default App;
