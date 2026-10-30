import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { UIProvider } from '../../provider/ui-provider.js';
import { Switch } from './index.js';

afterEach(cleanup);

test('a labeled controlled switch forwards its button ref and reports one requested change without changing the value', async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLButtonElement>();
  const changes: boolean[] = [];
  const onCheckedChange = (value: boolean) => changes.push(value);
  const view = render(
    <>
      <label htmlFor="notifications">Notifications</label>
      <p id="switch-help">Choose whether to receive updates.</p>
      <UIProvider appearance="sci-fi">
        <Switch
          ref={ref}
          id="notifications"
          checked={false}
          onCheckedChange={onCheckedChange}
          aria-describedby="switch-help"
        />
      </UIProvider>
    </>,
  );
  const control = screen.getByRole('switch', { name: 'Notifications' });
  assert.equal(ref.current, control);
  assert.equal(control.tagName, 'BUTTON');
  assert.equal(control.getAttribute('type'), 'button');
  assert.equal(control.getAttribute('aria-describedby'), 'switch-help');
  assert.equal(control.getAttribute('data-appearance'), 'sci-fi');
  assert.equal(control.getAttribute('aria-checked'), 'false');
  assert.deepEqual(changes, []);
  await user.click(control);
  assert.deepEqual(changes, [true]);
  assert.equal(control.getAttribute('aria-checked'), 'false');
  view.rerender(
    <UIProvider appearance="sci-fi">
      <Switch
        aria-label="Notifications"
        checked
        appearance="default"
        onCheckedChange={onCheckedChange}
      />
    </UIProvider>,
  );
  assert.equal(screen.getByRole('switch').getAttribute('aria-checked'), 'true');
  assert.equal(screen.getByRole('switch').getAttribute('data-appearance'), 'default');
  assert.deepEqual(changes, [true], 'external state changes must not emit another request');
});

test('an uncontrolled switch responds to its label and Space/Enter without submitting a form', async () => {
  const user = userEvent.setup();
  const changes: boolean[] = [];
  let submitted = 0;
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitted++;
      }}
    >
      <label htmlFor="updates">Updates</label>
      <Switch id="updates" defaultChecked onCheckedChange={(value) => changes.push(value)} />
    </form>,
  );
  const control = screen.getByRole('switch', { name: 'Updates' });
  await user.tab();
  assert.equal(document.activeElement, control);
  await user.keyboard(' ');
  assert.equal(control.getAttribute('aria-checked'), 'false');
  await user.keyboard('{Enter}');
  assert.equal(control.getAttribute('aria-checked'), 'true');
  await user.click(screen.getByText('Updates', { selector: 'label' }));
  assert.equal(control.getAttribute('aria-checked'), 'false');
  assert.deepEqual(changes, [false, true, false]);
  assert.equal(submitted, 0);
});

test('disabled switches skip keyboard focus and read-only switches never emit a change', async () => {
  const user = userEvent.setup();
  const changes: boolean[] = [];
  render(
    <>
      <Switch
        aria-label="Disabled setting"
        defaultChecked
        disabled
        onCheckedChange={(value) => changes.push(value)}
      />
      <Switch
        aria-label="Read-only setting"
        defaultChecked
        readOnly
        onCheckedChange={(value) => changes.push(value)}
      />
    </>,
  );
  const disabled = screen.getByRole('switch', { name: 'Disabled setting' });
  const readOnly = screen.getByRole('switch', { name: 'Read-only setting' });
  assert.equal((disabled as HTMLButtonElement).disabled, true);
  await user.tab();
  assert.equal(document.activeElement, readOnly);
  await user.click(disabled);
  await user.click(readOnly);
  await user.keyboard(' {Enter}');
  assert.deepEqual(changes, []);
  assert.equal(readOnly.getAttribute('aria-readonly'), 'true');
  assert.equal(readOnly.getAttribute('aria-checked'), 'true');
});

test('form values, external form ownership and required validation follow the checked state', async () => {
  const user = userEvent.setup();
  const input = createRef<HTMLInputElement>();
  render(
    <>
      <form id="preferences" aria-label="Preferences" />
      <Switch
        aria-label="Accept updates"
        form="preferences"
        name="updates"
        value="enabled"
        uncheckedValue="disabled"
        required
        inputRef={input}
      />
      <Switch aria-label="Unavailable" form="preferences" name="blocked" defaultChecked disabled />
    </>,
  );
  const form = screen.getByRole('form', { name: 'Preferences' }) as HTMLFormElement;
  const control = screen.getByRole('switch', { name: 'Accept updates' });
  assert.equal(input.current?.checkValidity(), false);
  assert.equal(control.getAttribute('aria-required'), 'true');
  assert.deepEqual([...new window.FormData(form)], [['updates', 'disabled']]);
  await user.click(control);
  assert.equal(input.current?.checkValidity(), true);
  assert.deepEqual([...new window.FormData(form)], [['updates', 'enabled']]);
});

test('unchecked switches omit the form field by default and disabling after activation blocks further changes', async () => {
  const user = userEvent.setup();
  const changes: boolean[] = [];
  const view = render(
    <form aria-label="Preferences">
      <Switch
        aria-label="Updates"
        name="updates"
        onCheckedChange={(value) => changes.push(value)}
      />
    </form>,
  );
  const form = screen.getByRole('form', { name: 'Preferences' }) as HTMLFormElement;
  assert.deepEqual([...new window.FormData(form)], []);
  await user.click(screen.getByRole('switch'));
  assert.deepEqual([...new window.FormData(form)], [['updates', 'on']]);
  view.rerender(
    <form aria-label="Preferences">
      <Switch
        aria-label="Updates"
        name="updates"
        disabled
        onCheckedChange={(value) => changes.push(value)}
      />
    </form>,
  );
  await user.click(screen.getByRole('switch'));
  assert.deepEqual(changes, [true]);
  assert.equal(screen.getByRole('switch').getAttribute('aria-checked'), 'true');
  assert.deepEqual([...new window.FormData(form)], []);
});

test('callers can cancel an uncontrolled change using the primitive event details', async () => {
  const user = userEvent.setup();
  render(
    <Switch
      aria-label="Protected setting"
      onCheckedChange={(_value, details) => details.cancel()}
    />,
  );
  const control = screen.getByRole('switch');
  await user.click(control);
  assert.equal(control.getAttribute('aria-checked'), 'false');
});
