import YAML from 'yamljs';
import fs from 'fs';
import { ConfigurationContract } from './ConfigurationContract';

export class ConfigContractLoader {
  public loadConfigFormatFile(path: string): ConfigurationContract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing configuration format file at ' + path);
    }

    return YAML.load(path) as ConfigurationContract;
  }
}
