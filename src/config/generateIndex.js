"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIndex = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const generateConfig_js_1 = require("./generateConfig.js");
async function generateIndex(config) {
    const index = `export const config = ${configToTypeScript(config)};`;
    await fs_extra_1.default.writeFile(generateConfig_js_1.OUTPUT_PATH, index);
}
exports.generateIndex = generateIndex;
function configToTypeScript(config) {
    return `{
    ${Object.keys(config).map((property) => `${property}: ${typeof config[property] === 'object'
        ? configToTypeScript(config[property])
        : JSON.stringify(config[property])}`)}
  }`;
}
//# sourceMappingURL=generateIndex.js.map