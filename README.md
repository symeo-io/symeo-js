<h1 align="center">
<a href="https://app.symeo.io/">
  <img width="300" src="https://s3.eu-west-3.amazonaws.com/symeo.io-assets/symeo-logo.png" alt="symeo">
</a>
</h1>
<p align="center">
  <p align="center">Secret management as code. Easy. Centralized. Secured.</p>
</p>


<h4 align="center">
  <a href="https://app.symeo.io/">SaaS</a> |
  <a href="https://symeo.io/">Website</a> |
  <a href="https://docs.symeo.io/">Docs</a>
</h4>

<h4 align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache-blue.svg" />
  </a>
 <a href="https://circleci.com/gh/symeo-io/symeo-js">
    <img src="https://circleci.com/gh/symeo-io/symeo-js.svg?style=svg"/>
 </a>

</h4>

# Symeo JS SDK

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
    "build:config": "symeo-js build"
  }
}
```

And then run `npm run build:config` or `yarn build:config`

### Use your configuration anywhere in your code

Your configuration is then accessible with the import:

```typescript
import { config } from 'symeo-js';
```

Or using require:

```javascript
const { config } = require('symeo-js');
```

For example:

```typescript
import { config } from 'symeo-js';
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
    "start": "symeo-js start -- node dist/index.js"
  }
}
```

Or, directly from the command line:

```shell
node_modules/.bin/symeo-js start -- node dist/index.js
```

### Start application with configuration from Symeo platform

After creating an environment and its api key in the [Symeo platform](https://app.symeo.io/), use this command in your package.json

```shell
symeo-js start --api-key $YOUR_ENVIRONMENT_API_KEY -- node index.js
```

Or, directly from the command line:

```shell
node_modules/.bin/symeo-js start --api-key $YOUR_ENVIRONMENT_API_KEY -- node index.js
```

So the sdk fetch the values for the given environment and starts your application with those values.

Follow the [Symeo platform documentation](https://docs.symeo.io/) for more details.

### Check your configuration is valid

In your CI or CD pipeline, run:

```shell
symeo-js validate --api-key $YOUR_ENVIRONMENT_API_KEY
```

Which will check if the values filled in the Symeo platform comply with your contract.

## Symeo CLI commands

### symeo-js build

Build your typescript types from your contract file.

#### `-c, --contract-file`

The path to your configuration contract file. Default is `symeo.config.yml`.

#### `-r, --force-recreate`

By default, if contract stays identical, configuration won't be rebuilt to save time. Passing this option will force the rebuild of your configuration.

### symeo-js start

Start your application with your configuration values, either read from a local file or fetched from the Symeo platform.

#### `-c, --contract-file`

The path to your configuration contract file. Default is `symeo.config.yml`.

#### `-f, --values-file`

The path to your local values file. Default is `symeo.local.yml`.

#### `-k, --api-key`

The environment api key to use to fetch values from Symeo platform. If empty, values will be fetched from local value file (`symeo.local.yml` by default). If specified, parameter `-f, --values-file` is ignored.

#### `-a, --api-url`

The api endpoint used to fetch your configuration with the api key. Default is `https://api.symeo.io/api/v1/values`.

#### `-r, --force-recreate`

By default, if contract stays identical, configuration won't be rebuilt to save time. Passing this option will force the rebuild of your configuration.


### symeo-js validate


Check that with your configuration values, either read from a local file or fetched from the Symeo platform, match your contract.

#### `-c, --contract-file`

The path to your configuration contract file. Default is `symeo.config.yml`.

#### `-f, --values-file`

The path to your local values file. Default is `symeo.local.yml`.

#### `-k, --api-key`

The environment api key to use to fetch values from Symeo platform. If empty, values will be fetched from local value file (`symeo.local.yml` by default). If specified, parameter `-f, --values-file` is ignored.

#### `-a, --api-url`

The api endpoint used to fetch your configuration with the api key. Default is `https://api.symeo.io/api/v1/values`.
