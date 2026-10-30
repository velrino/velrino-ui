# Changelog

## 0.0.5 — 2026-10-30

- Add a reusable Switch with controlled/uncontrolled state, labeled native button interaction, form values/required validation, disabled/read-only states and forwarded button/input refs.
- Inherit rounded default or square sci-fi presentation from UIProvider, with semantic theme colors, a 44-pixel interaction target, visible focus and reduced-motion support.
- Add English/Portuguese examples to Inputs, preserving the 17 gallery section IDs, and publish root/granular imports with bundled styles and declarations.
- Verify keyboard activation, controlled updates, cancellation, form ownership/submission and blocked states; extend packed consumer and desktop/mobile checks to the new family.

## 0.0.4 — 2026-10-29

- Add a controlled, accessible Select with themeable trigger and popup, keyboard navigation, disabled options and an explicit empty-string choice. Keep selection popups inside a surrounding dialog's focus scope.
- Extract controlled StepNavigation with horizontal stages, mobile short labels, accessible full labels and caller-owned progression/validation.
- Add English/Portuguese live gallery examples, bringing the gallery to 17 sections, and granular compiled package exports for both families.
- Cover popup/dialog focus, keyboard selection, disabled states, empty-string options and controlled step changes. Extend packed consumer checks to the new imports, declarations, SSR and CSS.

## 0.0.3 — 2026-10-28

- Generate a fixed-name archive/checksum alias beside each versioned package. Publish the release only after all assets upload, document latest-download lockfile behavior and verify the alias through packed consumers.

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
