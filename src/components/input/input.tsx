'use client';

import type { ComponentProps } from 'react';
import { cx } from '../../lib/classes.js';

export type InputProps = ComponentProps<'input'>;
export function Input({ className, ...props }: InputProps) {
  return <input data-slot="input" className={cx('vui-input', className)} {...props} />;
}
