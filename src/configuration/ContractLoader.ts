import YAML from 'yamljs';
import fs from 'fs';
import { ConfigurationContract } from './ConfigurationContract';

export class ContractLoader {
  public static loadContractFile(path: string): ConfigurationContract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing configuration contract file at ' + path);
    }

    return YAML.load(path) as ConfigurationContract;
  }
}
