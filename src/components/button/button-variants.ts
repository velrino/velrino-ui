import { cva } from 'class-variance-authority';

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
