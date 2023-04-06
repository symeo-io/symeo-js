export type Contract = {
  [property: string]: Contract | ContractProperty;
};

export type ContractProperty = {
  type: ContractPropertyType;
  secret?: boolean;
  optional?: boolean;
  regex?: string;
};

export type ContractPropertyType = 'string' | 'integer' | 'float' | 'boolean';
