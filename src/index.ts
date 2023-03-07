// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Config } from '.symeo-js/config/types';
import { ContractLoader } from './contract/contract.loader';
import chalk from 'chalk';
import { ValuesInitializer } from './values/values.initializer';
import { ContractTypeChecker } from './contract/contract-type.checker';
import {
  API_KEY_VARIABLE_NAME,
  API_URL_VARIABLE_NAME,
  CONTRACT_FILE_VARIABLE_NAME,
  LOCAL_VALUES_FILE_VARIABLE_NAME,
} from './cli/actions/action.contants';
import { RawValuesFetcher } from './values/raw-values.fetcher';

let rawValues: any;
const apiUrl = process.env[API_URL_VARIABLE_NAME];
const apiKey = process.env[API_KEY_VARIABLE_NAME];
const localValuesPath = process.env[LOCAL_VALUES_FILE_VARIABLE_NAME];
const contractPath = process.env[CONTRACT_FILE_VARIABLE_NAME];

if (apiUrl && apiKey) {
  rawValues = RawValuesFetcher.fetchFromApi(apiUrl, apiKey);
} else if (localValuesPath) {
  rawValues = RawValuesFetcher.fetchFromFile(localValuesPath);
} else {
  throw new Error(
    'Missing api key or local configuration file. Are you sure you wrapped you command with symeo cli? e.g: symeo -- node index.js',
  );
}

if (!contractPath) {
  throw new Error(
    'Missing configuration contract file path. Are you sure you defined a configuration contract file path ? e.g: ./symeo.config.yml',
  );
}

const contract = ContractLoader.loadContractFile(contractPath);
const config: Config = ValuesInitializer.initializeValues(contract, rawValues);

const errors = ContractTypeChecker.checkContractTypeCompatibility(
  contract,
  config,
);

if (errors.length > 0) {
  errors.forEach((error) => console.error(chalk.red(error)));
  process.exit(1);
}

export { config };
