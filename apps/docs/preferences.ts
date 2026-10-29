import { useCallback, useEffect, useState } from 'react';
import type { SurfaceAppearance } from '../../src/index.js';
import type { DemoTheme } from './components/theme-picker.js';
import type { Locale } from './i18n.js';

type Preferences = { locale: Locale; theme: DemoTheme; appearance: SurfaceAppearance };

function readPreferences(): Preferences {
  const query = new URLSearchParams(window.location.search);
  const single = (key: string) => (query.getAll(key).length === 1 ? query.get(key) : null);
  const theme = single('theme');
  return {
    locale: single('lang') === 'pt-BR' ? 'pt-BR' : 'en',
    theme: theme === 'purple' || theme === 'red' ? theme : 'cyan',
    appearance: single('appearance') === 'default' ? 'default' : 'sci-fi',
  };
}

/** URL preferences let consumers share a view without adding application dependencies. */
export function useDocsPreferences() {
  const [preferences, setPreferences] = useState(readPreferences);
  useEffect(() => {
    const restore = () => setPreferences(readPreferences());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  const update = useCallback((key: string, value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    // Keep component inputs mounted and avoid a history entry for every preference change.
    window.history.replaceState(window.history.state, '', url);
    setPreferences(readPreferences());
  }, []);
  const setLocale = useCallback((locale: Locale) => update('lang', locale), [update]);
  const setTheme = useCallback((theme: DemoTheme) => update('theme', theme), [update]);
  const setAppearance = useCallback(
    (appearance: SurfaceAppearance) => update('appearance', appearance),
    [update],
  );
  return { ...preferences, setLocale, setTheme, setAppearance };
}
