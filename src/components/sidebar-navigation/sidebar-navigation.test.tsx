import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
  SidebarNavigation,
  type SidebarNavigationItem,
  type SidebarNavigationProps,
} from './index.js';
import { indexSidebar } from './model.js';

afterEach(cleanup);
const items: readonly SidebarNavigationItem[] = [
  {
    id: 'a',
    label: 'Alpha',
    href: '/alpha',
    children: [
      {
        id: 'b',
        label: 'Beta',
        children: [
          {
            id: 'c',
            label: 'Gamma',
            children: [
              {
                id: 'd',
                label: 'Delta',
                children: [{ id: 'leaf', label: 'Overview', href: '/overview' }],
              },
            ],
          },
          {
            id: 'sibling',
            label: 'Sibling',
            children: [{ id: 'other', label: 'Other', href: '/other' }],
          },
        ],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    children: [{ id: 'guide', label: 'Guide', href: '/guide' }],
  },
  {
    id: 'disabled',
    label: 'Disabled',
    href: '/disabled',
    disabled: true,
    children: [{ id: 'hidden', label: 'Restricted', href: '/restricted' }],
  },
];
const props: SidebarNavigationProps = {
  items,
  label: 'Workspace',
  disclosureLabel: (item, open) => `${open ? 'Collapse' : 'Expand'} ${item.label}`,
};

test('single expansion keeps a five-level path and closes sibling subtrees', async () => {
  const user = userEvent.setup();
  render(<SidebarNavigation {...props} mode="single" defaultExpandedIds={['d']} />);
  assert.ok(screen.getByRole('link', { name: 'Overview' }));
  await user.click(screen.getByRole('button', { name: 'Expand Sibling' }));
  assert.equal(screen.queryByRole('link', { name: 'Overview' }), null);
  assert.ok(screen.getByRole('link', { name: 'Other' }));
  await user.click(screen.getByRole('button', { name: 'Expand Resources' }));
  assert.equal(screen.queryByRole('link', { name: 'Other' }), null);
  assert.ok(screen.getByRole('link', { name: 'Guide' }));
  await user.click(screen.getByRole('button', { name: 'Collapse Resources' }));
  assert.equal(screen.queryByRole('link', { name: 'Guide' }), null);
});

test('multiple expansion is independent and disclosure never navigates', async () => {
  const user = userEvent.setup();
  const events: string[] = [];
  render(
    <SidebarNavigation
      {...props}
      defaultExpandedIds={['d']}
      currentId="leaf"
      onNavigate={(item, event) => {
        event.preventDefault();
        events.push(item.id);
      }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Expand Resources' }));
  assert.ok(screen.getByRole('link', { name: 'Overview' }));
  assert.ok(screen.getByRole('link', { name: 'Guide' }));
  assert.deepEqual(events, []);
  await user.click(screen.getByRole('link', { name: 'Alpha' }));
  assert.deepEqual(events, ['a']);
  assert.equal(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current'), 'page');
  await user.click(screen.getByRole('button', { name: 'Collapse Alpha' }));
  await user.click(screen.getByRole('button', { name: 'Expand Alpha' }));
  assert.equal(
    screen.queryByRole('link', { name: 'Overview' }),
    null,
    'collapsed descendants do not reopen automatically',
  );
});

test('controlled state emits canonical ancestors without mutating caller data and restores hidden focus', async () => {
  const user = userEvent.setup();
  const values: (readonly string[])[] = [];
  const expanded = Object.freeze(['d']);
  const view = render(
    <SidebarNavigation
      {...props}
      expandedIds={expanded}
      onExpandedChange={(ids) => values.push(ids)}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Expand Resources' }));
  assert.deepEqual(values, [['a', 'b', 'c', 'd', 'resources']]);
  assert.deepEqual(expanded, ['d']);
  assert.equal(
    screen.queryByRole('link', { name: 'Guide' }),
    null,
    'controlled state awaits the consumer',
  );
  screen.getByRole('link', { name: 'Overview' }).focus();
  view.rerender(<SidebarNavigation {...props} expandedIds={[]} />);
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Expand Alpha' }));
  await user.keyboard('{Enter}');
  assert.equal(screen.queryByRole('button', { name: 'Expand Beta' }), null);
});

test('all mode exposes every branch without toggles and disabled descendants cannot navigate', async () => {
  const user = userEvent.setup();
  const events: string[] = [];
  const view = render(
    <SidebarNavigation {...props} mode="all" onNavigate={(item) => events.push(item.id)} />,
  );
  assert.ok(screen.getByRole('link', { name: 'Overview' }));
  assert.ok(screen.getByRole('link', { name: 'Guide' }));
  assert.equal(screen.queryByRole('button', { name: /Expand|Collapse/ }), null);
  const disabled = screen.getByText('Restricted').closest('a')!;
  assert.equal(disabled.getAttribute('href'), null);
  assert.equal(disabled.tabIndex, -1);
  await user.click(disabled);
  assert.deepEqual(events, []);
  view.rerender(<SidebarNavigation {...props} mode="multiple" />);
  assert.equal(
    screen.queryByRole('link', { name: 'Overview' }),
    null,
    'all mode does not overwrite stored choices',
  );
});

test('native keyboard disclosure and custom links preserve their semantics', async () => {
  const user = userEvent.setup();
  render(
    <SidebarNavigation
      {...props}
      renderLink={(_item, props) => <a {...props} data-router="custom" />}
    />,
  );
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole('link', { name: 'Alpha' }));
  await user.tab();
  await user.keyboard(' ');
  assert.equal(
    screen.getByRole('button', { name: 'Collapse Alpha' }).getAttribute('aria-expanded'),
    'true',
  );
  assert.equal(screen.getByRole('link', { name: 'Alpha' }).getAttribute('data-router'), 'custom');
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Expand Beta' }));
});

test('invalid depth, duplicate IDs and cycles fail explicitly', () => {
  assert.throws(
    () =>
      indexSidebar([
        { id: 'x', label: 'One' },
        { id: 'x', label: 'Two' },
      ]),
    /unique/,
  );
  const cycle: { id: string; label: string; children?: SidebarNavigationItem[] } = {
    id: 'loop',
    label: 'Loop',
  };
  cycle.children = [cycle];
  assert.throws(() => indexSidebar([cycle]), /cyclic/);
  let deep: SidebarNavigationItem = { id: '6', label: 'Six' };
  for (let i = 5; i > 0; i--) deep = { id: String(i), label: String(i), children: [deep] };
  assert.throws(() => indexSidebar([deep]), /five levels/);
});

test('disabling an ancestor moves hidden descendant focus to the navigation fallback', () => {
  const view = render(<SidebarNavigation {...props} defaultExpandedIds={['d']} />);
  screen.getByRole('link', { name: 'Overview' }).focus();
  const disabledItems = items.map((item) => (item.id === 'a' ? { ...item, disabled: true } : item));
  view.rerender(<SidebarNavigation {...props} items={disabledItems} />);
  assert.equal(document.activeElement, screen.getByRole('navigation', { name: 'Workspace' }));
});
