import type { SidebarExpansionMode, SidebarNavigationItem } from './types.js';

export type SidebarEntry = {
  item: SidebarNavigationItem;
  ancestors: readonly string[];
  parent: string | null;
  disabled: boolean;
  group: boolean;
  ordinal: number;
};

export function indexSidebar(items: readonly SidebarNavigationItem[]) {
  const index = new Map<string, SidebarEntry>();
  const visit = (
    items: readonly SidebarNavigationItem[],
    ancestors: readonly string[],
    disabled: boolean,
    path: ReadonlySet<SidebarNavigationItem>,
  ) => {
    for (const item of items) {
      if (path.has(item)) throw new Error('SidebarNavigation: cyclic item graph.');
      if (ancestors.length >= 5)
        throw new Error('SidebarNavigation: maximum depth is five levels.');
      if (!item.id || index.has(item.id))
        throw new Error('SidebarNavigation: item IDs must be nonempty and unique.');
      const entry: SidebarEntry = {
        item,
        ancestors,
        parent: ancestors.at(-1) ?? null,
        disabled: disabled || !!item.disabled,
        group: !!item.children?.length,
        ordinal: index.size,
      };
      index.set(item.id, entry);
      if (entry.group)
        visit(item.children!, [...ancestors, item.id], entry.disabled, new Set([...path, item]));
    }
  };
  visit(items, [], false, new Set());
  return index;
}

export function normalizeExpansion(
  index: ReadonlyMap<string, SidebarEntry>,
  ids: readonly string[],
  mode: SidebarExpansionMode,
) {
  if (mode === 'all') return [...index].filter(([, entry]) => entry.group).map(([id]) => id);
  const result = new Set<string>();
  for (const id of ids) {
    const entry = index.get(id);
    if (!entry?.group || entry.disabled) continue;
    for (const candidate of [...entry.ancestors, id]) {
      const group = index.get(candidate)!;
      if (mode === 'single') {
        for (const existing of result) {
          const other = index.get(existing)!;
          if (other.parent === group.parent && existing !== candidate) {
            result.delete(existing);
            for (const child of result)
              if (index.get(child)!.ancestors.includes(existing)) result.delete(child);
          }
        }
      }
      result.add(candidate);
    }
  }
  return [...result];
}
