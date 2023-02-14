import checksum from 'checksum';
import { anyString, anything, instance, mock, verify } from 'ts-mockito';
import fsExtra from 'fs-extra';
import { faker } from '@faker-js/faker';
import SpyInstance = jest.SpyInstance;
import { ConfigTypesGenerator } from 'src/cli/config-generator/config.types.generator';
import { ConfigTranspiler } from 'src/cli/config-generator/config.transpiler';
import { ConfigLibraryGenerator } from 'src/cli/config-generator/config.library.generator';
import { ConfigurationContract } from 'src/cli/config.contract';

describe('ConfigLibrary', () => {
  describe('generateConfigLibrary', () => {
    let mockedFsExtraExistSync: SpyInstance;
    let mockedFsExtraReadFileSync: SpyInstance;

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

      configLibraryGenerator = new ConfigLibraryGenerator(
        configTypesGenerator,
        configTranspiler,
      );
    });

    afterEach(() => {
      mockedFsExtraExistSync.mockRestore();
      mockedFsExtraReadFileSync.mockRestore();
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
    });
  });
});
