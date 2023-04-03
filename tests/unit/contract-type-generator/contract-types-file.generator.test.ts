import { join } from 'path';
import fsExtra from 'fs-extra';
import SpyInstance = jest.SpyInstance;
import { dir } from 'tmp-promise';
import { ContractTypesFileGenerator } from 'src/sdk/contract-types-file.generator';
import { ContractPropertyType } from 'src/contract/contract.types';
import { ContractUtils } from 'src/contract/contract.utils';

describe('ContractTypesFileGenerator', () => {
  describe('generateTypesFile', () => {
    let mockTypesOutputPath: string;
    const contractUtils = new ContractUtils();
    const contractTypesFileGenerator: ContractTypesFileGenerator =
      new ContractTypesFileGenerator(contractUtils);
    let mockWriteFile: SpyInstance;

    beforeEach(async () => {
      mockTypesOutputPath = (await dir({ prefix: 'symeo-test' })).path;
      await fsExtra.writeFile(join(mockTypesOutputPath, './types.ts'), '');
      mockWriteFile = jest.spyOn(fsExtra, 'writeFile');
    });

    afterEach(() => {
      mockWriteFile.mockRestore();
      fsExtra.unlinkSync(join(mockTypesOutputPath, './types.ts'));
    });

    it('should return empty typescript type file for empty configuration contract', () => {
      // Given
      const configurationContract = {};
      const expectedTypes = `export type Config = {
}
;`;

      // When
      contractTypesFileGenerator.generateTypesFile(
        mockTypesOutputPath,
        configurationContract,
      );

      // Then
      expect(mockWriteFile).toBeCalledWith(
        join(mockTypesOutputPath, './types.ts'),
        expectedTypes,
      );
    });

    it('should return typescript type for simple configuration contract', () => {
      // Given
      const configurationContract = {
        database: {
          secretAccessKey: {
            type: 'string' as ContractPropertyType,
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
      contractTypesFileGenerator.generateTypesFile(
        mockTypesOutputPath,
        configurationContract,
      );

      // Then
      expect(mockWriteFile).toBeCalledWith(
        join(mockTypesOutputPath, './types.ts'),
        expectedTypes,
      );
    });

    it('should return typescript type for complex configuration contract', () => {
      // Given
      const configurationContract = {
        database: {
          secretAccessKey: {
            type: 'string' as ContractPropertyType,
            optional: true,
          },
          accessKeyId: {
            type: 'string' as ContractPropertyType,
            optional: true,
          },
          region: {
            type: 'string' as ContractPropertyType,
          },
        },
        vcsProvider: {
          paginationLength: {
            type: 'integer' as ContractPropertyType,
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
      contractTypesFileGenerator.generateTypesFile(
        mockTypesOutputPath,
        configurationContract,
      );

      // Then
      expect(mockWriteFile).toBeCalledWith(
        join(mockTypesOutputPath, './types.ts'),
        expectedTypes,
      );
    });
  });
});
