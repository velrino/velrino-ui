import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from '../button/index.js';
import { Input } from '../input/index.js';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './index.js';

afterEach(cleanup);

test('dialog traps keyboard focus, closes with Escape and restores the trigger', async () => {
  const user = userEvent.setup();
  render(
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open settings</Button>
      </DialogTrigger>
      <DialogContent closeLabel="Fechar">
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Update your preferences.</DialogDescription>
        <Input aria-label="Display name" />
        <Button>Save</Button>
      </DialogContent>
    </Dialog>,
  );
  const trigger = screen.getByRole('button', { name: 'Open settings' });
  await user.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Settings' });
  const input = screen.getByRole('textbox', { name: 'Display name' });
  await waitFor(() => assert.equal(document.activeElement, input));
  assert.equal(
    dialog.querySelector('[data-slot="dialog-frame"]')?.getAttribute('aria-hidden'),
    'true',
  );
  await user.tab({ shift: true });
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Fechar' }));
  await user.tab();
  assert.equal(document.activeElement, input);
  await user.keyboard('{Escape}');
  await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
  assert.equal(document.activeElement, trigger);
});

test('dialog supports an explicit portal container and localized close control', async () => {
  const user = userEvent.setup();
  const container = document.createElement('div');
  document.body.append(container);
  const view = render(
    <Dialog defaultOpen>
      <DialogContent portalContainer={container} closeLabel="Close preview">
        <DialogTitle>Scoped theme</DialogTitle>
        <DialogDescription>Theme variables come from this container.</DialogDescription>
      </DialogContent>
    </Dialog>,
  );
  assert.ok(container.querySelector('[role="dialog"]'));
  await user.click(screen.getByRole('button', { name: 'Close preview' }));
  await waitFor(() => assert.equal(container.querySelector('[role="dialog"]'), null));
  view.unmount();
  container.remove();
});
