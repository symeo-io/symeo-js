import { Command } from 'commander';
import { isAbsolute, join } from 'path';

const DEFAULT_CONFIGURATION_CONTRACT_PATH = './symeo.config.yml';
const DEFAULT_LOCAL_CONFIGURATION_PATH = './symeo.local.yml';

export interface SymeoCliArgs {
  configurationContractPath: string;
  apiKey?: string;
  localConfigurationPath: string;
  forceRecreate: boolean;
  command: string;
  commandArgs: string[];
}

export function parseArgs({
  argv,
  cwd,
}: {
  argv: string[];
  cwd: string;
}): SymeoCliArgs {
  const program = new Command();
  program.option(
    '-c, --contract-file <file>',
    'Configuration contract file',
    DEFAULT_CONFIGURATION_CONTRACT_PATH,
  );
  program.option('-k, --api-key <key>', 'API Key');
  program.option(
    '-f, --local-file <file>',
    'Local configuration file',
    DEFAULT_LOCAL_CONFIGURATION_PATH,
  );
  program.option(
    '-r, --force-recreate',
    'Force config creation even if contract is identical',
    false,
  );
  program.version('0.0.1');
  program.parse(argv);

  const rawOpts = program.opts();
  const command = program.args[0];
  const commandArgs = program.args.slice(1);

  return {
    configurationContractPath: joinPaths({ cwd, path: rawOpts.contractFile }),
    localConfigurationPath: joinPaths({ cwd, path: rawOpts.localFile }),
    apiKey: rawOpts.apiKey,
    forceRecreate: rawOpts.forceRecreate,
    command,
    commandArgs,
  };
}

function joinPaths({ path, cwd }: { path: string; cwd: string }) {
  const absolutePath = isAbsolute(path) ? path : join(cwd, path);
  return absolutePath.replace(/\\/g, '/');
}
