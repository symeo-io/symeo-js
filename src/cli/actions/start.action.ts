import chalk from 'chalk';
import spawn from 'cross-spawn';
import { Action } from './action';
import { ContractLoader } from '../../contract/contract.loader';
import { spin } from '../ui/spin';
import { ContractTypesGenerator } from '../../contract-type-generator/contract-types.generator';
import {
  API_KEY_VARIABLE_NAME,
  API_URL_VARIABLE_NAME,
  CONTRACT_FILE_VARIABLE_NAME,
  LOCAL_VALUES_FILE_VARIABLE_NAME,
} from './action.contants';
import { ContractUtils } from '../../contract/contract.utils';
import { ContractTypesFileGenerator } from '../../contract-type-generator/contract-types-file.generator';
import { TypeScriptTranspiler } from '../../contract-type-generator/typescript.transpiler';

export type StartActionInput = {
  contractPath: string;
  forceRecreate: boolean;
  apiUrl: string;
  apiKey?: string;
  localValuesPath: string;
  command: string;
  commandArgs: string[];
};

export class StartAction implements Action<StartActionInput> {
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
    apiKey,
    apiUrl,
    localValuesPath,
    command,
    commandArgs,
  }: StartActionInput): Promise<void> {
    if (!command) {
      throw new Error(
        'Missing start command. e.g: symeo-js start -- node index.js',
      );
    }

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

    const commandEnvVariables = {
      [CONTRACT_FILE_VARIABLE_NAME]: contractPath,
      [LOCAL_VALUES_FILE_VARIABLE_NAME]: !apiKey ? localValuesPath : undefined,
      [API_URL_VARIABLE_NAME]: apiKey ? apiUrl : undefined,
      [API_KEY_VARIABLE_NAME]: apiKey ? apiKey : undefined,
    };

    spawn(command, commandArgs, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...commandEnvVariables,
      },
    }).on('exit', function (exitCode, signal) {
      if (typeof exitCode === 'number') {
        process.exit(exitCode);
      } else {
        process.kill(process.pid, signal?.toString());
      }
    });
  }
}
