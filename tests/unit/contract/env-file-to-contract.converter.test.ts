import { EnvFileToContractConverter } from 'src/contract/env-file-to-contract.converter';
import { faker } from '@faker-js/faker';

describe('EnvFileToContractConverter', () => {
  const envFileToContractConverter = new EnvFileToContractConverter();

  it('should convert env file to contract and values', () => {
    // Given
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

    // When
    const { contract, values, envPropertyToContractPathMap } =
      envFileToContractConverter.convert(envFile);

    expect(contract).toEqual({
      nodeEnv: { type: 'string' },
      aws: { profile: { type: 'string' }, region: { type: 'string' } },
      redis: {
        domainName: { type: 'string' },
        portNumber: { type: 'integer' },
      },
      planPrice: { type: 'float' },
      logging: { type: 'boolean' },
      dynamo: {
        url: { type: 'string' },
        boards: {
          tableName: { type: 'string' },
          historyTableName: { type: 'string' },
          secondaryIndex: { type: 'string' },
        },
      },
      cognitoUserPoolId: { type: 'string' },
      avatarS3Bucket: { type: 'string' },
      corsAuthorizedOrigin: { type: 'string' },
      google: {
        client: {
          id: { type: 'string' },
          secret: { type: 'string', secret: true },
        },
      },
    });

    expect(values).toEqual({
      nodeEnv: envFile.NODE_ENV,
      aws: { profile: envFile.AWS_PROFILE, region: envFile.AWS_REGION },
      redis: {
        domainName: envFile.REDIS_DOMAIN_NAME,
        portNumber: parseInt(envFile.REDIS_PORT_NUMBER),
      },
      planPrice: parseFloat(envFile.PLAN_PRICE),
      logging: envFile.LOGGING === 'true',
      dynamo: {
        url: envFile.DYNAMO_URL,
        boards: {
          tableName: envFile.DYNAMO_BOARDS_TABLE_NAME,
          historyTableName: envFile.DYNAMO_BOARDS_HISTORY_TABLE_NAME,
          secondaryIndex: envFile.DYNAMO_BOARDS_SECONDARY_INDEX,
        },
      },
      cognitoUserPoolId: envFile.COGNITO_USER_POOL_ID,
      avatarS3Bucket: envFile.AVATAR_S3_BUCKET,
      corsAuthorizedOrigin: envFile.CORS_AUTHORIZED_ORIGIN,
      google: {
        client: {
          id: envFile.GOOGLE_CLIENT_ID,
          secret: envFile.GOOGLE_CLIENT_SECRET,
        },
      },
    });

    expect(envPropertyToContractPathMap).toEqual({
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
    });
  });
});
