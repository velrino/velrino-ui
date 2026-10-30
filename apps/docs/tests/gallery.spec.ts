import { expect, test } from '@playwright/test';

test('catalog retains values through keyboard dialogs and language selection', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Design system', exact: true })).toBeVisible();
  await expect(page.locator('.vui-showcase-section')).toHaveCount(17);
  await page.getByLabel('Validation example', { exact: true }).fill('Orbit');
  const trigger = page.getByRole('button', { name: 'Open example dialog', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'A focused decision' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('opacity', '1');
  await expect(dialog.locator('[data-slot="dialog-frame"]')).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel('Validation example', { exact: true })).toHaveValue('Orbit');
  const languageTrigger = page.getByRole('button', {
    name: 'Change language: English',
    exact: true,
  });
  await languageTrigger.click();
  const languages = page.getByRole('dialog', { name: 'Choose your language' });
  await expect(languages).toBeVisible();
  await expect(languages.locator('img')).toHaveCount(2);
  await languages.locator('img').evaluateAll(async (images) => {
    await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
  });
  await expect(languages.getByRole('button', { name: 'English', exact: true })).toBeFocused();
  await expect(page.locator('h1')).toHaveText('Design system');
  await page.keyboard.press('Escape');
  await expect(languageTrigger).toBeFocused();
  await languageTrigger.click();
  await languages.getByRole('button', { name: 'Português', exact: true }).click();
  await expect(languages).toBeHidden();
  await expect(page.locator('#vui-example-validation')).toHaveValue('Orbit');
  await expect(page.getByRole('heading', { name: 'Sistema de design', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('dialog, sheet and loading use the selected portfolio theme', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Settings', exact: true });
  await settings.getByRole('tab', { name: 'Settings', exact: true }).click();
  const hackColors = await page.evaluate(() =>
    ['--vui-accent', '--vui-background', '--vui-surface', '--vui-text', '--vui-muted'].map((key) =>
      getComputedStyle(document.documentElement).getPropertyValue(key).trim(),
    ),
  );
  await expect(settings.getByRole('radio', { name: 'Cyan', exact: true })).toBeChecked();
  expect(
    await page.evaluate(() =>
      ['--vui-accent', '--vui-background', '--vui-surface', '--vui-text', '--vui-muted'].map(
        (key) => getComputedStyle(document.documentElement).getPropertyValue(key).trim(),
      ),
    ),
  ).toEqual(hackColors);
  await settings.getByRole('radio', { name: 'Cyan', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(settings.getByRole('radio', { name: 'Purple', exact: true })).toBeChecked();
  await page.screenshot({ path: info.outputPath('settings-theme.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open example dialog', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'A focused decision' });
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--vui-accent').trim(),
    ),
  ).toBe('#5b21b6');
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  await page.screenshot({ path: info.outputPath('purple-dialog.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open sheet: Right', exact: true }).click();
  const sheet = page.getByRole('dialog', { name: 'A little more space' });
  await expect(sheet).toBeVisible();
  const footer = await sheet.locator('[data-slot="dialog-footer"]').boundingBox();
  expect(footer!.y + footer!.height).toBeGreaterThan(page.viewportSize()!.height * 0.8);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await page.getByRole('button', { name: 'Preview loading screen', exact: true }).click();
  await expect(page.getByRole('progressbar', { name: 'Loading screen demo' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop preview', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('slider keyboard controls and a nested menu remain usable', async ({ page }) => {
  await page.goto('/');
  const volume = page.getByRole('slider', { name: 'Example volume' });
  await volume.focus();
  await page.keyboard.press('ArrowRight');
  await expect(volume).toHaveAttribute('aria-valuenow', '51');
  await page.getByRole('button', { name: 'Open example menu', exact: true }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitemcheckbox', { name: 'Show interface hints' }).click();
  await page.getByRole('button', { name: 'Open example menu', exact: true }).click();
  await expect(
    page.getByRole('menuitemcheckbox', { name: 'Show interface hints' }),
  ).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('menuitem', { name: 'More options', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await page.getByRole('menuitem', { name: 'Nested example action', exact: true }).click();
  await expect(page.locator('#menus').getByRole('status')).toHaveText('Action completed locally.');
  await page
    .getByRole('button', { name: 'Can each application keep its palette?', exact: true })
    .click();
  await expect(
    page.getByText('Yes. Application theme variables control every accent, surface and glow.', {
      exact: true,
    }),
  ).toBeVisible();
});

test('selects and step navigation retain choices through navigation and localization', async ({
  page,
}) => {
  await page.goto('/#selects');
  const density = page.getByRole('combobox', { name: 'Display density', exact: true });
  await density.click();
  await expect(page.getByRole('option', { name: 'Unavailable', exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await page.getByRole('option', { name: 'Compact', exact: true }).click();
  await expect(density).toHaveText('Compact');
  await expect(
    page.getByRole('combobox', { name: 'Disabled selection', exact: true }),
  ).toBeDisabled();
  await density.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(density).toBeFocused();

  const steps = page.locator('#steps');
  await steps.getByLabel('Display name', { exact: true }).fill('Aster');
  await steps.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(steps.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
  await expect(steps.getByText('Aster', { exact: true })).toBeVisible();
  await steps.getByRole('button', { name: 'Preferences', exact: true }).click();
  await steps.getByRole('combobox', { name: 'Update frequency', exact: true }).click();
  await page.getByRole('option', { name: 'Monthly', exact: true }).click();
  await steps.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(steps.getByText('Monthly', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Change language: English', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Choose your language' })
    .getByRole('button', {
      name: 'Português',
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('combobox', { name: 'Densidade da interface', exact: true }),
  ).toHaveText('Compacta');
  await expect(steps.getByText('Mensal', { exact: true })).toBeVisible();
  await steps.getByRole('button', { name: 'Perfil', exact: true }).click();
  await expect(steps.getByLabel('Nome de exibição', { exact: true })).toHaveValue('Aster');
});

test('standard surfaces keep modal behavior without sci-fi decoration', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Settings', exact: true });
  await settings.getByRole('tab', { name: 'Settings', exact: true }).click();
  await settings.getByRole('button', { name: 'Standard', exact: true }).click();
  await expect(settings).toHaveAttribute('data-appearance', 'default');
  await expect(settings.locator('img')).toHaveCount(2);
  await settings.getByRole('button', { name: 'Português', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Configurações', exact: true })).toBeVisible();
  await page
    .getByRole('dialog', { name: 'Configurações', exact: true })
    .getByRole('button', { name: 'English', exact: true })
    .click();
  await page.keyboard.press('Escape');
  const trigger = page.getByRole('button', { name: 'Open example dialog', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'A focused decision' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-appearance', 'default');
  await expect(dialog.locator('[data-slot="dialog-frame"]')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('standard-dialog.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('color values follow the host theme and keep transparency visible', async ({ page }) => {
  await page.goto('/#colors');
  const value = (variable: string) =>
    page
      .locator(`[data-color-variable="${variable}"]`)
      .locator('..')
      .locator('.vui-showcase-color-value');
  await expect(value('--vui-accent')).toHaveText('#42E8F4');
  await expect(value('--vui-line')).toHaveText('rgba(66, 232, 244, 0.3)');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Settings', exact: true });
  await settings.getByRole('tab', { name: 'Settings', exact: true }).click();
  await settings.getByText('Purple', { exact: true }).click();
  await expect(value('--vui-accent')).toHaveText('#5B21B6');
  await expect(value('--vui-line')).toHaveText('rgba(91, 33, 182, 0.3)');
  await page.keyboard.press('Escape');
  await page
    .locator('.vui-showcase')
    .evaluate((element) =>
      (element as HTMLElement).style.setProperty('--vui-accent', 'rgb(20, 160, 90)'),
    );
  await expect(value('--vui-accent')).toHaveText('#14A05A');
});

test('menu index searches and jumps without inline navigation or lost fields', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?keep=1');
  await expect(page.getByRole('group', { name: 'Catalog view', exact: true })).toHaveCount(0);
  await page.locator('#vui-example-validation').fill('Retained value');
  const jump = async (query: string, label: string) => {
    await page.getByRole('button', { name: 'Open settings', exact: true }).click();
    const settings = page.getByRole('dialog', { name: 'Settings', exact: true });
    await expect(settings.getByRole('tab', { name: 'Go to', exact: true })).toHaveAttribute(
      'data-state',
      'active',
    );
    await expect(settings.getByRole('tab')).toHaveText(['Go to', 'Settings', 'About']);
    await settings.getByRole('searchbox', { name: 'Search components', exact: true }).fill(query);
    await settings.getByRole('button', { name: label, exact: true }).click();
    await expect(settings).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`#${label.toLowerCase()}$`));
  };
  await jump('slider', 'Sliders');
  await expect(page).toHaveURL(/\?keep=1#sliders$/);
  await expect
    .poll(() => page.locator('#sliders').evaluate((element) => element.getBoundingClientRect().top))
    .toBeLessThan(250);
  await jump('inputs', 'Inputs');
  await expect(page.locator('#vui-example-validation')).toHaveValue('Retained value');
  await page.goBack();
  await expect(page).toHaveURL(/#sliders$/);
  await page.locator('.demo-wordmark').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page).toHaveURL(/\?keep=1#?$/);
  await expect(page.locator('#vui-example-validation')).toHaveValue('Retained value');
  await jump('inputs', 'Inputs');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Settings', exact: true });
  await settings
    .getByRole('searchbox', { name: 'Search components', exact: true })
    .fill('no-such-component');
  await expect(settings.getByRole('status')).toHaveText('No matching components.');
  for (const name of ['Go to', 'Settings', 'About']) {
    await settings.getByRole('tab', { name, exact: true }).click();
    const overflow = await settings.locator('[data-slot="dialog-body"]').evaluate((element) => ({
      width: element.scrollWidth - element.clientWidth,
      height: element.scrollHeight - element.clientHeight,
    }));
    expect(overflow.width).toBeLessThanOrEqual(1);
    expect(overflow.height).toBeLessThanOrEqual(1);
  }
  await page.screenshot({ path: info.outputPath('menu-index.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open settings', exact: true })).toBeFocused();
});

test('grouped settings and author links remain usable after localization', async ({
  page,
}, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Settings', exact: true });
  await dialog.getByRole('tab', { name: 'Settings', exact: true }).click();
  await expect(dialog.getByRole('group', { name: 'Language', exact: true })).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Surfaces', exact: true })).toBeVisible();
  await expect(dialog.getByRole('group', { name: 'Theme', exact: true })).toBeVisible();
  await expect(dialog.getByRole('radio')).toHaveCount(3);
  const centers = await dialog
    .locator('.demo-theme-swatch')
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(1);
  await dialog.getByRole('button', { name: 'Português', exact: true }).click();
  const localized = page.getByRole('dialog', { name: 'Configurações', exact: true });
  await expect(localized.getByRole('tab')).toHaveText(['Ir para', 'Ajustes', 'Sobre']);
  await localized.getByRole('tab', { name: 'Sobre', exact: true }).click();
  await expect(localized.getByText('Feito por Velrino', { exact: true })).toBeVisible();
  for (const href of [
    'https://github.com/velrino/',
    'https://www.linkedin.com/in/velrino/',
    'https://github.com/velrino/velrino-ui/',
  ]) {
    const link = localized.locator(`a[href="${href}"]`);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.screenshot({ path: info.outputPath('about-portuguese.png'), animations: 'disabled' });
  const overflow = await localized
    .locator('[data-slot="dialog-body"]')
    .evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Abrir configurações', exact: true }),
  ).toBeFocused();
});
