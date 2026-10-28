# Contributing

1. Open an issue with the concrete problem and acceptance criteria.
2. Create a focused branch from current `main`, such as `feat/2-themeable-components`.
3. Keep each component's code, types and styles together. Update public exports, the actual showcase and documentation when behavior changes.
4. Cover focus, keyboard interaction, lifecycle cleanup and package boundaries meaningfully. Use browser checks for layout and interaction behavior.
5. Run `pnpm run validate` and relevant browser or consumer checks.
6. Commit coherent increments, push and open a PR with `Closes #<issue>` and actual validation results.
7. Wait for CI, merge and delete the branch. Verify issue closure and matching local/remote `main`.

Preserve unrelated changes and active servers in consumer projects. Use isolated worktrees for integration; never commit secrets or unrelated work.
