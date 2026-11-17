import { Button } from '../../../src/index.js';
import { useDemoLocale } from '../i18n.js';
import type { ColorMode } from '../preferences.js';

export function ColorModeToggle({
  mode,
  onChange,
}: {
  mode: ColorMode;
  onChange: (mode: ColorMode) => void;
}) {
  const { copy } = useDemoLocale();
  const next = mode === 'dark' ? 'light' : 'dark';
  const label = copy.colorMode[next];
  return (
    <Button
      variant="ghost"
      size="icon"
      className="demo-toolbar-action"
      aria-label={label}
      title={label}
      onClick={() => onChange(next)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {mode === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
          </>
        ) : (
          <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
        )}
      </svg>
    </Button>
  );
}
