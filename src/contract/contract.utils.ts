import { ConfigurationContract, ConfigurationProperty } from './contract.types';

export function isContractPropertyOptional(
  contractProperty: ConfigurationProperty,
) {
  return contractProperty.optional === true;
}

export function isConfigProperty(
  el: ConfigurationContract | ConfigurationProperty,
) {
  return el.type && typeof el.type === 'string';
}
