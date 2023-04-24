export type Contract = {
  [property: string]: Contract | ContractProperty;
};

export const supportedContractPropertyOptions = [
  'type',
  'secret',
  'optional',
  'regex',
];

export type ContractProperty = {
  type: ContractPropertyType;
  secret?: boolean;
  optional?: boolean;
  regex?: string;
};

export const contractPropertyTypes = [
  'string',
  'integer',
  'float',
  'boolean',
] as const;

export type ContractPropertyType = (typeof contractPropertyTypes)[number];
