import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createRef, useState } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from '../button/index.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../dialog/index.js';
import { Input } from '../input/index.js';
import { Select, type SelectOption } from './index.js';

afterEach(cleanup);

const options: readonly SelectOption[] = [
  { value: '', label: 'Automatic' },
  { value: 'blocked', label: 'Unavailable choice', disabled: true },
  { value: 'planet', label: 'Planet' },
  { value: 'galaxy', label: 'Galaxy' },
];

async function expectFocusedOption(name: string) {
  const option = await screen.findByRole('option', { name });
  await waitFor(() =>
    assert.ok(document.activeElement === option, `Focus should reach option ${name}`),
  );
}

function ControlledSelect({ changes, initial = '' }: { changes: string[]; initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <label htmlFor="object-kind">Object type</label>
      <Select
        id="object-kind"
        value={value}
        options={options}
        placeholder="Choose a type"
        onValueChange={(next) => {
          changes.push(next);
          setValue(next);
        }}
      />
    </>
  );
}

test('select exposes a labeled trigger and forwarded attributes/ref without changing its controlled value on mount', () => {
  const changes: string[] = [];
  const ref = createRef<HTMLButtonElement>();
  render(
    <>
      <label htmlFor="object-kind">Object type</label>
      <p id="select-help">Choose where the object belongs.</p>
      <Select
        ref={ref}
        id="object-kind"
        value=""
        options={options}
        placeholder="Choose a type"
        aria-describedby="select-help"
        aria-invalid
        onValueChange={(value) => changes.push(value)}
      />
    </>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Object type' });
  assert.equal(ref.current, trigger);
  assert.equal(trigger.textContent, 'Automatic');
  assert.equal(trigger.getAttribute('aria-describedby'), 'select-help');
  assert.equal(trigger.getAttribute('aria-invalid'), 'true');
  assert.equal(trigger.getAttribute('type'), 'button');
  assert.deepEqual(changes, []);
});

test('keyboard navigation cannot commit a disabled option and returns focus after an enabled choice', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  render(<ControlledSelect changes={changes} />);
  const trigger = screen.getByRole('combobox', { name: 'Object type' });
  await user.tab();
  assert.equal(document.activeElement, trigger);
  await user.keyboard('{ArrowDown}');
  await screen.findByRole('listbox');
  await expectFocusedOption('Automatic');
  await user.keyboard('{Home}');
  await expectFocusedOption('Automatic');
  await user.keyboard('{ArrowDown}');
  await expectFocusedOption('Unavailable choice');
  await user.keyboard('{Enter}');
  assert.deepEqual(changes, []);
  assert.equal(document.activeElement?.getAttribute('aria-disabled'), 'true');
  await user.keyboard('{ArrowDown}');
  await expectFocusedOption('Planet');
  await user.keyboard('{Enter}');
  await waitFor(() => assert.deepEqual(changes, ['planet']));
  assert.equal(trigger.textContent, 'Planet');
  await waitFor(() => assert.equal(screen.queryByRole('listbox'), null));
  assert.equal(document.activeElement, trigger);
});

test('an empty-string option is selectable and keeps its label instead of becoming a placeholder', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  render(<ControlledSelect changes={changes} initial="planet" />);
  const trigger = screen.getByRole('combobox', { name: 'Object type' });
  await user.click(trigger);
  await user.click(await screen.findByRole('option', { name: 'Automatic' }));
  await waitFor(() => assert.deepEqual(changes, ['']));
  assert.equal(trigger.textContent, 'Automatic');
  assert.equal(trigger.hasAttribute('data-unselected'), false);
  await user.click(trigger);
  assert.equal(
    (await screen.findByRole('option', { name: 'Automatic' })).getAttribute('aria-selected'),
    'true',
  );
});

test('disabled controls and options do not emit changes, while external value updates stay callback-free', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  const onValueChange = (value: string) => changes.push(value);
  const view = render(
    <Select
      aria-label="Object type"
      value="planet"
      options={options}
      disabled
      onValueChange={onValueChange}
    />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Object type' });
  await user.click(trigger);
  assert.equal(screen.queryByRole('listbox'), null);
  assert.deepEqual(changes, []);
  view.rerender(
    <Select aria-label="Object type" value="" options={options} onValueChange={onValueChange} />,
  );
  assert.equal(trigger.textContent, 'Automatic');
  assert.deepEqual(changes, []);
  await user.click(trigger);
  const disabled = await screen.findByRole('option', { name: 'Unavailable choice' });
  assert.equal(disabled.getAttribute('aria-disabled'), 'true');
  await user.click(disabled);
  assert.deepEqual(changes, []);
});

test('disabling an already open select blocks pointer and keyboard value changes', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  const onValueChange = (value: string) => changes.push(value);
  const view = render(
    <Select aria-label="Object type" value="" options={options} onValueChange={onValueChange} />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Object type' });
  await user.click(trigger);
  await screen.findByRole('option', { name: 'Planet' });
  view.rerender(
    <Select
      aria-label="Object type"
      value=""
      options={options}
      onValueChange={onValueChange}
      disabled
    />,
  );
  assert.equal(trigger.hasAttribute('disabled'), true);
  const option = screen.queryByRole('option', { name: 'Planet' });
  // Closing immediately or leaving an inert list visible are both safe outcomes.
  if (option) {
    assert.equal(option.getAttribute('aria-disabled'), 'true');
    await user.click(option);
    await user.keyboard('{Home}{ArrowDown}{ArrowDown}{Enter}');
  }
  assert.deepEqual(changes, []);
  assert.equal(trigger.textContent, 'Automatic');
});

test('a select popup stays within the dialog focus boundary and Escape closes only the popup first', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  render(
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open editor</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit object</DialogTitle>
        <DialogDescription>Choose an object type.</DialogDescription>
        <ControlledSelect changes={changes} />
        <Input aria-label="Object name" />
      </DialogContent>
    </Dialog>,
  );
  const opener = screen.getByRole('button', { name: 'Open editor' });
  await user.click(opener);
  const dialog = screen.getByRole('dialog', { name: 'Edit object' });
  const trigger = screen.getByRole('combobox', { name: 'Object type' });
  await waitFor(() =>
    assert.ok(document.activeElement === trigger, 'Dialog should first focus the select trigger'),
  );
  await user.click(trigger);
  const list = await screen.findByRole('listbox');
  assert.equal(list.closest('[role="dialog"]'), dialog);
  await expectFocusedOption('Automatic');
  await user.keyboard('{Home}');
  await expectFocusedOption('Automatic');
  await user.keyboard('{ArrowDown}');
  await expectFocusedOption('Unavailable choice');
  await user.keyboard('{ArrowDown}');
  await expectFocusedOption('Planet');
  await user.keyboard('{Enter}');
  await waitFor(() => assert.deepEqual(changes, ['planet']));
  assert.equal(screen.getByRole('dialog'), dialog);
  await user.click(trigger);
  await screen.findByRole('listbox');
  await user.click(screen.getByRole('textbox', { name: 'Object name' }));
  await waitFor(() => assert.equal(screen.queryByRole('listbox'), null));
  assert.equal(screen.getByRole('dialog'), dialog);
  assert.equal(document.activeElement, screen.getByRole('textbox', { name: 'Object name' }));
  assert.deepEqual(changes, ['planet']);
  await user.click(trigger);
  await screen.findByRole('listbox');
  await user.keyboard('{Escape}');
  await waitFor(() => assert.equal(screen.queryByRole('listbox'), null));
  assert.equal(screen.getByRole('dialog'), dialog);
  assert.equal(document.activeElement, trigger);
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole('textbox', { name: 'Object name' }));
  await user.keyboard('{Escape}');
  await waitFor(() => assert.equal(screen.queryByRole('dialog'), null));
  assert.equal(document.activeElement, opener);
});
