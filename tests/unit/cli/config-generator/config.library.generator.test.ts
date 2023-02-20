import checksum from 'checksum';
import { anyString, anything, instance, mock, verify } from 'ts-mockito';
import fsExtra from 'fs-extra';
import { faker } from '@faker-js/faker';
import SpyInstance = jest.SpyInstance;
import { ConfigTypesGenerator } from 'src/cli/config-generator/config.types.generator';
import { ConfigTranspiler } from 'src/cli/config-generator/config.transpiler';
import { ConfigLibraryGenerator } from 'src/cli/config-generator/config.library.generator';
import { ConfigurationContract } from 'src/cli/config.contract';
import mkdirp from 'mkdirp';

jest.mock('mkdirp');
const mockedMkdirp = <jest.Mock<typeof mkdirp>>(<unknown>mkdirp);

describe('ConfigLibrary', () => {
  describe('generateConfigLibrary', () => {
    let mockedFsExtraExistSync: SpyInstance;
    let mockedFsExtraReadFileSync: SpyInstance;
    let mockedFsExtraWriteFileSync: SpyInstance;

    let mockedConfigTypesGenerator: ConfigTypesGenerator;
    let configTypesGenerator: ConfigTypesGenerator;

    let mockedConfigTranspiler: ConfigTranspiler;
    let configTranspiler: ConfigTranspiler;

    let configLibraryGenerator: ConfigLibraryGenerator;

    const configurationContract: ConfigurationContract = {
      aws: {
        secretAccessKey: {
          type: 'string',
          optional: true,
        },
        region: {
          type: 'string',
        },
      },
    };

    beforeEach(() => {
      mockedConfigTypesGenerator = mock(ConfigTypesGenerator);
      configTypesGenerator = instance(mockedConfigTypesGenerator);

      mockedConfigTranspiler = mock(ConfigTranspiler);
      configTranspiler = instance(mockedConfigTranspiler);

      mockedFsExtraExistSync = jest.spyOn(fsExtra, 'existsSync');
      mockedFsExtraReadFileSync = jest.spyOn(fsExtra, 'readFileSync');
      mockedFsExtraWriteFileSync = jest
        .spyOn(fsExtra, 'writeFileSync')
        .mockImplementation();

      mockedMkdirp.mockImplementation();

      configLibraryGenerator = new ConfigLibraryGenerator(
        configTypesGenerator,
        configTranspiler,
      );
    });

    afterEach(() => {
      mockedFsExtraExistSync.mockRestore();
      mockedFsExtraReadFileSync.mockRestore();
      mockedFsExtraWriteFileSync.mockRestore();
    });

    it('should not regenerate config library for unchanged contract', async () => {
      // When
      mockedFsExtraExistSync.mockImplementation(() => true);
      mockedFsExtraReadFileSync.mockImplementation(() =>
        checksum(JSON.stringify(configurationContract)),
      );
      await configLibraryGenerator.generateConfigLibrary(configurationContract);

      // Then
      verify(
        mockedConfigTypesGenerator.generateTypesFile(anyString(), anything()),
      ).never();
      expect(mockedFsExtraWriteFileSync).not.toHaveBeenCalled();
    });

    it('should regenerate config library', async () => {
      // When
      mockedFsExtraExistSync.mockImplementation(() => true);
      mockedFsExtraReadFileSync.mockImplementation(() =>
        faker.name.firstName(),
      );

      await configLibraryGenerator.generateConfigLibrary(configurationContract);

      // Then
      verify(
        mockedConfigTypesGenerator.generateTypesFile(
          anyString(),
          configurationContract,
        ),
      ).once();
      expect(mockedFsExtraWriteFileSync).toHaveBeenCalledTimes(1);
      expect(mockedFsExtraWriteFileSync).toHaveBeenCalledWith(
        configLibraryGenerator.CHECKSUM_PATH,
        checksum(JSON.stringify(configurationContract)),
        'utf8',
      );
    });
  });
});
