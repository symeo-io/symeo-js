import { ConfigContractLoader } from '../../../src/configuration/config.contract.loader';
import { dir } from 'tmp-promise';
import { join } from 'path';
import { ConfigContractTypeChecker } from '../../../config/config.contract.type.checker';
import { Config } from '../../../config/types';

describe('ConfigContractTypeChecker', () => {
  describe('checkContractTypeCompatibility', () => {
    let tmpDirectoryPath: string;
    const configContractLoader: ConfigContractLoader =
      new ConfigContractLoader();
    let configContractTypeChecker: ConfigContractTypeChecker;

    beforeEach(async () => {
      tmpDirectoryPath = (await dir({ prefix: 'symeo-test' })).path;
      configContractTypeChecker = new ConfigContractTypeChecker(
        configContractLoader,
      );
    });

    it('should throw new error for missing config format file path', () => {
      // Given
      const configContractPath: string = join(
        tmpDirectoryPath,
        './test.config.yml',
      );

      let config: Config;

      // Then
      expect(() => {
        configContractTypeChecker.checkContractTypeCompatibility(
          configContractPath,
          config,
        );
      }).toThrow(
        new Error('Missing config format file at ' + configContractPath),
      );
    });
  });
});
