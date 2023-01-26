"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = void 0;
const commander_1 = require("commander");
const path_1 = require("path");
const DEFAULT_CONFIG_FORMAT_PATH = './symeo.config.yml';
const DEFAULT_LOCAL_CONFIG_PATH = './symeo.local.yml';
function parseArgs({ argv, cwd, }) {
    const program = new commander_1.Command();
    program.option('-f, --file <file>', 'Config format file', DEFAULT_CONFIG_FORMAT_PATH);
    program.option('-k, --env-key <key>', 'Environment key');
    program.option('-e, --env-file <env>', 'Environment local file', DEFAULT_LOCAL_CONFIG_PATH);
    program.version('0.0.1');
    program.parse(argv);
    const rawOpts = program.opts();
    return {
        configFormatPath: joinPaths({ cwd, path: rawOpts.file }),
        envFilePath: joinPaths({ cwd, path: rawOpts.envFile }),
        envKey: rawOpts.envKey,
    };
}
exports.parseArgs = parseArgs;
function joinPaths({ path, cwd }) {
    const absolutePath = (0, path_1.isAbsolute)(path) ? path : (0, path_1.join)(cwd, path);
    return absolutePath.replace(/\\/g, '/');
}
//# sourceMappingURL=parseArgs.js.map