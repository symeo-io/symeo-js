#! /usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import spawn from 'cross-spawn';
import { parseArgs } from './parseArgs';
import { loadConfigFormatFile } from './config/loadConfigFormatFile';
import { generateConfigLibrary } from './config/generateConfig';

export const CONFIG_VALUES_FILE_ENV_VARIABLE_NAME = 'SYMEO_CONFIG_FILE';

export async function main() {
  const cwd = process.cwd();

  try {
    const cliArgs = parseArgs({ argv: process.argv, cwd });

    const configFormat = loadConfigFormatFile(cliArgs.configFormatPath);
    console.log(
      `Loaded config format from ${chalk.green(cliArgs.configFormatPath)}`,
    );

    await spin('Generating config', generateConfigLibrary(configFormat));

    let configFilePath;
    if (!cliArgs.envKey) {
      configFilePath = cliArgs.envFilePath;
    } else {
      // TODO fetch config from Saas
    }
    // TODO check file respect config format

    if (cliArgs.command) {
      spawn(cliArgs.command, cliArgs.commandArgs, {
        stdio: 'inherit',
        env: {
          ...process.env,
          [CONFIG_VALUES_FILE_ENV_VARIABLE_NAME]: configFilePath,
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
