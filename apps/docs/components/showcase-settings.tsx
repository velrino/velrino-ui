import { useRef, useState } from 'react';
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
} from '../../../src/index.js';
import {
  SectionSearch,
  type DesignSystemNavigation,
  type ShowcaseSectionId,
} from '../../../src/showcase/index.js';
import { useDemoLocale } from '../i18n.js';
import { SettingsPreferences, type SettingsPreferencesProps } from './settings-preferences.js';
import { AboutPanel } from './about-panel.js';
export type { DemoTheme } from './theme-picker.js';

type MenuTab = 'go-to' | 'settings' | 'about';

export function ShowcaseSettings({
  navigation,
  ...preferences
}: SettingsPreferencesProps & { navigation: DesignSystemNavigation }) {
  const { copy } = useDemoLocale();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<MenuTab>('go-to');
  const pending = useRef<ShowcaseSectionId | null>(null);
  const text = copy.settings;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setTab('go-to');
      }}
    >
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
      <DialogContent
        className="demo-settings-dialog"
        closeLabel={copy.language.close}
        onCloseAutoFocus={(event) => {
          if (pending.current) {
            event.preventDefault();
            const section = pending.current;
            pending.current = null;
            navigation.navigateTo(section);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.descriptions[tab]}</DialogDescription>
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (value === 'go-to' || value === 'settings' || value === 'about') setTab(value);
          }}
          className="demo-settings-tabs"
        >
          <TabsList aria-label={text.title}>
            <TabsTrigger value="go-to">{text.goTo}</TabsTrigger>
            <TabsTrigger value="settings">{text.preferences}</TabsTrigger>
            <TabsTrigger value="about">{text.about}</TabsTrigger>
          </TabsList>
          <TabsContent value="go-to" className="demo-settings-index">
            <SectionSearch
              activeSection={navigation.activeSection}
              onSelect={(section) => {
                pending.current = section;
                setOpen(false);
              }}
            />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsPreferences {...preferences} />
          </TabsContent>
          <TabsContent value="about">
            <AboutPanel />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
