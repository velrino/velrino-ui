# Application adoption

## Install a fixed GitHub release

Use the package asset, which contains compiled JavaScript, declarations and CSS. A dependency on a local sibling folder will not be available on a clean CI or hosting machine.

```json
{
  "dependencies": {
    "@velrino/ui": "https://github.com/velrino/velrino-ui/releases/download/v0.0.5/velrino-ui-0.0.5.tgz"
  }
}
```

Install with the application's existing package manager and commit its lockfile. Update to a new immutable release explicitly. A public GitHub release asset requires no npm account; a private distribution needs build-time authentication.

## Latest download alias

Each release also provides `velrino-ui.tgz` and its matching SHA-256 file. GitHub's latest-release URL follows that fixed asset name:

```json
{
  "dependencies": {
    "@velrino/ui": "https://github.com/velrino/velrino-ui/releases/latest/download/velrino-ui.tgz"
  }
}
```

This is an opt-in mutable URL, useful when trying the newest release. A lockfile still records the installed version and integrity; it does not automatically follow new release contents. Adopting an update requires refreshing and committing the lockfile with the chosen package version. A fresh download can conflict with an old recorded checksum, so use versioned assets for repeatable application builds. See [GitHub release links](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases) and [npm lockfiles](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/).

The alias contains exactly the same bytes as its versioned archive. Verify its adjacent checksum when downloading manually. Versioned assets remain immutable.

## Styles and theme

Root imports are convenient in client code. Component exports such as `@velrino/ui/button`, `@velrino/ui/dialog` and `@velrino/ui/provider` let framework consumers keep route bundles focused. Pure helpers are available from server-safe `@velrino/ui/utils` and `@velrino/ui/button-variants` exports.

Import `@velrino/ui/styles.css` once in the application's global stylesheet, after framework imports and before application overrides. Styles live in the base/components layers, so application utilities can still override layout. No package source scan or Tailwind plugin is needed.

Map application variables rather than copying a preset:

```css
:root {
  --vui-accent: var(--app-accent);
  --vui-text-accent: var(--app-accessible-accent);
  --vui-on-accent: var(--app-on-accent);
  --vui-background: var(--app-background);
  --vui-surface: var(--app-surface);
  --vui-text: var(--app-text);
  --vui-muted: var(--app-muted);
  --vui-secondary: var(--app-secondary-surface);
  --vui-font: var(--app-font);
}
```

Keep tokens on a root ancestor that also contains portal content. For deliberately scoped themes, pass `portalContainer` to `DialogContent`.

When a fixed application header precedes the gallery, set `--vui-anchor-offset` to its measured height plus the desired gap. The gallery preserves native fragments and applies this offset to section scrolling.

## Surface appearance

`Panel` groups content; `Dialog` provides modal behavior. Standard surfaces work by default. Opt into sci-fi frames independently of the theme:

```tsx
'use client';
import { UIProvider, Panel } from '@velrino/ui';

export function Interface({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider appearance="sci-fi">
      <Panel>{children}</Panel>
    </UIProvider>
  );
}
```

The provider adds no DOM wrapper and works through React portals. A per-component `appearance` overrides it. Applications own brand assets, localization, routing, persisted state and business logic.

## Gallery

Use `DesignSystemRoot` from `@velrino/ui/showcase` and import `@velrino/ui/showcase.css`. Host adapters provide the brand name/logo, a language control and a `DesignSystemCopy` dictionary. Built-in dictionaries come from the server-safe `@velrino/ui/messages` export; alternate languages can supply the same typed shape.

The gallery defaults to a `main` landmark. Use `as="div"` or `as="section"` when embedding it inside an existing page landmark.

## Compatibility

Supports React/React DOM 19.1 through 19.x. No Next.js dependency or source transpilation configuration is required; compiled client boundaries are preserved. Node.js 22+ and pinned pnpm are development/release requirements, not browser runtime dependencies.

Thin compatibility exports in an existing application are acceptable during migration. Shared implementations, focus behavior and decorative CSS belong in this package.

## Switch

`Switch` and `SwitchProps` are available from `@velrino/ui/switch` and the package root in v0.0.5. Load the existing runtime stylesheet; there are no new dependencies, resets or source-scanning requirements.

```tsx
import { Switch } from '@velrino/ui/switch';

<label htmlFor="notifications">Enable notifications</label>
<Switch
  id="notifications"
  checked={notifications}
  onCheckedChange={setNotifications}
  aria-describedby="notifications-help"
/>
<p id="notifications-help">Choose whether to receive updates.</p>;
```

Use `checked` with `onCheckedChange` for application-owned state, or `defaultChecked` for an uncontrolled setting. The callback receives the next boolean and Base UI change details; `details.cancel()` cancels an uncontrolled change. Supply a visible associated label, `aria-label` or `aria-labelledby`, plus an optional `aria-describedby`. A forwarded ref accesses the native button, while `inputRef` accesses the form input.

Space/Enter toggle the setting without submitting an enclosing form. `disabled` blocks changes and keyboard focus; `readOnly` retains focus without allowing changes. Native form properties include `name`, `value` (default `on`), `uncheckedValue`, `form` and `required`. Unchecked switches omit their field unless `uncheckedValue` is supplied; disabled fields do not submit. Required validation belongs to the form input. Applications own persistence, asynchronous work, permission checks and error messages.

The default appearance uses a rounded track and thumb. `appearance="sci-fi"` uses a square track and a subtly chamfered thumb, inheriting `UIProvider` when no override is supplied. Colors follow existing semantic tokens; reduced motion removes the short state transition. The control reserves a 44-by-44-pixel target and keeps keyboard focus outside the decorative layers. Built-in EN/PT examples live in Inputs without changing the 17 section IDs. Custom `DesignSystemCopy` dictionaries need the additional `inputs.switches` fields. See [v0.0.5 release notes](releases/0.0.5.md).

## Select and step navigation

Select and StepNavigation are included in v0.0.4 through the root export and the granular entries below. Adopt the immutable release URL above and regenerate the consumer lockfile when upgrading; older archives do not gain new exports automatically. Do not commit local sibling paths as application dependencies.

```tsx
import { Select } from '@velrino/ui/select';
import { StepNavigation } from '@velrino/ui/step-navigation';

<label htmlFor="density">Density</label>
<Select
  id="density"
  value={density}
  onValueChange={setDensity}
  options={[
    { value: '', label: 'Automatic' },
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
  ]}
/>;

<StepNavigation
  label="Steps"
  current={step}
  onStepChange={setStep}
  steps={[
    { id: 'details', label: 'Details' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'review', label: 'Review' },
  ]}
/>;
```

Keep selected values, localized option/step labels, required-field rules and submission in the application. An empty string is a real Select option, so an Automatic choice retains its own label instead of becoming a placeholder. Set `disabled` on the Select or an individual option to prevent selection. Keyboard users can navigate choices and return focus to the trigger; inside a Dialog, the first Escape closes only the popup and keeps its parent dialog open.

StepNavigation only reports a requested stage; it does not validate, persist data or advance by itself. Its ordinary buttons use native Tab and Enter/Space interaction, and the current stage has `aria-current="step"`. Optional `shortLabel` text is visual on mobile while the full `label` remains accessible; `complete` supplies a decorative completion mark. Its `disabled` prop disables all stage buttons. Choosing a stage never submits an enclosing form.

The gallery includes both families in its 17 English/Portuguese sections. Custom `DesignSystemCopy` dictionaries must provide the new `selects` and `steps` fields; the built-in dictionaries already include them. Existing runtime imports and the shared stylesheet path are unchanged. See the [v0.0.4 release notes](releases/0.0.4.md).

A client host can provide `renderNavigation` to replace the built-in page/tab controls with its own menu. The render callback receives `mode`, `activeSection`, `changeMode` and `navigateTo`. Embed `SectionSearch` from `@velrino/ui/showcase` inside that menu; it reuses the host's typed dictionaries. Close the menu before calling `navigateTo` (for example from DialogContent's `onCloseAutoFocus`, preventing its default trigger focus for that selection). Examples remain mounted and fragment navigation preserves the route query. Standard built-in controls are unchanged when no render callback is supplied.
