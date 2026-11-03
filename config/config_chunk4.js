'use strict';

module.exports = {
  baseUrl: 'https://parabank.parasoft.com',
  auth: {
    validUsername: 'john',
    validPassword: 'demo'
  },
  timeouts: {
    implicitWait: 10000,
    explicitWait: 15000,
    pageLoad: 30000
  },
  performanceThresholdMs: 2000,
  screenshotDir: 'screenshots'
};
