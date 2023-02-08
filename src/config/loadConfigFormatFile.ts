import YAML from 'yamljs';
import { ConfigurationContract } from '../types';
import fs from 'fs';

export function loadConfigFormatFile(path: string): ConfigurationContract {
  if (!fs.existsSync(path)) {
    throw new Error('Missing config format file at ' + path);
  }

  return YAML.load(path) as ConfigurationContract;
}
