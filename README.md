# unified-config
![Travic CI status][travis-image]

Merges env and local config and provides consistent camelCased config properties in one place.

## Config structure
Library merges two parts of config together:
  - Env config, that relies on ENV variables or default ones
  - Common config, that is usually static across all deployments.

## ENV config - **required**
This part of config checks if required environment variables are provided and provides default values for others. Transfers each ENV variable into camelCased one.

To declare default value for variable, just provide it in configuration. To make some variable required, provide its value as `null`.


**Example config file:**
```javascript
{
  testVariable1: 'test',
  testVariable2: null
}
```

**Case 1:**
```bash
export TEST_VARIABLE_1='overwritten'
```
This case will throw error, because second variable `TEST_VARIABLE_2` is missing and it's required one.

**Case 2:**
```bash
export TEST_VARIABLE_2='test2'
```
This example will result in following config structure:
```javascript
{
  testVariable1: 'test', // Using default value
  testVariable2: 'test2' // Using one provided by ENV
}
```

**Case 3:**
```bash
export TEST_VARIABLE_1='test123'
export TEST_VARIABLE_2='test2'
```
This example will result in following config structure:
```javascript
{
  testVariable1: 'test123', // Overriden default value
  testVariable2: 'test2' // Using one provided by ENV
}
```

## Common config - **optional**
This is part of config that is provided as it is and is merged with latter, overwriting values if any existing are found. It could store e.g. static variables that aren't changed between different environments and deployments.

**Example common config file:**
```javascript
{
  commonVar1: 'test',
  commonVar2: 123
}
```

## Usage
Library uses ES6 classes. In order to start using it, instance has to be constructed, using at least ENV config:
```javascript
    var config = require('unified-config');

    var envConfig = {
      var1: 1,
      var2: null
    };
    var commonConfig = {
      commonVar: 'common'
    }

    var unifiedConfig = new Config(envConfig, commonConfig);
    unifiedConfig.getConfig(); // Returns one configuration file
    // or error if config variable wasn't provided
```

## Scripts
To run eslint:

    npm run lint

To run tests:

    npm test

To check coverage:

    npm run coverage

[travis-image]: https://travis-ci.org/SzybkiSasza/unified-config.svg?branch=master
