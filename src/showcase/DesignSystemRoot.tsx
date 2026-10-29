'use client';
import type { ReactNode } from 'react';

import { AdaptersProvider } from './adapters/context/AdaptersProvider.js';
import { useDesignSystemCopy } from './adapters/hooks/useDesignSystemAdapters.js';
import type { DesignSystemAdapters } from './adapters/types/index.js';
import { Showcase } from './features/showcase/Showcase.js';
import { DesignSystemShell } from './ui/layout/DesignSystemShell.js';
import { useShowcaseNavigation } from './hooks/useShowcaseNavigation.js';

export type DesignSystemRootProps = {
  adapters: DesignSystemAdapters;
  as?: 'main' | 'section' | 'div';
  renderNavigation?: (navigation: DesignSystemNavigation) => ReactNode;
};

export type DesignSystemNavigation = Pick<
  ReturnType<typeof useShowcaseNavigation>,
  'mode' | 'activeSection' | 'changeMode' | 'navigateTo'
>;

function DesignSystemSurface({
  as,
  renderNavigation,
}: Pick<DesignSystemRootProps, 'as' | 'renderNavigation'>) {
  const copy = useDesignSystemCopy();
  const navigation = useShowcaseNavigation();
  return (
    <DesignSystemShell
      as={as}
      copy={copy}
      {...navigation}
      customNavigation={!!renderNavigation}
      navigationSlot={renderNavigation?.(navigation)}
    >
      <Showcase mode={navigation.mode} activeSection={navigation.activeSection} />
    </DesignSystemShell>
  );
}

export function DesignSystemRoot({
  adapters,
  as = 'main',
  renderNavigation,
}: DesignSystemRootProps) {
  return (
    <AdaptersProvider adapters={adapters}>
      <DesignSystemSurface as={as} renderNavigation={renderNavigation} />
    </AdaptersProvider>
  );
}
