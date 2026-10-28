import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type SurfaceAppearance,
} from '../../../src/index.js';
import { useDemoLocale } from '../i18n.js';
import { LanguageOptions } from './language-picker.js';

export const demoThemes = ['cyan', 'purple', 'red'] as const;
export type DemoTheme = (typeof demoThemes)[number];

export function ShowcaseSettings({
  theme,
  onThemeChange,
  appearance,
  onAppearanceChange,
}: {
  theme: DemoTheme;
  onThemeChange: (theme: DemoTheme) => void;
  appearance: SurfaceAppearance;
  onAppearanceChange: (appearance: SurfaceAppearance) => void;
}) {
  const { copy } = useDemoLocale();
  const [open, setOpen] = useState(false);
  const text = copy.settings;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="demo-settings-trigger"
          aria-label={text.trigger}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="demo-settings-dialog" closeLabel={copy.language.close}>
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="theme" className="demo-settings-tabs">
          <TabsList aria-label={text.title}>
            <TabsTrigger value="theme">{text.theme}</TabsTrigger>
            <TabsTrigger value="appearance">{text.appearance}</TabsTrigger>
            <TabsTrigger value="language">{text.language}</TabsTrigger>
          </TabsList>
          <TabsContent value="theme">
            <div className="demo-settings-options">
              {demoThemes.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  aria-pressed={theme === value}
                  onClick={() => onThemeChange(value)}
                >
                  {value[0].toUpperCase() + value.slice(1)}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="appearance">
            <div className="demo-settings-options">
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
          </TabsContent>
          <TabsContent value="language" className="demo-settings-language">
            <LanguageOptions />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
