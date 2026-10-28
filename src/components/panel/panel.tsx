'use client';

import type { HTMLAttributes } from 'react';
import { cx } from '../../lib/classes.js';
import { useSurfaceAppearance, type SurfaceAppearance } from '../../provider/ui-provider.js';

export type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article' | 'aside';
  appearance?: SurfaceAppearance;
};

/** Decorations never clip content, focus rings or interactive descendants. */
export function Panel({ as: Element = 'div', appearance, className, ...props }: PanelProps) {
  const resolvedAppearance = useSurfaceAppearance(appearance);
  return (
    <Element
      data-slot="panel"
      data-appearance={resolvedAppearance}
      className={cx('vui-panel', className)}
      {...props}
    />
  );
}
