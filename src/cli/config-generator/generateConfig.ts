import mkdirp from 'mkdirp';
import { ConfigurationContract } from '../types';
import fsExtra from 'fs-extra';
import { generateTypesFile } from './generateTypes';
import { transpileClient } from './transpileConfig';
import { dir } from 'tmp-promise';
import checksum from 'checksum';
import { join } from 'path';

export const OUTPUT_PATH = join(__dirname, '../../config');
export const CHECKSUM_PATH = join(OUTPUT_PATH, './checksum');
export async function generateConfigLibrary(
  configFormat: ConfigurationContract,
  forceRecreate = false,
) {
  const configChecksum = checksum(JSON.stringify(configFormat));

  if (forceRecreate || shouldRegenerateConfigLibrary(configChecksum)) {
    await mkdirp(OUTPUT_PATH);

    const randomTmpDir = await tmpDir('symeo');

    await generateTypesFile(randomTmpDir, configFormat);
    await transpileClient(randomTmpDir, OUTPUT_PATH);
    fsExtra.writeFileSync(CHECKSUM_PATH, configChecksum, 'utf8');
  }
}

function shouldRegenerateConfigLibrary(configChecksum: string) {
  return (
    !fsExtra.existsSync(CHECKSUM_PATH) ||
    fsExtra.readFileSync(CHECKSUM_PATH, 'utf8') !== configChecksum
  );
}

async function tmpDir(prefix: string) {
  const { path } = await dir({ prefix });
  return path;
}
