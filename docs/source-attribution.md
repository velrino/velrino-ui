# Source attribution

The source owner requested shared UI extraction from these projects:

- [HackUniverse](https://github.com/velrino/hackuniverse), revision `186f12159bfb98d335e67cef2b70a7d04bddc176`: `web/src/modules/design-system`, `web/src/components/ui` and `web/src/styles/hud.css`.
- Additional generic controls and theme requirements were contributed from the author's existing applications, with their permission. Application-specific code and private repository details are excluded from the package.

HackUniverse's sci-fi dialog frame, globe loader, fragment/tab navigation and grapheme-aware typewriter are the visual and behavioral starting points. Adapt their imports and styles to package-local modules and semantic tokens. Do not copy brand assets, fonts, account code, telemetry or 3D runtime.

Accessible primitives remain dependencies of their original authors: [Radix UI](https://www.radix-ui.com/) (WorkOS) and [Base UI](https://base-ui.com/). Their licenses remain in the distributed dependencies.
