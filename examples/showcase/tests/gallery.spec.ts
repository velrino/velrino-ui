import { expect, test } from '@playwright/test';

test('catalog preserves values across page/tab mode, keyboard dialogs and localization', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Design system', exact: true })).toBeVisible();
  await expect(page.locator('.vui-showcase-section')).toHaveCount(15);
  await page.getByLabel('Validation example', { exact: true }).fill('Orbit');
  await page.getByRole('button', { name: 'Tabs', exact: true }).click();
  await page.getByRole('tab', { name: 'Dialogs', exact: true }).click();
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
  await page.getByRole('button', { name: 'Single page', exact: true }).click();
  await expect(page.getByLabel('Validation example', { exact: true })).toHaveValue('Orbit');
  await page.locator('.demo-toolbar').getByRole('button', { name: 'Português' }).click();
  await expect(page.getByRole('heading', { name: 'Sistema de design', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('dialog, sheet and loading use the selected portfolio theme', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Portfolio · purple', exact: true }).click();
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

test('standard surfaces keep modal behavior without sci-fi decoration', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Standard surfaces', exact: true }).click();
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
