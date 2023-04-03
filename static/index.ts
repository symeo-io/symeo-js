import { fetchConfig } from 'symeo-js';
import { Config } from './types';

const config: Config = fetchConfig() as Config;

export { config };
