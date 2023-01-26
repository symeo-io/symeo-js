"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConfigFromLocalFile = exports.OUTPUT_PATH = void 0;
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
const generateTypes_js_1 = require("./generateTypes.js");
const generateIndex_js_1 = require("./generateIndex.js");
exports.OUTPUT_PATH = './node_modules/.symeo/config';
async function generateConfigFromLocalFile(configFormat, config) {
    await (0, mkdirp_1.default)(exports.OUTPUT_PATH);
    await copyStaticFiles();
    await generateTsClient(configFormat, config);
}
exports.generateConfigFromLocalFile = generateConfigFromLocalFile;
async function copyStaticFiles() {
    const staticDir = (0, path_1.join)(__dirname, '../../static');
    const dir = await fs_extra_1.default.readdir(staticDir);
    await Promise.all(dir.map((file) => fs_extra_1.default.copy((0, path_1.join)(staticDir, file), (0, path_1.join)(exports.OUTPUT_PATH, file))));
}
async function generateTsClient(configFormat, config) {
    await (0, generateTypes_js_1.generateTypes)(configFormat);
    await (0, generateIndex_js_1.generateIndex)(config);
}
//# sourceMappingURL=generateConfig.js.map