import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { spin } from '../ui/spin';
import { ContractTypesGenerator } from '../../contract-type-generator/contract-types.generator';
import chalk from 'chalk';
import { ContractTypesFileGenerator } from '../../contract-type-generator/contract-types-file.generator';
import { TypeScriptTranspiler } from '../../contract-type-generator/typescript.transpiler';
import { ContractUtils } from '../../contract/contract.utils';

export type BuildActionInput = {
  contractPath: string;
  forceRecreate: boolean;
};

export class BuildAction implements Action<BuildActionInput> {
  protected readonly contractLoader = new ContractLoader();
  protected readonly contractUtils = new ContractUtils();
  protected readonly contractTypesFileGenerator =
    new ContractTypesFileGenerator(this.contractUtils);
  protected readonly typeScriptTranspiler = new TypeScriptTranspiler();
  protected readonly contractTypesGenerator = new ContractTypesGenerator(
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
