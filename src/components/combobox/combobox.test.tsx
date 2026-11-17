import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createRef, useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Combobox } from './index.js';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../dialog/index.js';
afterEach(cleanup);
const options = [
  { value: 'api', label: 'API gateway' },
  { value: 'cache', label: 'Cache' },
  { value: 'blocked', label: 'Unavailable', disabled: true },
];
const copy = {
  toggleLabel: 'Show types',
  emptyMessage: 'No types found',
  clearLabel: 'Clear type',
};
function Controlled() {
  const [value, setValue] = useState<string | null>('api');
  return (
    <>
      <label htmlFor="kind">Object type</label>
      <Combobox
        {...copy}
        id="kind"
        value={value}
        onValueChange={setValue}
        options={options}
        name="kind"
      />
      <output>{value ?? 'none'}</output>
    </>
  );
}
test('combobox filters labels, selects with keyboard and serializes the option ID', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <form>
      <Controlled />
    </form>,
  );
  const input = screen.getByRole('combobox', { name: 'Object type' });
  assert.equal((input as HTMLInputElement).value, 'API gateway');
  await user.clear(input);
  await user.type(input, 'cach');
  await screen.findByRole('option', { name: 'Cache' });
  assert.equal(screen.queryByRole('option', { name: 'API gateway' }), null);
  await user.keyboard('{ArrowDown}{Enter}');
  await waitFor(() => assert.equal(screen.getByRole('status').textContent, 'cache'));
  assert.equal(new window.FormData(container.querySelector('form')!).get('kind'), 'cache');
  await user.click(screen.getByRole('button', { name: 'Clear type' }));
  await waitFor(() => assert.equal(screen.getByRole('status').textContent, 'none'));
});
test('combobox exposes empty and disabled states and forwards the input ref', async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLInputElement>();
  render(<Combobox {...copy} options={options} aria-label="Type" ref={ref} defaultValue="cache" />);
  assert.equal(ref.current, screen.getByRole('combobox', { name: 'Type' }));
  await user.clear(ref.current!);
  await user.type(ref.current!, 'unavailable');
  const unavailable = await screen.findByRole('option', { name: 'Unavailable' });
  assert.equal(unavailable.getAttribute('aria-disabled'), 'true');
  await user.clear(ref.current!);
  await user.type(ref.current!, 'unknown');
  await screen.findByText('No types found');
  cleanup();
  render(<Combobox {...copy} options={options} aria-label="Disabled type" disabled />);
  assert.equal(
    (screen.getByRole('combobox', { name: 'Disabled type' }) as HTMLInputElement).disabled,
    true,
  );
});
test('combobox inside a dialog keeps the popup in its focus boundary and consumes the first Escape', async () => {
  const user = userEvent.setup();
  render(
    <Dialog>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Choose a type.</DialogDescription>
        <Combobox {...copy} options={options} aria-label="Type" />
      </DialogContent>
    </Dialog>,
  );
  await user.click(screen.getByRole('button', { name: 'Open settings' }));
  const input = screen.getByRole('combobox', { name: 'Type' });
  await user.type(input, 'cache');
  const option = await screen.findByRole('option', { name: 'Cache' });
  assert.ok(screen.getByRole('dialog').contains(option));
  await user.keyboard('{Escape}');
  assert.ok(screen.getByRole('dialog'));
  await waitFor(() => assert.equal(screen.queryByRole('listbox'), null));
  assert.equal(document.activeElement, input);
  await user.keyboard('{Escape}');
  await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
});

test('custom option content preserves plain-label search and keyboard selection', async () => {
  const user = userEvent.setup();
  const { container } = render(
    <form>
      <Combobox
        {...copy}
        options={options}
        name="visual"
        aria-label="Visual type"
        renderOption={(option) => (
          <>
            <svg aria-hidden="true" data-testid="preview" />
            <span>{option.label}</span>
            <small aria-hidden="true">Decorative preview</small>
          </>
        )}
      />
    </form>,
  );
  const input = screen.getByRole('combobox', { name: 'Visual type' });
  await user.type(input, 'cach');
  const item = await screen.findByRole('option', { name: 'Cache' });
  assert.ok(item.querySelector('svg'));
  assert.equal(screen.queryByRole('option', { name: 'API gateway' }), null);
  await user.keyboard('{ArrowDown}{Enter}');
  await waitFor(() => assert.equal((input as HTMLInputElement).value, 'Cache'));
  assert.equal(new window.FormData(container.querySelector('form')!).get('visual'), 'cache');
});
