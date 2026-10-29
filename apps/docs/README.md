# Velrino UI documentation

The canonical component gallery is published at [velrino.github.io/velrino-ui](https://velrino.github.io/velrino-ui/). The portfolio and HackUniverse open this site in a new tab; their runtime components still come from a pinned package release.

## Local development

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run docs:dev
```

Open `http://127.0.0.1:4321`. The previous `demo:dev`, `demo:build` and `demo:typecheck` commands remain aliases.

## Share a view

The URL accepts `lang=en|pt-BR`, `theme=cyan|purple|red` and `appearance=default|sci-fi`. A section fragment opens that component directly:

```text
https://velrino.github.io/velrino-ui/?lang=pt-BR&theme=purple&appearance=sci-fi#dialogs
```

Missing, invalid or repeated preferences use English, Cyan and sci-fi surfaces. Settings update the current URL without reloading the document or clearing example inputs. No account, analytics or stored browser preference is needed.

## Build and deploy

```sh
pnpm run docs:build
pnpm run test:pages
pnpm run docs:preview
```

The build uses `/velrino-ui/` as its Vite base, including local flag assets. Preview at `http://127.0.0.1:4322/velrino-ui/`. Browser checks exercise both the development host and the built artifact at the real Pages prefix on desktop and mobile emulation.

The Validate workflow checks pull requests without deploying. On `main`, the same checks must pass before the generated `apps/docs/dist` artifact can deploy to the `github-pages` environment. A manual workflow dispatch on `main` retries the full validated deployment. No generated site files or deployment branch are committed, and no package release is needed for documentation-only updates.
