import { MigrationService } from 'src/migration/migration.service';
import { dir } from 'tmp-promise';
import { join } from 'path';
import fsExtra from 'fs-extra';
import { faker } from '@faker-js/faker';

describe('MigrationService', () => {
  const migrationService = new MigrationService();
  let tmpDirectoryPath: string;

  beforeEach(async () => {
    tmpDirectoryPath = (await dir({ prefix: 'symeo-test' })).path;
  });

  it('should not change file if no env variables', () => {
    // Given
    const codeFileContent = fsExtra.readFileSync(
      join(__dirname, '../../resources/migration/main-without-env.ts'),
      { encoding: 'utf-8' },
    );
    const expectedCodeFileContent = fsExtra.readFileSync(
      join(__dirname, '../../resources/migration/main-without-env.ts'),
      { encoding: 'utf-8' },
    );

    const codeFilePath = join(tmpDirectoryPath, 'main-without-env.ts');
    fsExtra.writeFileSync(codeFilePath, codeFileContent);

    const envFile = {
      NODE_ENV: faker.lorem.slug(),
      AWS_PROFILE: faker.lorem.slug(),
      AWS_REGION: faker.lorem.slug(),
      REDIS_DOMAIN_NAME: faker.internet.ip(),
      REDIS_PORT_NUMBER: faker.datatype.number().toString(),
      PLAN_PRICE: faker.datatype.float().toString(),
      LOGGING: faker.datatype.boolean().toString(),
      DYNAMO_URL: faker.internet.url(),
      DYNAMO_BOARDS_TABLE_NAME: faker.lorem.slug(),
      DYNAMO_BOARDS_HISTORY_TABLE_NAME: faker.lorem.slug(),
      DYNAMO_BOARDS_SECONDARY_INDEX: faker.lorem.slug(),
      COGNITO_USER_POOL_ID: faker.datatype.uuid(),
      AVATAR_S3_BUCKET: faker.lorem.slug(),
      CORS_AUTHORIZED_ORIGIN: faker.internet.url(),
      GOOGLE_CLIENT_ID: faker.datatype.uuid(),
      GOOGLE_CLIENT_SECRET: faker.datatype.uuid(),
    };

    const envPropertyToContractPathMap = {
      NODE_ENV: 'nodeEnv',
      AWS_PROFILE: 'aws.profile',
      AWS_REGION: 'aws.region',
      REDIS_DOMAIN_NAME: 'redis.domainName',
      REDIS_PORT_NUMBER: 'redis.portNumber',
      PLAN_PRICE: 'planPrice',
      LOGGING: 'logging',
      DYNAMO_URL: 'dynamo.url',
      DYNAMO_BOARDS_TABLE_NAME: 'dynamo.boards.tableName',
      DYNAMO_BOARDS_HISTORY_TABLE_NAME: 'dynamo.boards.historyTableName',
      DYNAMO_BOARDS_SECONDARY_INDEX: 'dynamo.boards.secondaryIndex',
      COGNITO_USER_POOL_ID: 'cognitoUserPoolId',
      AVATAR_S3_BUCKET: 'avatarS3Bucket',
      CORS_AUTHORIZED_ORIGIN: 'corsAuthorizedOrigin',
      GOOGLE_CLIENT_ID: 'google.client.id',
      GOOGLE_CLIENT_SECRET: 'google.client.secret',
    };

    migrationService.migrate(
      tmpDirectoryPath,
      envFile,
      envPropertyToContractPathMap,
    );

    const migratedCodeFileContent = fsExtra.readFileSync(codeFilePath, {
      encoding: 'utf-8',
    });

    expect(migratedCodeFileContent).toEqual(expectedCodeFileContent);
  });

  it('should replace env variable by config for TypeScript', () => {
    // Given
    const codeFileContent = fsExtra.readFileSync(
      join(__dirname, '../../resources/migration/main.ts'),
      { encoding: 'utf-8' },
    );
    const expectedCodeFileContent = fsExtra.readFileSync(
      join(__dirname, '../../resources/migration/expected-main.ts'),
      { encoding: 'utf-8' },
    );

    const codeFilePath = join(tmpDirectoryPath, 'main.ts');
    fsExtra.writeFileSync(codeFilePath, codeFileContent);

    const envFile = {
      NODE_ENV: faker.lorem.slug(),
      AWS_PROFILE: faker.lorem.slug(),
      AWS_REGION: faker.lorem.slug(),
      REDIS_DOMAIN_NAME: faker.internet.ip(),
      REDIS_PORT_NUMBER: faker.datatype.number().toString(),
      PLAN_PRICE: faker.datatype.float().toString(),
      LOGGING: faker.datatype.boolean().toString(),
      DYNAMO_URL: faker.internet.url(),
      DYNAMO_BOARDS_TABLE_NAME: faker.lorem.slug(),
      DYNAMO_BOARDS_HISTORY_TABLE_NAME: faker.lorem.slug(),
      DYNAMO_BOARDS_SECONDARY_INDEX: faker.lorem.slug(),
      COGNITO_USER_POOL_ID: faker.datatype.uuid(),
      AVATAR_S3_BUCKET: faker.lorem.slug(),
      CORS_AUTHORIZED_ORIGIN: faker.internet.url(),
      GOOGLE_CLIENT_ID: faker.datatype.uuid(),
      GOOGLE_CLIENT_SECRET: faker.datatype.uuid(),
    };

    const envPropertyToContractPathMap = {
      NODE_ENV: 'nodeEnv',
      AWS_PROFILE: 'aws.profile',
      AWS_REGION: 'aws.region',
      REDIS_DOMAIN_NAME: 'redis.domainName',
      REDIS_PORT_NUMBER: 'redis.portNumber',
      PLAN_PRICE: 'planPrice',
      LOGGING: 'logging',
      DYNAMO_URL: 'dynamo.url',
      DYNAMO_BOARDS_TABLE_NAME: 'dynamo.boards.tableName',
      DYNAMO_BOARDS_HISTORY_TABLE_NAME: 'dynamo.boards.historyTableName',
      DYNAMO_BOARDS_SECONDARY_INDEX: 'dynamo.boards.secondaryIndex',
      COGNITO_USER_POOL_ID: 'cognitoUserPoolId',
      AVATAR_S3_BUCKET: 'avatarS3Bucket',
      CORS_AUTHORIZED_ORIGIN: 'corsAuthorizedOrigin',
      GOOGLE_CLIENT_ID: 'google.client.id',
      GOOGLE_CLIENT_SECRET: 'google.client.secret',
    };

    migrationService.migrate(
      tmpDirectoryPath,
      envFile,
      envPropertyToContractPathMap,
    );

    const migratedCodeFileContent = fsExtra.readFileSync(codeFilePath, {
      encoding: 'utf-8',
    });

    expect(migratedCodeFileContent).toEqual(expectedCodeFileContent);
  });

  it('should replace env variable by config for JavaScript', () => {
    // Given
    const codeFileContent = fsExtra.readFileSync(
      join(__dirname, '../../resources/migration/index.js'),
      { encoding: 'utf-8' },
    );
    const expectedCodeFileContent = fsExtra.readFileSync(
      join(__dirname, '../../resources/migration/expected-index.js'),
      { encoding: 'utf-8' },
    );

    const codeFilePath = join(tmpDirectoryPath, 'index.js');
    fsExtra.writeFileSync(codeFilePath, codeFileContent);

    const envFile = {
      PORT: faker.datatype.number().toString(),
      CORS_ORIGIN: faker.internet.url(),
    };

    const envPropertyToContractPathMap = {
      PORT: 'port',
      CORS_ORIGIN: 'corsOrigin',
    };

    migrationService.migrate(
      tmpDirectoryPath,
      envFile,
      envPropertyToContractPathMap,
    );

    const migratedCodeFileContent = fsExtra.readFileSync(codeFilePath, {
      encoding: 'utf-8',
    });

    expect(migratedCodeFileContent).toEqual(expectedCodeFileContent);
  });
});
