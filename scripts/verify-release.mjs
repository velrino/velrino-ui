import { readFile } from 'node:fs/promises';

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
if (process.env.RELEASE_TAG !== `v${version}`) {
  throw new Error('The release tag must match package.json exactly.');
}
