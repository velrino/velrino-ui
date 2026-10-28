'use client';
import { Input } from '../../../components/input/index.js';
import { useInputExample } from '../../hooks/useInputExample.js';

export function InputExamples() {
  const { copy, value, invalid, onValueChange } = useInputExample();
  return (
    <div className="vui-showcase-grid">
      <div className="vui-showcase-field">
        <label htmlFor="vui-example-input">{copy.normalLabel}</label>
        <Input
          id="vui-example-input"
          placeholder={copy.placeholder}
          aria-describedby="vui-example-input-hint"
        />
        <p id="vui-example-input-hint">{copy.normalHint}</p>
      </div>
      <div className="vui-showcase-field">
        <label htmlFor="vui-example-validation">{copy.errorLabel}</label>
        <Input
          id="vui-example-validation"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          minLength={3}
          aria-invalid={invalid}
          aria-describedby="vui-example-validation-hint"
        />
        <p id="vui-example-validation-hint" role="status" data-invalid={invalid}>
          {invalid ? copy.errorHint : copy.validHint}
        </p>
      </div>
      <div className="vui-showcase-field">
        <label htmlFor="vui-example-disabled">{copy.disabledLabel}</label>
        <Input id="vui-example-disabled" value={copy.disabledValue} disabled />
      </div>
    </div>
  );
}
