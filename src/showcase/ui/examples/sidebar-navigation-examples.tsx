'use client';

import { useState } from 'react';
import { Button } from '../../../components/button/index.js';
import {
  SidebarNavigation,
  type SidebarExpansionMode,
  type SidebarNavigationItem,
} from '../../../components/sidebar-navigation/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function SidebarNavigationExamples() {
  const { sidebar: copy } = useDesignSystemCopy();
  const [mode, setMode] = useState<SidebarExpansionMode>('multiple');
  const [current, setCurrent] = useState('overview');
  const [expanded, setExpanded] = useState<readonly string[]>([
    'workspace',
    'product',
    'interface',
    'navigation',
  ]);
  const labels = copy.items;
  const folderIcon = (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M2 4h4l2 2h6v7H2Z" />
    </svg>
  );
  const items: readonly SidebarNavigationItem[] = [
    {
      id: 'workspace',
      label: labels.workspace,
      icon: folderIcon,
      badge: '5',
      children: [
        {
          id: 'product',
          label: labels.product,
          children: [
            {
              id: 'interface',
              label: labels.interface,
              children: [
                {
                  id: 'navigation',
                  label: labels.navigation,
                  children: [
                    { id: 'overview', label: labels.overview, href: '#sidebar' },
                    { id: 'patterns', label: labels.patterns, href: '#sidebar' },
                  ],
                },
                { id: 'tokens', label: labels.tokens, href: '#sidebar' },
              ],
            },
            {
              id: 'delivery',
              label: labels.delivery,
              children: [{ id: 'releases', label: labels.releases, href: '#sidebar' }],
            },
          ],
        },
      ],
    },
    {
      id: 'resources',
      label: labels.resources,
      href: '#sidebar',
      icon: folderIcon,
      children: [
        { id: 'guidelines', label: labels.guidelines, href: '#sidebar' },
        { id: 'archive', label: labels.archive, href: '#sidebar', disabled: true },
      ],
    },
  ];
  return (
    <div className="vui-showcase-sidebar-example">
      <div className="vui-showcase-stack">
        <div className="vui-showcase-row" role="group" aria-label={copy.mode}>
          {(['single', 'multiple', 'all'] as const).map((value) => (
            <Button
              key={value}
              variant="outline"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {copy.modes[value]}
            </Button>
          ))}
        </div>
        <p className="vui-showcase-feedback">{copy.hint}</p>
        <p className="vui-showcase-feedback" role="status">
          {copy.selected}: <strong>{labels[current as keyof typeof labels]}</strong>
        </p>
      </div>
      <SidebarNavigation
        label={copy.navigation}
        items={items}
        mode={mode}
        currentId={current}
        expandedIds={expanded}
        onExpandedChange={setExpanded}
        disclosureLabel={(item, isExpanded) =>
          `${isExpanded ? copy.collapse : copy.expand} ${item.label}`
        }
        onNavigate={(item, event) => {
          event.preventDefault();
          setCurrent(item.id);
        }}
      />
    </div>
  );
}
