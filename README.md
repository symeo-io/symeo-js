# Symeo JS

The Symeo SDK made for interacting with your Symeo secrets and configuration from JavaScript or TypeScript applications.

# Install

NPM
```shell
$ npm install symeo-js --save 
```

Yarn
```shell
$ yarn add symeo-js
```

# Usage

## Define configuration contract

Create a `symeo.config.yml` file in the root of your project, and define the structure and types of your application configuration:

```yaml
aws:
  region:
    type: string
    optional: true
  database:
    host:
      type: string
    port:
      type: integer
    username:
      type: string
    password:
      type: string
      secret: true
```

- You can nest properties to any depth level
- Supported types are `boolean`, `string`, `integer` and `float`
- Properties can be flagged with `optional: true`, or `secret: true`

## Create your local configuration file

Create a `symeo.local.yml` file in the root of your project, defining the values matching your configuration contract:

```yaml
aws:
  region: "eu-west-3"
  database:
    host: "localhost"
    port: 5432
    username: "postgres"
    password: "XPJc5qAbQcn77GWg"
```

## Wrap your application startup with the symeo command

In your `package.json`, replace for example:

```json
{
  "scripts": {
    "start": "node dist/index.js"
  }
}
```

with:

```json
{
  "scripts": {
    "start": "symeo-js -- node dist/index.js"
  }
}
```

Or, directly from the command line:

```json
{
  "scripts": {
    "start": "node_modules/.bin/symeo-js -- node dist/index.js"
  }
}
```

### Custom contract file

You can specify the path and name of the contract file and local file with the `-c` and `-f` flags:

```json
{
  "scripts": {
    "start": "symeo-js -c config/symeo.config.yml -- node dist/index.js",
    "test": "symeo-js -c config/symeo.config.yml -f config/symeo.test.yml -- jest"
  }
}
```

## Use your configuration anywhere in your code

Your configuration is then accessible with the import:

```typescript
import { config } from 'symeo-js/config';
```

For example:

```typescript
import { config } from 'symeo-js/config';
import { Client } from "postgres";

export class DatabaseClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: config.aws.database.host,
      port: config.aws.database.port,
      username: config.aws.database.username,
      password: config.aws.database.password,
    })
  }
}
```

## Start application with configuration from Symeo platform

After creating an environment and its api key in the [Symeo platform](https://app-config-staging.symeo.io/), use this command in your package.json

```shell
$ symeo-js -k $YOUR_ENVIRONMENT_API_KEY -- node index.js
```

Or, directly from the command line:

```shell
$ node_modules/.bin/symeo-js -k $YOUR_ENVIRONMENT_API_KEY -- node index.js
```

So the sdk fetch the values for the given environment and starts your application with those values.

Follow the [Symeo platform documentation](https://symeo.io/) for more details.