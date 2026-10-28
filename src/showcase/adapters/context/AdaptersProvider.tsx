'use client';

import type { ReactNode } from 'react';
import type { DesignSystemAdapters } from '../types/index.js';
import { AdaptersContext } from './AdaptersContext.js';

export function AdaptersProvider({
  adapters,
  children,
}: {
  adapters: DesignSystemAdapters;
  children: ReactNode;
}) {
  return <AdaptersContext value={adapters}>{children}</AdaptersContext>;
}
