import YAML from 'yamljs';
import fs from 'fs';
import { ConfigurationContract } from './config.contract';

export class ConfigContractLoader {
  public loadConfigFormatFile(path: string): ConfigurationContract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing config format file at ' + path);
    }

    return YAML.load(path) as ConfigurationContract;
  }
}
