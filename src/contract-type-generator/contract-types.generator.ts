import mkdirp from 'mkdirp';
import { ConfigurationContract } from '../contract/contract.types';
import fsExtra from 'fs-extra';
import { dir } from 'tmp-promise';
import checksum from 'checksum';
import { join } from 'path';
import { ContractTypesFileGenerator } from './contract-types-file.generator';
import { TypeScriptTranspiler } from './typescript.transpiler';

export class ContractTypesGenerator {
  static OUTPUT_PATH: string = join(
    process.cwd(),
    'node_modules/.symeo-js/config',
  );
  static CHECKSUM_PATH: string = join(this.OUTPUT_PATH, './checksum');

  public static async generateConfigLibrary(
    contract: ConfigurationContract,
    forceRecreate = false,
  ) {
    const configChecksum = checksum(JSON.stringify(contract));

    if (forceRecreate || this.shouldRegenerateConfigLibrary(configChecksum)) {
      await mkdirp(this.OUTPUT_PATH);

      const randomTmpDir = await this.tmpDir('symeo');
      await ContractTypesFileGenerator.generateTypesFile(
        randomTmpDir,
        contract,
      );
      await TypeScriptTranspiler.transpile(randomTmpDir, this.OUTPUT_PATH);
      fsExtra.writeFileSync(this.CHECKSUM_PATH, configChecksum, 'utf8');
    }
  }

  private static shouldRegenerateConfigLibrary(configChecksum: string) {
    return (
      !fsExtra.existsSync(this.CHECKSUM_PATH) ||
      fsExtra.readFileSync(this.CHECKSUM_PATH, 'utf8') !== configChecksum
    );
  }

  private static async tmpDir(prefix: string) {
    const { path } = await dir({ prefix });
    return path;
  }
}
