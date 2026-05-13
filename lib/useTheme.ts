import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function getInitial(): Theme {
  // The inline script in index.html has already set the .dark class on <html>
  // before React mounts. Trust that as the source of truth on first render.
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // localStorage may be unavailable (private mode, etc.); ignore.
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
}
