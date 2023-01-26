import YAML from 'yamljs';
import { Config } from '../types';
import fs from 'fs';

export function loadLocalConfigFile(path: string): Config {
  if (!fs.existsSync(path)) {
    throw new Error('Missing local config file at ' + path);
  }

  return YAML.load(path) as Config;
}
