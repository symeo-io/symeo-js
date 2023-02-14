import { join } from 'path';
import fsExtra from 'fs-extra';
import SpyInstance = jest.SpyInstance;
import { dir } from 'tmp-promise';
import { ConfigTypesGenerator } from 'src/cli/config-generator/config.types.generator';
import { ConfigurationPropertyType } from 'src/cli/config.contract';

describe('ConfigTypes', () => {
  describe('generateTypesFile', () => {
    let mockTypesOutputPath: string;
    const configTypes: ConfigTypesGenerator = new ConfigTypesGenerator();
    let mockWriteFile: SpyInstance;

    beforeEach(async () => {
      mockTypesOutputPath = (await dir({ prefix: 'symeo-test' })).path;
      await fsExtra.writeFile(
        join(mockTypesOutputPath, './config.contract.ts'),
        '',
      );
      mockWriteFile = jest.spyOn(fsExtra, 'writeFile');
    });

    afterEach(() => {
      mockWriteFile.mockRestore();
      fsExtra.unlinkSync(join(mockTypesOutputPath, './config.contract.ts'));
    });

    it('should return empty typescript type file for empty configuration contract', () => {
      // Given
      const configurationContract = {};
      const expectedTypes = `export type Config = {
}
;`;

      // When
      configTypes.generateTypesFile(mockTypesOutputPath, configurationContract);

      // Then
      expect(mockWriteFile).toBeCalledWith(
        join(mockTypesOutputPath, './config.contract.ts'),
        expectedTypes,
      );
    });

    it('should return typescript type for simple configuration contract', () => {
      // Given
      const configurationContract = {
        database: {
          secretAccessKey: {
            type: 'string' as ConfigurationPropertyType,
            optional: true,
          },
        },
      };

      const expectedTypes = `export type Config = {
"database": {
"secretAccessKey"?: string;
}
;
}
;`;

      // When
      configTypes.generateTypesFile(mockTypesOutputPath, configurationContract);

      // Then
      expect(mockWriteFile).toBeCalledWith(
        join(mockTypesOutputPath, './config.contract.ts'),
        expectedTypes,
      );
    });

    it('should return typescript type for complex configuration contract', () => {
      // Given
      const configurationContract = {
        database: {
          secretAccessKey: {
            type: 'string' as ConfigurationPropertyType,
            optional: true,
          },
          accessKeyId: {
            type: 'string' as ConfigurationPropertyType,
            optional: true,
          },
          region: {
            type: 'string' as ConfigurationPropertyType,
          },
        },
        vcsProvider: {
          paginationLength: {
            type: 'integer' as ConfigurationPropertyType,
            optional: true,
          },
        },
      };

      const expectedTypes = `export type Config = {
"database": {
"secretAccessKey"?: string;
"accessKeyId"?: string;
"region": string;
}
;
"vcsProvider": {
"paginationLength"?: number;
}
;
}
;`;

      // When
      configTypes.generateTypesFile(mockTypesOutputPath, configurationContract);

      // Then
      expect(mockWriteFile).toBeCalledWith(
        join(mockTypesOutputPath, './config.contract.ts'),
        expectedTypes,
      );
    });
  });
});
