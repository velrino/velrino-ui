import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/velrino-ui/' : '/',
  build: {
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        // This host is a client-only SPA; the library's TypeScript build preserves
        // these boundaries for real RSC consumers. Keep all other warnings visible.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client'))
          return;
        defaultHandler(warning);
      },
    },
  },
}));
