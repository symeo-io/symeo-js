import mkdirp from 'mkdirp';
import { ConfigurationContract } from '../types';
import fsExtra from 'fs-extra';
import { dir } from 'tmp-promise';
import checksum from 'checksum';
import { join } from 'path';
import { ConfigTypesGenerator } from './config.types.generator';
import { ConfigTranspiler } from './config.transpiler';

export class ConfigLibraryGenerator {
  constructor(
    private configTypesGenerator: ConfigTypesGenerator,
    private configTranspiler: ConfigTranspiler,
  ) {}

  OUTPUT_PATH: string = join(__dirname, '../../config');
  CHECKSUM_PATH: string = join(this.OUTPUT_PATH, './checksum');

  public async generateConfigLibrary(
    configFormat: ConfigurationContract,
    forceRecreate = false,
  ) {
    const configChecksum = checksum(JSON.stringify(configFormat));

    if (forceRecreate || this.shouldRegenerateConfigLibrary(configChecksum)) {
      await mkdirp(this.OUTPUT_PATH);

      const randomTmpDir = await this.tmpDir('symeo');
      await this.configTypesGenerator.generateTypesFile(
        randomTmpDir,
        configFormat,
      );
      await this.configTranspiler.transpileClient(
        randomTmpDir,
        this.OUTPUT_PATH,
      );
      fsExtra.writeFileSync(this.CHECKSUM_PATH, configChecksum, 'utf8');
    }
  }

  private shouldRegenerateConfigLibrary(configChecksum: string) {
    return (
      !fsExtra.existsSync(this.CHECKSUM_PATH) ||
      fsExtra.readFileSync(this.CHECKSUM_PATH, 'utf8') !== configChecksum
    );
  }

  private async tmpDir(prefix: string) {
    const { path } = await dir({ prefix });
    return path;
  }
}
