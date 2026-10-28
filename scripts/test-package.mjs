import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { packageRoot, packPackage, run } from './package-utils.mjs';

const artifact = await packPackage();
const temporary = await mkdtemp(join(tmpdir(), 'velrino-ui-consumers-'));
try {
  // Match the two real consumers: portfolio uses pnpm/React 19.1; HackUniverse
  // uses npm/React 19.3. Each case installs the actual tarball without scripts.
  for (const [manager, version] of [
    ['pnpm', '19.1.0'],
    ['npm', '19.3.0'],
  ]) {
    const directory = join(temporary, `${manager}-${version}`);
    await mkdir(directory);
    await writeFile(
      join(directory, 'package.json'),
      JSON.stringify({
        name: `velrino-ui-${manager}-consumer`,
        version: '1.0.0',
        private: true,
        type: 'module',
        dependencies: {
          '@velrino/ui': `file:${artifact.path}`,
          react: version,
          'react-dom': version,
        },
        devDependencies: { '@types/react': '19.2.14', '@types/react-dom': '19.2.3' },
      }),
    );
    const args =
      manager === 'npm'
        ? ['install', '--ignore-scripts', '--no-audit', '--no-fund']
        : ['install', '--ignore-scripts', '--reporter=append-only'];
    run(manager, args, directory);
    await writeFile(
      join(directory, 'consumer.tsx'),
      `
      import { Panel, Button, UIProvider, type PanelProps, type SurfaceAppearance } from '@velrino/ui';
      import { designSystemEn, type DesignSystemCopy } from '@velrino/ui/messages';
      const appearance: SurfaceAppearance = 'sci-fi';
      const props = { as: 'section', appearance, 'aria-label': 'Portable example' } satisfies PanelProps;
      const copy: DesignSystemCopy = designSystemEn;
      const example = <UIProvider appearance={appearance}><Panel {...props}><Button>{copy.buttons.normal}</Button></Panel></UIProvider>;
      void example;
    `,
    );
    await writeFile(
      join(directory, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          esModuleInterop: true,
        },
        include: ['consumer.tsx'],
      }),
    );
    run(
      process.execPath,
      [resolve(packageRoot, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'],
      directory,
    );
    await writeFile(
      join(directory, 'consumer.mjs'),
      `
      import assert from 'node:assert/strict';
      import { readFileSync } from 'node:fs';
      import { createElement } from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { Panel, Button, UIProvider } from '@velrino/ui';
      import { DesignSystemRoot } from '@velrino/ui/showcase';
      import { designSystemEn } from '@velrino/ui/messages';
      const content = createElement(Panel, {as:'section', 'aria-label':'Portable example'}, createElement(Button, null, designSystemEn.buttons.normal));
      const html = renderToStaticMarkup(createElement(UIProvider, {appearance:'sci-fi'}, content));
      assert.match(html, /data-slot="panel"/);
      assert.match(html, /data-appearance="sci-fi"/);
      assert.match(html, /Portable example/);
      assert.equal(typeof DesignSystemRoot, 'function');
      const entry = readFileSync(new URL(import.meta.resolve('@velrino/ui')), 'utf8');
      assert.match(entry, /^['"]use client['"];?/);
      for (const name of ['styles.css','showcase.css']) {
        const css = readFileSync(new URL(import.meta.resolve('@velrino/ui/' + name)), 'utf8');
        assert.ok(css.length > 100);
        assert.ok(!css.includes('@import'));
        assert.ok(!css.includes('/Users/'));
      }
    `,
    );
    run(process.execPath, ['consumer.mjs'], directory);
    process.stdout.write(
      `PASS ${manager} / React ${version}: packed imports, declarations, SSR, peers and CSS\n`,
    );
  }
  assert.ok(artifact.size > 0);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
