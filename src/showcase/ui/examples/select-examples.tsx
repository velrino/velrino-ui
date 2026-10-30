'use client';

import { useId, useState } from 'react';
import { Select } from '../../../components/select/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function SelectExamples() {
  const { selects: copy } = useDesignSystemCopy();
  const id = useId();
  const [density, setDensity] = useState('comfortable');
  const options = [
    { value: 'comfortable', label: copy.options.comfortable },
    { value: 'compact', label: copy.options.compact },
    { value: 'unavailable', label: copy.options.unavailable, disabled: true },
  ];

  return (
    <div className="vui-showcase-grid">
      <div className="vui-showcase-field">
        <label htmlFor={`${id}-density`}>{copy.label}</label>
        <Select
          id={`${id}-density`}
          value={density}
          onValueChange={setDensity}
          options={options}
          aria-describedby={`${id}-hint`}
        />
        <p id={`${id}-hint`}>{copy.hint}</p>
      </div>
      <div className="vui-showcase-field">
        <label htmlFor={`${id}-disabled`}>{copy.disabled}</label>
        <Select
          id={`${id}-disabled`}
          value="compact"
          onValueChange={() => {}}
          options={options}
          disabled
        />
      </div>
    </div>
  );
}
