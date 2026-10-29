import { createContext, useContext } from 'react';

export type Locale = 'en' | 'pt-BR';

const en = {
  standard: 'Standard',
  scifi: 'Sci-fi',
  settings: {
    trigger: 'Open settings',
    title: 'Settings',
    descriptions: {
      'go-to': 'Find a component and see it in action.',
      settings: 'Choose the language and look that work for you.',
      about: 'Meet the maker behind Velrino UI.',
    },
    goTo: 'Go to',
    preferences: 'Settings',
    about: 'About',
  },
  preferences: {
    language: 'Language',
    surfaces: 'Surfaces',
    surfacesHint: 'Switch between standard and sci-fi surfaces.',
    theme: 'Theme',
    themeHint: 'Choose a palette. The whole catalog follows.',
    themes: { cyan: 'Cyan', purple: 'Purple', red: 'Red' },
  },
  language: {
    trigger: 'Change language',
    title: 'Choose your language',
    description: 'Explore the catalog in the language you prefer.',
    close: 'Close',
    selected: 'Current',
    available: 'Select',
    regions: { en: 'United States', 'pt-BR': 'Brazil' },
  },
  about: {
    credit: 'Made by Velrino',
    name: 'Denis Velrino',
    role: 'Founding AI & full-stack engineer',
    intro: 'I build AI agents, software products and interactive experiences.',
    story:
      'Velrino UI grew from the components I use in my own projects. I share them so you can focus on what makes your project different.',
    links: {
      github: { title: 'GitHub', description: 'Explore my projects and contributions' },
      linkedin: { title: 'LinkedIn', description: 'Get to know my work and connect' },
      source: {
        title: 'Velrino UI',
        description: 'Explore the source and help shape what comes next',
      },
      map: {
        title: 'Library map',
        description: 'See how the components, documentation and releases connect',
      },
    },
  },
};

const ptBR: typeof en = {
  standard: 'Padrão',
  scifi: 'Sci-fi',
  settings: {
    trigger: 'Abrir configurações',
    title: 'Configurações',
    descriptions: {
      'go-to': 'Encontre um componente e veja como ele funciona.',
      settings: 'Escolha o idioma e o visual que combinam com você.',
      about: 'Conheça quem está por trás da Velrino UI.',
    },
    goTo: 'Ir para',
    preferences: 'Ajustes',
    about: 'Sobre',
  },
  preferences: {
    language: 'Idioma',
    surfaces: 'Aparência',
    surfacesHint: 'Alterne entre superfícies padrão e molduras sci-fi.',
    theme: 'Tema',
    themeHint: 'Escolha uma paleta. O catálogo inteiro acompanha.',
    themes: { cyan: 'Ciano', purple: 'Roxo', red: 'Vermelho' },
  },
  language: {
    trigger: 'Mudar idioma',
    title: 'Escolha seu idioma',
    description: 'Explore o catálogo no idioma que você prefere.',
    close: 'Fechar',
    selected: 'Em uso',
    available: 'Selecionar',
    regions: { en: 'Estados Unidos', 'pt-BR': 'Brasil' },
  },
  about: {
    credit: 'Feito por Velrino',
    name: 'Denis Velrino',
    role: 'Engenheiro fundador de IA e full-stack',
    intro: 'Crio agentes de IA, produtos digitais e experiências interativas.',
    story:
      'A Velrino UI nasceu dos componentes que uso nos meus projetos. Compartilho esse trabalho para você focar no que torna o seu diferente.',
    links: {
      github: { title: 'GitHub', description: 'Explore meus projetos e contribuições' },
      linkedin: { title: 'LinkedIn', description: 'Conheça meu trabalho e vamos nos conectar' },
      source: {
        title: 'Velrino UI',
        description: 'Explore o código e ajude a construir os próximos passos',
      },
      map: {
        title: 'Mapa da biblioteca',
        description: 'Veja como os componentes, a documentação e as versões se conectam',
      },
    },
  },
};

export const demoMessages = { en, 'pt-BR': ptBR };
export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function useDemoLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('The demo locale provider is missing.');
  return { ...context, copy: demoMessages[context.locale] };
}
