import YAML from 'yamljs';
import { Config } from './types';
import fetch from 'sync-fetch';
import { ConfigContractTypeChecker } from './config.contract.type.checker';
import { ConfigContractLoader } from './config.contract.loader';

let config: Config;
const configContractLoader: ConfigContractLoader = new ConfigContractLoader();
const configContractTypeChecker: ConfigContractTypeChecker =
  new ConfigContractTypeChecker(configContractLoader);
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

  config = response.json().values;
} else if (localConfigFilePath) {
  config = YAML.load(localConfigFilePath) as Config;
} else {
  console.error(
    'Missing api key or local configuration file. Are you sure you wrapped you command with symeo cli? E.g symeo -- node index.js',
  );
  process.exit(1);
}

if (configContractPath) {
  configContractTypeChecker.checkContractTypeCompatibility(
    configContractPath,
    config,
  );
} else {
  console.error(
    'Missing config format file path. Are you sure you defined a configuration contract file path ? E.g ./symeo.config.yml',
  );
}

export { config };
