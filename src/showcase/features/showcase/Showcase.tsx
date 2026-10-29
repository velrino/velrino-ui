'use client';
import type { ReactNode } from 'react';
import { useDesignSystemAdapters } from '../../adapters/hooks/useDesignSystemAdapters.js';
import { sectionOrder, type ShowcaseMode, type ShowcaseSectionId } from '../../configs/showcase.js';
import { DesignSection } from '../../ui/base/design-section.js';
import { ButtonExamples } from '../../ui/examples/button-examples.js';
import { InputExamples } from '../../ui/examples/input-examples.js';
import { DialogExamples } from '../../ui/examples/dialog-examples.js';
import { LoadingExample } from '../../ui/examples/loading-example.js';
import { PanelExamples } from '../../ui/examples/panel-examples.js';
import { TabsExamples } from '../../ui/examples/tabs-examples.js';
import { AccordionExamples } from '../../ui/examples/accordion-examples.js';
import { MenuExamples } from '../../ui/examples/menu-examples.js';
import { SheetExamples } from '../../ui/examples/sheet-examples.js';
import { SliderExamples } from '../../ui/examples/slider-examples.js';
import { TypewriterExamples } from '../../ui/examples/typewriter-examples.js';
import { ColorExamples } from '../../ui/examples/color-examples.js';

export function Showcase({
  mode,
  activeSection,
}: {
  mode: ShowcaseMode;
  activeSection: ShowcaseSectionId;
}) {
  const {
    localization: { copy },
    components: { BrandLogo },
    brand,
  } = useDesignSystemAdapters();
  const content: Record<ShowcaseSectionId, ReactNode> = {
    principles: (
      <ul className="vui-showcase-principles">
        <li>{copy.principles.interaction}</li>
        <li>{copy.principles.readability}</li>
        <li>{copy.principles.density}</li>
      </ul>
    ),
    colors: <ColorExamples />,
    typography: (
      <div className="vui-showcase-stack">
        <div>
          <h3>{copy.typography.headingLabel}</h3>
          <p className="vui-showcase-heading-sample">{copy.typography.headingSample}</p>
        </div>
        <div>
          <h3>{copy.typography.bodyLabel}</h3>
          <p>{copy.typography.bodySample}</p>
        </div>
        <div className="vui-showcase-grid">
          <div>
            <h3>{copy.typography.kickerLabel}</h3>
            <p className="vui-showcase-kicker">{copy.typography.kickerSample}</p>
          </div>
          <div>
            <h3>{copy.typography.monoLabel}</h3>
            <code>--vui-accent / 0123456789</code>
          </div>
        </div>
      </div>
    ),
    buttons: <ButtonExamples />,
    inputs: <InputExamples />,
    dialogs: <DialogExamples />,
    loading: <LoadingExample />,
    brand: (
      <div className="vui-showcase-brand">
        <BrandLogo alt={copy.brand.wordmark} size={96} />
        <div>
          <h3>{brand.name}</h3>
          <p>{copy.brand.rule}</p>
        </div>
      </div>
    ),
    panels: <PanelExamples />,
    tabs: <TabsExamples />,
    accordion: <AccordionExamples />,
    menus: <MenuExamples />,
    sheets: <SheetExamples />,
    sliders: <SliderExamples />,
    typewriter: <TypewriterExamples />,
  };
  return sectionOrder.map((id) => (
    <DesignSection
      key={id}
      id={id}
      title={copy.sections[id]}
      description={copy[id].description}
      tabbed={mode === 'tabs'}
      active={activeSection === id}
    >
      {content[id]}
    </DesignSection>
  ));
}
