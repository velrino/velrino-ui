# Application adoption

## Install a fixed GitHub release

Use the package asset, which contains compiled JavaScript, declarations and CSS. A dependency on a local sibling folder will not be available on a clean CI or hosting machine.

```json
{
  "dependencies": {
    "@velrino/ui": "https://github.com/velrino/velrino-ui/releases/download/v0.0.1/velrino-ui-0.0.1.tgz"
  }
}
```

Install with the application's existing package manager and commit its lockfile. Update to a new immutable release explicitly. A public GitHub release asset requires no npm account; a private distribution needs build-time authentication.

## Styles and theme

Root imports are convenient in client code. Component exports such as `@velrino/ui/button`, `@velrino/ui/dialog` and `@velrino/ui/provider` let framework consumers keep route bundles focused. Pure helpers are available from server-safe `@velrino/ui/utils` and `@velrino/ui/button-variants` exports.

Import `@velrino/ui/styles.css` once in the application's global stylesheet, after framework imports and before application overrides. Styles live in the base/components layers, so application utilities can still override layout. No package source scan or Tailwind plugin is needed.

Map application variables rather than copying a preset:

```css
:root {
  --vui-accent: var(--app-accent);
  --vui-text-accent: var(--app-accessible-accent);
  --vui-on-accent: var(--app-on-accent);
  --vui-background: var(--app-background);
  --vui-surface: var(--app-surface);
  --vui-text: var(--app-text);
  --vui-muted: var(--app-muted);
  --vui-secondary: var(--app-secondary-surface);
  --vui-font: var(--app-font);
}
```

Keep tokens on a root ancestor that also contains portal content. For deliberately scoped themes, pass `portalContainer` to `DialogContent`.

When a fixed application header precedes the gallery, set `--vui-anchor-offset` to its measured height plus the desired gap. The gallery preserves native fragments and applies this offset to section scrolling.

## Surface appearance

`Panel` groups content; `Dialog` provides modal behavior. Standard surfaces work by default. Opt into sci-fi frames independently of the theme:

```tsx
'use client';
import { UIProvider, Panel } from '@velrino/ui';

export function Interface({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider appearance="sci-fi">
      <Panel>{children}</Panel>
    </UIProvider>
  );
}
```

The provider adds no DOM wrapper and works through React portals. A per-component `appearance` overrides it. Applications own brand assets, localization, routing, persisted state and business logic.

## Gallery

Use `DesignSystemRoot` from `@velrino/ui/showcase` and import `@velrino/ui/showcase.css`. Host adapters provide the brand name/logo, a language control and a `DesignSystemCopy` dictionary. Built-in dictionaries come from the server-safe `@velrino/ui/messages` export; alternate languages can supply the same typed shape.

## Compatibility

Supports React/React DOM 19.1 through 19.x. No Next.js dependency or source transpilation configuration is required; compiled client boundaries are preserved. Node.js 22+ and pinned pnpm are development/release requirements, not browser runtime dependencies.

Thin compatibility exports in an existing application are acceptable during migration. Shared implementations, focus behavior and decorative CSS belong in this package.
