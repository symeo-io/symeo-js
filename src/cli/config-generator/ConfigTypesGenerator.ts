import {
  ConfigurationContract,
  ConfigurationProperty,
} from '../ConfigurationContract';
import { join } from 'path';
import fsExtra from 'fs-extra';

export class ConfigTypesGenerator {
  public async generateTypesFile(
    path: string,
    contract: ConfigurationContract,
  ) {
    const typesOutputPath = join(path, './types.ts');

    const types = `export type Config = ${this.contractToTypeScriptType(
      contract,
    )};`;

    await fsExtra.writeFile(typesOutputPath, types);
  }

  private contractToTypeScriptType(contract: ConfigurationContract): string {
    let result = '{\n';

    Object.keys(contract).forEach((propertyName) => {
      const property = contract[propertyName];
      const propertyTypeName = this.generatePropertyTypeName(
        propertyName,
        contract,
      );

      const body = this.isConfigProperty(property)
        ? this.configPropertyToTypeScriptType(property as ConfigurationProperty)
        : this.contractToTypeScriptType(property as ConfigurationContract);

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
