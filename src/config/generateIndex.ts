import { Config } from '../types';
import fsExtra from 'fs-extra';
import { join } from 'path';

export async function generateIndex(path: string, config: Config) {
  const indexOutputPath = join(path, './index.ts');
  const index = `
    import { Config } from './types';
    export const config: Config = ${configToTypeScript(config)};
  `;

  await fsExtra.writeFile(indexOutputPath, index);
}

function configToTypeScript(config: Config): string {
  return `{
    ${Object.keys(config).map(
      (property) =>
        `${property}: ${
          typeof config[property] === 'object'
            ? configToTypeScript(config[property] as Config)
            : JSON.stringify(config[property])
        }`,
    )}
  }`;
}
