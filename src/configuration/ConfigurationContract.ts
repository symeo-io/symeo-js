export type ConfigurationContract = {
  [property: string]: ConfigurationContract | ConfigurationProperty;
};

export type ConfigurationProperty = {
  type: ConfigurationPropertyType;
  secret?: boolean;
  optional?: boolean;
};

export type ConfigurationPropertyType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean';

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
