'use client';

import { AdaptersProvider } from './adapters/context/AdaptersProvider.js';
import { useDesignSystemCopy } from './adapters/hooks/useDesignSystemAdapters.js';
import type { DesignSystemAdapters } from './adapters/types/index.js';
import { Showcase } from './features/showcase/Showcase.js';
import { DesignSystemShell } from './ui/layout/DesignSystemShell.js';
import { useShowcaseNavigation } from './hooks/useShowcaseNavigation.js';

function DesignSystemSurface() {
  const copy = useDesignSystemCopy();
  const navigation = useShowcaseNavigation();
  return (
    <DesignSystemShell copy={copy} {...navigation}>
      <Showcase mode={navigation.mode} activeSection={navigation.activeSection} />
    </DesignSystemShell>
  );
}

export function DesignSystemRoot({ adapters }: { adapters: DesignSystemAdapters }) {
  return (
    <AdaptersProvider adapters={adapters}>
      <DesignSystemSurface />
    </AdaptersProvider>
  );
}
