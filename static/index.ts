import { fetchConfig } from 'symeo-js';
import { Config } from '.symeo-js/config/types';

const config: Config = fetchConfig() as Config;

export { config };
