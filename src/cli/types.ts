export type ConfigurationPropertyType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean';

export type ConfigurationProperty = {
  type: ConfigurationPropertyType;
  secret?: boolean;
  optional?: boolean;
};

export type ConfigurationContract = {
  [property: string]: ConfigurationContract | ConfigurationProperty;
};
