'use client';

import type { CSSProperties } from 'react';
import { Button } from '../button/index.js';
import { cx } from '../../lib/classes.js';

export type NavigationStep = Readonly<{
  id: string;
  label: string;
  shortLabel?: string;
  complete?: boolean;
}>;

export type StepNavigationProps = {
  steps: readonly NavigationStep[];
  current: string;
  onStepChange: (id: string) => void;
  label: string;
  disabled?: boolean;
};

/** Ordinary navigation buttons; the caller owns progression and validation. */
export function StepNavigation({
  steps,
  current,
  onStepChange,
  label,
  disabled = false,
}: StepNavigationProps) {
  const columns = Math.max(1, Math.min(steps.length, 4));

  return (
    <nav
      className="vui-step-navigation"
      aria-label={label}
      style={{ '--vui-step-navigation-columns': columns } as CSSProperties}
    >
      <p className="vui-step-navigation__heading">{label}</p>
      <ol className="vui-step-navigation__list">
        {steps.map((step, index) => (
          <li key={step.id} className="vui-step-navigation__item">
            <Button
              type="button"
              variant="ghost"
              className="vui-step-navigation__button"
              aria-current={step.id === current ? 'step' : undefined}
              aria-label={step.label}
              data-complete={step.complete || undefined}
              disabled={disabled}
              onClick={() => {
                if (step.id !== current) onStepChange(step.id);
              }}
            >
              <span className="vui-step-navigation__marker" aria-hidden="true">
                {step.complete ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m20 6-11 11-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cx(
                  'vui-step-navigation__label',
                  step.shortLabel && 'vui-step-navigation__label--full',
                )}
              >
                {step.label}
              </span>
              {step.shortLabel && (
                <span
                  className="vui-step-navigation__label vui-step-navigation__label--short"
                  aria-hidden="true"
                >
                  {step.shortLabel}
                </span>
              )}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
