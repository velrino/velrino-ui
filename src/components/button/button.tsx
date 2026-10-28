'use client';

import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('vui-button', {
  variants: {
    variant: {
      default: 'vui-button--default',
      destructive: 'vui-button--destructive',
      outline: 'vui-button--outline',
      secondary: 'vui-button--secondary',
      ghost: 'vui-button--ghost',
      link: 'vui-button--link',
    },
    size: {
      default: 'vui-button--md',
      xs: 'vui-button--xs',
      sm: 'vui-button--sm',
      lg: 'vui-button--lg',
      icon: 'vui-button--icon',
      'icon-xs': 'vui-button--icon-xs',
      'icon-sm': 'vui-button--icon-sm',
      'icon-lg': 'vui-button--icon-lg',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

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
