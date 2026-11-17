import type { ComponentProps, ReactNode } from 'react';
export type ComboboxOption = Readonly<{ value: string; label: string; disabled?: boolean }>;
export type ComboboxProps = Omit<
  ComponentProps<'input'>,
  'value' | 'defaultValue' | 'onChange' | 'children'
> & {
  options: readonly ComboboxOption[];
  /** Visual option content; label remains the filtering and accessible-name source. */
  renderOption?: (option: ComboboxOption) => ReactNode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  toggleLabel: string;
  emptyMessage: string;
  /** Providing a localized label enables the clear button. */
  clearLabel?: string;
};
