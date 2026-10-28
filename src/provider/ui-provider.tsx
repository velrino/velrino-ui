'use client';
import { createContext, useContext, type ReactNode } from 'react';

export type SurfaceAppearance = 'default' | 'sci-fi';
const AppearanceContext = createContext<SurfaceAppearance>('default');

/** Optional presentation defaults; applications still own colors, fonts and identity. */
export function UIProvider({
  appearance = 'default',
  children,
}: {
  appearance?: SurfaceAppearance;
  children: ReactNode;
}) {
  return <AppearanceContext value={appearance}>{children}</AppearanceContext>;
}
export function useSurfaceAppearance(override?: SurfaceAppearance) {
  const inherited = useContext(AppearanceContext);
  return override ?? inherited;
}
