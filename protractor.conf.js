'use strict';

var testAssets = require('./config/assets/test');

// Protractor configuration
exports.config = {
	specs: testAssets.tests.e2e,
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: testAssets.lib.seleniumServerJarPath,
  // seleniumPort: 4444,
  // seleniumArgs: [],
  // capabilities: {
  //   browserName: 'chrome',
  //   chromeOptions: {
  //     // args: ['show-fps-counter=true']
  //   }
  // },
  capabilities: {
    'browserName': 'phantomjs',

    /*
     * Can be used to specify the phantomjs binary path.
     * This can generally be ommitted if you installed phantomjs globally.
     */
    'phantomjs.binary.path': require('phantomjs').path,

    /*
     * Command line args to pass to ghostdriver, phantomjs's browser driver.
     * See https://github.com/detro/ghostdriver#faq
     */
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  },
  chromeDriver: require('chromedriver').path,
  // directConnect: true
  // multiCapabilities: [{
  //   browserName: 'firefox'
  // }, {
  //   browserName: 'chrome'
  // }]
};
