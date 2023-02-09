#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.API_KEY_VARIABLE_NAME = exports.API_URL_VARIABLE_NAME = exports.LOCAL_CONFIGURATION_FILE_VARIABLE_NAME = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const parseArgs_1 = require("./parseArgs");
const loadConfigFormatFile_1 = require("./config-generator/loadConfigFormatFile");
const generateConfig_1 = require("./config-generator/generateConfig");
exports.LOCAL_CONFIGURATION_FILE_VARIABLE_NAME = 'SYMEO_LOCAL_CONFIGURATION_FILE';
exports.API_URL_VARIABLE_NAME = 'SYMEO_API_URL';
exports.API_KEY_VARIABLE_NAME = 'SYMEO_API_KEY';
async function main() {
    const cwd = process.cwd();
    try {
        const cliArgs = (0, parseArgs_1.parseArgs)({ argv: process.argv, cwd });
        const configFormat = (0, loadConfigFormatFile_1.loadConfigFormatFile)(cliArgs.configurationContractPath);
        console.log(`Loaded config format from ${chalk_1.default.green(cliArgs.configurationContractPath)}`);
        await spin('Generating config', (0, generateConfig_1.generateConfigLibrary)(configFormat, cliArgs.forceRecreate));
        const commandEnvVariables = {};
        if (!cliArgs.apiKey) {
            commandEnvVariables[exports.LOCAL_CONFIGURATION_FILE_VARIABLE_NAME] =
                cliArgs.localConfigurationPath;
        }
        else {
            commandEnvVariables[exports.API_URL_VARIABLE_NAME] = cliArgs.apiUrl;
            commandEnvVariables[exports.API_KEY_VARIABLE_NAME] = cliArgs.apiKey;
        }
        if (cliArgs.command) {
            (0, cross_spawn_1.default)(cliArgs.command, cliArgs.commandArgs, {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    ...commandEnvVariables,
                },
            }).on('exit', function (exitCode, signal) {
                if (typeof exitCode === 'number') {
                    process.exit(exitCode);
                }
                else {
                    process.kill(process.pid, signal === null || signal === void 0 ? void 0 : signal.toString());
                }
            });
        }
    }
    catch (error) {
        console.log(chalk_1.default.red(error.message));
        process.exit(1);
    }
}
exports.main = main;
async function spin(text, promise) {
    ora_1.default.promise(promise, { text, spinner: 'dots3', color: 'magenta' });
    return await promise;
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map