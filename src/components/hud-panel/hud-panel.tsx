import type { HTMLAttributes } from 'react';
import { cx } from '../../lib/classes.js';

export type HudPanelProps = HTMLAttributes<HTMLElement> & { as?: 'section' | 'div' };

/** Decorations never clip content, focus rings or interactive descendants. */
export function HudPanel({ as: Element = 'section', className, ...props }: HudPanelProps) {
  return <Element data-slot="hud-panel" className={cx('vui-panel', className)} {...props} />;
}
