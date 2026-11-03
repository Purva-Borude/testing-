'use strict';

module.exports = {
  baseUrl: 'https://parabank.parasoft.com',
  loginUrl: '/parabank/login.htm',
  registerUrl: '/parabank/register.htm',
  logoutUrl: '/parabank/logout.htm',
  overviewUrl: '/parabank/overview.htm',
  credentials: {
    validUsername: 'john',
    validPassword: 'demo'
  },
  waits: {
    implicit: 10000,
    explicit: 15000,
    pageLoad: 30000
  },
  screenshotDir: 'screenshots',
  performanceThresholdMs: 2000
};
