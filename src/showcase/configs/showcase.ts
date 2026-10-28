export const sectionOrder = [
  'principles',
  'colors',
  'typography',
  'buttons',
  'inputs',
  'panels',
  'dialogs',
  'tabs',
  'accordion',
  'menus',
  'sheets',
  'sliders',
  'typewriter',
  'loading',
  'brand',
] as const;

export type ShowcaseSectionId = (typeof sectionOrder)[number];
export type ShowcaseMode = 'page' | 'tabs';

export const colorTokens = [
  { key: 'accent', variable: '--vui-accent' },
  { key: 'surface', variable: '--vui-surface' },
  { key: 'background', variable: '--vui-background' },
  { key: 'text', variable: '--vui-text' },
  { key: 'muted', variable: '--vui-muted' },
  { key: 'line', variable: '--vui-line' },
  { key: 'secondary', variable: '--vui-secondary' },
  { key: 'destructive', variable: '--vui-danger' },
] as const;

export const buttonVariants = ['default', 'secondary', 'outline', 'ghost', 'destructive'] as const;
export const buttonSizes = ['xs', 'sm', 'default', 'lg'] as const;
