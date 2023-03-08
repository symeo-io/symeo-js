import checksum from 'checksum';
import { anyString, anything, instance, mock, verify } from 'ts-mockito';
import fsExtra from 'fs-extra';
import { faker } from '@faker-js/faker';
import SpyInstance = jest.SpyInstance;
import { ContractTypesFileGenerator } from 'src/contract-type-generator/contract-types-file.generator';
import { TypeScriptTranspiler } from 'src/contract-type-generator/typescript.transpiler';
import { ContractTypesGenerator } from 'src/contract-type-generator/contract-types.generator';
import { Contract } from 'src/contract/contract.types';
import mkdirp from 'mkdirp';

jest.mock('mkdirp');
const mockedMkdirp = <jest.Mock<typeof mkdirp>>(<unknown>mkdirp);

describe('ConfigLibrary', () => {
  describe('generateContractTypes', () => {
    let mockedFsExtraExistSync: SpyInstance;
    let mockedFsExtraReadFileSync: SpyInstance;
    let mockedFsExtraWriteFileSync: SpyInstance;

    let mockedContractTypesFileGenerator: ContractTypesFileGenerator;
    let contractTypesFileGenerator: ContractTypesFileGenerator;

    let mockedConfigTranspiler: TypeScriptTranspiler;
    let configTranspiler: TypeScriptTranspiler;

    let contractTypesGenerator: ContractTypesGenerator;

    const configurationContract: Contract = {
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
      mockedContractTypesFileGenerator = mock(ContractTypesFileGenerator);
      contractTypesFileGenerator = instance(mockedContractTypesFileGenerator);

      mockedConfigTranspiler = mock(TypeScriptTranspiler);
      configTranspiler = instance(mockedConfigTranspiler);

      mockedFsExtraExistSync = jest.spyOn(fsExtra, 'existsSync');
      mockedFsExtraReadFileSync = jest.spyOn(fsExtra, 'readFileSync');
      mockedFsExtraWriteFileSync = jest
        .spyOn(fsExtra, 'writeFileSync')
        .mockImplementation();

      mockedMkdirp.mockImplementation();

      contractTypesGenerator = new ContractTypesGenerator(
        contractTypesFileGenerator,
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
      await contractTypesGenerator.generateContractTypes(configurationContract);

      // Then
      verify(
        mockedContractTypesFileGenerator.generateTypesFile(
          anyString(),
          anything(),
        ),
      ).never();
      expect(mockedFsExtraWriteFileSync).not.toHaveBeenCalled();
    });

    it('should regenerate config library', async () => {
      // When
      mockedFsExtraExistSync.mockImplementation(() => true);
      mockedFsExtraReadFileSync.mockImplementation(() =>
        faker.name.firstName(),
      );

      await contractTypesGenerator.generateContractTypes(configurationContract);

      // Then
      verify(
        mockedContractTypesFileGenerator.generateTypesFile(
          anyString(),
          configurationContract,
        ),
      ).once();
      expect(mockedFsExtraWriteFileSync).toHaveBeenCalledTimes(1);
      expect(mockedFsExtraWriteFileSync).toHaveBeenCalledWith(
        contractTypesGenerator.CHECKSUM_PATH,
        checksum(JSON.stringify(configurationContract)),
        'utf8',
      );
    });
  });
});
