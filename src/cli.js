"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const parseArgs_js_1 = require("./parseArgs.js");
const loadConfigFormatFile_js_1 = require("./config/loadConfigFormatFile.js");
const loadLocalConfigFile_js_1 = require("./config/loadLocalConfigFile.js");
const generateConfig_js_1 = require("./config/generateConfig.js");
async function main() {
    const cwd = process.cwd();
    try {
        const cliArgs = (0, parseArgs_js_1.parseArgs)({ argv: process.argv, cwd });
        const configFormat = (0, loadConfigFormatFile_js_1.loadConfigFormatFile)(cliArgs.configFormatPath);
        console.log(`Loaded config format from ${chalk_1.default.green(cliArgs.configFormatPath)}`);
        if (!cliArgs.envKey) {
            const config = (0, loadLocalConfigFile_js_1.loadLocalConfigFile)(cliArgs.envFilePath);
            await spin('Generating config', (0, generateConfig_js_1.generateConfigFromLocalFile)(configFormat, config));
        }
    }
    catch (error) {
        // console.log(chalk.red((error as Error).message));
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