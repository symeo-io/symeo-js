import mkdirp from 'mkdirp';
import { Contract } from '../contract/contract.types';
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

  public static async generateContractTypes(
    contract: Contract,
    forceRecreate = false,
  ) {
    const contractChecksum = checksum(JSON.stringify(contract));

    if (forceRecreate || this.shouldRegenerateContractTypes(contractChecksum)) {
      await mkdirp(this.OUTPUT_PATH);

      const randomTmpDir = await this.tmpDir('symeo');
      await ContractTypesFileGenerator.generateTypesFile(
        randomTmpDir,
        contract,
      );
      await TypeScriptTranspiler.transpile(randomTmpDir, this.OUTPUT_PATH);
      fsExtra.writeFileSync(this.CHECKSUM_PATH, contractChecksum, 'utf8');
    }
  }

  private static shouldRegenerateContractTypes(contractChecksum: string) {
    return (
      !fsExtra.existsSync(this.CHECKSUM_PATH) ||
      fsExtra.readFileSync(this.CHECKSUM_PATH, 'utf8') !== contractChecksum
    );
  }

  private static async tmpDir(prefix: string) {
    const { path } = await dir({ prefix });
    return path;
  }
}
