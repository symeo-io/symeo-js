import { ConfigFormat, ConfigProperty } from '../types';
import { join } from 'path';
import fsExtra from 'fs-extra';

export async function generateTypes(path: string, configFormat: ConfigFormat) {
  const typesOutputPath = join(path, './types.ts');

  const types = `export type Config = ${configFormatToTypeScriptType(
    configFormat,
  )};`;

  await fsExtra.writeFile(typesOutputPath, types);
}

function configFormatToTypeScriptType(configFormat: ConfigFormat): string {
  return `{
    ${Object.keys(configFormat).map(
      (property) =>
        `${property}: ${
          isConfigProperty(configFormat[property])
            ? configPropertyToTypeScriptType(
                configFormat[property] as ConfigProperty,
              )
            : configFormatToTypeScriptType(
                configFormat[property] as ConfigFormat,
              )
        }`,
    )}
  }`;
}

function configPropertyToTypeScriptType(configProperty: ConfigProperty) {
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

function isConfigProperty(el: ConfigFormat | ConfigProperty) {
  return el.type && typeof el.type === 'string';
}
