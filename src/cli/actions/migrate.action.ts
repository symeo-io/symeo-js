import { Action } from './action';
import { EnvFileToContractConverter } from '../../contract/env-file-to-contract.converter';
import fs from 'fs';
import path from 'path';
import * as env from 'envfile';
import { ContractWriter } from '../../contract/contract.witer';
import { ValuesWriter } from '../../values/values.witer';
import { MigrationService } from '../../migration/migration.service';

export type MigrateActionInput = {
  envFilePath: string;
  srcPath?: string;
};

export class MigrateAction implements Action<MigrateActionInput> {
  protected readonly envFileToContractConverter =
    new EnvFileToContractConverter();
  protected readonly contractWriter = new ContractWriter();
  protected readonly valuesWriter = new ValuesWriter();
  protected readonly migrationService = new MigrationService();

  async handle({ envFilePath, srcPath }: MigrateActionInput): Promise<void> {
    const stringEnvFile = fs.readFileSync(envFilePath, { encoding: 'utf8' });
    const envFile = env.parse(stringEnvFile);

    const { contract, values, envPropertyToContractPathMap } =
      this.envFileToContractConverter.convert(envFile);
    this.contractWriter.writeContractFile(path.dirname(envFilePath), contract);
    this.valuesWriter.writeValuesFile(path.dirname(envFilePath), values);

    if (srcPath) {
      this.migrationService.migrate(
        srcPath,
        envFile,
        envPropertyToContractPathMap,
      );
    }
  }
}
