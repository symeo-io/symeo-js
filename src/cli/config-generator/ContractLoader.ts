import YAML from 'yamljs';
import { ConfigurationContract } from '../ConfigurationContract';
import fs from 'fs';

export class ContractLoader {
  public loadContractFile(path: string): ConfigurationContract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing configuration contract file at ' + path);
    }

    return YAML.load(path) as ConfigurationContract;
  }
}
