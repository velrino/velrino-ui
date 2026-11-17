import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import type { SurfaceAppearance } from '../../provider/ui-provider.js';

export type SidebarNavigationItem = Readonly<{
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  children?: readonly SidebarNavigationItem[];
}>;

export type SidebarExpansionMode = 'single' | 'multiple' | 'all';

export type SidebarNavigationProps = {
  items: readonly SidebarNavigationItem[];
  label: string;
  mode?: SidebarExpansionMode;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
  currentId?: string;
  onNavigate?: (item: SidebarNavigationItem, event: MouseEvent<HTMLElement>) => void;
  disclosureLabel: (item: SidebarNavigationItem, expanded: boolean) => string;
  renderLink?: (item: SidebarNavigationItem, props: ComponentProps<'a'>) => ReactNode;
  appearance?: SurfaceAppearance;
  className?: string;
};
