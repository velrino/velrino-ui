import { packPackage } from './package-utils.mjs';

const artifact = await packPackage();
process.stdout.write(
  JSON.stringify(
    {
      filename: artifact.filename,
      aliasFilename: artifact.aliasFilename,
      sha256: artifact.sha256,
      size: artifact.size,
      files: artifact.files.length,
    },
    null,
    2,
  ) + '\n',
);
