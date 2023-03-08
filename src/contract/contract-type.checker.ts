import { Contract, ContractProperty } from './contract.types';
import { ContractUtils } from './contract.utils';

export class ContractTypeChecker {
  constructor(private readonly contractUtils: ContractUtils) {}

  public checkContractTypeCompatibility(
    contract: Contract,
    values: any,
    parentPath?: string,
  ): string[] {
    const errors: string[] = [];
    Object.keys(contract).forEach((propertyName) => {
      const contractProperty = contract[propertyName];
      const valuesProperty = (values as any)[propertyName];

      if (
        !this.contractUtils.isContractProperty(contractProperty) &&
        this.isUndefined(valuesProperty)
      ) {
        errors.push(this.buildMissingPropertyError(propertyName, parentPath));
        return;
      }

      if (
        !this.contractUtils.isContractProperty(contractProperty) &&
        this.isDefined(valuesProperty)
      ) {
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
        this.isUndefined(valuesProperty) &&
        !this.contractUtils.isContractPropertyOptional(
          contractProperty as ContractProperty,
        )
      ) {
        errors.push(this.buildMissingPropertyError(propertyName, parentPath));
        return;
      }

      if (
        this.isDefined(valuesProperty) &&
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

  private contractPropertyAndValueHaveSameType(
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

  private buildMissingPropertyError(
    propertyName: string,
    parentPath: string | undefined,
  ): string {
    const displayedPropertyName = this.buildParentPath(
      parentPath,
      propertyName,
    );
    return `The property "${displayedPropertyName}" of your configuration contract is missing in your configuration values.`;
  }

  private buildWrongTypeError(
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

  private buildParentPath(
    previousParentPath: string | undefined,
    propertyName: string,
  ) {
    return previousParentPath !== undefined
      ? previousParentPath + '.' + propertyName
      : propertyName;
  }

  private isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }

  private isUndefined(value: any): boolean {
    return !this.isDefined(value);
  }
}
