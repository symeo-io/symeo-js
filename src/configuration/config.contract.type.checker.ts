import { Config } from './types';
import {
  ConfigurationContract,
  ConfigurationProperty,
} from './config.contract';
import { ConfigContractLoader } from './config.contract.loader';
import { ConfigContractTypeCheckerError } from './config.contract.type.checker.error';

export class ConfigContractTypeChecker {
  constructor(
    private configContractLoader: ConfigContractLoader,
    private configContractTypeCheckerError: ConfigContractTypeCheckerError,
  ) {}

  public checkContractTypeCompatibility(
    configContractPath: string,
    config: Config,
  ) {
    const configContract =
      this.configContractLoader.loadConfigFormatFile(configContractPath);
    this.compareConfigContractAndConfigValuesTypes(configContract, config);
  }

  private compareConfigContractAndConfigValuesTypes(
    configContract: ConfigurationContract,
    config: Config,
  ) {
    Object.keys(configContract).forEach((propertyName) => {
      let errors: string[] = [];

      const contractProperty = configContract[propertyName];
      const configProperty = config[propertyName];

      if (this.isConfigProperty(contractProperty)) {
        if (!configProperty) {
          if (
            !this.isContractPropertyOptional(
              contractProperty as ConfigurationProperty,
            )
          ) {
            errors =
              this.configContractTypeCheckerError.addMissingPropertyError(
                errors,
                propertyName,
              );
          }
        } else {
          if (
            !this.contractPropertyAndConfigValueHaveSameType(
              contractProperty as ConfigurationProperty,
              configProperty,
            )
          ) {
            errors = this.configContractTypeCheckerError.addWrongTypeError(
              errors,
              propertyName,
              contractProperty,
              configProperty,
            );
          }
        }
        this.configContractTypeCheckerError.checkErrors(errors);
      } else {
        if (!configProperty) {
          errors = this.configContractTypeCheckerError.addMissingPropertyError(
            errors,
            propertyName,
          );
        }
        this.configContractTypeCheckerError.checkErrors(errors);

        this.compareConfigContractAndConfigValuesTypes(
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
