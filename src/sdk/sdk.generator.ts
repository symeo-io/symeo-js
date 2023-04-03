import mkdirp from 'mkdirp';
import { Contract } from '../contract/contract.types';
import fsExtra from 'fs-extra';
import { dir } from 'tmp-promise';
import checksum from 'checksum';
import { join } from 'path';
import { ContractTypesFileGenerator } from './contract-types-file.generator';
import { TypeScriptTranspiler } from './typescript.transpiler';

export class SdkGenerator {
  SDK_INDEX_FILE_PATH: string = join(__dirname, '../../static/index.ts');
  SDK_PACKAGE_FILE_PATH: string = join(__dirname, '../../static/package.json');
  SDK_OUTPUT_PATH: string = join(process.cwd(), 'node_modules/@symeo-sdk');
  SDK_SRC_OUTPUT_PATH: string = join(this.SDK_OUTPUT_PATH, '.dist');
  CHECKSUM_PATH: string = join(this.SDK_OUTPUT_PATH, './checksum');

  constructor(
    private readonly contractTypesFileGenerator: ContractTypesFileGenerator,
    private readonly typeScriptTranspiler: TypeScriptTranspiler,
  ) {}

  public async generateContractTypes(
    contract: Contract,
    forceRecreate = false,
  ) {
    const contractChecksum = checksum(JSON.stringify(contract));

    if (forceRecreate || this.shouldRegenerateContractTypes(contractChecksum)) {
      await mkdirp(this.SDK_SRC_OUTPUT_PATH);

      const randomTmpDir = await this.tmpDir('symeo');

      await fsExtra.copy(
        this.SDK_INDEX_FILE_PATH,
        join(randomTmpDir, 'index.ts'),
      );
      await this.contractTypesFileGenerator.generateTypesFile(
        randomTmpDir,
        contract,
      );
      await this.typeScriptTranspiler.transpile(
        randomTmpDir,
        this.SDK_SRC_OUTPUT_PATH,
      );

      await fsExtra.copy(
        this.SDK_PACKAGE_FILE_PATH,
        join(this.SDK_OUTPUT_PATH, 'package.json'),
      );

      fsExtra.writeFileSync(this.CHECKSUM_PATH, contractChecksum, 'utf8');
    }
  }

  private shouldRegenerateContractTypes(contractChecksum: string) {
    return (
      !fsExtra.existsSync(this.CHECKSUM_PATH) ||
      fsExtra.readFileSync(this.CHECKSUM_PATH, 'utf8') !== contractChecksum
    );
  }

  private async tmpDir(prefix: string) {
    const { path } = await dir({ prefix });
    return path;
  }
}
