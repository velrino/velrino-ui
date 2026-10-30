'use client';

import { forwardRef } from 'react';
import { Switch as Primitive } from '@base-ui/react/switch';
import { cx } from '../../lib/classes.js';
import { useSurfaceAppearance } from '../../provider/ui-provider.js';
import type { SwitchProps } from './types.js';

/** A binary setting with native button interaction and a form-compatible input. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, appearance, ...props },
  ref,
) {
  const resolvedAppearance = useSurfaceAppearance(appearance);
  return (
    <Primitive.Root
      {...props}
      ref={ref}
      nativeButton
      render={<button type="button" />}
      data-slot="switch"
      data-appearance={resolvedAppearance}
      className={cx('vui-switch', className)}
    >
      <span className="vui-switch-track" aria-hidden="true">
        <Primitive.Thumb data-slot="switch-thumb" className="vui-switch-thumb" />
      </span>
    </Primitive.Root>
  );
});
