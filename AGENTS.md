# Velrino UI working conventions

- Keep identifiers, comments and repository documentation in English; UI copy belongs in typed English/Portuguese dictionaries.
- Keep runtime code independent of Next.js, consumer aliases, telemetry, accounts and scene logic.
- Organize each component family in `src/components/<family>/` with implementation, types, CSS and behavior tests as needed. Share demonstrated capabilities.
- Preserve the evolved HackUniverse frame, globe loader, focus handling, fragment navigation and reduced-motion support while making colors and fonts themeable.
- Use namespaced `vui-` classes and `--vui-*` variables. Publish bundled CSS without a global reset or consumer Tailwind scan requirement.
- React and React DOM are peer dependencies. Preserve client boundaries and emit declarations.
- Use pinned pnpm, coherent commits and one focused issue/PR per feature. Run relevant validation, wait for CI, merge, delete the branch and verify issue closure.
- `pnpm run validate` is the default check. Verify relevant layout and keyboard behavior in the example and actual consumers.
- Release tested tarballs through GitHub. Do not publish to npm unless explicitly requested.
- Preserve unrelated changes and user-owned active servers; use isolated consumer checkouts when needed.

## Reviews

- For requested code, diff, pull-request or repository reviews, use the [review skill](.agents/skills/review/SKILL.md). A review request alone does not authorize edits, commits, pushes or posting findings externally.
