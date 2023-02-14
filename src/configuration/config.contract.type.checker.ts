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
  ) {
    const configContract =
      this.configContractLoader.loadConfigFormatFile(configContractPath);
    this.compareConfigContractAndConfig(configContract, config);
  }

  private compareConfigContractAndConfig(
    configContract: ConfigurationContract,
    config: Config,
  ) {
    Object.keys(configContract).forEach((propertyName) => {
      const contractProperty = configContract[propertyName];
      const configProperty = config[propertyName];

      if (this.isConfigProperty(contractProperty)) {
        if (!configProperty) {
          if (
            !this.isContractPropertyOptional(
              contractProperty as ConfigurationProperty,
            )
          ) {
            throw new Error(
              `The property ${propertyName} of your configuration contract is missing in your config file.`,
            );
          }
        } else {
          if (
            !this.contractPropertyAndConfigValueHaveSameType(
              contractProperty as ConfigurationProperty,
              configProperty,
            )
          ) {
            throw new Error(
              `Config property ${propertyName} has type '${typeof configProperty}' while configuration contract defined ${propertyName} as ${
                contractProperty.type
              }.`,
            );
          }
        }
      } else {
        if (!configProperty) {
          throw new Error(
            `The property ${propertyName} of your configuration contract is missing in your config file.`,
          );
        }

        this.compareConfigContractAndConfig(
          contractProperty as ConfigurationContract,
          configProperty,
        );
      }
    });
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
}
