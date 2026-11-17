'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/classes.js';
import { useSurfaceAppearance } from '../../provider/ui-provider.js';
import { indexSidebar, normalizeExpansion } from './model.js';
import type { SidebarNavigationItem, SidebarNavigationProps } from './types.js';

/** Nested site navigation using ordinary links and independent disclosure buttons. */
export function SidebarNavigation({
  items,
  label,
  mode = 'multiple',
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  currentId,
  onNavigate,
  disclosureLabel,
  renderLink,
  appearance,
  className,
}: SidebarNavigationProps) {
  const id = useId();
  const resolvedAppearance = useSurfaceAppearance(appearance);
  const [internal, setInternal] = useState(defaultExpandedIds);
  const index = indexSidebar(items);
  const expanded = normalizeExpansion(index, expandedIds ?? internal, mode);
  const open = new Set(expanded);
  const nav = useRef<HTMLElement>(null);
  const toggles = useRef(new Map<string, HTMLButtonElement>());
  const focused = useRef<{ element: HTMLElement; ancestors: readonly string[] } | null>(null);

  // Controlled updates can hide the focused descendant without a pointer click.
  useEffect(() => {
    const previous = focused.current;
    if (!previous) return;
    const active = document.activeElement;
    if (active !== previous.element && active !== document.body) return;
    const closed = previous.ancestors.find((ancestor) => !open.has(ancestor));
    if (closed) {
      const trigger = toggles.current.get(closed);
      (trigger && !trigger.disabled ? trigger : nav.current)?.focus({ preventScroll: true });
    } else if (!previous.element.isConnected) {
      nav.current?.focus({ preventScroll: true });
    }
  });

  const toggle = (item: SidebarNavigationItem) => {
    const entry = index.get(item.id)!;
    if (mode === 'all' || entry.disabled) return;
    const next = open.has(item.id)
      ? expanded.filter(
          (value) => value !== item.id && !index.get(value)!.ancestors.includes(item.id),
        )
      : normalizeExpansion(index, [...expanded, item.id], mode);
    if (expandedIds === undefined) setInternal(next);
    onExpandedChange?.(next);
  };
  const chevron = (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
  const content = (item: SidebarNavigationItem) => (
    <>
      {item.icon && (
        <span className="vui-sidebar-navigation__icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="vui-sidebar-navigation__label">{item.label}</span>
      {item.badge != null && <span className="vui-sidebar-navigation__badge">{item.badge}</span>}
    </>
  );
  const list = (entries: readonly SidebarNavigationItem[], parent?: string): ReactNode => (
    <ul
      id={parent ? `${id}-group-${index.get(parent)!.ordinal}` : undefined}
      className="vui-sidebar-navigation__list"
      hidden={parent ? !open.has(parent) : undefined}
    >
      {entries.map((item) => {
        const entry = index.get(item.id)!;
        const isOpen = open.has(item.id);
        const collapsible = entry.group && mode !== 'all';
        const groupId = `${id}-group-${entry.ordinal}`;
        const toggleProps = {
          type: 'button' as const,
          disabled: entry.disabled,
          'aria-expanded': isOpen,
          'aria-controls': groupId,
          'aria-label': disclosureLabel(item, isOpen),
          onClick: () => toggle(item),
          ref: (element: HTMLButtonElement | null) => {
            if (element) toggles.current.set(item.id, element);
            else toggles.current.delete(item.id);
          },
        };
        const current = currentId === item.id ? ('page' as const) : undefined;
        const className = 'vui-sidebar-navigation__destination';
        let destination: ReactNode;
        if (item.href !== undefined) {
          const props = {
            href: entry.disabled ? undefined : item.href,
            className,
            'aria-current': current,
            'aria-disabled': entry.disabled || undefined,
            tabIndex: entry.disabled ? -1 : undefined,
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
              if (entry.disabled) event.preventDefault();
              else onNavigate?.(item, event);
            },
            children: content(item),
          };
          destination = renderLink ? renderLink(item, props) : <a {...props} />;
        } else if (collapsible) {
          destination = (
            <button {...toggleProps} className={className}>
              {content(item)}
              {chevron}
            </button>
          );
        } else if (entry.group) {
          destination = (
            <span className={className} aria-disabled={entry.disabled || undefined}>
              {content(item)}
            </span>
          );
        } else {
          destination = (
            <button
              type="button"
              className={className}
              disabled={entry.disabled}
              aria-current={current}
              onClick={(event) => onNavigate?.(item, event)}
            >
              {content(item)}
            </button>
          );
        }
        return (
          <li
            key={item.id}
            data-vui-sidebar-item={item.id}
            className="vui-sidebar-navigation__item"
          >
            <div className="vui-sidebar-navigation__row" data-current={current ? '' : undefined}>
              {destination}
              {collapsible && item.href !== undefined && (
                <button {...toggleProps} className="vui-sidebar-navigation__toggle">
                  {chevron}
                </button>
              )}
            </div>
            {entry.group && list(item.children!, item.id)}
          </li>
        );
      })}
    </ul>
  );
  return (
    <nav
      ref={nav}
      tabIndex={-1}
      aria-label={label}
      data-slot="sidebar-navigation"
      data-mode={mode}
      data-appearance={resolvedAppearance}
      className={cx('vui-sidebar-navigation vui-panel', className)}
      onFocusCapture={(event) => {
        const target = event.target as HTMLElement;
        const item = target
          .closest('[data-vui-sidebar-item]')
          ?.getAttribute('data-vui-sidebar-item');
        focused.current =
          item && index.has(item)
            ? { element: target, ancestors: index.get(item)!.ancestors }
            : null;
      }}
    >
      {list(items)}
    </nav>
  );
}
