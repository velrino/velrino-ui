import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../src/index.js';
import {
  DesignSystemRoot,
  type DesignSystemAdapters,
  type DesignSystemBrandLogoProps,
} from '../../src/showcase/index.js';
import { designSystemEn, designSystemPtBR } from '../../src/showcase/messages/index.js';
import '../../src/styles/index.css';
import '../../src/styles/showcase.css';
import './styles.css';

type Locale = 'en' | 'pt-BR';
const LocaleContext = createContext({ locale: 'en' as Locale, toggle: () => {} });
function LanguagePicker() {
  const { locale, toggle } = useContext(LocaleContext);
  return (
    <Button variant="outline" onClick={toggle}>
      {locale === 'en' ? 'Português' : 'English'}
    </Button>
  );
}
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
  const [locale, setLocale] = useState<Locale>('en');
  const [theme, setTheme] = useState('hackuniverse');
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
    <LocaleContext
      value={{ locale, toggle: () => setLocale((value) => (value === 'en' ? 'pt-BR' : 'en')) }}
    >
      <header className="demo-toolbar">
        <a href="#" className="demo-wordmark">
          VELRINO UI<span>0.0.1</span>
        </a>
        <div
          role="group"
          aria-label={locale === 'en' ? 'Theme preview' : 'Prévia de tema'}
          className="demo-theme-controls"
        >
          {['hackuniverse', 'cyan', 'purple', 'red'].map((value) => (
            <Button
              key={value}
              size="sm"
              variant="outline"
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
            >
              {value === 'hackuniverse' ? 'HackUniverse' : `Portfolio · ${value}`}
            </Button>
          ))}
        </div>
        <LanguagePicker />
      </header>
      <DesignSystemRoot adapters={adapters} />
    </LocaleContext>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
