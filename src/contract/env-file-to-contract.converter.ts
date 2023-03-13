import { Contract, ContractPropertyType } from './contract.types';
import { merge } from 'lodash';

const INTEGER_REGEX = /^\d*$/;
const FLOAT_REGEX = /^\d+\.\d+$/;

export class EnvFileToContractConverter {
  public convert(envFile: Record<string, string>): {
    contract: Contract;
    values: object;
  } {
    let contract: Contract = {};
    let values: object = {};

    for (const propertyName of Object.keys(envFile)) {
      const { contract: propertyContract, values: propertyValues } =
        this.buildEnvPropertyContract(
          propertyName,
          envFile[propertyName],
          Object.keys(envFile).filter((key) => key !== propertyName),
        );

      contract = merge(contract, propertyContract);
      values = merge(values, propertyValues);
    }
    return { contract, values };
  }

  private buildEnvPropertyContract(
    envPropertyName: string,
    envValue: string,
    adjacentEnvProperties: string[],
  ): { contract: Contract; values: object } {
    const splitPropertyName = this.splitPropertyName(envPropertyName);

    if (splitPropertyName.length === 1) {
      return {
        contract: this.buildContractForProperty(envPropertyName, envValue),
        values: this.buildContractValue(envPropertyName, envValue),
      };
    }

    const splitAdjacentPropertyNames = adjacentEnvProperties.map((name) => ({
      propertyName: name,
      split: this.splitPropertyName(name),
    }));
    const firstPropertyNameElement = splitPropertyName[0];
    const siblingProperties = splitAdjacentPropertyNames.filter(
      (elements) => elements.split[0] === firstPropertyNameElement,
    );

    if (siblingProperties.length === 0) {
      return {
        contract: this.buildContractForProperty(envPropertyName, envValue),
        values: this.buildContractValue(envPropertyName, envValue),
      };
    }

    const { contract, values } = this.buildEnvPropertyContract(
      envPropertyName.replace(`${firstPropertyNameElement}_`, ''),
      envValue,
      siblingProperties.map((el) =>
        el.propertyName.replace(`${firstPropertyNameElement}_`, ''),
      ),
    );
    return {
      contract: {
        [firstPropertyNameElement.toLowerCase()]: contract,
      },
      values: {
        [firstPropertyNameElement.toLowerCase()]: values,
      },
    };
  }

  private splitPropertyName(name: string): string[] {
    return name.split('_');
  }

  private buildContractForProperty(
    envPropertyName: string,
    envValue: string,
  ): Contract {
    const splitPropertyName = this.splitPropertyName(envPropertyName);
    const contractPropertyName = this.toCamelCase(splitPropertyName);

    const type = this.inferContractPropertyFromValue(envValue);
    const secret = this.inferIsSecretFromPropertyName(envPropertyName);

    if (secret) {
      return {
        [contractPropertyName]: {
          type,
          secret: true,
        },
      };
    }

    return {
      [contractPropertyName]: {
        type,
      },
    };
  }

  private buildContractValue(
    envPropertyName: string,
    envValue: string,
  ): object {
    const splitPropertyName = this.splitPropertyName(envPropertyName);
    const contractPropertyName = this.toCamelCase(splitPropertyName);

    return {
      [contractPropertyName]: envValue,
    };
  }

  private toCamelCase(elements: string[]): string {
    let result = '';

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (i === 0) {
        result += element.toLowerCase();
      } else {
        result +=
          element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
      }
    }

    return result;
  }

  private inferContractPropertyFromValue(value: string): ContractPropertyType {
    if (!!value.match(INTEGER_REGEX)) {
      return 'integer';
    }

    if (!!value.match(FLOAT_REGEX)) {
      return 'float';
    }

    if (value === 'true' || value === 'false') {
      return 'boolean';
    }

    return 'string';
  }

  private inferIsSecretFromPropertyName(
    propertyName: string,
  ): true | undefined {
    if (
      propertyName.toLowerCase().includes('key') ||
      propertyName.toLowerCase().includes('password') ||
      propertyName.toLowerCase().includes('secret')
    ) {
      return true;
    }

    return undefined;
  }
}
