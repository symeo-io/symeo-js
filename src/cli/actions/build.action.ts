import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { spin } from '../ui/spin';
import { ContractTypesGenerator } from '../../contract-type-generator/contract-types.generator';
import chalk from 'chalk';

export type BuildActionInput = {
  contractPath: string;
  forceRecreate: boolean;
};

export class BuildAction implements Action<BuildActionInput> {
  async handle({
    contractPath,
    forceRecreate,
  }: BuildActionInput): Promise<void> {
    const contract = ContractLoader.loadContractFile(contractPath);
    console.log(
      `Loaded configuration contract from ${chalk.green(contractPath)}`,
    );
    await spin(
      'Generating config',
      ContractTypesGenerator.generateContractTypes(contract, forceRecreate),
    );
  }
}
