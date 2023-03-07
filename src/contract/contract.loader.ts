import YAML from 'yamljs';
import { Contract } from './contract.types';
import fs from 'fs';

export class ContractLoader {
  public static loadContractFile(path: string): Contract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing configuration contract file at ' + path);
    }

    return YAML.load(path) as Contract;
  }
}
