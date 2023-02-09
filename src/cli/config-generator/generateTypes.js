"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypesFile = void 0;
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
async function generateTypesFile(path, configFormat) {
    const typesOutputPath = (0, path_1.join)(path, './types.ts');
    const types = `export type Config = ${configFormatToTypeScriptType(configFormat)};`;
    await fs_extra_1.default.writeFile(typesOutputPath, types);
}
exports.generateTypesFile = generateTypesFile;
function configFormatToTypeScriptType(contract) {
    let result = '{\n';
    Object.keys(contract).forEach((propertyName) => {
        const property = contract[propertyName];
        const propertyTypeName = generatePropertyTypeName(propertyName, contract);
        const body = isConfigProperty(property)
            ? configPropertyToTypeScriptType(property)
            : configFormatToTypeScriptType(property);
        result += `${propertyTypeName}: ${body};\n`;
    });
    result += '}\n';
    return result;
}
function generatePropertyTypeName(propertyName, contract) {
    const property = contract[propertyName];
    if (!isConfigProperty(property)) {
        return `"${propertyName}"`;
    }
    return `"${propertyName}"${property.optional ? '?' : ''}`;
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