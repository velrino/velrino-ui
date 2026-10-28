import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const packageRoot = fileURLToPath(new URL('../', import.meta.url));
export function run(command, args, cwd = packageRoot, options = {}) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
  return result;
}

/** Pack the compiled allowlist; consumers never run dependency build hooks. */
export async function packPackage(directory = resolve(packageRoot, '.local/artifacts')) {
  await readFile(resolve(packageRoot, 'dist/index.js'));
  await mkdir(directory, { recursive: true });
  const result = run(
    'npm',
    ['pack', '--ignore-scripts', '--json', '--pack-destination', directory],
    packageRoot,
    { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' },
  );
  const [metadata] = JSON.parse(result.stdout);
  const allowed = /^(dist\/|docs\/|package\.json$|README\.md$|CHANGELOG\.md$|LICENSE$)/;
  const forbidden = /(^|\/)(src|node_modules|test|tests|fixtures|\.env[^/]*)(\/|$)|\.test\./;
  const unexpected = metadata.files.filter(
    ({ path }) => !allowed.test(path) || forbidden.test(path),
  );
  if (unexpected.length)
    throw new Error(`Unexpected packed files: ${unexpected.map(({ path }) => path).join(', ')}`);
  const path = resolve(directory, metadata.filename);
  const sha256 = createHash('sha256')
    .update(await readFile(path))
    .digest('hex');
  await writeFile(`${path}.sha256`, `${sha256}  ${metadata.filename}\n`);
  await writeFile(
    resolve(directory, 'release.json'),
    JSON.stringify(
      {
        filename: metadata.filename,
        sha256,
        integrity: metadata.integrity,
        size: metadata.size,
        files: metadata.files.length,
      },
      null,
      2,
    ) + '\n',
  );
  return { ...metadata, path, sha256 };
}
