import { dir } from 'tmp-promise';
import { join } from 'path';
import YAML from 'yamljs';
import fsExtra from 'fs-extra';
import { faker } from '@faker-js/faker';
import { ConfigContractLoader } from 'src/configuration/config.contract.loader';
import { ConfigContractTypeChecker } from 'src/configuration/config.contract.type.checker';
import { Config } from 'src/configuration/types';
import SpyInstance = jest.SpyInstance;

describe('ConfigContractTypeChecker', () => {
  describe('checkContractTypeCompatibility', () => {
    let tmpDirectoryPath: string;
    let tmpConfigContractPath: string;
    let configContractLoader: ConfigContractLoader;
    let configContractTypeChecker: ConfigContractTypeChecker;

    let mockedProcessExit: SpyInstance;

    const configContract = {
      database: {
        host: {
          type: 'string',
          optional: true,
        },
        password: {
          type: 'string',
          optional: true,
        },
        responseLimit: {
          type: 'float',
        },
      },
      vcsProvider: {
        paginationLength: {
          type: 'integer',
        },
      },
      auth0: {
        isAdmin: {
          type: 'boolean',
        },
      },
    };

    beforeEach(async () => {
      tmpDirectoryPath = (await dir({ prefix: 'symeo-test' })).path;
      tmpConfigContractPath = join(tmpDirectoryPath, './test.config.yml');

      configContractLoader = new ConfigContractLoader();

      configContractTypeChecker = new ConfigContractTypeChecker(
        configContractLoader,
      );

      jest.spyOn(console, 'error').mockImplementation();

      mockedProcessExit = jest
        .spyOn(process, 'exit')
        .mockImplementation((code) => {
          throw new Error('process exit: ' + code);
        });

      const yamlConfigContract = YAML.stringify(configContract, 6);
      fsExtra.writeFileSync(tmpConfigContractPath, yamlConfigContract);
    });

    afterEach(() => {
      mockedProcessExit.mockRestore();
      fsExtra.unlinkSync(tmpConfigContractPath);
    });

    it('should return errors for missing config format file path', () => {
      // Given
      const wrongConfigContractPath: string = faker.datatype.string();
      let config: Config;

      // Then
      expect(() => {
        configContractTypeChecker.checkContractTypeCompatibility(
          wrongConfigContractPath,
          config,
        );
      }).toThrow(
        new Error(
          'Missing configuration format file at ' + wrongConfigContractPath,
        ),
      );
    });

    it('should throw new error for non config property missing or not well named', () => {
      // Given
      const config = {
        badName: {
          host: faker.datatype.string(),
          password: faker.datatype.string(),
        },
        vcsProvider: {
          paginationLength: faker.datatype.number(),
        },
        auth0: {
          isAdmin: faker.datatype.boolean(),
        },
      };
      const badNamedProperty = 'database';

      //Then
      expect(
        configContractTypeChecker.checkContractTypeCompatibility(
          tmpConfigContractPath,
          config,
        ),
      ).toEqual([
        `The property "${badNamedProperty}" of your configuration contract is missing in your configuration values.`,
      ]);
    });

    it('should throw new error for missing config property value not mark as optional', () => {
      // Given
      const config = {
        database: {
          host: faker.datatype.string(),
          password: faker.datatype.string(),
        },
        vcsProvider: {
          paginationLength: faker.datatype.number(),
        },
        auth0: {
          isAdmin: faker.datatype.boolean(),
        },
      };
      const missingPropertyValueNotOptional = 'database.responseLimit';

      //Then
      expect(
        configContractTypeChecker.checkContractTypeCompatibility(
          tmpConfigContractPath,
          config,
        ),
      ).toEqual([
        `The property "${missingPropertyValueNotOptional}" of your configuration contract is missing in your configuration values.`,
      ]);
    });

    it('should throw new error for config property value which has different type from contract', () => {
      // Given
      const wrongTypeProperty = 'database.responseLimit';
      const wrongTypeFaker = faker.datatype.string();
      const config = {
        database: {
          host: faker.datatype.string(),
          password: faker.datatype.string(),
          responseLimit: wrongTypeFaker,
        },
        vcsProvider: {
          paginationLength: faker.datatype.number(),
        },
        auth0: {
          isAdmin: faker.datatype.boolean(),
        },
      };

      //Then
      expect(
        configContractTypeChecker.checkContractTypeCompatibility(
          tmpConfigContractPath,
          config,
        ),
      ).toEqual([
        `Configuration property "${wrongTypeProperty}" has type "${typeof wrongTypeFaker}" while configuration contract defined "${wrongTypeProperty}" as "${
          configContract.database.responseLimit.type
        }".`,
      ]);
    });

    it('should not throw any error for type verification', () => {
      // Given
      const config = {
        database: {
          host: faker.datatype.string(),
          password: faker.datatype.string(),
          responseLimit: faker.datatype.number(),
        },
        vcsProvider: {
          paginationLength: faker.datatype.number(),
        },
        auth0: {
          isAdmin: faker.datatype.boolean(),
        },
      };

      //Then
      expect(
        configContractTypeChecker.checkContractTypeCompatibility(
          tmpConfigContractPath,
          config,
        ),
      ).toEqual([]);
    });
  });
});
