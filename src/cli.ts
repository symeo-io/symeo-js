#! /usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import { parseArgs } from './parseArgs';
import { loadConfigFormatFile } from './config/loadConfigFormatFile';
import { loadLocalConfigFile } from './config/loadLocalConfigFile';
import { generateConfigFromLocalFile } from './config/generateConfig';

export async function main() {
  const cwd = process.cwd();

  try {
    const cliArgs = parseArgs({ argv: process.argv, cwd });

    const configFormat = loadConfigFormatFile(cliArgs.configFormatPath);
    console.log(
      `Loaded config format from ${chalk.green(cliArgs.configFormatPath)}`,
    );

    if (!cliArgs.envKey) {
      const config = loadLocalConfigFile(cliArgs.envFilePath);
      await spin(
        'Generating config',
        generateConfigFromLocalFile(configFormat, config),
      );
    } else {
      // TODO fetch config from Saas
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
