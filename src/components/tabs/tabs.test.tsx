import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './index.js';

afterEach(cleanup);

test('keyboard tab navigation skips disabled choices and associates the visible panel', async () => {
  const user = userEvent.setup();
  render(
    <Tabs defaultValue="one">
      <TabsList aria-label="Sections">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two" disabled>
          Two
        </TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First section</TabsContent>
      <TabsContent value="three">Third section</TabsContent>
    </Tabs>,
  );
  await user.tab();
  await user.keyboard('{ArrowRight}');
  const selected = screen.getByRole('tab', { name: 'Three' });
  assert.equal(document.activeElement, selected);
  assert.equal(selected.getAttribute('aria-selected'), 'true');
  const panel = screen.getByRole('tabpanel');
  assert.equal(panel.textContent, 'Third section');
  assert.equal(panel.getAttribute('aria-labelledby'), selected.id);
});
