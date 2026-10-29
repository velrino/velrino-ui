import { useId } from 'react';
import { useDemoLocale } from '../i18n.js';

export const demoThemes = ['cyan', 'purple', 'red'] as const;
export type DemoTheme = (typeof demoThemes)[number];

export function ThemePicker({
  value,
  onChange,
}: {
  value: DemoTheme;
  onChange: (theme: DemoTheme) => void;
}) {
  const name = useId();
  const { copy } = useDemoLocale();
  return (
    <div className="demo-theme-picker">
      {demoThemes.map((theme) => (
        <label key={theme} className="demo-theme-option" data-theme={theme}>
          <input
            className="vui-sr-only"
            type="radio"
            name={name}
            value={theme}
            checked={value === theme}
            onChange={() => onChange(theme)}
          />
          <span className="demo-theme-swatch" aria-hidden="true">
            {value === theme && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            )}
          </span>
          <span>{copy.preferences.themes[theme]}</span>
        </label>
      ))}
    </div>
  );
}
