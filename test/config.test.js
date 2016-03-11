'use strict';

var expect = require('chai').expect;
var Config = require('../lib/config');

describe('Unified config tests', function() {
  it('Is defined function', function() {
    expect(Config).to.be.an('function');
  });

  describe('Config instance tests', function() {
    it('Throws an error if at least env config is not provided', function() {
      expect(function() {
        var config = new Config();
        config.getConfig();
      }).to.throw('At least env config file has to be provided!');
    });

    it('Assigns configs to properties if they are both provided', function() {
      var config = new Config({test: 'test'}, {test2: 'test'});
      expect(config.envConfig).to.deep.equal({test: 'test'});
      expect(config.commonConfig).to.deep.equal({test2: 'test'});
    });
  });

  describe('getConfig method tests', function() {
    it('Should inform about missing required variable when getting config',
    function() {
      var config = new Config({testVar: null});
      expect(function() {
        config.getConfig();
      }).to.throw(`Missing following ENV values: TEST_VAR` +
        ` and no default ones provided!`);
    });

    it('Should build base config using ENV defaults', function() {
      var envPart = {testVar: 'test', testVar2: 'test2'};
      var config = new Config(envPart);
      expect(config.getConfig()).to.deep.equal(envPart);
    });

    it('Should replace default values with ENV ones', function() {
      var envPart = {testVar: null, testVar2: 'defined in config'};
      var config = new Config(envPart);
      process.env.TEST_VAR = 'something';
      process.env.TEST_VAR_2 = 'defined in env';
      expect(config.getConfig()).to.deep.equal({
        testVar: 'something',
        testVar2: 'defined in env'
      });
    });

    it('Should extend config by common values, overwriting any existing ones',
    function() {
      var envPart = {testVar: null, testVar2: 'defined in config'};
      var commonPart = {commonVar: 'test'};
      var config = new Config(envPart, commonPart);
      process.env.TEST_VAR = 'something';
      process.env.TEST_VAR_2 = 'defined in env';
      expect(config.getConfig()).to.deep.equal({
        testVar: 'something',
        testVar2: 'defined in env',
        commonVar: 'test'
      });
    });
  });
});
