import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { spin } from '../ui/spin';
import { SdkGenerator } from '../../sdk/sdk.generator';
import chalk from 'chalk';
import { ContractTypesFileGenerator } from '../../sdk/contract-types-file.generator';
import { TypeScriptTranspiler } from '../../sdk/typescript.transpiler';
import { ContractUtils } from '../../contract/contract.utils';
import { ContractValidator } from '../../contract/contract.validator';

export type BuildActionInput = {
  contractPath: string;
  forceRecreate: boolean;
};

export class BuildAction implements Action<BuildActionInput> {
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

  async handle({
    contractPath,
    forceRecreate,
  }: BuildActionInput): Promise<void> {
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
  }
}
