'use client';
import { useId, useState } from 'react';
import { Button } from '../../../components/button/index.js';
import { Input } from '../../../components/input/index.js';
import { useDesignSystemCopy } from '../../adapters/hooks/useDesignSystemAdapters.js';
import { sectionOrder, type ShowcaseSectionId } from '../../configs/showcase.js';

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export type SectionSearchProps = {
  activeSection?: ShowcaseSectionId;
  onSelect: (section: ShowcaseSectionId) => void;
};

/** Hosts can embed this index in their own navigation, without a second modal. */
export function SectionSearch({ activeSection, onSelect }: SectionSearchProps) {
  const copy = useDesignSystemCopy();
  const [search, setSearch] = useState('');
  const inputId = useId();
  const text = copy.quickNavigation;
  const sections = sectionOrder.filter((id) =>
    normalize(`${copy.sections[id]} ${id}`).includes(normalize(search)),
  );
  return (
    <div className="vui-showcase-section-search">
      <label htmlFor={inputId} className="vui-sr-only">
        {text.searchLabel}
      </label>
      <Input
        id={inputId}
        type="search"
        value={search}
        autoComplete="off"
        spellCheck={false}
        placeholder={text.placeholder}
        onChange={(event) => setSearch(event.target.value)}
      />
      <ul className="vui-showcase-section-results">
        {sections.map((id) => (
          <li key={id}>
            <Button
              variant="ghost"
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={() => onSelect(id)}
            >
              {copy.sections[id]}
            </Button>
          </li>
        ))}
      </ul>
      {sections.length === 0 && <p role="status">{text.empty}</p>}
    </div>
  );
}
