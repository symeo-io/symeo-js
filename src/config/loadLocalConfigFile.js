"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLocalConfigFile = void 0;
const yamljs_1 = __importDefault(require("yamljs"));
const fs_1 = __importDefault(require("fs"));
function loadLocalConfigFile(path) {
    if (!fs_1.default.existsSync(path)) {
        throw new Error('Missing local config file at ' + path);
    }
    return yamljs_1.default.load(path);
}
exports.loadLocalConfigFile = loadLocalConfigFile;
//# sourceMappingURL=loadLocalConfigFile.js.map