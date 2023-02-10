import { join } from 'path';
import { ConfigContractLoader } from 'src/cli/config-generator/config.contract.loader';
import YAML from 'yamljs';
import fsExtra from 'fs-extra';
import { ConfigurationContract } from 'src/cli/types';

describe('loadConfigFormatFile', () => {
  const tmpDirectoryPath: string = join(__dirname, './tmp');
  const configContractLoader: ConfigContractLoader = new ConfigContractLoader();

  it('should throw new error if config file path does not exist', () => {
    // Given
    const configFilePath: string = join(tmpDirectoryPath, './test.config.yml');

    // Then
    expect(() => {
      configContractLoader.loadConfigFormatFile(configFilePath);
    }).toThrow(new Error('Missing config format file at ' + configFilePath));
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
    const configurationContract: ConfigurationContract =
      configContractLoader.loadConfigFormatFile(configFilePath);
    fsExtra.unlinkSync(configFilePath);

    // Then
    expect(configurationContract).toStrictEqual(expectedContract);
  });
});
