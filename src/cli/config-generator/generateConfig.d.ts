import { ConfigurationContract } from '../types';
export declare const OUTPUT_PATH = "./config";
export declare const CHECKSUM_PATH: string;
export declare function generateConfigLibrary(configFormat: ConfigurationContract, forceRecreate?: boolean): Promise<void>;
