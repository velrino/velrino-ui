'use client';
import { useId, useState } from 'react';
import { Combobox } from '../../../components/combobox/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';
export function ComboboxExamples() {
  const { combobox: copy } = useDesignSystemCopy();
  const id = useId();
  const [value, setValue] = useState<string | null>('react');
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'disabled', label: copy.disabled, disabled: true },
  ];
  return (
    <div className="vui-showcase-field">
      <label htmlFor={id}>{copy.label}</label>
      <Combobox
        id={id}
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder={copy.placeholder}
        toggleLabel={copy.toggle}
        emptyMessage={copy.empty}
        clearLabel={copy.clear}
      />
      <p>
        {copy.selected}: {options.find((option) => option.value === value)?.label ?? copy.none}
      </p>
    </div>
  );
}
