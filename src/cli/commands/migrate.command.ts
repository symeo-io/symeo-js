import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { DEFAULT_ENV_PATH } from './command.constants';
import { MigrateAction } from '../actions/migrate.action';

export class MigrateCommand extends AbstractCommand<MigrateAction> {
  public load(program: Command): void {
    program
      .command('migrate')
      .option('-e, --env-file <file>', '.env file', DEFAULT_ENV_PATH)
      .option('-s, --src <folder>', 'Source code folder to migrate')
      .description('Build Symeo contract types.')
      .action(async (options) => {
        const input = {
          envFilePath: options.envFile,
          srcPath: options.src,
        };
        await this.action.handle(input);
      });
  }
}
