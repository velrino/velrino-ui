'use client';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';
import { colorTokens } from '../../configs/showcase.js';
import { useResolvedColors } from '../../hooks/useResolvedColors.js';

export function ColorExamples() {
  const copy = useDesignSystemCopy();
  const { container, values } = useResolvedColors();
  return (
    <div ref={container} className="vui-showcase-swatches">
      {colorTokens.map((token) => (
        <div key={token.variable} className="vui-showcase-color">
          <div
            aria-hidden="true"
            data-color-variable={token.variable}
            className="vui-showcase-swatch"
            style={{ backgroundColor: `var(${token.variable})` }}
          />
          <div className="vui-showcase-color-info">
            <h3>{copy.colors[token.key]}</h3>
            <div className="vui-showcase-color-details">
              <code>{token.variable}</code>
              <code className="vui-showcase-color-value">{values[token.variable] ?? '—'}</code>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
