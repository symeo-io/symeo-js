import { join } from 'path';
import YAML from 'yamljs';
import fsExtra from 'fs-extra';
import { dir } from 'tmp-promise';
import { ContractLoader } from 'src/contract/contract.loader';
import { Contract } from 'src/contract/contract.types';
import { ContractUtils } from 'src/contract/contract.utils';
import { ContractValidator } from 'src/contract/contract.validator';

describe('loadConfigFormatFile', () => {
  const contractUtils = new ContractUtils();
  const contractValidator = new ContractValidator(contractUtils);
  const contractLoader = new ContractLoader(contractValidator);
  let tmpDirectoryPath: string;

  beforeEach(async () => {
    tmpDirectoryPath = (await dir({ prefix: 'symeo-test' })).path;
  });

  it('should throw new error if config file path does not exist', () => {
    // Given
    const configFilePath: string = join(tmpDirectoryPath, './test.config.yml');

    // Then
    expect(() => {
      contractLoader.loadContractFile(configFilePath);
    }).toThrow(
      new Error('Missing configuration contract file at ' + configFilePath),
    );
  });

  it('should return configuration contract', () => {
    // Given
    const configFilePath: string = join(tmpDirectoryPath, './test.config.yml');
    const configObject = {
      aws: {
        secretAccessKey: {
          type: 'string',
          optional: true,
        },
        region: {
          type: 'string',
        },
      },
      database: {
        dynamodbUrl: {
          type: 'string',
          optional: true,
        },
        configuration: {
          tableName: {
            type: 'string',
          },
        },
      },
    };
    const yamlConfig = YAML.stringify(configObject, 6);
    fsExtra.writeFileSync(configFilePath, yamlConfig);

    const expectedContract = {
      aws: {
        secretAccessKey: {
          type: 'string',
          optional: true,
        },
        region: {
          type: 'string',
        },
      },
      database: {
        dynamodbUrl: {
          type: 'string',
          optional: true,
        },
        configuration: {
          tableName: {
            type: 'string',
          },
        },
      },
    };

    // When
    const configurationContract: Contract =
      contractLoader.loadContractFile(configFilePath);
    fsExtra.unlinkSync(configFilePath);

    // Then
    expect(configurationContract).toStrictEqual(expectedContract);
  });
});
