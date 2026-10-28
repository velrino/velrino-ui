import type { ReactNode } from 'react';
import { HudPanel } from '../../../components/hud-panel/index.js';
import { TabsContent } from '../../../components/tabs/index.js';
import type { ShowcaseSectionId } from '../../configs/showcase.js';

export function DesignSection({
  id,
  title,
  description,
  children,
  tabbed,
  active,
}: {
  id: ShowcaseSectionId;
  title: string;
  description: string;
  children: ReactNode;
  tabbed: boolean;
  active: boolean;
}) {
  return (
    <TabsContent
      value={id}
      id={`design-panel-${id}`}
      forceMount
      hidden={tabbed && !active}
      role={tabbed ? 'tabpanel' : undefined}
      aria-labelledby={tabbed ? `design-tab-${id}` : `${id}-title`}
      tabIndex={tabbed ? 0 : -1}
      className="vui-showcase-section-panel"
    >
      <section
        id={id}
        tabIndex={-1}
        aria-labelledby={`${id}-title`}
        className="vui-showcase-section"
      >
        <h2 id={`${id}-title`} className="vui-showcase-section-title">
          {title}
        </h2>
        <p className="vui-showcase-description">{description}</p>
        <HudPanel as="div" className="vui-showcase-example">
          {children}
        </HudPanel>
      </section>
    </TabsContent>
  );
}
