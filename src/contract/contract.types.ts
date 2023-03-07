export type Contract = {
  [property: string]: Contract | ContractProperty;
};

export type ContractProperty = {
  type: ContractPropertyType;
  secret?: boolean;
  optional?: boolean;
};

export type ContractPropertyType = 'string' | 'integer' | 'float' | 'boolean';
