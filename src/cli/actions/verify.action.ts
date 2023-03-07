import chalk from 'chalk';
import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { spin } from '../ui/spin';
import { ContractTypesGenerator } from '../../contract-type-generator/contract-types.generator';
import { RawValuesFetcher } from '../../values/raw-values.fetcher';
import { ValuesInitializer } from '../../values/values.initializer';
import { ContractTypeChecker } from '../../contract/contract-type.checker';

export type StartActionInput = {
  contractPath: string;
  forceRecreate: boolean;
  apiUrl: string;
  apiKey?: string;
  localValuesPath: string;
};

export class VerifyAction implements Action<StartActionInput> {
  async handle({
    contractPath,
    forceRecreate,
    apiKey,
    apiUrl,
    localValuesPath,
  }: StartActionInput): Promise<void> {
    const contract = ContractLoader.loadContractFile(contractPath);
    console.log(
      `Loaded configuration contract from ${chalk.green(contractPath)}`,
    );
    await spin(
      'Generating config',
      ContractTypesGenerator.generateContractTypes(contract, forceRecreate),
    );

    let rawValues: any;
    if (apiUrl && apiKey) {
      rawValues = RawValuesFetcher.fetchFromApi(apiUrl, apiKey);
    } else if (localValuesPath) {
      rawValues = RawValuesFetcher.fetchFromFile(localValuesPath);
    }

    const values = ValuesInitializer.initializeValues(contract, rawValues);

    const errors = ContractTypeChecker.checkContractTypeCompatibility(
      contract,
      values,
    );

    if (errors.length > 0) {
      errors.forEach((error) => console.error(chalk.red(error)));
      process.exit(1);
    }
    console.log(chalk.green('Configuration values matching contract'));
  }
}
