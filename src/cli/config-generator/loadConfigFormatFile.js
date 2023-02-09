"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfigFormatFile = void 0;
const yamljs_1 = __importDefault(require("yamljs"));
const fs_1 = __importDefault(require("fs"));
function loadConfigFormatFile(path) {
    if (!fs_1.default.existsSync(path)) {
        throw new Error('Missing config format file at ' + path);
    }
    return yamljs_1.default.load(path);
}
exports.loadConfigFormatFile = loadConfigFormatFile;
//# sourceMappingURL=loadConfigFormatFile.js.map