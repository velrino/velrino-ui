import { expect, test } from '@playwright/test';

test('published prefix loads flags and retains shareable preferences and component state', async ({
  page,
}) => {
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/velrino-ui/?lang=pt-BR&theme=red&appearance=default&keep=1#inputs');
  await expect(page.locator('h1')).toHaveText('Sistema de design');
  await expect(page.locator('html')).toHaveAttribute('data-demo-theme', 'red');
  await page.locator('#vui-example-validation').fill('Keep my work');
  await page.getByRole('button', { name: 'Abrir configurações', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Configurações', exact: true });
  await settings.getByRole('tab', { name: 'Ajustes', exact: true }).click();
  await expect(settings).toHaveAttribute('data-appearance', 'default');
  await settings.locator('img').evaluateAll(async (images) => {
    await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
  });
  await settings.getByRole('button', { name: 'English', exact: true }).click();
  await page
    .getByRole('dialog', { name: 'Settings', exact: true })
    .getByText('Purple', { exact: true })
    .click();
  await page.keyboard.press('Escape');
  const changed = new URL(page.url());
  expect(changed.pathname).toBe('/velrino-ui/');
  expect(changed.searchParams.get('lang')).toBe('en');
  expect(changed.searchParams.get('theme')).toBe('purple');
  expect(changed.searchParams.get('keep')).toBe('1');
  expect(changed.hash).toBe('#inputs');
  await expect(page.locator('#vui-example-validation')).toHaveValue('Keep my work');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Design system');
  await expect(page.locator('html')).toHaveAttribute('data-demo-theme', 'purple');
  await page.locator('.demo-wordmark').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(new URL(page.url()).pathname).toBe('/velrino-ui/');
  expect(failures).toEqual([]);
});

test('invalid or repeated URL preferences use safe defaults', async ({ page }) => {
  await page.goto('/velrino-ui/?lang=pt-BR&lang=en&theme=unknown&appearance=unknown');
  await expect(page.locator('h1')).toHaveText('Design system');
  await expect(page.locator('html')).toHaveAttribute('data-demo-theme', 'cyan');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Settings', exact: true })).toHaveAttribute(
    'data-appearance',
    'sci-fi',
  );
});

test('library map is bundled at the Pages prefix and opens in a separate tab', async ({
  page,
  context,
}) => {
  await page.goto('/velrino-ui/?lang=pt-BR&theme=cyan');
  await page.getByRole('button', { name: 'Abrir configurações', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Configurações', exact: true });
  await settings.getByRole('tab', { name: 'Sobre', exact: true }).click();
  const link = settings.getByRole('link', { name: /^Mapa da biblioteca/ });
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  const href = (await link.getAttribute('href'))!;
  expect(new URL(href, page.url()).pathname).toMatch(/^\/velrino-ui\/assets\/.*\.png$/);
  const asset = await page.request.get(href);
  expect(asset.ok()).toBe(true);
  expect(asset.headers()['content-type']).toContain('image/png');
  const original = page.url();
  const [popup] = await Promise.all([context.waitForEvent('page'), link.click()]);
  await expect(popup.locator('img')).toBeVisible();
  expect(
    await popup.locator('img').evaluate((image) => (image as HTMLImageElement).naturalWidth),
  ).toBe(3840);
  expect(page.url()).toBe(original);
  await popup.close();
});
