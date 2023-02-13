#! /usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import spawn from 'cross-spawn';
import { parseArgs } from './parseArgs';
import { ConfigContractLoader } from './config-generator/config.contract.loader';
import { ConfigTypesGenerator } from './config-generator/config.types.generator';
import { ConfigTranspiler } from './config-generator/config.transpiler';
import { ConfigLibraryGenerator } from './config-generator/config.library.generator';

export const LOCAL_CONFIGURATION_FILE_VARIABLE_NAME =
  'SYMEO_LOCAL_CONFIGURATION_FILE';
export const CONFIGURATION_CONTRACT_FILE_VARIABLE_NAME =
  'SYMEO_CONFIGURATION_CONTRACT_FILE';
export const API_URL_VARIABLE_NAME = 'SYMEO_API_URL';
export const API_KEY_VARIABLE_NAME = 'SYMEO_API_KEY';

export async function main() {
  const configTypesGenerator: ConfigTypesGenerator = new ConfigTypesGenerator();
  const configTranspiler: ConfigTranspiler = new ConfigTranspiler();
  const configLibraryGenerator: ConfigLibraryGenerator =
    new ConfigLibraryGenerator(configTypesGenerator, configTranspiler);
  const configContractLoader: ConfigContractLoader = new ConfigContractLoader();

  const cwd = process.cwd();

  try {
    const cliArgs = parseArgs({ argv: process.argv, cwd });

    const configFormat = configContractLoader.loadConfigFormatFile(
      cliArgs.configurationContractPath,
    );
    console.log(
      `Loaded config format from ${chalk.green(
        cliArgs.configurationContractPath,
      )}`,
    );

    await spin(
      'Generating config',
      configLibraryGenerator.generateConfigLibrary(
        configFormat,
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
