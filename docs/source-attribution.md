# Source attribution

The source owner requested shared UI extraction from these projects:

- [HackUniverse](https://github.com/velrino/hackuniverse), revision `186f12159bfb98d335e67cef2b70a7d04bddc176`: `web/src/modules/design-system`, `web/src/components/ui` and `web/src/styles/hud.css`.
- Additional generic controls and theme requirements were contributed from the author's existing applications, with their permission. Application-specific code and private repository details are excluded from the package.

HackUniverse's sci-fi dialog frame, globe loader, fragment/tab navigation and grapheme-aware typewriter are the visual and behavioral starting points. Adapt their imports and styles to package-local modules and semantic tokens. Do not copy brand assets, fonts, account code, telemetry or 3D runtime.

Accessible primitives remain dependencies of their original authors: [Radix UI](https://www.radix-ui.com/) (WorkOS) and [Base UI](https://base-ui.com/). Their licenses remain in the distributed dependencies.

The standalone example bundles only the United States and Brazil icons from [circle-flags](https://github.com/HatScripts/circle-flags), revision `379588b5da95482d6bbf10bd45644a35b0609ea6`. Its MIT notice is retained at `apps/docs/public/flags/LICENSE.md`. These assets belong to the example host and are excluded from the runtime package.

The design-system map follows the author's [SuperPlane diagram layout](https://github.com/velrino/superplane/tree/artifacts/architecture/architecture/source), using grouped cards and separate icon/title/description rows. Its neutral symbols are drawn by the renderer. The React icon comes from [diagrams](https://github.com/mingrammer/diagrams); its MIT notice is retained in `docs/assets/diagrams/LICENSE-diagrams.txt`.
