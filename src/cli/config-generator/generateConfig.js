"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConfigLibrary = exports.CHECKSUM_PATH = exports.OUTPUT_PATH = void 0;
const mkdirp_1 = __importDefault(require("mkdirp"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const generateTypes_1 = require("./generateTypes");
const transpileConfig_1 = require("./transpileConfig");
const tmp_promise_1 = require("tmp-promise");
const checksum_1 = __importDefault(require("checksum"));
exports.OUTPUT_PATH = './config';
exports.CHECKSUM_PATH = exports.OUTPUT_PATH + '/checksum';
async function generateConfigLibrary(configFormat, forceRecreate = false) {
    const configChecksum = (0, checksum_1.default)(JSON.stringify(configFormat));
    if (forceRecreate || shouldRegenerateConfigLibrary(configChecksum)) {
        await (0, mkdirp_1.default)(exports.OUTPUT_PATH);
        const randomTmpDir = await tmpDir('symeo');
        await (0, generateTypes_1.generateTypesFile)(randomTmpDir, configFormat);
        await (0, transpileConfig_1.transpileClient)(randomTmpDir, exports.OUTPUT_PATH);
        fs_extra_1.default.writeFileSync(exports.CHECKSUM_PATH, configChecksum, 'utf8');
    }
}
exports.generateConfigLibrary = generateConfigLibrary;
function shouldRegenerateConfigLibrary(configChecksum) {
    return (!fs_extra_1.default.existsSync(exports.CHECKSUM_PATH) ||
        fs_extra_1.default.readFileSync(exports.CHECKSUM_PATH, 'utf8') !== configChecksum);
}
async function tmpDir(prefix) {
    const { path } = await (0, tmp_promise_1.dir)({ prefix });
    return path;
}
//# sourceMappingURL=generateConfig.js.map