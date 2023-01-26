"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypes = void 0;
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
const generateConfig_js_1 = require("./generateConfig.js");
async function generateTypes(configFormat) {
    const typesOutputPath = (0, path_1.join)(generateConfig_js_1.OUTPUT_PATH, './types');
    const types = `export type = ${configFormatToTypeScriptType(configFormat)};`;
    await fs_extra_1.default.writeFile(typesOutputPath, types);
}
exports.generateTypes = generateTypes;
function configFormatToTypeScriptType(configFormat) {
    return `{
    ${Object.keys(configFormat).map((property) => `${property}: ${isConfigProperty(configFormat[property])
        ? configPropertyToTypeScriptType(configFormat[property])
        : configFormatToTypeScriptType(configFormat[property])}`)}
  }`;
}
function configPropertyToTypeScriptType(configProperty) {
    switch (configProperty.type) {
        case 'boolean':
            return 'boolean';
        case 'string':
            return 'string';
        case 'float':
        case 'integer':
            return 'number';
    }
}
function isConfigProperty(el) {
    return el.type && typeof el.type === 'string';
}
//# sourceMappingURL=generateTypes.js.map