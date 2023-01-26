import { Command } from 'commander';
import { isAbsolute, join } from 'path';

const DEFAULT_CONFIG_FORMAT_PATH = './symeo.config.yml';
const DEFAULT_LOCAL_CONFIG_PATH = './symeo.local.yml';

export interface SymeoCliArgs {
  configFormatPath: string;
  envKey?: string;
  envFilePath: string;
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
    '-f, --file <file>',
    'Config format file',
    DEFAULT_CONFIG_FORMAT_PATH,
  );
  program.option('-k, --env-key <key>', 'Environment key');
  program.option(
    '-e, --env-file <env>',
    'Environment local file',
    DEFAULT_LOCAL_CONFIG_PATH,
  );
  program.version('0.0.1');
  program.parse(argv);

  const rawOpts = program.opts();

  return {
    configFormatPath: joinPaths({ cwd, path: rawOpts.file }),
    envFilePath: joinPaths({ cwd, path: rawOpts.envFile }),
    envKey: rawOpts.envKey,
  };
}

function joinPaths({ path, cwd }: { path: string; cwd: string }) {
  const absolutePath = isAbsolute(path) ? path : join(cwd, path);
  return absolutePath.replace(/\\/g, '/');
}
