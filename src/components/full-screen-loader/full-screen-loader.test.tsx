import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from '../button/index.js';
import { FullScreenLoader } from './index.js';

afterEach(cleanup);

test('loader clamps progress and keeps indeterminate work without a fabricated percentage', () => {
  const view = render(<FullScreenLoader label="Loading universe" progress={180} />);
  assert.equal(screen.getByRole('progressbar').getAttribute('aria-valuenow'), '100');
  view.rerender(<FullScreenLoader label="Loading universe" progress={-4} />);
  assert.equal(screen.getByRole('progressbar').getAttribute('aria-valuenow'), '0');
  view.rerender(<FullScreenLoader label="Loading universe" progress={Number.NaN} />);
  assert.equal(screen.getByRole('progressbar').hasAttribute('aria-valuenow'), false);
});

test('non-cancellable loading ignores Escape; cancellation restores prior focus', async () => {
  const user = userEvent.setup();
  const blocked = render(<FullScreenLoader label="Required loading" />);
  await user.keyboard('{Escape}');
  assert.ok(screen.getByRole('dialog', { name: 'Required loading' }));
  blocked.unmount();

  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Start preview</Button>
        {open && (
          <FullScreenLoader
            label="Loading preview"
            cancelLabel="Cancel preview"
            onCancel={() => setOpen(false)}
          />
        )}
      </>
    );
  }
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Start preview' });
  await user.click(trigger);
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Cancel preview' }));
  await user.keyboard('{Escape}');
  await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
  assert.equal(document.activeElement, trigger);
});
