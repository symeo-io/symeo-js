import { ContractUtils } from 'src/contract/contract.utils';
import { ContractValidator } from 'src/contract/contract.validator';

describe('validateFormat', () => {
  const contractUtils = new ContractUtils();
  const contractValidator = new ContractValidator(contractUtils);

  it('should return error for empty contract', () => {
    // Given
    const contract = {};

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual("Contract shouldn't be empty");
  });

  it('should return error for empty contract property', () => {
    // Given
    const contract = {
      database: {},
      auth: {
        id: {
          type: 'string',
        },
        key: {
          type: 'string',
          secret: true,
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual("Property database shouldn't be empty");
  });

  it('should return error for undefined contract property', () => {
    // Given
    const contract = {
      database: undefined,
      auth: {
        id: {
          type: 'string',
        },
        key: {
          type: 'string',
          secret: true,
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual("Property database shouldn't be empty");
  });

  it('should return error for unknown option', () => {
    // Given
    const contract = {
      auth: {
        id: {
          type: 'string',
          unknownOption: 'toto',
        },
        key: {
          type: 'string',
          secret: true,
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual(
      'Unknown option unknownOption in property auth.id',
    );
  });

  it('should return error for unknown type', () => {
    // Given
    const contract = {
      auth: {
        id: {
          type: 'unknownType',
        },
        key: {
          type: 'string',
          secret: true,
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual('Unknown type unknownType in property auth.id');
  });

  it('should return error for non boolean secret option', () => {
    // Given
    const contract = {
      auth: {
        id: {
          type: 'string',
        },
        key: {
          type: 'string',
          secret: 'string',
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual(
      'Option "secret" should be boolean in property auth.key',
    );
  });

  it('should return error for non boolean optional option', () => {
    // Given
    const contract = {
      auth: {
        id: {
          type: 'string',
          optional: 'string',
        },
        key: {
          type: 'string',
          secret: true,
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual(
      'Option "optional" should be boolean in property auth.id',
    );
  });

  it('should return error for invalid regex', () => {
    // Given
    const contract = {
      auth: {
        id: {
          type: 'string',
          regex: '/12)6',
        },
        key: {
          type: 'string',
          secret: true,
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual('Invalid regex provided in property auth.id');
  });

  it('should return error for non object property', () => {
    // Given
    const contract = {
      database: 'database',
      auth: [
        {
          id: {
            type: 'string',
            regex: '/12)6',
          },
          key: {
            type: 'string',
            secret: true,
          },
        },
      ],
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(2);
    expect(errors[0]).toEqual('Property database should be an object');
    expect(errors[1]).toEqual('Property auth should be an object');
  });

  it('should return errors for nested property', () => {
    // Given
    const contract = {
      parent: {
        parent: {
          parent: {
            type: 'unknownType',
          },
        },
      },
    };

    // When
    const errors = contractValidator.validateFormat(contract);

    // Then
    expect(errors.length).toEqual(1);
    expect(errors[0]).toEqual(
      'Unknown type unknownType in property parent.parent.parent',
    );
  });
});
