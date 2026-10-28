# Architecture

Velrino UI is a framework-independent React package based on the evolved HackUniverse design system. The portfolio is a second consumer with its existing palette.

## Boundaries

- `components/<family>/` owns implementation, types, CSS, exports and relevant behavior tests. Compose accessible Radix or Base UI primitives rather than rebuilding keyboard or focus handling.
- `hooks/` and `lib/` contain capabilities actually shared by components. Avoid speculative abstractions and application aliases.
- `showcase/` renders the real public components with typed localized copy and explicit brand adapters. Its separate export keeps examples out of runtime imports.
- `styles/tokens.css` defines the semantic `--vui-*` contract. Concrete default colors belong here; component effects derive from these tokens.
- Application adapters own routing, brand assets, language selection, persisted themes, authentication, analytics and 3D behavior.

## Styling

Publish ready-to-use, namespaced CSS. Never require a consumer Tailwind source scan, add a global reset, change body styles or download fonts. Clip decorative layers, never content or focus rings. Respect reduced motion and forced colors.

Import `@velrino/ui/styles.css` once, then define an application adapter after it. Root-level tokens reach portal content; dialogs can accept a custom portal container for explicitly scoped surfaces.

## Distribution

TypeScript emits ESM and declarations with explicit `.js` imports. Client entrypoints preserve `use client`. React and React DOM are peers. esbuild bundles CSS separately. GitHub Releases distribute tested tarballs; applications pin the release URL and commit their lockfiles.

There is no Next.js dependency. Validate the actual packed artifact and both actual consumers before calling a release integrated.
