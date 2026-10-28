import { createContext, useContext } from 'react';

export type Locale = 'en' | 'pt-BR';

export const demoMessages = {
  en: {
    theme: 'Theme preview',
    standard: 'Standard surfaces',
    scifi: 'Sci-fi surfaces',
    settings: {
      trigger: 'Open preview settings',
      title: 'Preview settings',
      description: 'Choose a theme, surface style and language for this preview.',
      theme: 'Theme',
      appearance: 'Surfaces',
      language: 'Language',
    },
    language: {
      trigger: 'Change language',
      title: 'Choose your language',
      description: 'Choose the language you feel most comfortable with.',
      close: 'Close',
      selected: 'Selected language',
      available: 'Choose this language',
      regions: { en: 'United States', 'pt-BR': 'Brazil' },
    },
  },
  'pt-BR': {
    theme: 'Prévia de tema',
    standard: 'Superfícies padrão',
    scifi: 'Superfícies sci-fi',
    settings: {
      trigger: 'Abrir configurações da prévia',
      title: 'Configurações da prévia',
      description: 'Escolha o tema, o estilo das superfícies e o idioma desta prévia.',
      theme: 'Tema',
      appearance: 'Aparência',
      language: 'Idioma',
    },
    language: {
      trigger: 'Mudar idioma',
      title: 'Escolha seu idioma',
      description: 'Escolha o idioma em que você se sente mais confortável.',
      close: 'Fechar',
      selected: 'Idioma selecionado',
      available: 'Escolher este idioma',
      regions: { en: 'Estados Unidos', 'pt-BR': 'Brasil' },
    },
  },
} satisfies Record<
  Locale,
  {
    theme: string;
    standard: string;
    scifi: string;
    settings: {
      trigger: string;
      title: string;
      description: string;
      theme: string;
      appearance: string;
      language: string;
    };
    language: {
      trigger: string;
      title: string;
      description: string;
      close: string;
      selected: string;
      available: string;
      regions: Record<Locale, string>;
    };
  }
>;

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function useDemoLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('The demo locale provider is missing.');
  return { ...context, copy: demoMessages[context.locale] };
}
