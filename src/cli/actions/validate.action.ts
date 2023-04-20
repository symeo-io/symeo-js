import chalk from 'chalk';
import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { SdkGenerator } from '../../sdk/sdk.generator';
import { RawValuesFetcher } from '../../values/raw-values.fetcher';
import { ValuesInitializer } from '../../values/values.initializer';
import { ContractTypeChecker } from '../../contract/contract-type.checker';
import { ContractUtils } from '../../contract/contract.utils';
import { ContractTypesFileGenerator } from '../../sdk/contract-types-file.generator';
import { TypeScriptTranspiler } from '../../sdk/typescript.transpiler';
import { ContractValidator } from '../../contract/contract.validator';

export type StartActionInput = {
  contractPath: string;
  apiUrl: string;
  apiKey?: string;
  localValuesPath: string;
};

export class ValidateAction implements Action<StartActionInput> {
  protected readonly contractUtils = new ContractUtils();
  protected readonly contractValidator = new ContractValidator(
    this.contractUtils,
  );
  protected readonly contractLoader = new ContractLoader(
    this.contractValidator,
  );
  protected readonly contractTypesFileGenerator =
    new ContractTypesFileGenerator(this.contractUtils);
  protected readonly typeScriptTranspiler = new TypeScriptTranspiler();
  protected readonly contractTypesGenerator = new SdkGenerator(
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
    apiKey,
    apiUrl,
    localValuesPath,
  }: StartActionInput): Promise<void> {
    const contract = this.contractLoader.loadContractFile(contractPath);
    console.log(
      `Loaded configuration contract from ${chalk.green(contractPath)}`,
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
