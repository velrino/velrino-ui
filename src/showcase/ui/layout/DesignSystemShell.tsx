import type { MouseEvent, ReactNode } from 'react';
import { AnchorLink } from '../../../components/anchor-link/index.js';
import { Button } from '../../../components/button/index.js';
import { Tabs, TabsList, TabsTrigger } from '../../../components/tabs/index.js';
import type { DesignSystemCopy } from '../../messages/index.js';
import { sectionOrder, type ShowcaseMode, type ShowcaseSectionId } from '../../configs/showcase.js';

type Navigation = {
  mode: ShowcaseMode;
  activeSection: ShowcaseSectionId;
  changeMode: (mode: ShowcaseMode) => void;
  changeSection: (section: string) => void;
  onAnchorClick: (event: MouseEvent<HTMLElement>) => void;
  onTabListMount: (element: HTMLDivElement | null) => void;
};

export function DesignSystemShell({
  as: Element = 'main',
  copy,
  mode,
  activeSection,
  changeMode,
  changeSection,
  onAnchorClick,
  onTabListMount,
  children,
}: Navigation & { as?: 'main' | 'section' | 'div'; copy: DesignSystemCopy; children: ReactNode }) {
  const tabbed = mode === 'tabs';
  return (
    <Element className="vui-showcase">
      <header className="vui-showcase-header">
        <p className="vui-showcase-kicker">{copy.eyebrow}</p>
        <h1 className="vui-showcase-title">{copy.title}</h1>
        <p className="vui-showcase-intro">{copy.description}</p>
      </header>
      <Tabs
        value={activeSection}
        onValueChange={changeSection}
        onClickCapture={onAnchorClick}
        className="vui-showcase-sections"
      >
        <div className="vui-showcase-view">
          <p className="vui-showcase-kicker">{copy.viewMode.label}</p>
          <div role="group" aria-label={copy.viewMode.label} className="vui-showcase-row">
            {(['page', 'tabs'] as const).map((value) => (
              <Button
                key={value}
                variant="outline"
                aria-pressed={mode === value}
                onClick={() => changeMode(value)}
              >
                {copy.viewMode[value]}
              </Button>
            ))}
          </div>
        </div>
        <nav aria-label={copy.navigation} hidden={tabbed} className="vui-showcase-anchors">
          {sectionOrder.map((id) => (
            <AnchorLink key={id} href={`#${id}`}>
              {copy.sections[id]}
            </AnchorLink>
          ))}
        </nav>
        <div hidden={!tabbed} className="vui-showcase-tab-strip">
          <TabsList ref={onTabListMount} aria-label={copy.navigation}>
            {sectionOrder.map((id) => (
              <TabsTrigger
                key={id}
                id={`design-tab-${id}`}
                aria-controls={`design-panel-${id}`}
                data-section={id}
                value={id}
              >
                {copy.sections[id]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="vui-showcase-section-list">{children}</div>
      </Tabs>
    </Element>
  );
}
