import { Button } from '../../../src/index.js';
import { useDemoLocale } from '../i18n.js';

const links = [
  { key: 'github', href: 'https://github.com/velrino/' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/velrino/' },
  { key: 'source', href: 'https://github.com/velrino/velrino-ui/' },
  {
    key: 'map',
    href: new URL('../../../docs/assets/diagrams/design-system-map.png', import.meta.url).href,
  },
] as const;

export function AboutPanel() {
  const { copy } = useDemoLocale();
  const text = copy.about;
  return (
    <div className="demo-about">
      <p className="demo-about-credit">{text.credit}</p>
      <h3>{text.name}</h3>
      <p className="demo-about-role">{text.role}</p>
      <p>{text.intro}</p>
      <p>{text.story}</p>
      <div className="demo-about-links">
        {links.map(({ key, href }) => (
          <Button key={key} asChild variant={key === 'source' ? 'default' : 'outline'}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="demo-about-link">
              <span>
                <strong>{text.links[key].title}</strong>
                <small>{text.links[key].description}</small>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
