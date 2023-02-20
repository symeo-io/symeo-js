#! /usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import spawn from 'cross-spawn';
import { parseArgs } from './parseArgs';
import { ContractLoader } from './config-generator/ContractLoader';
import { ConfigTypesGenerator } from './config-generator/ConfigTypesGenerator';
import { TypeScriptTranspiler } from './config-generator/TypeScriptTranspiler';
import { ConfigLibraryGenerator } from './config-generator/ConfigLibraryGenerator';

export const LOCAL_CONFIGURATION_FILE_VARIABLE_NAME =
  'SYMEO_LOCAL_CONFIGURATION_FILE';
export const CONFIGURATION_CONTRACT_FILE_VARIABLE_NAME =
  'SYMEO_CONFIGURATION_CONTRACT_FILE';
export const API_URL_VARIABLE_NAME = 'SYMEO_API_URL';
export const API_KEY_VARIABLE_NAME = 'SYMEO_API_KEY';

export async function main() {
  const configTypesGenerator: ConfigTypesGenerator = new ConfigTypesGenerator();
  const configTranspiler: TypeScriptTranspiler = new TypeScriptTranspiler();
  const configLibraryGenerator: ConfigLibraryGenerator =
    new ConfigLibraryGenerator(configTypesGenerator, configTranspiler);
  const configContractLoader: ContractLoader = new ContractLoader();

  const cwd = process.cwd();

  try {
    const cliArgs = parseArgs({ argv: process.argv, cwd });

    const contract = configContractLoader.loadContractFile(
      cliArgs.configurationContractPath,
    );
    console.log(
      `Loaded configuration contract from ${chalk.green(
        cliArgs.configurationContractPath,
      )}`,
    );

    await spin(
      'Generating config',
      configLibraryGenerator.generateConfigLibrary(
        contract,
        cliArgs.forceRecreate,
      ),
    );

    const commandEnvVariables: any = {};
    commandEnvVariables[CONFIGURATION_CONTRACT_FILE_VARIABLE_NAME] =
      cliArgs.configurationContractPath;
    if (!cliArgs.apiKey) {
      commandEnvVariables[LOCAL_CONFIGURATION_FILE_VARIABLE_NAME] =
        cliArgs.localConfigurationPath;
    } else {
      commandEnvVariables[API_URL_VARIABLE_NAME] = cliArgs.apiUrl;
      commandEnvVariables[API_KEY_VARIABLE_NAME] = cliArgs.apiKey;
    }

    if (cliArgs.command) {
      spawn(cliArgs.command, cliArgs.commandArgs, {
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
  } catch (error) {
    console.log(chalk.red((error as Error).message));
    process.exit(1);
  }
}

async function spin<T>(text: string, promise: Promise<T>): Promise<T> {
  ora.promise(promise, { text, spinner: 'dots3', color: 'magenta' });
  return await promise;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
