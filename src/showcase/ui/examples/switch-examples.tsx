'use client';

import { useId, useState } from 'react';
import { Switch } from '../../../components/switch/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function SwitchExamples() {
  const {
    inputs: { switches: copy },
  } = useDesignSystemCopy();
  const id = useId();
  const [checked, setChecked] = useState(false);
  return (
    <div className="vui-showcase-stack">
      <div>
        <h3>{copy.title}</h3>
        <p>{copy.hint}</p>
      </div>
      <div className="vui-showcase-grid">
        <div className="vui-showcase-field">
          <div className="vui-showcase-switch-row">
            <label htmlFor={`${id}-notifications`}>{copy.label}</label>
            <Switch id={`${id}-notifications`} checked={checked} onCheckedChange={setChecked} />
          </div>
          <p>{checked ? copy.on : copy.off}</p>
        </div>
        <div className="vui-showcase-field">
          <div className="vui-showcase-switch-row">
            <label htmlFor={`${id}-disabled`}>{copy.disabled}</label>
            <Switch id={`${id}-disabled`} defaultChecked disabled />
          </div>
          <p>{copy.disabledHint}</p>
        </div>
      </div>
    </div>
  );
}
