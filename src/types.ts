export type ConfigPropertyType = 'string' | 'integer' | 'float' | 'boolean';
export type ConfigProperty = {
  type: ConfigPropertyType;
  secret?: boolean;
  optional?: boolean;
};

export type ConfigFormat = {
  [property: string]: ConfigFormat | ConfigProperty;
};

export type Config = { [property: string]: string | number | boolean | Config };
