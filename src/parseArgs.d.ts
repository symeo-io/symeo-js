export interface SymeoCliArgs {
    configFormatPath: string;
    envKey?: string;
    envFilePath: string;
}
export declare function parseArgs({ argv, cwd, }: {
    argv: string[];
    cwd: string;
}): SymeoCliArgs;
