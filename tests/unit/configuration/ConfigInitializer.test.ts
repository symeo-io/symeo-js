import { ConfigurationPropertyType } from 'src/configuration/ConfigurationContract';
import { ConfigInitializer } from 'src/configuration/ConfigInitializer';
import { faker } from '@faker-js/faker';

describe('ConfigInitializer', () => {
  describe('initializeConfig', () => {
    const configContract = {
      database: {
        host: {
          type: 'string' as ConfigurationPropertyType,
          optional: true,
        },
        password: {
          type: 'string' as ConfigurationPropertyType,
          optional: true,
        },
        responseLimit: {
          type: 'float' as ConfigurationPropertyType,
        },
      },
      vcsProvider: {
        paginationLength: {
          type: 'integer' as ConfigurationPropertyType,
        },
      },
      auth0: {
        isAdmin: {
          type: 'boolean' as ConfigurationPropertyType,
        },
      },
    };

    it('should init an empty config given an undefined values', () => {
      // Given
      const config = undefined;

      //Then
      expect(
        ConfigInitializer.initializeConfig(configContract, config),
      ).toEqual({
        database: {
          host: undefined,
          password: undefined,
          responseLimit: undefined,
        },
        vcsProvider: {
          paginationLength: undefined,
        },
        auth0: {
          isAdmin: undefined,
        },
      });
    });

    it('should init an empty config given values', () => {
      // Given
      const config = {
        database: {
          host: faker.datatype.string(),
          responseLimit: faker.datatype.number(),
        },
        vcsProvider: {
          paginationLength: faker.datatype.number(),
        },
      };

      //Then
      expect(
        ConfigInitializer.initializeConfig(configContract, config),
      ).toEqual({
        database: {
          host: config.database.host,
          password: undefined,
          responseLimit: config.database.responseLimit,
        },
        vcsProvider: {
          paginationLength: config.vcsProvider.paginationLength,
        },
        auth0: {
          isAdmin: undefined,
        },
      });
    });
  });
});
