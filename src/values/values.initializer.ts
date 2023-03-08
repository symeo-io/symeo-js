import { Contract } from '../contract/contract.types';
import { ContractUtils } from '../contract/contract.utils';

export class ValuesInitializer {
  constructor(private readonly contractUtils: ContractUtils) {}

  public initializeValues(contract: Contract, values: any | undefined): any {
    const initializedValues: any = {};
    Object.keys(contract).forEach((propertyName) => {
      const contractProperty = contract[propertyName];
      const valuesProperty = values && values[propertyName];

      if (!this.contractUtils.isContractProperty(contractProperty)) {
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
