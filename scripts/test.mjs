import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

async function discover(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) files.push(...(await discover(url)));
    else if (/\.test\.(ts|tsx|mjs)$/.test(entry.name)) files.push(fileURLToPath(url));
  }
  return files;
}

const tests = await discover(new URL('../src/', import.meta.url));
if (!tests.length) {
  process.stdout.write('No component behavior tests exist in the package foundation yet.\n');
} else {
  const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', ...tests.sort()], {
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
