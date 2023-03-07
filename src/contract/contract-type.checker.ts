import { Contract, ContractProperty } from './contract.types';
import {
  isContractProperty,
  isContractPropertyOptional,
} from './contract.utils';

export class ContractTypeChecker {
  public static checkContractTypeCompatibility(
    contract: Contract,
    values: any,
    parentPath?: string,
  ): string[] {
    const errors: string[] = [];
    Object.keys(contract).forEach((propertyName) => {
      const contractProperty = contract[propertyName];
      const valuesProperty = (values as any)[propertyName];

      if (!isContractProperty(contractProperty) && !valuesProperty) {
        errors.push(this.buildMissingPropertyError(propertyName, parentPath));
        return;
      }

      if (!isContractProperty(contractProperty) && !!valuesProperty) {
        errors.push(
          ...this.checkContractTypeCompatibility(
            contractProperty as Contract,
            valuesProperty,
            this.buildParentPath(parentPath, propertyName),
          ),
        );
        return;
      }

      if (
        valuesProperty === undefined &&
        !isContractPropertyOptional(contractProperty as ContractProperty)
      ) {
        errors.push(this.buildMissingPropertyError(propertyName, parentPath));
        return;
      }

      if (
        valuesProperty !== undefined &&
        !this.contractPropertyAndValueHaveSameType(
          contractProperty as ContractProperty,
          valuesProperty,
        )
      ) {
        errors.push(
          this.buildWrongTypeError(
            propertyName,
            parentPath,
            contractProperty,
            valuesProperty,
          ),
        );
      }
    });

    return errors;
  }

  private static contractPropertyAndValueHaveSameType(
    contractProperty: ContractProperty,
    valueProperty: any,
  ): boolean {
    if (typeof valueProperty === 'number') {
      return (
        contractProperty.type === 'float' || contractProperty.type === 'integer'
      );
    }
    return typeof valueProperty === contractProperty.type;
  }

  private static buildMissingPropertyError(
    propertyName: string,
    parentPath: string | undefined,
  ): string {
    const displayedPropertyName = this.buildParentPath(
      parentPath,
      propertyName,
    );
    return `The property "${displayedPropertyName}" of your configuration contract is missing in your configuration values.`;
  }

  private static buildWrongTypeError(
    propertyName: string,
    parentPath: string | undefined,
    contractProperty: any,
    valueProperty: any,
  ) {
    const displayedPropertyName = this.buildParentPath(
      parentPath,
      propertyName,
    );
    return `Configuration property "${displayedPropertyName}" has type "${typeof valueProperty}" while configuration contract defined "${displayedPropertyName}" as "${
      contractProperty.type
    }".`;
  }

  private static buildParentPath(
    previousParentPath: string | undefined,
    propertyName: string,
  ) {
    return previousParentPath !== undefined
      ? previousParentPath + '.' + propertyName
      : propertyName;
  }
}
