import { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import packageInfo from '../../package.json';
import { UIProvider } from '../../src/index.js';
import {
  DesignSystemRoot,
  type DesignSystemAdapters,
  type DesignSystemBrandLogoProps,
} from '../../src/showcase/index.js';
import { designSystemEn, designSystemPtBR } from '../../src/showcase/messages/index.js';
import '../../src/styles/index.css';
import '../../src/styles/showcase.css';
import './styles.css';
import { LanguagePicker } from './components/language-picker.js';
import { LocaleContext } from './i18n.js';
import { ShowcaseSettings } from './components/showcase-settings.js';
import { useDocsPreferences } from './preferences.js';
function BrandLogo({ size = 96, alt, className }: DesignSystemBrandLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-label={alt}
    >
      <circle cx="48" cy="48" r="25" stroke="var(--vui-accent)" strokeWidth="2" />
      <ellipse
        cx="48"
        cy="48"
        rx="43"
        ry="13"
        transform="rotate(-30 48 48)"
        stroke="var(--vui-text)"
      />
      <circle cx="79" cy="21" r="4" fill="var(--vui-accent)" />
    </svg>
  );
}
function App() {
  const { locale, setLocale, theme, setTheme, appearance, setAppearance } = useDocsPreferences();
  useEffect(() => {
    document.documentElement.dataset.demoTheme = theme;
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const adapters = useMemo<DesignSystemAdapters>(
    () => ({
      localization: {
        copy: locale === 'en' ? designSystemEn : designSystemPtBR,
        closeLabel: locale === 'en' ? 'Close' : 'Fechar',
      },
      components: { BrandLogo, LanguagePicker },
      brand: { name: 'Velrino UI' },
    }),
    [locale],
  );
  return (
    <LocaleContext value={{ locale, setLocale }}>
      <UIProvider appearance={appearance}>
        <DesignSystemRoot
          adapters={adapters}
          renderNavigation={(navigation) => (
            <header className="demo-toolbar">
              <a href="#" className="demo-wordmark">
                VELRINO UI<span>{packageInfo.version}</span>
              </a>
              <ShowcaseSettings
                theme={theme}
                onThemeChange={setTheme}
                appearance={appearance}
                onAppearanceChange={setAppearance}
                navigation={navigation}
              />
            </header>
          )}
        />
      </UIProvider>
    </LocaleContext>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
