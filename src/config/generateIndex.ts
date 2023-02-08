import fsExtra from 'fs-extra';
import { join } from 'path';
import {
  API_KEY_VARIABLE_NAME,
  LOCAL_CONFIGURATION_FILE_VARIABLE_NAME,
} from '../cli';

export async function generateIndex(path: string) {
  const indexOutputPath = join(path, './index.ts');

  // TODO check file respect config format
  const index = `
    import YAML from 'yamljs';
    import { Config } from './types';
    import fetch from 'sync-fetch';

    let config: Config;
    // @ts-ignore
    const apiKey = process.env.${API_KEY_VARIABLE_NAME};
    // @ts-ignore
    const localConfigFilePath = process.env.${LOCAL_CONFIGURATION_FILE_VARIABLE_NAME};
    
    if (apiKey) {
      const response = fetch('http://localhost:9999/api/v1/values', {
        headers: {
          'X-API-KEY': apiKey
        }
      }).json();
      
      config = response.values;
    } else if (localConfigFilePath) {
      config = YAML.load(localConfigFilePath) as Config;    
    } else {
      console.error('Missing api key or local configuration file. Are you sure you wrapped you command with symeo cli? E.g symeo -- node index.js');
      // @ts-ignore
      process.exit(1);
    }
    
    export { config };
  `;

  await fsExtra.writeFile(indexOutputPath, index);
}
