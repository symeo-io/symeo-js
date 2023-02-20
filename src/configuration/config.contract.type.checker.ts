import { Config } from './types';
import {
  ConfigurationContract,
  ConfigurationProperty,
} from './config.contract';
import { ConfigContractLoader } from './config.contract.loader';

export class ConfigContractTypeChecker {
  constructor(private configContractLoader: ConfigContractLoader) {}

  public checkContractTypeCompatibility(
    configContractPath: string,
    config: Config,
  ): string[] {
    const configContract =
      this.configContractLoader.loadConfigFormatFile(configContractPath);
    return this.compareConfigContractAndConfigValuesTypes(
      configContract,
      config,
    );
  }

  private compareConfigContractAndConfigValuesTypes(
    configContract: ConfigurationContract,
    config: Config,
  ): string[] {
    const errors: string[] = [];
    Object.keys(configContract).forEach((propertyName) => {
      const contractProperty = configContract[propertyName];
      const valuesProperty = (config as any)[propertyName];

      if (!this.isConfigProperty(contractProperty) && !valuesProperty) {
        errors.push(this.buildMissingPropertyError(propertyName));
        return;
      }

      if (!this.isConfigProperty(contractProperty) && !!valuesProperty) {
        errors.push(
          ...this.compareConfigContractAndConfigValuesTypes(
            contractProperty as ConfigurationContract,
            valuesProperty,
          ),
        );
        return;
      }

      if (
        valuesProperty === undefined &&
        !this.isContractPropertyOptional(
          contractProperty as ConfigurationProperty,
        )
      ) {
        errors.push(this.buildMissingPropertyError(propertyName));
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
            contractProperty,
            valuesProperty,
          ),
        );
      }
    });

    return errors;
  }

  private contractPropertyAndConfigValueHaveSameType(
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

  private isContractPropertyOptional(contractProperty: ConfigurationProperty) {
    return contractProperty.optional === true;
  }

  private isConfigProperty(el: ConfigurationContract | ConfigurationProperty) {
    return el.type && typeof el.type === 'string';
  }

  private buildMissingPropertyError(propertyName: string): string {
    return `The property "${propertyName}" of your configuration contract is missing in your configuration values.`;
  }

  private buildWrongTypeError(
    propertyName: string,
    contractProperty: any,
    configProperty: any,
  ) {
    return `Configuration property "${propertyName}" has type "${typeof configProperty}" while configuration contract defined "${propertyName}" as "${
      contractProperty.type
    }".`;
  }
}
