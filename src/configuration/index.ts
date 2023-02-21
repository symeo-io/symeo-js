import YAML from 'yamljs';
import { Config } from './types';
import fetch from 'sync-fetch';
import { ConfigContractTypeChecker } from './ConfigContractTypeChecker';
import { ContractLoader } from './ContractLoader';
import chalk from 'chalk';
import { ConfigInitializer } from './ConfigInitializer';

let rawConfig: any;
const apiUrl = process.env.SYMEO_API_URL;
const apiKey = process.env.SYMEO_API_KEY;
const localConfigFilePath = process.env.SYMEO_LOCAL_CONFIGURATION_FILE;
const configContractPath = process.env.SYMEO_CONFIGURATION_CONTRACT_FILE;

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
} else if (localConfigFilePath) {
  rawConfig = YAML.load(localConfigFilePath);
} else {
  console.error(
    'Missing api key or local configuration file. Are you sure you wrapped you command with symeo cli? E.g symeo -- node index.js',
  );
  process.exit(1);
}

if (!configContractPath) {
  console.error(
    'Missing configuration contract file path. Are you sure you defined a configuration contract file path ? E.g ./symeo.config.yml',
  );
  process.exit(1);
}

const configContract = ContractLoader.loadContractFile(configContractPath);
const config: Config = ConfigInitializer.initializeConfig(
  configContract,
  rawConfig,
);

const errors = ConfigContractTypeChecker.checkContractTypeCompatibility(
  configContract,
  config,
);

if (errors.length > 0) {
  errors.forEach((error) => console.error(chalk.red(error)));
  process.exit(1);
}

export { config };
