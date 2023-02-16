# Symeo JS

The Symeo SDK made for interacting with your Symeo secrets and configuration from JavaScript or TypeScript applications.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Symeo CLI options](#symeo-cli-options)

## Install

NPM
```shell
npm install symeo-js --save 
```

Yarn
```shell
yarn add symeo-js
```

## Usage

### Define configuration contract

Create a `symeo.config.yml` file in the root of your project, and define the structure and types of your application configuration.

For example:
```yaml
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

### Build your configuration to access it in your code

You can add a build configuration command to your package.json:

```json
{
  "scripts": {
    "build:config": "symeo-js"
  }
}
```

And then run `npm run build:config` or `yarn build:config`

### Use your configuration anywhere in your code

Your configuration is then accessible with the import:

```typescript
import { config } from 'symeo-js/config';
```

Or using require:

```javascript
const { config } = require('symeo-js/config');
```

For example:

```typescript
import { config } from 'symeo-js/config';
import { Client } from "postgres";

export class DatabaseClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
    })
  }
}
```

### Create your local configuration file

Create a `symeo.local.yml` file in the root of your project, defining the values matching your configuration contract.

For example:
```yaml
database:
  host: "localhost"
  port: 5432
  username: "postgres"
  password: "XPJc5qAbQcn77GWg"
```

### Wrap your application startup with the symeo command

This will trigger the rebuild of you configuration at each statup and inject values into your runtime.

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

```shell
node_modules/.bin/symeo-js -- node dist/index.js
```

### Start application with configuration from Symeo platform

After creating an environment and its api key in the [Symeo platform](https://app-staging.symeo.io/), use this command in your package.json

```shell
symeo-js --api-key $YOUR_ENVIRONMENT_API_KEY -- node index.js
```

Or, directly from the command line:

```shell
node_modules/.bin/symeo-js --api-key $YOUR_ENVIRONMENT_API_KEY -- node index.js
```

So the sdk fetch the values for the given environment and starts your application with those values.

Follow the [Symeo platform documentation](https://symeo.io/) for more details.

## Symeo CLI options

### `-c, --contract-file`

The path to your configuration contract file. Default is `symeo.config.yml`.

### `-f, --values-file`

The path to your local values file. Default is `symeo.local.yml`.

### `-k, --api-key`

The environment api key to use to fetch values from Symeo platform. If empty, values will be fetched from local value file (`symeo.local.yml` by default). If specified, parameter `-f, --values-file` is ignored.

### `-a, --api-url`

The api endpoint used to fetch your configuration with the api key. Default is `https://api.symeo.io/api/v1/values`.

### `-r, --force-recreate`

By default, if contract stays identical, configuration won't be rebuilt to save time. Passing this option will force the rebuild of your configuration.