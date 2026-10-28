# Velrino UI

Accessible, themeable React components with optional sci-fi surfaces. Built for independent React applications.

The starting point is HackUniverse's evolved gallery, dialog frame, accessible primitives and globe loader. Applications keep their own colors, fonts, brand, localization and business logic.

## Development

Use Node.js 22 or newer and the pinned `pnpm@10.29.3`.

```sh
pnpm install --frozen-lockfile
pnpm run validate
```

`validate` checks formatting, lint, types, behavioral tests and the production package build. TypeScript emits ESM and declarations; esbuild bundles standalone CSS. Consumer applications do not need to scan this package with Tailwind.

## Structure

```text
src/
  components/       # One folder per public component family
  hooks/            # Shared interaction lifecycles
  lib/              # Framework-independent helpers
  showcase/         # Optional gallery and typed localized copy
  styles/           # Semantic tokens and composed styles
scripts/            # Build, validation and release tooling
examples/           # Standalone visual verification host
docs/               # Architecture, adoption and release guidance
```

See [architecture](docs/architecture.md), [adoption](docs/adoption.md), [releases](docs/releases/0.0.1.md), [contributing](CONTRIBUTING.md) and [issues #1–#6](https://github.com/velrino/velrino-ui/issues).

## Components

| Family     | Public API                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Actions    | `Button`, `buttonVariants`, `AnchorLink`                                                                                               |
| Surfaces   | `Panel`, `Dialog`, `DialogContent`, `DialogTrigger`, `DialogClose`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` |
| Inputs     | `Input`, `Slider`                                                                                                                      |
| Navigation | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Accordion`, `DropdownMenu`                                                          |
| Drawers    | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetClose`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`                  |
| Feedback   | `FullScreenLoader`, `TypewriterText`                                                                                                   |

Dialogs support localized close controls, controlled state, custom portal containers and full-screen content. The loader clamps progress, supports indeterminate work and delegates cancellation to its caller. Typewriter animation preserves complete graphemes, final layout and accessible text.

`Panel` groups content; it is not a modal. `Dialog` owns modal focus, the overlay and dismissal. Both use standard surfaces by default. Choose `appearance="sci-fi"` for one surface, or wrap a tree in `<UIProvider appearance="sci-fi">` to opt into that presentation across panels, dialogs and sheets. Providers compose without adding DOM wrappers; application-owned CSS variables still control all colors and fonts.

## Interactive gallery

`@velrino/ui/showcase` exports `DesignSystemRoot` and its explicit brand/localization adapter types. Import typed English/Portuguese dictionaries from the server-safe `@velrino/ui/messages` export, and load `@velrino/ui/showcase.css` alongside the runtime stylesheet. Every component family has a live example; page and tab navigation preserve example state.

```sh
pnpm run demo:dev
PLAYWRIGHT_SKIP_BROWSER_GC=1 pnpm exec playwright install chromium
pnpm run test:browser
```

The standalone example runs at `http://127.0.0.1:4321`. Its menu opens centered settings with theme, surface and language tabs. Options have matching widths, and English/Portuguese selection shows local flag artwork. Portfolio Cyan uses the same palette as HackUniverse; Purple and Red are also available. Browser checks cover desktop and mobile emulation; they do not establish physical-device performance.

## Distribution

Distribution uses a compiled GitHub Release tarball for `@velrino/ui@0.0.1`. The `private` package flag prevents accidental npm publication while permitting packed GitHub release installation. No npm registry release exists.

Import the package stylesheet once in the application's global entry, then map application-owned palettes onto `--vui-*` tokens. Component styles use namespaced `vui-` classes; structural styles never hard-code a brand accent or apply a global CSS reset.

## Attribution

Adapted from the author's HackUniverse design system and portfolio primitives. Accessible interaction primitives remain dependencies of their original authors. See [source attribution](docs/source-attribution.md) and the [MIT license](LICENSE).
