import { rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
const compiler = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url));
const result = spawnSync(process.execPath, [compiler, '-p', 'tsconfig.build.json'], {
  cwd: root,
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await build({
  absWorkingDir: root,
  entryPoints: { styles: 'src/styles/index.css', showcase: 'src/styles/showcase.css' },
  outdir: 'dist',
  bundle: true,
  minify: true,
  target: ['es2022'],
  legalComments: 'none',
});
