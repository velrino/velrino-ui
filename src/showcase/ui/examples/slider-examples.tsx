'use client';
import { useState } from 'react';
import { Slider } from '../../../components/slider/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';

export function SliderExamples() {
  const { sliders: copy } = useDesignSystemCopy();
  const [value, setValue] = useState<number | readonly number[]>(50);
  const [range, setRange] = useState<number | readonly number[]>([20, 80]);
  return (
    <div className="vui-showcase-grid">
      <div className="vui-showcase-field">
        <p>
          {copy.label}: <output>{value}%</output>
        </p>
        <Slider
          value={value}
          onValueChange={setValue}
          getAriaLabel={() => copy.label}
          getAriaValueText={(next) => `${next}%`}
        />
      </div>
      <div className="vui-showcase-field">
        <p>
          {copy.range}: <output>{typeof range === 'number' ? range : range.join(' – ')}</output>
        </p>
        <Slider
          value={range}
          onValueChange={setRange}
          getAriaLabel={(index) => (index === 0 ? copy.lower : copy.upper)}
        />
      </div>
      <div className="vui-showcase-field">
        <p>{copy.disabled}</p>
        <Slider defaultValue={40} disabled getAriaLabel={() => copy.disabled} />
      </div>
    </div>
  );
}
