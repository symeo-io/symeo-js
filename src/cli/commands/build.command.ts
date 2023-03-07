import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { DEFAULT_CONTRACT_PATH } from './command.constants';
import { BuildAction } from '../actions/build.action';

export class BuildCommand extends AbstractCommand<BuildAction> {
  public load(program: Command): void {
    program
      .command('build')
      .option(
        '-c, --contract-file <file>',
        'Configuration contract file',
        DEFAULT_CONTRACT_PATH,
      )
      .option(
        '-r, --force-recreate',
        'Force config creation even if contract is identical',
        false,
      )
      .description('Build Symeo contract types.')
      .action(async (options) => {
        const input = {
          contractPath: options.contractFile,
          forceRecreate: options.forceRecreate,
        };
        await this.action.handle(input);
      });
  }
}
