import { readdirSync, readFileSync, lstatSync, writeFileSync } from 'fs';
import path from 'path';

const PROCESS_ENV_PREFIX = 'process.env.';
const SYMEO_CONFIG_PREFIX = 'config.';
const SYMEO_IMPORT = 'import { config } from "symeo-js"';
const SYMEO_REQUIRE = 'const { config } = require("symeo-js")';

export class MigrationService {
  public migrate(
    srcPath: string,
    envFile: Record<string, string>,
    envPropertyToContractPathMap: Record<string, string>,
  ): void {
    const codeFilesWithEnvVariables =
      this.listCodeFilesContainingEnvVariables(srcPath);

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
    const fileContent = readFileSync(file);
    let newFileContent = isTypeScript
      ? `${SYMEO_IMPORT}\n${fileContent}`
      : `${SYMEO_REQUIRE}\n${fileContent}`;

    for (const envProperty of Object.keys(envFile)) {
      newFileContent = newFileContent
        .split(`${PROCESS_ENV_PREFIX}${envProperty}`)
        .join(
          `${SYMEO_CONFIG_PREFIX}${envPropertyToContractPathMap[envProperty]}`,
        );
    }

    writeFileSync(file, newFileContent);
  }

  private listCodeFilesContainingEnvVariables(srcPath: string): string[] {
    const results: string[] = [];
    const codeFiles = this.listJavaScriptOrTypeScriptFiles(srcPath);

    for (const file of codeFiles) {
      if (readFileSync(file).includes(PROCESS_ENV_PREFIX)) {
        results.push(file);
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
}
