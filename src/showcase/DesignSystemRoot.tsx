'use client';

import { AdaptersProvider } from './adapters/context/AdaptersProvider.js';
import { useDesignSystemCopy } from './adapters/hooks/useDesignSystemAdapters.js';
import type { DesignSystemAdapters } from './adapters/types/index.js';
import { Showcase } from './features/showcase/Showcase.js';
import { DesignSystemShell } from './ui/layout/DesignSystemShell.js';
import { useShowcaseNavigation } from './hooks/useShowcaseNavigation.js';

export type DesignSystemRootProps = {
  adapters: DesignSystemAdapters;
  as?: 'main' | 'section' | 'div';
};

function DesignSystemSurface({ as }: Pick<DesignSystemRootProps, 'as'>) {
  const copy = useDesignSystemCopy();
  const navigation = useShowcaseNavigation();
  return (
    <DesignSystemShell as={as} copy={copy} {...navigation}>
      <Showcase mode={navigation.mode} activeSection={navigation.activeSection} />
    </DesignSystemShell>
  );
}

export function DesignSystemRoot({ adapters, as = 'main' }: DesignSystemRootProps) {
  return (
    <AdaptersProvider adapters={adapters}>
      <DesignSystemSurface as={as} />
    </AdaptersProvider>
  );
}
