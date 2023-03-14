import YAML from 'yamljs';
import { Contract } from './contract.types';
import fs from 'fs';
import path from 'path';

const DEFAULT_CONTRACT_FILE_NAME = 'symeo.config.yml';

export class ContractWriter {
  public writeContractFile(dest: string, contract: Contract): void {
    return fs.writeFileSync(
      path.join(dest, DEFAULT_CONTRACT_FILE_NAME),
      YAML.stringify(contract, Number.MAX_VALUE, 2),
    );
  }
}
