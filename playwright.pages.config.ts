import { defineConfig } from '@playwright/test';
import gallery from './playwright.config.js';

export default defineConfig({
  ...gallery,
  outputDir: './test-results/pages',
  testIgnore: [],
  testMatch: '**/hosting.spec.ts',
  use: { baseURL: 'http://127.0.0.1:4322', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm run docs:preview',
    url: 'http://127.0.0.1:4322/velrino-ui/',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
