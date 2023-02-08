import { ConfigurationContract, ConfigurationProperty } from '../types';
import { join } from 'path';
import fsExtra from 'fs-extra';

export async function generateTypes(
  path: string,
  configFormat: ConfigurationContract,
) {
  const typesOutputPath = join(path, './types.ts');

  const types = `export type Config = ${configFormatToTypeScriptType(
    configFormat,
  )};`;

  await fsExtra.writeFile(typesOutputPath, types);
}

function configFormatToTypeScriptType(contract: ConfigurationContract): string {
  let result = '{\n';

  Object.keys(contract).forEach((propertyName) => {
    const property = contract[propertyName];
    const propertyTypeName = generatePropertyTypeName(propertyName, contract);

    const body = isConfigProperty(property)
      ? configPropertyToTypeScriptType(property as ConfigurationProperty)
      : configFormatToTypeScriptType(property as ConfigurationContract);

    result += `${propertyTypeName}: ${body};\n`;
  });

  result += '}\n';

  return result;
}

function generatePropertyTypeName(
  propertyName: string,
  contract: ConfigurationContract,
) {
  const property = contract[propertyName];
  if (!isConfigProperty(property)) {
    return `"${propertyName}"`;
  }

  return `"${propertyName}"${property.optional ? '?' : ''}`;
}

function configPropertyToTypeScriptType(configProperty: ConfigurationProperty) {
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

function isConfigProperty(el: ConfigurationContract | ConfigurationProperty) {
  return el.type && typeof el.type === 'string';
}
