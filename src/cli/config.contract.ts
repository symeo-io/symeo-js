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
