import chalk from 'chalk';

export class ConfigContractTypeCheckerError {
  addMissingPropertyError(
    errors: string[],
    propertyName: string,
  ): Array<string> {
    errors.push(
      `The property "${propertyName}" of your configuration contract is missing in your configuration values.`,
    );
    return errors;
  }

  addWrongTypeError(
    errors: string[],
    propertyName: string,
    contractProperty: any,
    configProperty: any,
  ) {
    errors.push(
      `Configuration property "${propertyName}" has type "${typeof configProperty}" while configuration contract defined "${propertyName}" as "${
        contractProperty.type
      }".`,
    );
    return errors;
  }

  checkErrors(errors: string[]): void {
    if (errors.length > 0) {
      errors.forEach((error) => console.error(chalk.red(error)));
      process.exit(1);
    }
  }
}
