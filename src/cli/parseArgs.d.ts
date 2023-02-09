export interface SymeoCliArgs {
    configurationContractPath: string;
    apiUrl: string;
    apiKey?: string;
    localConfigurationPath: string;
    forceRecreate: boolean;
    command: string;
    commandArgs: string[];
}
export declare function parseArgs({ argv, cwd, }: {
    argv: string[];
    cwd: string;
}): SymeoCliArgs;
