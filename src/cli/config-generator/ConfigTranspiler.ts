import { resolve } from 'path';
import * as tsc from 'typescript';
import { promisify } from 'util';
import originalGlob from 'glob';

export class ConfigTranspiler {
  glob = promisify(originalGlob);
  outputs = [{ module: tsc.ModuleKind.CommonJS, directory: './' }];

  async transpileClient(configPath: string, outputPath: string): Promise<void> {
    const tsFiles = await this.glob('**/*.ts', {
      cwd: configPath,
      absolute: true,
    });

    await Promise.all(
      this.outputs.map(async ({ directory, module }) => {
        const outDir = resolve(outputPath, directory);

        const target = tsc.ScriptTarget.ES2019;
        const options: tsc.CompilerOptions = {
          declaration: true,
          target,
          outDir,
          module,
          rootDir: configPath,
          resolveJsonModule: true,
          esModuleInterop: true,
          moduleResolution: tsc.ModuleResolutionKind.NodeJs,
        };
        const host = tsc.createCompilerHost(options);
        host.getCurrentDirectory = () => configPath;

        const program = tsc.createProgram(tsFiles, options, host);
        let diagnostics = tsc.getPreEmitDiagnostics(program);

        // We expect errors of code 2307 — the user does not have to have all
        // dependencies installed during codegen. It will crash in runtime,
        // https://www.typescriptlang.org/docs/handbook/module-resolution.html
        diagnostics = diagnostics.filter((d) => d.code !== 2307);
        if (diagnostics.length) {
          throw new Error(
            `TypeScript compilation failed.\n${diagnostics
              .map(this.stringifyDiagnostic)
              .join('\n')}`,
          );
        }

        program.emit();
      }),
    );
  }

  private stringifyDiagnostic(diagnostic: tsc.Diagnostic) {
    if (diagnostic.file) {
      const { line, character } = tsc.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start as number,
      );
      const message = tsc.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n',
      );
      console.log(
        `${diagnostic.file.fileName} (${Number(line) + 1},${
          Number(character) + 1
        }): ${message}`,
      );
    } else {
      console.log(
        tsc.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      );
    }
  }
}
