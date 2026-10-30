'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../../../components/button/index.js';
import { Input } from '../../../components/input/index.js';
import { Select } from '../../../components/select/index.js';
import { StepNavigation } from '../../../components/step-navigation/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

const exampleSteps = ['profile', 'preferences', 'review'] as const;
type ExampleStep = (typeof exampleSteps)[number];

export function StepNavigationExamples() {
  const { steps: copy } = useDesignSystemCopy();
  const id = useId();
  const [current, setCurrent] = useState<ExampleStep>('profile');
  const [visited, setVisited] = useState<readonly ExampleStep[]>([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [completed, setCompleted] = useState(false);
  const previous = useRef(current);
  const heading = useRef<HTMLHeadingElement>(null);
  const index = exampleSteps.indexOf(current);
  const options = Object.entries(copy.options).map(([value, label]) => ({ value, label }));
  useEffect(() => {
    if (previous.current === current) return;
    previous.current = current;
    heading.current?.focus({ preventScroll: true });
  }, [current]);
  const navigate = (step: string) => {
    if (!exampleSteps.includes(step as ExampleStep)) return;
    setVisited((steps) => (steps.includes(current) ? steps : [...steps, current]));
    setCurrent(step as ExampleStep);
    setCompleted(false);
  };

  return (
    <div className="vui-showcase-stack">
      <StepNavigation
        label={copy.navigation}
        current={current}
        onStepChange={navigate}
        steps={exampleSteps.map((step) => ({
          id: step,
          label: copy.labels[step],
          complete: visited.includes(step) && step !== 'review',
        }))}
      />
      <div className="vui-showcase-field" role="group" aria-labelledby={`${id}-heading`}>
        <h3 id={`${id}-heading`} ref={heading} tabIndex={-1}>
          {copy.labels[current]}
        </h3>
        <p>{copy.introductions[current]}</p>
        {current === 'profile' && (
          <>
            <label htmlFor={`${id}-name`}>{copy.name}</label>
            <Input
              id={`${id}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.namePlaceholder}
            />
          </>
        )}
        {current === 'preferences' && (
          <>
            <label htmlFor={`${id}-frequency`}>{copy.preference}</label>
            <Select
              id={`${id}-frequency`}
              value={frequency}
              onValueChange={setFrequency}
              options={options}
            />
          </>
        )}
        {current === 'review' && (
          <>
            <p>
              {copy.name}: <strong>{name.trim() || copy.noName}</strong>
            </p>
            <p>
              {copy.preference}:{' '}
              <strong>{options.find(({ value }) => value === frequency)?.label}</strong>
            </p>
          </>
        )}
      </div>
      <div className="vui-showcase-row">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => navigate(exampleSteps[index - 1])}
        >
          {copy.back}
        </Button>
        <Button
          onClick={() => {
            if (current === 'review') setCompleted(true);
            else navigate(exampleSteps[index + 1]);
          }}
        >
          {current === 'review' ? copy.complete : copy.next}
        </Button>
      </div>
      {completed && (
        <p role="status" className="vui-showcase-feedback">
          {copy.completed}
        </p>
      )}
    </div>
  );
}
