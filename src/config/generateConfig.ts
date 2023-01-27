import mkdirp from 'mkdirp';
import { Config, ConfigFormat } from '../types';
import { join } from 'path';
import fsExtra from 'fs-extra';
import { generateTypes } from './generateTypes';
import { generateIndex } from './generateIndex';
import { transpileClient } from './transpileConfig';
import { dir } from 'tmp-promise';

export const OUTPUT_PATH = './node_modules/symeo/config';
export async function generateConfigFromLocalFile(
  configFormat: ConfigFormat,
  config: Config,
) {
  await mkdirp(OUTPUT_PATH);
  const randomTmpDir = await tmpDir('symeo');

  await copyStaticFiles(OUTPUT_PATH);
  await generateTsClient(randomTmpDir, configFormat, config);
  await transpileClient(randomTmpDir, OUTPUT_PATH);
}

async function copyStaticFiles(path: string) {
  const staticDir = join(__dirname, '../../static');
  const dir = await fsExtra.readdir(staticDir);

  await Promise.all(
    dir.map((file) => fsExtra.copy(join(staticDir, file), join(path, file))),
  );
}

async function generateTsClient(
  path: string,
  configFormat: ConfigFormat,
  config: Config,
) {
  await generateTypes(path, configFormat);
  await generateIndex(path, config);
}

async function tmpDir(prefix: string) {
  const { path } = await dir({ prefix });
  return path;
}
