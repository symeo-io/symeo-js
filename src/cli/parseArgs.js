"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = void 0;
const commander_1 = require("commander");
const path_1 = require("path");
const DEFAULT_CONFIGURATION_CONTRACT_PATH = './symeo.config.yml';
const DEFAULT_LOCAL_CONFIGURATION_PATH = './symeo.local.yml';
const DEFAULT_API_URL = 'https://api.symeo.io/api/v1/values';
function parseArgs({ argv, cwd, }) {
    const program = new commander_1.Command();
    program.option('-c, --contract-file <file>', 'Configuration contract file', DEFAULT_CONFIGURATION_CONTRACT_PATH);
    program.option('-k, --api-key <key>', 'API Key');
    program.option('-a, --api-url <url>', 'Api endpoint used to fetch configuration', DEFAULT_API_URL);
    program.option('-f, --local-file <file>', 'Local configuration file', DEFAULT_LOCAL_CONFIGURATION_PATH);
    program.option('-r, --force-recreate', 'Force config creation even if contract is identical', false);
    program.version('0.0.1');
    program.parse(argv);
    const rawOpts = program.opts();
    const command = program.args[0];
    const commandArgs = program.args.slice(1);
    return {
        configurationContractPath: joinPaths({ cwd, path: rawOpts.contractFile }),
        localConfigurationPath: joinPaths({ cwd, path: rawOpts.localFile }),
        apiUrl: rawOpts.apiUrl,
        apiKey: rawOpts.apiKey,
        forceRecreate: rawOpts.forceRecreate,
        command,
        commandArgs,
    };
}
exports.parseArgs = parseArgs;
function joinPaths({ path, cwd }) {
    const absolutePath = (0, path_1.isAbsolute)(path) ? path : (0, path_1.join)(cwd, path);
    return absolutePath.replace(/\\/g, '/');
}
//# sourceMappingURL=parseArgs.js.map