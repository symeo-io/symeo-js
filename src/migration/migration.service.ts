import { readdirSync, readFileSync, lstatSync, writeFileSync } from 'fs';
import path from 'path';

const PROCESS_ENV_PREFIX_1 = 'process.env.';
const PROCESS_ENV_PREFIX_2 = 'process.env["';
const PROCESS_ENV_SUFFIX_2 = '"]';
const PROCESS_ENV_PREFIX_3 = "process.env['";
const PROCESS_ENV_SUFFIX_3 = "']";
const SYMEO_CONFIG_PREFIX = 'symeoConfig.';
const SYMEO_IMPORT = "import { config as symeoConfig } from '@symeo-sdk';";
const SYMEO_REQUIRE = "const { config: symeoConfig } = require('@symeo-sdk');";

export class MigrationService {
  public migrate(
    srcPath: string,
    envFile: Record<string, string>,
    envPropertyToContractPathMap: Record<string, string>,
  ): void {
    const codeFilesWithEnvVariables = this.listCodeFilesContainingEnvVariables(
      srcPath,
      envFile,
    );

    for (const file of codeFilesWithEnvVariables) {
      this.replaceFileEnvVariable(file, envFile, envPropertyToContractPathMap);
    }
  }

  private replaceFileEnvVariable(
    file: string,
    envFile: Record<string, string>,
    envPropertyToContractPathMap: Record<string, string>,
  ): void {
    const isTypeScript = file.endsWith('.ts');
    const fileContent = readFileSync(file, { encoding: 'utf-8' });

    let newFileContent = fileContent;

    if (
      (isTypeScript && !newFileContent.includes(SYMEO_IMPORT)) ||
      (!isTypeScript && !newFileContent.includes(SYMEO_REQUIRE))
    ) {
      newFileContent = isTypeScript
        ? `${SYMEO_IMPORT}\n${newFileContent}`
        : `${SYMEO_REQUIRE}\n${newFileContent}`;
    }

    for (const envProperty of Object.keys(envFile)) {
      const envStrings = this.buildProcessEnvStrings(envProperty);

      for (const envString of envStrings) {
        newFileContent = newFileContent
          .split(envString)
          .join(
            `${SYMEO_CONFIG_PREFIX}${envPropertyToContractPathMap[envProperty]}`,
          );
      }
    }

    writeFileSync(file, newFileContent);
  }

  private listCodeFilesContainingEnvVariables(
    srcPath: string,
    envFile: Record<string, string>,
  ): string[] {
    const results: string[] = [];
    const codeFiles = this.listJavaScriptOrTypeScriptFiles(srcPath);
    const envProperties = Object.keys(envFile);
    const envStrings = envProperties.flatMap((propertyName) =>
      this.buildProcessEnvStrings(propertyName),
    );

    for (const file of codeFiles) {
      const fileContent = readFileSync(file);
      for (const envString of envStrings) {
        if (fileContent.includes(envString)) {
          results.push(file);
          break;
        }
      }
    }

    return results;
  }

  private listJavaScriptOrTypeScriptFiles(srcPath: string): string[] {
    let results: string[] = [];
    const files = readdirSync(srcPath);
    files.forEach((file) => {
      if (lstatSync(path.join(srcPath, file)).isFile()) {
        if (
          path.extname(file).toLowerCase() === '.js' ||
          path.extname(file).toLowerCase() === '.ts'
        ) {
          results.push(path.join(srcPath, file));
        }
      } else if (lstatSync(path.join(srcPath, file)).isDirectory()) {
        results = [
          ...results,
          ...this.listJavaScriptOrTypeScriptFiles(path.join(srcPath, file)),
        ];
      }
    });

    return results;
  }

  private buildProcessEnvStrings(propertyName: string): string[] {
    return [
      `${PROCESS_ENV_PREFIX_1}${propertyName}`,
      `${PROCESS_ENV_PREFIX_2}${propertyName}${PROCESS_ENV_SUFFIX_2}`,
      `${PROCESS_ENV_PREFIX_3}${propertyName}${PROCESS_ENV_SUFFIX_3}`,
    ];
  }
}
