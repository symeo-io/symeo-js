import { Contract, ContractProperty } from '../contract/contract.types';
import { join } from 'path';
import fsExtra from 'fs-extra';
import { isContractProperty } from '../contract/contract.utils';

export class ContractTypesFileGenerator {
  public static async generateTypesFile(path: string, contract: Contract) {
    const typesOutputPath = join(path, './types.ts');

    const types = `export type Config = ${this.contractToTypeScriptType(
      contract,
    )};`;

    await fsExtra.writeFile(typesOutputPath, types);
  }

  private static contractToTypeScriptType(contract: Contract): string {
    let result = '{\n';

    Object.keys(contract).forEach((propertyName) => {
      const property = contract[propertyName];
      const propertyTypeName = this.generatePropertyTypeName(
        propertyName,
        contract,
      );

      const body = isContractProperty(property)
        ? this.contractPropertyToTypeScriptType(property as ContractProperty)
        : this.contractToTypeScriptType(property as Contract);

      result += `${propertyTypeName}: ${body};\n`;
    });

    result += '}\n';

    return result;
  }

  private static generatePropertyTypeName(
    propertyName: string,
    contract: Contract,
  ) {
    const property = contract[propertyName];
    if (!isContractProperty(property)) {
      return `"${propertyName}"`;
    }

    return `"${propertyName}"${property.optional ? '?' : ''}`;
  }

  private static contractPropertyToTypeScriptType(property: ContractProperty) {
    switch (property.type) {
      case 'boolean':
        return 'boolean';
      case 'string':
        return 'string';
      case 'float':
      case 'integer':
        return 'number';
    }
  }
}
