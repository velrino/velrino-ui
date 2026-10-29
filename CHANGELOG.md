# Changelog

## 0.0.3 — 2026-10-28

- Refine the standalone host menu into Go to, Settings and About. Group language, surfaces and theme preferences; use keyboard-accessible color circles and add localized author information and social/source links.
- Center the Dialog, language and loading-preview actions on mobile; update the language example copy to match the current host. Make the wordmark return smoothly to the top, respecting reduced motion.
- Type-check the example application and its browser suite as part of validation.

## 0.0.2 — 2026-10-28

- Add host-supplied gallery navigation and a reusable searchable section index. The example moves navigation into the first menu tab, followed by Language, Theme and Surfaces; section jumps close the menu before smooth scrolling.
- Correct Dialog body and Tabs box sizing so standalone hosts do not depend on a CSS reset. Use a two-column mobile menu tab grid to prevent horizontal overflow.

- Stack color rows and center Button/Sheet action examples one per line on mobile.
- Show live resolved HEX values for opaque sRGB swatches and RGBA for transparency. Observe host theme changes without polling and preserve other CSS color spaces.

- Move standalone preview controls into a centered, responsive settings dialog with theme, surface and language tabs. Use matching option widths, explicit English/Portuguese selection and local flag icons. Align Portfolio Cyan with the HackUniverse palette.

## 0.0.1 — 2026-10-28

- Establish the portable React package, semantic token contract, build pipeline and contribution workflow.
- Extract themeable Button, Dialog, Panel, Input, Tabs, AnchorLink, TypewriterText and FullScreenLoader from HackUniverse. Preserve the decorative sci-fi frame, globe, accessible focus behavior, reduced motion and grapheme-safe animation, with behavioral coverage.
- Add portfolio-compatible Accordion, DropdownMenu, Sheet and Slider. Expand the reusable English/Portuguese gallery to every component family and add a standalone host for palette, viewport and keyboard verification.
- Distribute the compiled package and SHA-256 checksum through GitHub Releases. Validate the actual tarball with pnpm/React 19.1 and npm/React 19.3, including public imports, strict declarations, SSR, peer resolution and both stylesheets.
- Use the application-agnostic `Panel` name, keep standard surfaces as the default, and make sci-fi frames an explicit per-component or `UIProvider` appearance. Keep colors and brand outside the provider and make default gallery copy generic.
