import YAML from 'yamljs';
import { ConfigurationContract } from './contract.types';
import fs from 'fs';

export class ContractLoader {
  public static loadContractFile(path: string): ConfigurationContract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing configuration contract file at ' + path);
    }

    return YAML.load(path) as ConfigurationContract;
  }
}
