import { Contract } from '../contract/contract.types';
import { isContractProperty } from '../contract/contract.utils';

export class ValuesInitializer {
  public static initializeValues(
    contract: Contract,
    values: any | undefined,
  ): any {
    const initializedValues: any = {};
    Object.keys(contract).forEach((propertyName) => {
      const contractProperty = contract[propertyName];
      const valuesProperty = values && values[propertyName];

      if (!isContractProperty(contractProperty)) {
        initializedValues[propertyName] = this.initializeValues(
          contractProperty as Contract,
          valuesProperty,
        );
        return;
      }

      initializedValues[propertyName] = valuesProperty;
    });

    return initializedValues;
  }
}
