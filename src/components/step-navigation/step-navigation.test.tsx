import '../../test/setup-dom.js';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { StepNavigation, type NavigationStep } from './index.js';

afterEach(cleanup);

const steps: readonly NavigationStep[] = [
  { id: 'type', label: 'Type', complete: true },
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Location', shortLabel: 'Place' },
  { id: 'review', label: 'Review' },
];

test('steps are controlled and freely selectable without changing the current step locally', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  const onStepChange = (id: string) => changes.push(id);
  const view = render(
    <StepNavigation
      steps={steps}
      current="type"
      onStepChange={onStepChange}
      label="Creation steps"
    />,
  );
  const first = screen.getByRole('button', { name: 'Type' });
  const review = screen.getByRole('button', { name: 'Review' });
  assert.equal(first.getAttribute('aria-current'), 'step');
  await user.click(review);
  assert.deepEqual(changes, ['review']);
  assert.equal(first.getAttribute('aria-current'), 'step');
  assert.equal(review.getAttribute('aria-current'), null);
  await user.click(first);
  assert.deepEqual(changes, ['review'], 'selecting the current step is not another navigation');

  view.rerender(
    <StepNavigation
      steps={steps}
      current="review"
      onStepChange={onStepChange}
      label="Creation steps"
    />,
  );
  assert.equal(review.getAttribute('aria-current'), 'step');
  assert.equal(first.getAttribute('aria-current'), null);
  await user.click(first);
  assert.deepEqual(changes, ['review', 'type']);
});

test('native keyboard navigation focuses and activates step buttons', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  render(
    <StepNavigation
      steps={steps}
      current="type"
      onStepChange={(id) => changes.push(id)}
      label="Creation steps"
    />,
  );
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Type' }));
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Details' }));
  await user.keyboard('{Enter}');
  await user.keyboard(' ');
  assert.deepEqual(changes, ['details', 'details']);
});

test('disabled steps cannot activate and are skipped by native tab navigation', async () => {
  const user = userEvent.setup();
  const changes: string[] = [];
  render(
    <>
      <StepNavigation
        steps={steps}
        current="type"
        onStepChange={(id) => changes.push(id)}
        label="Creation steps"
        disabled
      />
      <button type="button">Next control</button>
    </>,
  );
  await user.click(screen.getByRole('button', { name: 'Review' }));
  assert.deepEqual(changes, []);
  for (const step of steps) {
    const button = screen.getByRole('button', { name: step.label }) as HTMLButtonElement;
    assert.equal(button.disabled, true);
  }
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole('button', { name: 'Next control' }));
});

test('localized full labels remain accessible with decorative short labels and completion marks', () => {
  render(
    <StepNavigation
      steps={[
        { id: 'details', label: 'Detalhes', complete: true },
        { id: 'location', label: 'Localização', shortLabel: 'Local' },
      ]}
      current="location"
      onStepChange={() => {}}
      label="Etapas de criação"
    />,
  );
  assert.ok(screen.getByRole('navigation', { name: 'Etapas de criação' }));
  const location = screen.getByRole('button', { name: 'Localização' });
  assert.equal(location.getAttribute('aria-current'), 'step');
  assert.equal(screen.queryByRole('button', { name: 'Local' }), null);
  assert.equal(screen.getByText('Local').getAttribute('aria-hidden'), 'true');
  const check = screen.getByRole('button', { name: 'Detalhes' }).querySelector('svg');
  assert.ok(check);
  assert.equal(check.getAttribute('aria-hidden'), 'true');
  assert.equal(check.getAttribute('focusable'), 'false');
});

test('choosing a step inside a form never submits the caller form', async () => {
  const user = userEvent.setup();
  let submissions = 0;
  const changes: string[] = [];
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submissions++;
      }}
    >
      <StepNavigation
        steps={steps}
        current="type"
        onStepChange={(id) => changes.push(id)}
        label="Creation steps"
      />
    </form>,
  );
  await user.click(screen.getByRole('button', { name: 'Review' }));
  assert.deepEqual(changes, ['review']);
  assert.equal(submissions, 0);
});
