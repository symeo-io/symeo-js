import YAML from 'yamljs';
import { ConfigFormat } from '../types';
import fs from 'fs';

export function loadConfigFormatFile(path: string): ConfigFormat {
  if (!fs.existsSync(path)) {
    throw new Error('Missing config format file at ' + path);
  }

  return YAML.load(path) as ConfigFormat;
}
