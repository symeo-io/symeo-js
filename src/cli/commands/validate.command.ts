import { Command } from 'commander';
import { isAbsolute, join } from 'path';
import { AbstractCommand } from './abstract.command';
import {
  DEFAULT_API_URL,
  DEFAULT_CONTRACT_PATH,
  DEFAULT_LOCAL_VALUES_PATH,
} from './command.constants';
import { ValidateAction } from '../actions/validate.action';

export class ValidateCommand extends AbstractCommand<ValidateAction> {
  public load(program: Command): void {
    program
      .command('validate')
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
      .option('-k, --api-key <key>', 'API Key')
      .option(
        '-a, --api-url <url>',
        'Api endpoint used to fetch configuration',
        DEFAULT_API_URL,
      )
      .option(
        '-f, --values-file <file>',
        'Local configuration file',
        DEFAULT_LOCAL_VALUES_PATH,
      )
      .description('Build Symeo contract types.')
      .action(async (options) => {
        const input = {
          contractPath: options.contractFile,
          forceRecreate: options.forceRecreate,
          localValuesPath: this.joinPaths({
            cwd: process.cwd(),
            path: options.valuesFile,
          }),
          apiUrl: options.apiUrl,
          apiKey: options.apiKey,
        };
        await this.action.handle(input);
      });
  }

  private joinPaths({ path, cwd }: { path: string; cwd: string }) {
    const absolutePath = isAbsolute(path) ? path : join(cwd, path);
    return absolutePath.replace(/\\/g, '/');
  }
}
