import { ConfigurationContract, ConfigurationProperty } from '../types';
import { join } from 'path';
import fsExtra from 'fs-extra';

export class ConfigTypesGenerator {
  public async generateTypesFile(
    path: string,
    configFormat: ConfigurationContract,
  ) {
    const typesOutputPath = join(path, './types.ts');

    const types = `export type Config = ${this.configFormatToTypeScriptType(
      configFormat,
    )};`;

    await fsExtra.writeFile(typesOutputPath, types);
  }

  private configFormatToTypeScriptType(
    contract: ConfigurationContract,
  ): string {
    let result = '{\n';

    Object.keys(contract).forEach((propertyName) => {
      const property = contract[propertyName];
      const propertyTypeName = this.generatePropertyTypeName(
        propertyName,
        contract,
      );

      const body = this.isConfigProperty(property)
        ? this.configPropertyToTypeScriptType(property as ConfigurationProperty)
        : this.configFormatToTypeScriptType(property as ConfigurationContract);

      result += `${propertyTypeName}: ${body};\n`;
    });

    result += '}\n';

    return result;
  }

  private generatePropertyTypeName(
    propertyName: string,
    contract: ConfigurationContract,
  ) {
    const property = contract[propertyName];
    if (!this.isConfigProperty(property)) {
      return `"${propertyName}"`;
    }

    return `"${propertyName}"${property.optional ? '?' : ''}`;
  }

  private configPropertyToTypeScriptType(
    configProperty: ConfigurationProperty,
  ) {
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

  private isConfigProperty(el: ConfigurationContract | ConfigurationProperty) {
    return el.type && typeof el.type === 'string';
  }
}
