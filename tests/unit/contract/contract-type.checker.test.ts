import { faker } from '@faker-js/faker';
import { ContractTypeChecker } from 'src/contract/contract-type.checker';
import { ContractPropertyType } from 'src/contract/contract.types';
import { ContractUtils } from 'src/contract/contract.utils';

describe('ContractTypeChecker', () => {
  const contractUtils = new ContractUtils();
  const contractTypeChecker = new ContractTypeChecker(contractUtils);

  describe('checkContractTypeCompatibility', () => {
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
      currentUser: {
        email: {
          type: 'string' as ContractPropertyType,
          regex:
            '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+).([a-zA-Z]{2,5})$',
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
        currentUser: {
          email: faker.internet.email(),
        },
      };
      const badNamedProperty = 'database';

      //Then
      expect(
        contractTypeChecker.checkContractTypeCompatibility(
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
        currentUser: {
          email: faker.internet.email(),
        },
      };
      const missingPropertyValueNotOptional = 'database.responseLimit';

      //Then
      expect(
        contractTypeChecker.checkContractTypeCompatibility(
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
        currentUser: {
          email: faker.internet.email(),
        },
      };

      //Then
      expect(
        contractTypeChecker.checkContractTypeCompatibility(
          configContract,
          config,
        ),
      ).toEqual([
        `Configuration property "${wrongTypeProperty}" has type "${typeof wrongTypeFaker}" while configuration contract defined "${wrongTypeProperty}" as "${
          configContract.database.responseLimit.type
        }".`,
      ]);
    });

    it('should throw new error for config property value which do not match regex from contract', () => {
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
        currentUser: {
          email: faker.internet.url(),
        },
      };

      //Then
      expect(
        contractTypeChecker.checkContractTypeCompatibility(
          configContract,
          config,
        ),
      ).toEqual([
        `Configuration property "currentUser.email" with value "${config.currentUser.email}" does not match regex "${configContract.currentUser.email.regex}" defined in contract`,
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
        currentUser: {
          email: faker.internet.email(),
        },
      };

      //Then
      expect(
        contractTypeChecker.checkContractTypeCompatibility(
          configContract,
          config,
        ),
      ).toEqual([]);
    });

    it('should not throw any error for type verification with optional values missing', () => {
      // Given
      const config = {
        database: {
          host: undefined,
          password: null,
          responseLimit: faker.datatype.number(),
        },
        vcsProvider: {
          paginationLength: faker.datatype.number(),
        },
        auth0: {
          isAdmin: faker.datatype.boolean(),
        },
        currentUser: {
          email: faker.internet.email(),
        },
      };

      //Then
      expect(
        contractTypeChecker.checkContractTypeCompatibility(
          configContract,
          config,
        ),
      ).toEqual([]);
    });
  });
});
