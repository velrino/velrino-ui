# Velrino UI

Themeable React components and sci-fi interface primitives shared by [HackUniverse](https://github.com/velrino/hackuniverse) and [Velrino Portfolio](https://github.com/velrino/portfolio-front).

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

See [architecture](docs/architecture.md), [contributing](CONTRIBUTING.md) and [issues #1–#6](https://github.com/velrino/velrino-ui/issues).

## Distribution

The first release will distribute `@velrino/ui@0.0.1` as a compiled GitHub Release tarball. The `private` package flag prevents accidental npm publication while permitting packed GitHub release installation. No npm registry release exists yet.

Import the package stylesheet once in the application's global entry, then map application-owned palettes onto `--vui-*` tokens. Component styles use namespaced `vui-` classes; structural styles never hard-code a brand accent or apply a global CSS reset.

## Attribution

Adapted from the author's HackUniverse design system and portfolio primitives. Accessible interaction primitives remain dependencies of their original authors. See [source attribution](docs/source-attribution.md) and the [MIT license](LICENSE).
