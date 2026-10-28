'use client';

import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';

import { buttonVariants } from './button-variants.js';
export { buttonVariants } from './button-variants.js';

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  type = asChild ? undefined : 'button',
  ...props
}: ButtonProps) {
  const Element = asChild ? Slot : 'button';
  return (
    <Element
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
