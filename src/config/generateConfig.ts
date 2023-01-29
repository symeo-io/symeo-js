import mkdirp from 'mkdirp';
import { ConfigFormat } from '../types';
import { join } from 'path';
import fsExtra from 'fs-extra';
import { generateTypes } from './generateTypes';
import { generateIndex } from './generateIndex';
import { transpileClient } from './transpileConfig';
import { dir } from 'tmp-promise';
import checksum from 'checksum';

export const OUTPUT_PATH = './node_modules/symeo/config';
export const CHECKSUM_PATH = OUTPUT_PATH + '/checksum';
export async function generateConfigLibrary(configFormat: ConfigFormat) {
  const configChecksum = checksum(JSON.stringify(configFormat));

  if (shouldRegenerateConfigLibrary(configChecksum)) {
    await mkdirp(OUTPUT_PATH);
    fsExtra.writeFileSync(CHECKSUM_PATH, configChecksum, 'utf8');

    const randomTmpDir = await tmpDir('symeo');

    await copyStaticFiles(OUTPUT_PATH);
    await generateTsClient(randomTmpDir, configFormat);
    await transpileClient(randomTmpDir, OUTPUT_PATH);
  }
}

function shouldRegenerateConfigLibrary(configChecksum: string) {
  return (
    !fsExtra.existsSync(CHECKSUM_PATH) ||
    fsExtra.readFileSync(CHECKSUM_PATH, 'utf8') !== configChecksum
  );
}

async function copyStaticFiles(path: string) {
  const staticDir = join(__dirname, '../../static');
  const dir = await fsExtra.readdir(staticDir);

  await Promise.all(
    dir.map((file) => fsExtra.copy(join(staticDir, file), join(path, file))),
  );
}

async function generateTsClient(path: string, configFormat: ConfigFormat) {
  await generateTypes(path, configFormat);
  await generateIndex(path);
}

async function tmpDir(prefix: string) {
  const { path } = await dir({ prefix });
  return path;
}
