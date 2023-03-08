import { Contract, ContractProperty } from '../contract/contract.types';
import { join } from 'path';
import fsExtra from 'fs-extra';
import { ContractUtils } from '../contract/contract.utils';

export class ContractTypesFileGenerator {
  constructor(private readonly contractUtils: ContractUtils) {}

  public async generateTypesFile(path: string, contract: Contract) {
    const typesOutputPath = join(path, './types.ts');

    const types = `export type Config = ${this.contractToTypeScriptType(
      contract,
    )};`;

    await fsExtra.writeFile(typesOutputPath, types);
  }

  private contractToTypeScriptType(contract: Contract): string {
    let result = '{\n';

    Object.keys(contract).forEach((propertyName) => {
      const property = contract[propertyName];
      const propertyTypeName = this.generatePropertyTypeName(
        propertyName,
        contract,
      );

      const body = this.contractUtils.isContractProperty(property)
        ? this.contractPropertyToTypeScriptType(property as ContractProperty)
        : this.contractToTypeScriptType(property as Contract);

      result += `${propertyTypeName}: ${body};\n`;
    });

    result += '}\n';

    return result;
  }

  private generatePropertyTypeName(propertyName: string, contract: Contract) {
    const property = contract[propertyName];
    if (!this.contractUtils.isContractProperty(property)) {
      return `"${propertyName}"`;
    }

    return `"${propertyName}"${property.optional ? '?' : ''}`;
  }

  private contractPropertyToTypeScriptType(property: ContractProperty) {
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
