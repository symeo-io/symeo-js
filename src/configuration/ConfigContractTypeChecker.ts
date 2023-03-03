import {
  ConfigurationContract,
  ConfigurationProperty,
  isConfigProperty,
  isContractPropertyOptional,
} from './ConfigurationContract';

export class ConfigContractTypeChecker {
  public static checkContractTypeCompatibility(
    configContract: ConfigurationContract,
    config: any,
    parentPath?: string,
  ): string[] {
    const errors: string[] = [];
    Object.keys(configContract).forEach((propertyName) => {
      const contractProperty = configContract[propertyName];
      const valuesProperty = (config as any)[propertyName];

      if (!isConfigProperty(contractProperty) && !valuesProperty) {
        errors.push(this.buildMissingPropertyError(propertyName, parentPath));
        return;
      }

      if (!isConfigProperty(contractProperty) && !!valuesProperty) {
        errors.push(
          ...this.checkContractTypeCompatibility(
            contractProperty as ConfigurationContract,
            valuesProperty,
            this.buildParentPath(parentPath, propertyName),
          ),
        );
        return;
      }

      if (
        valuesProperty === undefined &&
        !isContractPropertyOptional(contractProperty as ConfigurationProperty)
      ) {
        errors.push(this.buildMissingPropertyError(propertyName, parentPath));
        return;
      }

      if (
        valuesProperty !== undefined &&
        !this.contractPropertyAndConfigValueHaveSameType(
          contractProperty as ConfigurationProperty,
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

  private static contractPropertyAndConfigValueHaveSameType(
    contractProperty: ConfigurationProperty,
    configProperty: any,
  ): boolean {
    if (typeof configProperty === 'number') {
      return (
        contractProperty.type === 'float' || contractProperty.type === 'integer'
      );
    }
    return typeof configProperty === contractProperty.type;
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
    configProperty: any,
  ) {
    const displayedPropertyName = this.buildParentPath(
      parentPath,
      propertyName,
    );
    return `Configuration property "${displayedPropertyName}" has type "${typeof configProperty}" while configuration contract defined "${displayedPropertyName}" as "${
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
