#! /usr/bin/env node
import { Command } from 'commander';
import { CommandLoader } from './cli/commands/command.loader';
import { ERROR_PREFIX } from './cli/ui/prefixes';
import chalk from 'chalk';

const bootstrap = async () => {
  const program = new Command();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { version } = await import('../package.json');
  program
    .version(version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  await CommandLoader.load(program);
  await program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap().catch((error) => {
  console.error(`${ERROR_PREFIX}: ${chalk.red(error)}`);
  process.exit(1);
});
