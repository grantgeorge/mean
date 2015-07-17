'use strict';

module.exports = {
	tests: {
		client: ['modules/*/tests/client/**/*.js'],
		server: ['modules/*/tests/server/**/*.js'],
		e2e: ['modules/*/tests/e2e/**/*.js']
	},
  lib: {
    seleniumServerJarPath: './node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  }
};
