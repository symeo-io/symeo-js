import { Config, ConfigFormat } from '../types.js';
export declare const OUTPUT_PATH = "./node_modules/.symeo/config";
export declare function generateConfigFromLocalFile(configFormat: ConfigFormat, config: Config): Promise<void>;
