'use strict';

var _ = require('lodash');

class Config {

  /**
   * @param  {Object} envConfig    Config properties to be checked against ENV variable
   * @param  {Object} commonConfig Common config properties (unchanged between environments)
   */
  constructor(envConfig, commonConfig) {
    if (!_.isObject(envConfig)) {
      throw new Error('At least env config file has to be provided!');
    }
    this.envConfig = envConfig;
    this.commonConfig = commonConfig;
  }

  /**
   * Returns consistent config object, with merged and camelCased ENV variables
   * @return {Object} Merged config
   */
  getConfig() {
    var config = {};

    // Add environment variables to config. Returns error if no default one is found.
    var missingEnvValues = [];
    _.each(this.envConfig, (configValue, key) => {
      var scKey = _.toUpper(_.snakeCase(key));
      var envValue = _.get(process.env, scKey, null);
      if (envValue !== null) {
        config[key] = envValue;
      } else if (configValue === null) {
        missingEnvValues.push(scKey);
      } else {
        config[key] = configValue;
      }
    });

    // Add common config to config variable
    if (this.commonConfig) {
      config = _.assign(config, this.commonConfig);
    }

    if (missingEnvValues.length) {
      throw new Error(`Missing following ENV values: ${missingEnvValues}` +
        ` and no default ones provided!`);
    } else {
      return config;
    }
  }
}

module.exports = Config;
