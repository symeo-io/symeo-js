import YAML from 'yamljs';
import { Contract } from './contract.types';
import fs from 'fs';
import { ContractValidator } from './contract.validator';

export class ContractLoader {
  private readonly contractValidator: ContractValidator;

  constructor(contractValidator: ContractValidator) {
    this.contractValidator = contractValidator;
  }

  public loadContractFile(path: string): Contract {
    if (!fs.existsSync(path)) {
      throw new Error('Missing configuration contract file at ' + path);
    }

    try {
      const contract = YAML.load(path);

      const contractErrors = this.contractValidator.validateFormat(contract);

      if (contractErrors.length > 0) {
        throw new Error('\n' + contractErrors.join('\n'));
      }

      return contract as Contract;
    } catch (e) {
      throw new Error(
        `Error when parsing contract ${path}: ${(e as Error).message}`,
      );
    }
  }
}
