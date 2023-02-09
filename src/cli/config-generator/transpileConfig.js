"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileClient = void 0;
const path_1 = require("path");
const tsc = __importStar(require("typescript"));
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const glob = (0, util_1.promisify)(glob_1.default);
async function transpileClient(configPath, outputPath) {
    const tsFiles = await glob('**/*.ts', { cwd: configPath, absolute: true });
    await Promise.all(outputs.map(async ({ directory, module }) => {
        const outDir = (0, path_1.resolve)(outputPath, directory);
        const target = tsc.ScriptTarget.ES2019;
        const options = {
            declaration: true,
            target,
            outDir,
            module,
            rootDir: configPath,
            resolveJsonModule: true,
            esModuleInterop: true,
            moduleResolution: tsc.ModuleResolutionKind.NodeJs,
        };
        const host = tsc.createCompilerHost(options);
        host.getCurrentDirectory = () => configPath;
        const program = tsc.createProgram(tsFiles, options, host);
        let diagnostics = tsc.getPreEmitDiagnostics(program);
        // We expect errors of code 2307 — the user does not have to have all
        // dependencies installed during codegen. It will crash in runtime,
        // https://www.typescriptlang.org/docs/handbook/module-resolution.html
        diagnostics = diagnostics.filter((d) => d.code !== 2307);
        if (diagnostics.length) {
            throw new Error(`TypeScript compilation failed.\n${diagnostics
                .map(stringifyDiagnostic)
                .join('\n')}`);
        }
        program.emit();
    }));
}
exports.transpileClient = transpileClient;
const outputs = [{ module: tsc.ModuleKind.CommonJS, directory: './' }];
function stringifyDiagnostic(diagnostic) {
    if (diagnostic.file) {
        const { line, character } = tsc.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        const message = tsc.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${Number(line) + 1},${Number(character) + 1}): ${message}`);
    }
    else {
        console.log(tsc.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
}
//# sourceMappingURL=transpileConfig.js.map