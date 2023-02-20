import { faker } from '@faker-js/faker';
import { ConfigContractTypeChecker } from 'src/configuration/ConfigContractTypeChecker';
import { ConfigurationPropertyType } from 'src/configuration/ConfigurationContract';

describe('ConfigContractTypeChecker', () => {
  describe('checkContractTypeCompatibility', () => {
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
        ConfigContractTypeChecker.checkContractTypeCompatibility(
          configContract,
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
        ConfigContractTypeChecker.checkContractTypeCompatibility(
          configContract,
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
        ConfigContractTypeChecker.checkContractTypeCompatibility(
          configContract,
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
        ConfigContractTypeChecker.checkContractTypeCompatibility(
          configContract,
          config,
        ),
      ).toEqual([]);
    });
  });
});
