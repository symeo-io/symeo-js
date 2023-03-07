import YAML from 'yamljs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Config } from '.symeo-js/config/types';
import fetch from 'sync-fetch';
import { ContractLoader } from './contract/contract.loader';
import chalk from 'chalk';
import { ContractConfigurationInitializer } from './contract/contract-configuration.initializer';
import { ContractTypeChecker } from './contract/contract-type.checker';
import {
  API_KEY_VARIABLE_NAME,
  API_URL_VARIABLE_NAME,
  CONTRACT_FILE_VARIABLE_NAME,
  LOCAL_VALUES_FILE_VARIABLE_NAME,
} from './cli/actions/action.contants';

let rawConfig: any;
const apiUrl = process.env[API_URL_VARIABLE_NAME];
const apiKey = process.env[API_KEY_VARIABLE_NAME];
const localValuesFilePath = process.env[LOCAL_VALUES_FILE_VARIABLE_NAME];
const contractPath = process.env[CONTRACT_FILE_VARIABLE_NAME];

if (apiUrl && apiKey) {
  const response = fetch(apiUrl, {
    headers: {
      'X-API-KEY': apiKey,
    },
  });

  if (response.status !== 200) {
    console.error('Error when fetching config: ', response.statusText);
    process.exit(1);
  }

  rawConfig = response.json().values;
} else if (localValuesFilePath) {
  rawConfig = YAML.load(localValuesFilePath);
} else {
  console.error(
    'Missing api key or local configuration file. Are you sure you wrapped you command with symeo cli? e.g: symeo -- node index.js',
  );
  process.exit(1);
}

if (!contractPath) {
  console.error(
    'Missing configuration contract file path. Are you sure you defined a configuration contract file path ? e.g: ./symeo.config.yml',
  );
  process.exit(1);
}

const configContract = ContractLoader.loadContractFile(contractPath);
const config: Config = ContractConfigurationInitializer.initializeConfig(
  configContract,
  rawConfig,
);

const errors = ContractTypeChecker.checkContractTypeCompatibility(
  configContract,
  config,
);

if (errors.length > 0) {
  errors.forEach((error) => console.error(chalk.red(error)));
  process.exit(1);
}

export { config };
