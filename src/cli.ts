#! /usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import spawn from 'cross-spawn';
import { parseArgs } from './parseArgs';
import { loadConfigFormatFile } from './config/loadConfigFormatFile';
import { generateConfigLibrary } from './config/generateConfig';

export const LOCAL_CONFIGURATION_FILE_VARIABLE_NAME =
  'SYMEO_LOCAL_CONFIGURATION_FILE';
export const API_KEY_VARIABLE_NAME = 'SYMEO_API_KEY_VARIABLE_NAME';

export async function main() {
  const cwd = process.cwd();

  try {
    const cliArgs = parseArgs({ argv: process.argv, cwd });

    const configFormat = loadConfigFormatFile(
      cliArgs.configurationContractPath,
    );
    console.log(
      `Loaded config format from ${chalk.green(
        cliArgs.configurationContractPath,
      )}`,
    );

    await spin(
      'Generating config',
      generateConfigLibrary(configFormat, cliArgs.forceRecreate),
    );

    const commandEnvVariables: any = {};
    if (!cliArgs.apiKey) {
      commandEnvVariables[LOCAL_CONFIGURATION_FILE_VARIABLE_NAME] =
        cliArgs.localConfigurationPath;
    } else {
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
