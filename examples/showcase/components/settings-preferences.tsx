import { Button, type SurfaceAppearance } from '../../../src/index.js';
import { useDemoLocale } from '../i18n.js';
import { LanguageOptions } from './language-picker.js';
import { ThemePicker, type DemoTheme } from './theme-picker.js';

export type SettingsPreferencesProps = {
  theme: DemoTheme;
  onThemeChange: (theme: DemoTheme) => void;
  appearance: SurfaceAppearance;
  onAppearanceChange: (appearance: SurfaceAppearance) => void;
};

export function SettingsPreferences({
  theme,
  onThemeChange,
  appearance,
  onAppearanceChange,
}: SettingsPreferencesProps) {
  const { copy } = useDemoLocale();
  return (
    <div className="demo-preferences">
      <fieldset>
        <legend>{copy.preferences.language}</legend>
        <LanguageOptions />
      </fieldset>
      <fieldset>
        <legend>{copy.preferences.surfaces}</legend>
        <p className="demo-preferences-hint">{copy.preferences.surfacesHint}</p>
        <div className="demo-surface-options">
          <Button
            variant="outline"
            aria-pressed={appearance === 'default'}
            onClick={() => onAppearanceChange('default')}
          >
            {copy.standard}
          </Button>
          <Button
            variant="outline"
            aria-pressed={appearance === 'sci-fi'}
            onClick={() => onAppearanceChange('sci-fi')}
          >
            {copy.scifi}
          </Button>
        </div>
      </fieldset>
      <fieldset>
        <legend>{copy.preferences.theme}</legend>
        <p className="demo-preferences-hint">{copy.preferences.themeHint}</p>
        <ThemePicker value={theme} onChange={onThemeChange} />
      </fieldset>
    </div>
  );
}
