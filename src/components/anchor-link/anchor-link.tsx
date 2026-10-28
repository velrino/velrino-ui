import type { ComponentProps } from 'react';
import { cx } from '../../lib/classes.js';

export type AnchorLinkProps = Omit<ComponentProps<'a'>, 'href'> & { href: `#${string}` };
/** Native fragment navigation preserves the current pathname and query. */
export function AnchorLink({ className, ...props }: AnchorLinkProps) {
  return <a data-slot="anchor-link" className={cx('vui-anchor-link', className)} {...props} />;
}
