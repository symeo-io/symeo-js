import fsExtra from 'fs-extra';
import { join } from 'path';
import { CONFIG_VALUES_FILE_ENV_VARIABLE_NAME } from '../cli';

export async function generateIndex(path: string) {
  const indexOutputPath = join(path, './index.ts');
  const index = `
    import YAML from 'yamljs';
    import { Config } from './types';

    // @ts-ignore    
    const configFilePath = process.env.${CONFIG_VALUES_FILE_ENV_VARIABLE_NAME}
    export const config: Config = YAML.load(configFilePath) as Config;
  `;

  await fsExtra.writeFile(indexOutputPath, index);
}
