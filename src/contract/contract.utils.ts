import { Contract, ContractProperty } from './contract.types';

export function isContractPropertyOptional(contractProperty: ContractProperty) {
  return contractProperty.optional === true;
}

export function isContractProperty(el: Contract | ContractProperty) {
  return el.type && typeof el.type === 'string';
}
