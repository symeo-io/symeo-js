import chalk from 'chalk';
import { Command } from 'commander';
import { BuildCommand } from './build.command';
import { StartCommand } from './start.command';
import { VerifyCommand } from './verify.command';
import { ERROR_PREFIX } from '../ui/prefixes';
import { BuildAction } from '../actions/build.action';
import { StartAction } from '../actions/start.action';
import { VerifyAction } from '../actions/verify.action';

export class CommandLoader {
  public static async load(program: Command): Promise<void> {
    new BuildCommand(new BuildAction()).load(program);
    new StartCommand(new StartAction()).load(program);
    new VerifyCommand(new VerifyAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(
        `See ${chalk.red('--help')} for a list of available commands.\n`,
      );
      process.exit(1);
    });
  }
}
