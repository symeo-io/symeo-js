import { ContractPropertyType } from 'src/contract/contract.types';
import { ValuesInitializer } from 'src/values/values.initializer';
import { faker } from '@faker-js/faker';
import { ContractUtils } from 'src/contract/contract.utils';

describe('ValuesInitializer', () => {
  const contractUtils = new ContractUtils();
  const valuesInitializer = new ValuesInitializer(contractUtils);

  describe('initializeValues', () => {
    const configContract = {
      database: {
        host: {
          type: 'string' as ContractPropertyType,
          optional: true,
        },
        password: {
          type: 'string' as ContractPropertyType,
          optional: true,
        },
        responseLimit: {
          type: 'float' as ContractPropertyType,
        },
      },
      vcsProvider: {
        paginationLength: {
          type: 'integer' as ContractPropertyType,
        },
      },
      auth0: {
        isAdmin: {
          type: 'boolean' as ContractPropertyType,
        },
      },
    };

    it('should init an empty config given an undefined values', () => {
      // Given
      const config = undefined;

      //Then
      expect(
        valuesInitializer.initializeValues(configContract, config),
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
        valuesInitializer.initializeValues(configContract, config),
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
