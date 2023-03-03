import {
  ConfigurationContract,
  isConfigProperty,
} from './ConfigurationContract';

export class ConfigInitializer {
  public static initializeConfig(
    configContract: ConfigurationContract,
    config: any | undefined,
  ): any {
    const initializedConfig: any = {};
    Object.keys(configContract).forEach((propertyName) => {
      const contractProperty = configContract[propertyName];
      const valuesProperty = config && config[propertyName];

      if (!isConfigProperty(contractProperty)) {
        initializedConfig[propertyName] = this.initializeConfig(
          contractProperty as ConfigurationContract,
          valuesProperty,
        );
        return;
      }

      initializedConfig[propertyName] = valuesProperty;
    });

    return initializedConfig;
  }
}
