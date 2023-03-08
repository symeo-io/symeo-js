import chalk from 'chalk';
import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { spin } from '../ui/spin';
import { ContractTypesGenerator } from '../../contract-type-generator/contract-types.generator';
import { RawValuesFetcher } from '../../values/raw-values.fetcher';
import { ValuesInitializer } from '../../values/values.initializer';
import { ContractTypeChecker } from '../../contract/contract-type.checker';
import { ContractUtils } from '../../contract/contract.utils';
import { ContractTypesFileGenerator } from '../../contract-type-generator/contract-types-file.generator';
import { TypeScriptTranspiler } from '../../contract-type-generator/typescript.transpiler';

export type StartActionInput = {
  contractPath: string;
  forceRecreate: boolean;
  apiUrl: string;
  apiKey?: string;
  localValuesPath: string;
};

export class ValidateAction implements Action<StartActionInput> {
  protected readonly contractLoader = new ContractLoader();
  protected readonly contractUtils = new ContractUtils();
  protected readonly contractTypesFileGenerator =
    new ContractTypesFileGenerator(this.contractUtils);
  protected readonly typeScriptTranspiler = new TypeScriptTranspiler();
  protected readonly contractTypesGenerator = new ContractTypesGenerator(
    this.contractTypesFileGenerator,
    this.typeScriptTranspiler,
  );
  protected readonly rawValuesFetcher = new RawValuesFetcher();
  protected readonly valuesInitializer = new ValuesInitializer(
    this.contractUtils,
  );
  protected readonly contractTypeChecker = new ContractTypeChecker(
    this.contractUtils,
  );

  async handle({
    contractPath,
    forceRecreate,
    apiKey,
    apiUrl,
    localValuesPath,
  }: StartActionInput): Promise<void> {
    const contract = this.contractLoader.loadContractFile(contractPath);
    console.log(
      `Loaded configuration contract from ${chalk.green(contractPath)}`,
    );
    await spin(
      'Generating config',
      this.contractTypesGenerator.generateContractTypes(
        contract,
        forceRecreate,
      ),
    );

    let rawValues: any;
    if (apiUrl && apiKey) {
      rawValues = this.rawValuesFetcher.fetchFromApi(apiUrl, apiKey);
    } else if (localValuesPath) {
      rawValues = this.rawValuesFetcher.fetchFromFile(localValuesPath);
    }

    const values = this.valuesInitializer.initializeValues(contract, rawValues);

    const errors = this.contractTypeChecker.checkContractTypeCompatibility(
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
