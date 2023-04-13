import { Contract, ContractProperty } from './contract.types';

export class ContractUtils {
  isContractPropertyOptional(contractProperty: ContractProperty) {
    return contractProperty.optional === true;
  }

  isContractProperty(el: Contract | ContractProperty) {
    return el.type && typeof el.type === 'string';
  }

  hasRegex(contractProperty: ContractProperty) {
    return !!contractProperty.regex;
  }
}
